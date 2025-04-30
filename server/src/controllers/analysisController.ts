// File: server/src/controllers/analysisController.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { AppError } from '../app';
import * as faceAnalysisService from '../services/faceAnalysisService';
import { uploadToS3, deleteFromS3, getSignedS3Url } from '../utils/s3Utils';
import { AnonymousSession } from '../models/AnonymousSession';
import { FaceAnalysis } from '../models/FaceAnalysis';
import { FaceAnalysisDto } from '../types';
import { FaceShapeType } from '../models/FaceAnalysis';

/**
 * Analyze a facial photo and determine face shape
 * This endpoint now accepts client-side analysis or falls back to basic detection
 */
export const analyzeFace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('No photo uploaded', 400);
    }
    
    const photoPath = req.file.path;
    let sessionId = req.headers['session-id'] as string;
    const userId = req.user?.id;
    
    // If no session ID provided, create a new anonymous session
    if (!sessionId) {
      const session = await AnonymousSession.create({
        session_id: uuidv4(),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
      
      sessionId = session.session_id;
    }
    
    // Use simplified analysis that doesn't require TensorFlow.js
    const analysisResult = await faceAnalysisService.analyzePhoto(photoPath);
    
    if (!analysisResult.success) {
      // Delete the temp file
      await fs.unlink(photoPath);
      throw new AppError(analysisResult.error || 'Face analysis failed', 400);
    }
    
    // Upload to S3 for storage (with expiration)
    const s3Key = `faces/${uuidv4()}-${req.file.originalname}`;
    await uploadToS3(photoPath, s3Key);
    
    // Delete the temp file after upload
    await fs.unlink(photoPath);
    
    // Create analysis record in database
    const analysisId = uuidv4();
    const shareToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days
    
    const analysis = await FaceAnalysis.create({
      analysis_id: analysisId,
      session_id: sessionId,
      user_id: userId,
      photo_key: s3Key,
      face_shape: analysisResult.faceShape as FaceShapeType,
      confidence_score: analysisResult.confidenceScore,
      share_token: shareToken,
      expires_at: expiresAt,
      is_deleted: false
    });
    
    // Generate signed URL for the photo
    const photoUrl = await getSignedS3Url(s3Key);
    
    // Return analysis result
    res.status(201).json({
      id: analysisId,
      faceShape: analysisResult.faceShape,
      confidenceScore: analysisResult.confidenceScore,
      photoUrl,
      shareToken,
      createdAt: analysis.created_at,
      expiresAt: analysis.expires_at,
      sessionId // Return session ID for client to store
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Process a photo that has already been analyzed by the client
 * This endpoint receives the face shape analysis data from the client
 */
export const analyzePhotoWithClientData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('No photo uploaded', 400);
    }
    
    // Extract analysis data
    const { faceShape, confidenceScore } = req.body;
    
    if (!faceShape || !confidenceScore) {
      throw new AppError('Missing face analysis data', 400);
    }
    
    const photoPath = req.file.path;
    let sessionId = req.headers['session-id'] as string;
    const userId = req.user?.id;
    
    // If no session ID provided, create a new anonymous session
    if (!sessionId) {
      const session = await AnonymousSession.create({
        session_id: uuidv4(),
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
      
      sessionId = session.session_id;
    }
    
    // Upload to S3 for storage (with expiration)
    const s3Key = `faces/${uuidv4()}-${req.file.originalname}`;
    await uploadToS3(photoPath, s3Key);
    
    // Delete the temp file after upload
    await fs.unlink(photoPath);
    
    // Create analysis record in database
    const analysisId = uuidv4();
    const shareToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days
    
    const analysis = await FaceAnalysis.create({
      analysis_id: analysisId,
      session_id: sessionId,
      user_id: userId,
      photo_key: s3Key,
      face_shape: faceShape as FaceShapeType,
      confidence_score: parseFloat(confidenceScore),
      share_token: shareToken,
      expires_at: expiresAt,
      is_deleted: false
    });
    
    // Generate signed URL for the photo
    const photoUrl = await getSignedS3Url(s3Key);
    
    // Return analysis result
    res.status(201).json({
      id: analysisId,
      faceShape,
      confidenceScore: parseFloat(confidenceScore),
      photoUrl,
      shareToken,
      createdAt: analysis.created_at,
      expiresAt: analysis.expires_at,
      sessionId // Return session ID for client to store
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get an analysis by ID
 */
export const getAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { analysisId } = req.params;
    
    const analysis = await FaceAnalysis.findOne({
      where: {
        analysis_id: analysisId,
        is_deleted: false
      }
    });
    
    if (!analysis) {
      throw new AppError('Analysis not found', 404);
    }
    
    // Check if the analysis has expired
    if (analysis.expires_at && new Date() > new Date(analysis.expires_at)) {
      throw new AppError('Analysis has expired', 410);
    }
    
    // Generate signed URL for the photo
    const photoUrl = await getSignedS3Url(analysis.photo_key);
    
    // Create DTO for response
    const analysisDto: FaceAnalysisDto = {
      id: analysis.analysis_id,
      faceShape: analysis.face_shape,
      confidenceScore: analysis.confidence_score,
      photoUrl,
      shareToken: analysis.share_token,
      createdAt: analysis.created_at,
      expiresAt: analysis.expires_at
    };
    
    // Return analysis result
    res.status(200).json(analysisDto);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get a shared analysis by share token
 */
export const getSharedAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { shareToken } = req.params;
    
    const analysis = await FaceAnalysis.findOne({
      where: {
        share_token: shareToken,
        is_deleted: false
      }
    });
    
    if (!analysis) {
      throw new AppError('Shared analysis not found', 404);
    }
    
    // Check if the analysis has expired
    if (analysis.expires_at && new Date() > new Date(analysis.expires_at)) {
      throw new AppError('Shared analysis has expired', 410);
    }
    
    // Generate signed URL for the photo
    const photoUrl = await getSignedS3Url(analysis.photo_key);
    
    // Create DTO for response (without share token)
    const analysisDto: FaceAnalysisDto = {
      id: analysis.analysis_id,
      faceShape: analysis.face_shape,
      confidenceScore: analysis.confidence_score,
      photoUrl,
      createdAt: analysis.created_at,
      expiresAt: analysis.expires_at
    };
    
    // Return analysis result
    res.status(200).json(analysisDto);
    
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an analysis
 */
export const deleteAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { analysisId } = req.params;
    const userId = req.user?.id;
    
    // Find the analysis
    const analysis = await FaceAnalysis.findOne({
      where: {
        analysis_id: analysisId,
        is_deleted: false
      }
    });
    
    if (!analysis) {
      throw new AppError('Analysis not found', 404);
    }
    
    // If user is authenticated, check ownership
    if (userId && analysis.user_id && analysis.user_id !== userId) {
      throw new AppError('Unauthorized', 403);
    }
    
    // Mark as deleted in database
    await analysis.update({
      is_deleted: true
    });
    
    // Delete photo from S3
    await deleteFromS3(analysis.photo_key);
    
    res.status(200).json({ message: 'Analysis deleted successfully' });
    
  } catch (error) {
    next(error);
  }
};

// Export the controller object for routes
export const analysisController = {
  analyzeFace,
  analyzePhotoWithClientData,
  getAnalysis,
  getSharedAnalysis,
  deleteAnalysis
};
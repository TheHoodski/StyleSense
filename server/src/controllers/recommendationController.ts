// File: server/src/controllers/recommendationController.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../app';
import * as recommendationService from '../services/recommendationService';
import { FaceAnalysis } from '../models/FaceAnalysis';
import { SavedRecommendation } from '../models/SavedRecommendation';
import { Recommendation } from '../models/Recommendation';
import { HaircutStyle } from '../models/HaircutStyle';

/**
 * Get recommendations based on a face analysis ID
 */
export const getRecommendationsByAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { analysisId } = req.params;
    const isPremium = req.user?.isPremium || false;
    
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
    
    // Get existing recommendations or generate new ones
    let recommendations = await Recommendation.findAll({
      where: {
        analysis_id: analysisId
      },
      include: [
        {
          model: HaircutStyle,
          as: 'style'
        }
      ],
      order: [
        ['relevance_score', 'DESC']
      ]
    });
    
    // If no recommendations exist, generate them
    if (recommendations.length === 0) {
      recommendations = await recommendationService.generateRecommendations(analysis);
    }
    
    // Limit to 3 for non-premium users
    const limitedRecommendations = isPremium ? recommendations : recommendations.slice(0, 3);
    
    // Format response
    const formattedRecommendations = limitedRecommendations.map(rec => ({
      id: rec.recommendation_id,
      analysisId: rec.analysis_id,
      styleId: rec.style_id,
      relevanceScore: rec.relevance_score,
      position: rec.position,
      explanation: rec.explanation,
      style: {
        id: rec.style.style_id,
        name: rec.style.name,
        description: rec.style.description,
        suitableFaceShapes: rec.style.suitable_face_shapes,
        suitableHairTypes: rec.style.suitable_hair_types,
        suitableGenders: rec.style.suitable_genders,
        lengthCategory: rec.style.length_category,
        maintenanceLevel: rec.style.maintenance_level,
        imageUrl: rec.style.image_url,
        styleAttributes: rec.style.style_attributes
      }
    }));
    
    // Return recommendations with metadata about premium status
    res.status(200).json({
      recommendations: formattedRecommendations,
      meta: {
        totalRecommendations: recommendations.length,
        showing: limitedRecommendations.length,
        isPremium,
        hasMoreRecommendations: recommendations.length > limitedRecommendations.length
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get shared recommendations by share token
 */
export const getSharedRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { shareToken } = req.params;
    
    // Find the analysis
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
    
    // Get recommendations (limit to 3 for shared links)
    const recommendations = await Recommendation.findAll({
      where: {
        analysis_id: analysis.analysis_id
      },
      include: [
        {
          model: HaircutStyle,
          as: 'style'
        }
      ],
      order: [
        ['relevance_score', 'DESC']
      ],
      limit: 3
    });
    
    // Format response
    const formattedRecommendations = recommendations.map(rec => ({
      id: rec.recommendation_id,
      analysisId: rec.analysis_id,
      styleId: rec.style_id,
      relevanceScore: rec.relevance_score,
      position: rec.position,
      explanation: rec.explanation,
      style: {
        id: rec.style.style_id,
        name: rec.style.name,
        description: rec.style.description,
        suitableFaceShapes: rec.style.suitable_face_shapes,
        suitableHairTypes: rec.style.suitable_hair_types,
        suitableGenders: rec.style.suitable_genders,
        lengthCategory: rec.style.length_category,
        maintenanceLevel: rec.style.maintenance_level,
        imageUrl: rec.style.image_url
      }
    }));
    
    res.status(200).json({
      recommendations: formattedRecommendations,
      meta: {
        isShared: true,
        faceShape: analysis.face_shape
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Save a recommendation for the current user
 */
export const saveRecommendation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { recommendationId } = req.params;
    const userId = req.user?.id;
    const { notes } = req.body;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Check if recommendation exists
    const recommendation = await Recommendation.findOne({
      where: {
        recommendation_id: recommendationId
      }
    });
    
    if (!recommendation) {
      throw new AppError('Recommendation not found', 404);
    }
    
    // Check if already saved
    const existing = await SavedRecommendation.findOne({
      where: {
        user_id: userId,
        recommendation_id: recommendationId
      }
    });
    
    if (existing) {
      throw new AppError('Recommendation already saved', 409);
    }
    
    // Save the recommendation
    await recommendationService.saveRecommendation(userId, recommendationId, notes);
    
    res.status(201).json({
      message: 'Recommendation saved successfully',
      recommendationId
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get saved recommendations for the current user
 */
export const getSavedRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Get saved recommendations
    const savedRecommendations = await SavedRecommendation.findAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Recommendation,
          as: 'recommendation',
          include: [
            {
              model: HaircutStyle,
              as: 'style'
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Format response
    const formattedRecommendations = savedRecommendations.map(saved => ({
      id: saved.saved_id,
      recommendationId: saved.recommendation_id,
      notes: saved.notes,
      createdAt: saved.created_at,
      recommendation: {
        id: saved.recommendation.recommendation_id,
        analysisId: saved.recommendation.analysis_id,
        styleId: saved.recommendation.style_id,
        relevanceScore: saved.recommendation.relevance_score,
        explanation: saved.recommendation.explanation,
        style: {
          id: saved.recommendation.style.style_id,
          name: saved.recommendation.style.name,
          description: saved.recommendation.style.description,
          suitableFaceShapes: saved.recommendation.style.suitable_face_shapes,
          suitableHairTypes: saved.recommendation.style.suitable_hair_types,
          suitableGenders: saved.recommendation.style.suitable_genders,
          lengthCategory: saved.recommendation.style.length_category,
          maintenanceLevel: saved.recommendation.style.maintenance_level,
          imageUrl: saved.recommendation.style.image_url
        }
      }
    }));
    
    res.status(200).json({
      savedRecommendations: formattedRecommendations,
      count: formattedRecommendations.length
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a saved recommendation
 */
export const deleteSavedRecommendation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { savedId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Find the saved recommendation
    const savedRecommendation = await SavedRecommendation.findOne({
      where: {
        saved_id: savedId,
        user_id: userId
      }
    });
    
    if (!savedRecommendation) {
      throw new AppError('Saved recommendation not found', 404);
    }
    
    // Delete it
    await savedRecommendation.destroy();
    
    res.status(200).json({
      message: 'Saved recommendation deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get premium recommendations for a face analysis
 * (Requires premium subscription)
 */
export const getPremiumRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { analysisId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    if (!req.user?.isPremium) {
      throw new AppError('Premium subscription required', 403);
    }
    
    // Get all recommendations for this analysis
    const recommendations = await recommendationService.getRecommendationsForAnalysis(
      analysisId,
      undefined, // No limit for premium users
      true // isPremium
    );
    
    res.status(200).json({
      recommendations,
      meta: {
        count: recommendations.length,
        isPremium: true
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Export the controller object for routes
export const recommendationController = {
  getRecommendationsByAnalysis,
  getSharedRecommendations,
  saveRecommendation,
  getSavedRecommendations,
  deleteSavedRecommendation,
  getPremiumRecommendations
};
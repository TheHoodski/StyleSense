"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisController = exports.deleteAnalysis = exports.getSharedAnalysis = exports.getAnalysis = exports.analyzePhotoWithClientData = exports.analyzeFace = void 0;
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const app_1 = require("../app");
const faceAnalysisService = __importStar(require("../services/faceAnalysisService"));
const s3Utils_1 = require("../utils/s3Utils");
const AnonymousSession_1 = require("../models/AnonymousSession");
const FaceAnalysis_1 = require("../models/FaceAnalysis");
const analyzeFace = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new app_1.AppError('No photo uploaded', 400);
        }
        const photoPath = req.file.path;
        let sessionId = req.headers['session-id'];
        const userId = req.user?.id;
        if (!sessionId) {
            const session = await AnonymousSession_1.AnonymousSession.create({
                session_id: (0, uuid_1.v4)(),
                ip_address: req.ip,
                user_agent: req.headers['user-agent']
            });
            sessionId = session.session_id;
        }
        const analysisResult = await faceAnalysisService.analyzePhoto(photoPath);
        if (!analysisResult.success) {
            await promises_1.default.unlink(photoPath);
            throw new app_1.AppError(analysisResult.error || 'Face analysis failed', 400);
        }
        const s3Key = `faces/${(0, uuid_1.v4)()}-${req.file.originalname}`;
        await (0, s3Utils_1.uploadToS3)(photoPath, s3Key);
        await promises_1.default.unlink(photoPath);
        const analysisId = (0, uuid_1.v4)();
        const shareToken = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const analysis = await FaceAnalysis_1.FaceAnalysis.create({
            analysis_id: analysisId,
            session_id: sessionId,
            user_id: userId,
            photo_key: s3Key,
            face_shape: analysisResult.faceShape,
            confidence_score: analysisResult.confidenceScore,
            share_token: shareToken,
            expires_at: expiresAt,
            is_deleted: false
        });
        const photoUrl = await (0, s3Utils_1.getSignedS3Url)(s3Key);
        res.status(201).json({
            id: analysisId,
            faceShape: analysisResult.faceShape,
            confidenceScore: analysisResult.confidenceScore,
            photoUrl,
            shareToken,
            createdAt: analysis.created_at,
            expiresAt: analysis.expires_at,
            sessionId
        });
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeFace = analyzeFace;
const analyzePhotoWithClientData = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new app_1.AppError('No photo uploaded', 400);
        }
        const { faceShape, confidenceScore } = req.body;
        if (!faceShape || !confidenceScore) {
            throw new app_1.AppError('Missing face analysis data', 400);
        }
        const photoPath = req.file.path;
        let sessionId = req.headers['session-id'];
        const userId = req.user?.id;
        if (!sessionId) {
            const session = await AnonymousSession_1.AnonymousSession.create({
                session_id: (0, uuid_1.v4)(),
                ip_address: req.ip,
                user_agent: req.headers['user-agent']
            });
            sessionId = session.session_id;
        }
        const s3Key = `faces/${(0, uuid_1.v4)()}-${req.file.originalname}`;
        await (0, s3Utils_1.uploadToS3)(photoPath, s3Key);
        await promises_1.default.unlink(photoPath);
        const analysisId = (0, uuid_1.v4)();
        const shareToken = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const analysis = await FaceAnalysis_1.FaceAnalysis.create({
            analysis_id: analysisId,
            session_id: sessionId,
            user_id: userId,
            photo_key: s3Key,
            face_shape: faceShape,
            confidence_score: parseFloat(confidenceScore),
            share_token: shareToken,
            expires_at: expiresAt,
            is_deleted: false
        });
        const photoUrl = await (0, s3Utils_1.getSignedS3Url)(s3Key);
        res.status(201).json({
            id: analysisId,
            faceShape,
            confidenceScore: parseFloat(confidenceScore),
            photoUrl,
            shareToken,
            createdAt: analysis.created_at,
            expiresAt: analysis.expires_at,
            sessionId
        });
    }
    catch (error) {
        next(error);
    }
};
exports.analyzePhotoWithClientData = analyzePhotoWithClientData;
const getAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;
        const analysis = await FaceAnalysis_1.FaceAnalysis.findOne({
            where: {
                analysis_id: analysisId,
                is_deleted: false
            }
        });
        if (!analysis) {
            throw new app_1.AppError('Analysis not found', 404);
        }
        if (analysis.expires_at && new Date() > new Date(analysis.expires_at)) {
            throw new app_1.AppError('Analysis has expired', 410);
        }
        const photoUrl = await (0, s3Utils_1.getSignedS3Url)(analysis.photo_key);
        const analysisDto = {
            id: analysis.analysis_id,
            faceShape: analysis.face_shape,
            confidenceScore: analysis.confidence_score,
            photoUrl,
            shareToken: analysis.share_token,
            createdAt: analysis.created_at,
            expiresAt: analysis.expires_at
        };
        res.status(200).json(analysisDto);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalysis = getAnalysis;
const getSharedAnalysis = async (req, res, next) => {
    try {
        const { shareToken } = req.params;
        const analysis = await FaceAnalysis_1.FaceAnalysis.findOne({
            where: {
                share_token: shareToken,
                is_deleted: false
            }
        });
        if (!analysis) {
            throw new app_1.AppError('Shared analysis not found', 404);
        }
        if (analysis.expires_at && new Date() > new Date(analysis.expires_at)) {
            throw new app_1.AppError('Shared analysis has expired', 410);
        }
        const photoUrl = await (0, s3Utils_1.getSignedS3Url)(analysis.photo_key);
        const analysisDto = {
            id: analysis.analysis_id,
            faceShape: analysis.face_shape,
            confidenceScore: analysis.confidence_score,
            photoUrl,
            createdAt: analysis.created_at,
            expiresAt: analysis.expires_at
        };
        res.status(200).json(analysisDto);
    }
    catch (error) {
        next(error);
    }
};
exports.getSharedAnalysis = getSharedAnalysis;
const deleteAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;
        const userId = req.user?.id;
        const analysis = await FaceAnalysis_1.FaceAnalysis.findOne({
            where: {
                analysis_id: analysisId,
                is_deleted: false
            }
        });
        if (!analysis) {
            throw new app_1.AppError('Analysis not found', 404);
        }
        if (userId && analysis.user_id && analysis.user_id !== userId) {
            throw new app_1.AppError('Unauthorized', 403);
        }
        await analysis.update({
            is_deleted: true
        });
        await (0, s3Utils_1.deleteFromS3)(analysis.photo_key);
        res.status(200).json({ message: 'Analysis deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAnalysis = deleteAnalysis;
exports.analysisController = {
    analyzeFace: exports.analyzeFace,
    analyzePhotoWithClientData: exports.analyzePhotoWithClientData,
    getAnalysis: exports.getAnalysis,
    getSharedAnalysis: exports.getSharedAnalysis,
    deleteAnalysis: exports.deleteAnalysis
};
//# sourceMappingURL=analysisController.js.map
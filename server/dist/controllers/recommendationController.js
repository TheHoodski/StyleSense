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
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationController = exports.getPremiumRecommendations = exports.deleteSavedRecommendation = exports.getSavedRecommendations = exports.saveRecommendation = exports.getSharedRecommendations = exports.getRecommendationsByAnalysis = void 0;
const app_1 = require("../app");
const recommendationService = __importStar(require("../services/recommendationService"));
const FaceAnalysis_1 = require("../models/FaceAnalysis");
const SavedRecommendation_1 = require("../models/SavedRecommendation");
const Recommendation_1 = require("../models/Recommendation");
const HaircutStyle_1 = require("../models/HaircutStyle");
const getRecommendationsByAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;
        const isPremium = req.user?.isPremium || false;
        const analysis = await FaceAnalysis_1.FaceAnalysis.findOne({
            where: {
                analysis_id: analysisId,
                is_deleted: false
            }
        });
        if (!analysis) {
            throw new app_1.AppError('Analysis not found', 404);
        }
        let recommendations = await Recommendation_1.Recommendation.findAll({
            where: {
                analysis_id: analysisId
            },
            include: [
                {
                    model: HaircutStyle_1.HaircutStyle,
                    as: 'style'
                }
            ],
            order: [
                ['relevance_score', 'DESC']
            ]
        });
        if (recommendations.length === 0) {
            recommendations = await recommendationService.generateRecommendations(analysis);
        }
        const limitedRecommendations = isPremium ? recommendations : recommendations.slice(0, 3);
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
        res.status(200).json({
            recommendations: formattedRecommendations,
            meta: {
                totalRecommendations: recommendations.length,
                showing: limitedRecommendations.length,
                isPremium,
                hasMoreRecommendations: recommendations.length > limitedRecommendations.length
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRecommendationsByAnalysis = getRecommendationsByAnalysis;
const getSharedRecommendations = async (req, res, next) => {
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
        const recommendations = await Recommendation_1.Recommendation.findAll({
            where: {
                analysis_id: analysis.analysis_id
            },
            include: [
                {
                    model: HaircutStyle_1.HaircutStyle,
                    as: 'style'
                }
            ],
            order: [
                ['relevance_score', 'DESC']
            ],
            limit: 3
        });
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
    }
    catch (error) {
        next(error);
    }
};
exports.getSharedRecommendations = getSharedRecommendations;
const saveRecommendation = async (req, res, next) => {
    try {
        const { recommendationId } = req.params;
        const userId = req.user?.id;
        const { notes } = req.body;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        const recommendation = await Recommendation_1.Recommendation.findOne({
            where: {
                recommendation_id: recommendationId
            }
        });
        if (!recommendation) {
            throw new app_1.AppError('Recommendation not found', 404);
        }
        const existing = await SavedRecommendation_1.SavedRecommendation.findOne({
            where: {
                user_id: userId,
                recommendation_id: recommendationId
            }
        });
        if (existing) {
            throw new app_1.AppError('Recommendation already saved', 409);
        }
        await recommendationService.saveRecommendation(userId, recommendationId, notes);
        res.status(201).json({
            message: 'Recommendation saved successfully',
            recommendationId
        });
    }
    catch (error) {
        next(error);
    }
};
exports.saveRecommendation = saveRecommendation;
const getSavedRecommendations = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        const savedRecommendations = await SavedRecommendation_1.SavedRecommendation.findAll({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: Recommendation_1.Recommendation,
                    as: 'recommendation',
                    include: [
                        {
                            model: HaircutStyle_1.HaircutStyle,
                            as: 'style'
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });
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
    }
    catch (error) {
        next(error);
    }
};
exports.getSavedRecommendations = getSavedRecommendations;
const deleteSavedRecommendation = async (req, res, next) => {
    try {
        const { savedId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        const savedRecommendation = await SavedRecommendation_1.SavedRecommendation.findOne({
            where: {
                saved_id: savedId,
                user_id: userId
            }
        });
        if (!savedRecommendation) {
            throw new app_1.AppError('Saved recommendation not found', 404);
        }
        await savedRecommendation.destroy();
        res.status(200).json({
            message: 'Saved recommendation deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSavedRecommendation = deleteSavedRecommendation;
const getPremiumRecommendations = async (req, res, next) => {
    try {
        const { analysisId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        if (!req.user?.isPremium) {
            throw new app_1.AppError('Premium subscription required', 403);
        }
        const recommendations = await recommendationService.getRecommendationsForAnalysis(analysisId, undefined, true);
        res.status(200).json({
            recommendations,
            meta: {
                count: recommendations.length,
                isPremium: true
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPremiumRecommendations = getPremiumRecommendations;
exports.recommendationController = {
    getRecommendationsByAnalysis: exports.getRecommendationsByAnalysis,
    getSharedRecommendations: exports.getSharedRecommendations,
    saveRecommendation: exports.saveRecommendation,
    getSavedRecommendations: exports.getSavedRecommendations,
    deleteSavedRecommendation: exports.deleteSavedRecommendation,
    getPremiumRecommendations: exports.getPremiumRecommendations
};
//# sourceMappingURL=recommendationController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRecommendation = exports.getRecommendationsForAnalysis = exports.generateRecommendations = void 0;
const uuid_1 = require("uuid");
const sequelize_1 = require("sequelize");
const HaircutStyle_1 = require("../models/HaircutStyle");
const Recommendation_1 = require("../models/Recommendation");
const SavedRecommendation_1 = require("../models/SavedRecommendation");
const UserActivity_1 = require("../models/UserActivity");
const app_1 = require("../app");
const generateRecommendations = async (analysis) => {
    const faceShape = analysis.face_shape;
    const suitableStyles = await HaircutStyle_1.HaircutStyle.findAll({
        where: {
            [sequelize_1.Op.and]: [
                { suitable_face_shapes: { [sequelize_1.Op.contains]: [faceShape] } }
            ]
        }
    });
    if (suitableStyles.length === 0) {
        throw new app_1.AppError('No suitable hairstyles found for this face shape', 404);
    }
    const recommendations = [];
    const creationPromises = suitableStyles.map(async (style, index) => {
        const relevanceScore = calculateRelevanceScore(style, faceShape);
        const explanation = generateExplanation(style, faceShape);
        const recommendation = await Recommendation_1.Recommendation.create({
            recommendation_id: (0, uuid_1.v4)(),
            analysis_id: analysis.analysis_id,
            user_id: analysis.user_id,
            style_id: style.style_id,
            relevance_score: relevanceScore,
            position: index + 1,
            explanation
        });
        recommendation.style = style;
        recommendations.push(recommendation);
    });
    await Promise.all(creationPromises);
    recommendations.sort((a, b) => b.relevance_score - a.relevance_score);
    for (let i = 0; i < recommendations.length; i++) {
        await recommendations[i].update({ position: i + 1 });
    }
    return recommendations;
};
exports.generateRecommendations = generateRecommendations;
const calculateRelevanceScore = (style, faceShape) => {
    let score = 0;
    score += 70;
    switch (faceShape) {
        case 'oval':
            score += 10;
            break;
        case 'round':
            if (style.style_attributes && style.style_attributes.volume === 'high') {
                score += 10;
            }
            if (style.length_category === 'medium' || style.length_category === 'long') {
                score += 5;
            }
            break;
        case 'square':
            if (style.style_attributes && style.style_attributes.texture === 'high') {
                score += 10;
            }
            break;
        case 'heart':
            if (style.length_category === 'medium') {
                score += 10;
            }
            break;
        case 'diamond':
            if (style.length_category === 'medium') {
                score += 10;
            }
            break;
        case 'rectangle':
            if (style.style_attributes && style.style_attributes.volume === 'medium') {
                score += 10;
            }
            break;
        case 'triangle':
            if (style.style_attributes && style.style_attributes.volume === 'high') {
                score += 10;
            }
            break;
    }
    score += (5 - style.maintenance_level) * 2;
    return Math.min(score, 100);
};
const generateExplanation = (style, faceShape) => {
    let explanation = `This ${style.name} is well-suited for your ${faceShape} face shape.`;
    switch (faceShape) {
        case 'oval':
            explanation += ' Oval face shapes are versatile and can wear a variety of styles successfully. This particular cut enhances your balanced proportions.';
            break;
        case 'round':
            explanation += ' This style helps to elongate your face and create the illusion of more definition in your features.';
            break;
        case 'square':
            explanation += ' This style helps to soften your strong jawline while maintaining the attractive structure of your face.';
            break;
        case 'heart':
            explanation += ' This style balances your wider forehead and cheekbones with your narrower chin, creating harmony in your facial proportions.';
            break;
        case 'diamond':
            explanation += ' This style works to balance your prominent cheekbones and complement the narrower areas of your forehead and chin.';
            break;
        case 'rectangle':
            explanation += ' This style adds width to your face, creating the appearance of more balanced proportions.';
            break;
        case 'triangle':
            explanation += ' This style adds volume to the upper part of your face, balancing your wider jawline.';
            break;
    }
    if (style.maintenance_level <= 2) {
        explanation += " This is a low-maintenance style that's easy to manage day-to-day.";
    }
    else if (style.maintenance_level === 3) {
        explanation += ' This style requires moderate maintenance to keep it looking its best.';
    }
    else {
        explanation += ' This style requires more effort to maintain, but the results are worth it for the stylish appearance.';
    }
    return explanation;
};
const getRecommendationsForAnalysis = async (analysisId, limit, isPremium = false) => {
    const query = {
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
    };
    if (!isPremium && limit) {
        query.limit = limit;
    }
    const recommendations = await Recommendation_1.Recommendation.findAll(query);
    return recommendations.map(rec => ({
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
};
exports.getRecommendationsForAnalysis = getRecommendationsForAnalysis;
const saveRecommendation = async (userId, recommendationId, notes) => {
    const savedRecommendation = await SavedRecommendation_1.SavedRecommendation.create({
        saved_id: (0, uuid_1.v4)(),
        user_id: userId,
        recommendation_id: recommendationId,
        notes: notes || null
    });
    await UserActivity_1.UserActivity.create({
        activity_id: (0, uuid_1.v4)(),
        user_id: userId,
        activity_type: 'save_recommendation',
        details: {
            recommendationId,
            timestamp: new Date().toISOString()
        }
    });
    return savedRecommendation;
};
exports.saveRecommendation = saveRecommendation;
//# sourceMappingURL=recommendationService.js.map
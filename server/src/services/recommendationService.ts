// File: server/src/services/recommendationService.ts
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { FaceAnalysis, FaceShapeType } from '../models/FaceAnalysis';
import { HaircutStyle } from '../models/HaircutStyle';
import { Recommendation } from '../models/Recommendation';
import { SavedRecommendation } from '../models/SavedRecommendation';
import { UserActivity } from '../models/UserActivity';
import { AppError } from '../app';

/**
 * Generate haircut recommendations based on face analysis
 * @param analysis The face analysis to generate recommendations for
 * @returns Array of recommendation records
 */
export const generateRecommendations = async (analysis: FaceAnalysis): Promise<Recommendation[]> => {
  const faceShape = analysis.face_shape;
  
  // Find suitable haircuts for the face shape
  const suitableStyles = await HaircutStyle.findAll({
    where: {
      // Finds styles that include this face shape in their suitable_face_shapes array
      [Op.and]: [
        { suitable_face_shapes: { [Op.contains]: [faceShape] } }
      ]
    }
  });
  
  if (suitableStyles.length === 0) {
    throw new AppError('No suitable hairstyles found for this face shape', 404);
  }

  // Create recommendations
  const recommendations: Recommendation[] = [];
  
  // Prepare creation promises
  const creationPromises = suitableStyles.map(async (style, index) => {
    // Calculate relevance score based on face shape match and other factors
    const relevanceScore = calculateRelevanceScore(style, faceShape);
    
    // Generate explanation for why this style is recommended
    const explanation = generateExplanation(style, faceShape);
    
    // Create recommendation record
    const recommendation = await Recommendation.create({
      recommendation_id: uuidv4(),
      analysis_id: analysis.analysis_id,
      user_id: analysis.user_id,
      style_id: style.style_id,
      relevance_score: relevanceScore,
      position: index + 1,
      explanation
    });
    
    // Ensure style is loaded in the recommendation
    recommendation.style = style;
    
    recommendations.push(recommendation);
  });
  
  // Wait for all creation promises to resolve
  await Promise.all(creationPromises);
  
  // Sort by relevance score descending
  recommendations.sort((a, b) => b.relevance_score - a.relevance_score);
  
  // Update positions based on sorted order
  for (let i = 0; i < recommendations.length; i++) {
    await recommendations[i].update({ position: i + 1 });
  }
  
  return recommendations;
};

/**
 * Calculate relevance score for a hairstyle based on face shape and other factors
 * @param style The hairstyle to evaluate
 * @param faceShape The face shape to match against
 * @returns A relevance score from 0-100
 */
const calculateRelevanceScore = (style: HaircutStyle, faceShape: FaceShapeType): number => {
  let score = 0;
  
  // Base score for being suitable for this face shape
  score += 70;
  
  // Additional points for how well it complements the specific face shape
  // This could be enhanced with more sophisticated matching logic
  switch (faceShape) {
    case 'oval':
      // Oval faces work well with most styles, so give a high base score
      score += 10;
      break;
    case 'round':
      // Styles that add height or angles help balance round faces
      if (style.style_attributes && style.style_attributes.volume === 'high') {
        score += 10;
      }
      if (style.length_category === 'medium' || style.length_category === 'long') {
        score += 5;
      }
      break;
    case 'square':
      // Soft layers and waves help soften square faces
      if (style.style_attributes && style.style_attributes.texture === 'high') {
        score += 10;
      }
      break;
    case 'heart':
      // Styles with volume at the chin help balance heart-shaped faces
      if (style.length_category === 'medium') {
        score += 10;
      }
      break;
    case 'diamond':
      // Medium length styles often work well for diamond faces
      if (style.length_category === 'medium') {
        score += 10;
      }
      break;
    case 'rectangle':
      // Styles with volume at the sides help balance rectangle faces
      if (style.style_attributes && style.style_attributes.volume === 'medium') {
        score += 10;
      }
      break;
    case 'triangle':
      // Styles with volume at the top help balance triangle faces
      if (style.style_attributes && style.style_attributes.volume === 'high') {
        score += 10;
      }
      break;
  }
  
  // Adjust for maintenance level - easier styles get a slight bonus
  score += (5 - style.maintenance_level) * 2;
  
  // Cap the score at 100
  return Math.min(score, 100);
};

/**
 * Generate explanation text for why a hairstyle is recommended
 * @param style The hairstyle to explain
 * @param faceShape The face shape being matched
 * @returns Explanation text
 */
const generateExplanation = (style: HaircutStyle, faceShape: FaceShapeType): string => {
  // Base explanation
  let explanation = `This ${style.name} is well-suited for your ${faceShape} face shape.`;
  
  // Add specific details based on face shape
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
  
  // Add details about maintenance
  if (style.maintenance_level <= 2) {
    explanation += " This is a low-maintenance style that's easy to manage day-to-day.";
  } else if (style.maintenance_level === 3) {
    explanation += ' This style requires moderate maintenance to keep it looking its best.';
  } else {
    explanation += ' This style requires more effort to maintain, but the results are worth it for the stylish appearance.';
  }
  
  return explanation;
};

/**
 * Get recommendations for a specific analysis
 * @param analysisId The ID of the analysis to get recommendations for
 * @param limit Optional limit on number of recommendations to return
 * @param isPremium Whether the user has premium access
 * @returns Array of formatted recommendation objects
 */
export const getRecommendationsForAnalysis = async (
  analysisId: string,
  limit?: number,
  isPremium: boolean = false
): Promise<any[]> => {
  // Find all recommendations for this analysis
  const query: any = {
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
  };
  
  // Add limit if specified (non-premium users)
  if (!isPremium && limit) {
    query.limit = limit;
  }
  
  const recommendations = await Recommendation.findAll(query);
  
  // Format recommendations for API response
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

/**
 * Save a recommendation for a user
 * @param userId The ID of the user
 * @param recommendationId The ID of the recommendation to save
 * @param notes Optional notes to add to the saved recommendation
 * @returns The created saved recommendation object
 */
export const saveRecommendation = async (
  userId: string,
  recommendationId: string,
  notes?: string
): Promise<SavedRecommendation> => {
  // Create saved recommendation
  const savedRecommendation = await SavedRecommendation.create({
    saved_id: uuidv4(),
    user_id: userId,
    recommendation_id: recommendationId,
    notes: notes || null
  });
  
  // Log activity
  await UserActivity.create({
    activity_id: uuidv4(),
    user_id: userId,
    activity_type: 'save_recommendation',
    details: {
      recommendationId,
      timestamp: new Date().toISOString()
    }
  });
  
  return savedRecommendation;
};
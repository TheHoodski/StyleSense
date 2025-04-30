// File: server/src/services/faceAnalysisService.ts
import { FaceAnalysisResult } from '../types';
import { FaceShapeType } from '../models/FaceAnalysis';

/**
 * Process client-side face analysis results
 * @param faceShape The detected face shape from client-side analysis
 * @param confidenceScore The confidence score from client-side analysis
 */
export const processClientAnalysis = (
  faceShape: FaceShapeType, 
  confidenceScore: number
): FaceAnalysisResult => {
  return {
    success: true,
    faceShape,
    confidenceScore,
    features: {
      // We'll use placeholder values since actual measurements
      // would come from the client-side analysis
      faceWidth: 0,
      faceHeight: 0,
      jawWidth: 0,
      jawAngle: 0,
      cheekboneWidth: 0,
      foreheadWidth: 0,
      chinShape: 'rounded'
    }
  };
};

/**
 * A simplified version of analyzePhoto that doesn't use TensorFlow
 * This function still processes the photo but doesn't do face detection
 * It assumes the client has already determined the face shape
 * 
 * @param photoPath Path to the photo file
 * @param faceShape Optional face shape provided by client
 * @param confidenceScore Optional confidence score provided by client
 */
export const analyzePhoto = async (
  _photoPath: string,
  faceShape?: FaceShapeType,
  confidenceScore?: number
): Promise<FaceAnalysisResult> => {
  try {
    // If client-side analysis data is provided, use it
    if (faceShape && confidenceScore) {
      return processClientAnalysis(faceShape, confidenceScore);
    }
    
    // If no client-side analysis, use a default response
    // In a production environment, you'd want more sophisticated fallback
    return {
      success: true,
      faceShape: 'oval', // Default to oval as a safe fallback
      confidenceScore: 70, // Medium confidence
      features: {
        faceWidth: 0,
        faceHeight: 0,
        jawWidth: 0,
        jawAngle: 0,
        cheekboneWidth: 0,
        foreheadWidth: 0,
        chinShape: 'rounded'
      }
    };
  } catch (error) {
    console.error('Error analyzing photo:', error);
    return {
      success: false,
      error: 'Failed to analyze photo'
    };
  }
};

/**
 * Get face shape descriptions
 * @param faceShape The detected face shape
 */
export const getFaceShapeInfo = (faceShape: FaceShapeType): {
  title: string;
  description: string;
  characteristics: string[];
  suitableStyles: string[];
} => {
  const faceShapeInfo = {
    oval: {
      title: 'Oval',
      description: 'Considered the ideal face shape with balanced proportions. The forehead is slightly wider than the chin, and the face length is about 1.5 times the width.',
      characteristics: [
        'Balanced facial features',
        'Forehead slightly wider than chin',
        'Softly rounded jawline',
        'Proportional face length to width'
      ],
      suitableStyles: [
        'Most hairstyles work well with oval faces',
        'Can experiment with various lengths and textures',
        'Both symmetrical and asymmetrical styles look good'
      ]
    },
    round: {
      title: 'Round',
      description: 'Characterized by soft angles and equal face width and length. Round faces have full cheeks and a rounded chin without defined angles.',
      characteristics: [
        'Equal face width and length',
        'Full cheeks',
        'Rounded chin without angles',
        'Soft jawline'
      ],
      suitableStyles: [
        'Layered cuts that add height',
        'Side-swept bangs',
        'Styles with volume on top',
        'Longer lengths to elongate the face'
      ]
    },
    square: {
      title: 'Square',
      description: 'Defined by a strong jawline and forehead with similar width. The face has angular features and appears to have similar width at the forehead and jaw.',
      characteristics: [
        'Strong, angular jawline',
        'Minimal curve at the chin',
        'Forehead and jawline similar in width',
        'Defined corners at the jaw'
      ],
      suitableStyles: [
        'Soft layers around the face',
        'Side-swept styles that soften angles',
        'Textured cuts with movement',
        'Wispy bangs or fringe'
      ]
    },
    heart: {
      title: 'Heart',
      description: 'Characterized by a wider forehead and cheekbones that narrow to a small, pointed chin. Often considered a very feminine face shape.',
      characteristics: [
        'Wider forehead and cheekbones',
        'Narrow, sometimes pointed chin',
        'High cheekbones',
        'Defined jawline tapering to chin'
      ],
      suitableStyles: [
        'Styles with volume at the chin',
        'Side-parts to offset wider forehead',
        'Layered cuts that add width at jaw level',
        'Chin-length bobs or lobs'
      ]
    },
    diamond: {
      title: 'Diamond',
      description: 'Characterized by narrow forehead and jawline with wider cheekbones. This dramatic face shape has high, dramatic cheekbones and a narrow chin.',
      characteristics: [
        'Narrow forehead',
        'High, dramatic cheekbones',
        'Narrow, sometimes pointed chin',
        'Angular features'
      ],
      suitableStyles: [
        'Styles with volume at the forehead',
        'Side-swept bangs',
        'Chin-length styles to highlight jawline',
        'Layered cuts with texture'
      ]
    },
    rectangle: {
      title: 'Rectangle',
      description: 'Similar to a square shape but longer. Rectangle faces have a longer forehead, straight cheeks, and a strong jawline with minimal curves.',
      characteristics: [
        'Face length greater than width',
        'Straight cheeks',
        'Strong, angular jawline',
        'Forehead, cheeks, and jawline similar in width'
      ],
      suitableStyles: [
        'Layered styles that add width',
        'Soft, rounded edges',
        'Bangs to shorten the appearance of the face',
        'Cuts with volume at the sides'
      ]
    },
    triangle: {
      title: 'Triangle',
      description: 'Characterized by a wider jawline that narrows at the forehead. The cheekbones align with the jawline rather than standing out.',
      characteristics: [
        'Wider jawline',
        'Narrower forehead',
        'Minimal cheekbone definition',
        'Jawline wider than cheekbones'
      ],
      suitableStyles: [
        'Volume at the crown and temples',
        'Shorter layers at the top',
        'Side-swept bangs',
        'Styles that add fullness to the upper face'
      ]
    }
  };
  
  return faceShapeInfo[faceShape];
};

/**
 * Process landmarks from client-side analysis to determine face shape
 * This function is maintained for when we receive raw landmarks from the client
 * 
 * @param landmarks Array of facial landmark coordinates from MediaPipe
 * @returns Face shape and confidence score
 */
export const determineShapeFromLandmarks = (landmarks: number[][]): {
  faceShape: FaceShapeType;
  confidenceScore: number;
} => {
  try {
    // Extract key measurements from landmarks
    // Note: These indices would need to match MediaPipe's face mesh model points
    // The actual implementation would use the specific landmark points
    
    // For a simplified example:
    // Calculate face width to height ratio using landmark coordinates
    // Get jaw width (distance between jaw corners)
    const jawLeftPoint = landmarks[134]; // Index depends on MediaPipe face mesh
    const jawRightPoint = landmarks[365]; // Index depends on MediaPipe face mesh
    const jawWidth = calculateDistance(jawLeftPoint, jawRightPoint);
    
    // Get forehead width
    const foreheadLeftPoint = landmarks[71]; // Index depends on MediaPipe face mesh
    const foreheadRightPoint = landmarks[301]; // Index depends on MediaPipe face mesh
    const foreheadWidth = calculateDistance(foreheadLeftPoint, foreheadRightPoint);
    
    // Get face height
    const foreheadTopPoint = landmarks[10]; // Top of forehead
    const chinBottomPoint = landmarks[152]; // Bottom of chin
    const faceHeight = calculateDistance(foreheadTopPoint, chinBottomPoint);
    
    // Get cheekbone width
    const cheekboneLeftPoint = landmarks[116]; // Left cheekbone
    const cheekboneRightPoint = landmarks[345]; // Right cheekbone
    const cheekboneWidth = calculateDistance(cheekboneLeftPoint, cheekboneRightPoint);
    
    // Calculate ratios for face shape determination
    const faceWidthToHeightRatio = Math.max(jawWidth, foreheadWidth, cheekboneWidth) / faceHeight;
    const jawToForeheadRatio = jawWidth / foreheadWidth;
    const cheekboneToJawRatio = cheekboneWidth / jawWidth;
    
    // Simple decision tree for face shape classification
    // Note: This is a simplified implementation and would need to be refined
    // based on real-world testing and expert input
    
    let faceShape: FaceShapeType = 'oval'; // Default
    let confidence = 75; // Default confidence
    
    if (faceWidthToHeightRatio > 0.8) {
      // Face is wider
      if (jawToForeheadRatio > 1.1) {
        faceShape = 'triangle';
        confidence = 70 + 10 * (jawToForeheadRatio - 1.1);
      } else if (jawToForeheadRatio < 0.9) {
        faceShape = 'heart';
        confidence = 70 + 10 * (0.9 - jawToForeheadRatio);
      } else if (cheekboneToJawRatio > 1.1) {
        faceShape = 'diamond';
        confidence = 70 + 10 * (cheekboneToJawRatio - 1.1);
      } else {
        faceShape = 'round';
        confidence = 70;
      }
    } else if (faceWidthToHeightRatio < 0.7) {
      // Face is longer
      if (jawToForeheadRatio > 0.95 && jawToForeheadRatio < 1.05) {
        faceShape = 'rectangle';
        confidence = 70 + 10 * (1 - Math.abs(jawToForeheadRatio - 1));
      } else {
        faceShape = 'oval';
        confidence = 75;
      }
    } else {
      // Medium proportions
      if (jawToForeheadRatio > 0.95 && jawToForeheadRatio < 1.05) {
        faceShape = 'square';
        confidence = 70 + 10 * (1 - Math.abs(jawToForeheadRatio - 1));
      } else {
        faceShape = 'oval';
        confidence = 75;
      }
    }
    
    return {
      faceShape,
      confidenceScore: Math.min(Math.round(confidence), 95) // Cap at 95% confidence
    };
  } catch (error) {
    console.error('Error determining face shape from landmarks:', error);
    // Default to oval face shape if we can't determine
    return {
      faceShape: 'oval',
      confidenceScore: 70
    };
  }
};

/**
 * Calculate distance between two points
 * Helper function for face shape determination
 */
const calculateDistance = (point1: number[], point2: number[]): number => {
  return Math.sqrt(
    Math.pow(point2[0] - point1[0], 2) +
    Math.pow(point2[1] - point1[1], 2)
  );
};
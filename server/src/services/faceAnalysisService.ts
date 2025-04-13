// File: server/src/services/faceAnalysisService.ts
import * as tf from '@tensorflow/tfjs-node';
import { promises as fs } from 'fs';
import { FaceAnalysisResult } from '../types';
import { FaceShapeType } from '../models/FaceAnalysis';
import path from 'path';

// Path to the TensorFlow model
const MODEL_PATH = path.join(__dirname, '../../models/face_shape_model');

// Load model singleton
let model: tf.LayersModel | null = null;

/**
 * Initialize the face shape detection model
 */
const initModel = async (): Promise<tf.LayersModel> => {
  if (!model) {
    try {
      // Check if model exists
      try {
        await fs.access(MODEL_PATH);
      } catch (error) {
        console.error('Model not found at path:', MODEL_PATH);
        throw new Error('Face shape model not found');
      }
      
      // Load model
      model = await tf.loadLayersModel(`file://${MODEL_PATH}/model.json`);
      console.log('Face shape detection model loaded successfully');
    } catch (error) {
      console.error('Error loading face shape model:', error);
      throw new Error('Failed to load face shape model');
    }
  }
  
  return model;
};

/**
 * Analyze a photo to determine face shape
 * @param photoPath Path to the photo file
 */
export const analyzePhoto = async (photoPath: string): Promise<FaceAnalysisResult> => {
  try {
    // Read the image file
    const imageBuffer = await fs.readFile(photoPath);
    
    // Convert image to tensor
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    
    // Preprocess image - resize to model input dimensions
    const processedImage = preprocessImage(imageTensor as tf.Tensor3D);
    
    // Use a placeholder face detector to locate the face
    const faceDetection = await detectFace(processedImage);
    
    if (!faceDetection.success) {
      return {
        success: false,
        error: faceDetection.error
      };
    }
    
    // Get the face tensor from the detection
    const faceTensor = faceDetection.faceTensor;
    
    if (!faceTensor) {
      return {
        success: false,
        error: 'Face tensor not available'
      };
    }
    
    // Get the shape model
    const shapeModel = await initModel();
    
    // Predict face shape using the model
    const prediction = shapeModel.predict(faceTensor) as tf.Tensor;
    const scores = await prediction.data();
    
    // Map prediction scores to face shapes
    const faceShapes: FaceShapeType[] = ['oval', 'round', 'square', 'heart', 'diamond', 'rectangle', 'triangle'];
    let maxIndex = 0;
    
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > scores[maxIndex]) {
        maxIndex = i;
      }
    }
    
    // Calculate confidence score (0-100)
    const confidenceScore = Math.round(scores[maxIndex] * 100);
    
    // Cleanup tensors to prevent memory leaks
    imageTensor.dispose();
    processedImage.dispose();
    faceTensor.dispose();
    prediction.dispose();
    
    return {
      success: true,
      faceShape: faceShapes[maxIndex],
      confidenceScore,
      features: {
        // In a production system, we would extract these measurements
        // from the face landmarks detected by a more sophisticated model
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
 * Preprocess an image for the face shape model
 * @param imageTensor Image tensor
 */
const preprocessImage = (imageTensor: tf.Tensor3D): tf.Tensor4D => {
  // Resize to the expected model input size (224x224 for MobileNet)
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
  
  // Normalize pixel values to [-1, 1]
  const normalized = resized.div(tf.scalar(127.5)).sub(tf.scalar(1));
  
  // Add batch dimension and return
  return normalized.expandDims(0) as tf.Tensor4D;
};

/**
 * Detect a face in an image
 * @param imageTensor Image tensor
 */
const detectFace = async (imageTensor: tf.Tensor4D): Promise<{ 
  success: boolean; 
  error?: string; 
  faceTensor?: tf.Tensor4D;
}> => {
  // Note: In a real implementation, we would use a proper face detection model
  // like BlazeFace or MediaPipe's face detection model.
  // For simplicity, in this prototype we'll assume the input image
  // is already a properly cropped face and just return it.
  
  return {
    success: true,
    faceTensor: imageTensor.clone()
  };
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
 * This is a new function to support client-side MediaPipe analysis
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
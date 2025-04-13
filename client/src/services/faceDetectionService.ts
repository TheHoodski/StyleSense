// client/src/services/faceDetectionService.ts
import * as facemesh from '@mediapipe/face_mesh';
import * as tf from '@tensorflow/tfjs';

class FaceDetectionService {
  private faceMesh: facemesh.FaceMesh | null = null;
  
  async initialize(): Promise<void> {
    this.faceMesh = new facemesh.FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });
    
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    await this.faceMesh.initialize();
  }
  
  async detectFace(imageElement: HTMLImageElement | HTMLVideoElement): Promise<{
    faceShape: string;
    confidenceScore: number;
    landmarks: number[][];
  } | null> {
    if (!this.faceMesh) {
      await this.initialize();
    }
    
    return new Promise((resolve) => {
      if (!this.faceMesh) {
        resolve(null);
        return;
      }
      
      this.faceMesh.onResults((results) => {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
          resolve(null);
          return;
        }
        
        const landmarks = results.multiFaceLandmarks[0];
        const faceShape = this.determineFaceShape(landmarks);
        
        resolve({
          faceShape: faceShape.shape,
          confidenceScore: faceShape.confidence,
          landmarks: landmarks.map(l => [l.x, l.y, l.z])
        });
      });
      
      this.faceMesh.send({image: imageElement});
    });
  }
  
  private determineFaceShape(landmarks: facemesh.NormalizedLandmarkList): {
    shape: string;
    confidence: number;
  } {
    // Extract key points for measurements
    const jawline = this.getJawlinePoints(landmarks);
    const forehead = this.getForeheadPoints(landmarks);
    const cheekbones = this.getCheekbonePoints(landmarks);
    const faceLength = this.getFaceLength(landmarks);
    
    // Calculate ratios and measurements
    const jawWidth = this.calculateDistance(jawline[0], jawline[1]);
    const foreheadWidth = this.calculateDistance(forehead[0], forehead[1]);
    const cheekboneWidth = this.calculateDistance(cheekbones[0], cheekbones[1]);
    const faceHeight = faceLength;
    
    // Face shape determination logic
    const faceWidthToHeightRatio = Math.max(jawWidth, foreheadWidth, cheekboneWidth) / faceHeight;
    const jawToForeheadRatio = jawWidth / foreheadWidth;
    const cheekboneToJawRatio = cheekboneWidth / jawWidth;
    const cheekboneToForeheadRatio = cheekboneWidth / foreheadWidth;
    
    // Decision tree for face shape classification
    // These are approximate rules and may need fine-tuning based on testing
    let shape = 'oval';
    let confidence = 80;
    
    if (faceWidthToHeightRatio > 0.8) {
      // Face is wider
      if (jawToForeheadRatio > 1.1) {
        shape = 'triangle';
        confidence = 75 + 10 * (jawToForeheadRatio - 1.1);
      } else if (jawToForeheadRatio < 0.9) {
        shape = 'heart';
        confidence = 75 + 10 * (0.9 - jawToForeheadRatio);
      } else if (cheekboneToJawRatio > 1.1 && cheekboneToForeheadRatio > 1.1) {
        shape = 'diamond';
        confidence = 75 + 5 * (cheekboneToJawRatio - 1.1) + 5 * (cheekboneToForeheadRatio - 1.1);
      } else {
        shape = 'round';
        confidence = 75;
      }
    } else if (faceWidthToHeightRatio < 0.7) {
      // Face is longer
      if (jawToForeheadRatio > 0.95 && jawToForeheadRatio < 1.05) {
        shape = 'rectangle';
        confidence = 75 + 10 * (1 - Math.abs(jawToForeheadRatio - 1));
      } else {
        shape = 'oval';
        confidence = 75;
      }
    } else {
      // Medium proportions
      if (jawToForeheadRatio > 0.95 && jawToForeheadRatio < 1.05) {
        shape = 'square';
        confidence = 75 + 10 * (1 - Math.abs(jawToForeheadRatio - 1));
      } else {
        shape = 'oval';
        confidence = 75;
      }
    }
    
    return { shape, confidence: Math.min(confidence, 95) };
  }
  
  // Helper methods to extract landmarks
  private getJawlinePoints(landmarks: facemesh.NormalizedLandmarkList): [facemesh.NormalizedLandmark, facemesh.NormalizedLandmark] {
    // These indices are for the jawline endpoints in MediaPipe Face Mesh
    return [landmarks[134], landmarks[365]];
  }
  
  private getForeheadPoints(landmarks: facemesh.NormalizedLandmarkList): [facemesh.NormalizedLandmark, facemesh.NormalizedLandmark] {
    // Approximate forehead width points
    return [landmarks[71], landmarks[301]];
  }
  
  private getCheekbonePoints(landmarks: facemesh.NormalizedLandmarkList): [facemesh.NormalizedLandmark, facemesh.NormalizedLandmark] {
    // Approximate cheekbone points
    return [landmarks[116], landmarks[345]];
  }
  
  private getFaceLength(landmarks: facemesh.NormalizedLandmarkList): number {
    // Top of forehead to bottom of chin
    const forehead = landmarks[10]; // Top of forehead
    const chin = landmarks[152]; // Bottom of chin
    return this.calculateDistance(forehead, chin);
  }
  
  private calculateDistance(point1: facemesh.NormalizedLandmark, point2: facemesh.NormalizedLandmark): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) +
      Math.pow(point2.y - point1.y, 2)
    );
  }
}

export default new FaceDetectionService();
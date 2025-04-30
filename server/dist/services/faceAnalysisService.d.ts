import { FaceAnalysisResult } from '../types';
import { FaceShapeType } from '../models/FaceAnalysis';
export declare const processClientAnalysis: (faceShape: FaceShapeType, confidenceScore: number) => FaceAnalysisResult;
export declare const analyzePhoto: (_photoPath: string, faceShape?: FaceShapeType, confidenceScore?: number) => Promise<FaceAnalysisResult>;
export declare const getFaceShapeInfo: (faceShape: FaceShapeType) => {
    title: string;
    description: string;
    characteristics: string[];
    suitableStyles: string[];
};
export declare const determineShapeFromLandmarks: (landmarks: number[][]) => {
    faceShape: FaceShapeType;
    confidenceScore: number;
};

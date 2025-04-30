import { FaceAnalysis } from '../models/FaceAnalysis';
import { Recommendation } from '../models/Recommendation';
import { SavedRecommendation } from '../models/SavedRecommendation';
export declare const generateRecommendations: (analysis: FaceAnalysis) => Promise<Recommendation[]>;
export declare const getRecommendationsForAnalysis: (analysisId: string, limit?: number, isPremium?: boolean) => Promise<any[]>;
export declare const saveRecommendation: (userId: string, recommendationId: string, notes?: string) => Promise<SavedRecommendation>;

import { Model } from 'sequelize-typescript';
import { FaceAnalysis } from './FaceAnalysis';
import { User } from './User';
import { HaircutStyle } from './HaircutStyle';
import { SavedRecommendation } from './SavedRecommendation';
export declare class Recommendation extends Model {
    recommendation_id: string;
    analysis_id: string;
    user_id?: string;
    style_id: string;
    relevance_score: number;
    position: number;
    explanation: string;
    created_at: Date;
    analysis: FaceAnalysis;
    user?: User;
    style: HaircutStyle;
    saved_instances: SavedRecommendation[];
}

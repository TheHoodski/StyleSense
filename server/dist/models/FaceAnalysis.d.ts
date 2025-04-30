import { Model } from 'sequelize-typescript';
import { User } from './User';
import { AnonymousSession } from './AnonymousSession';
import { Recommendation } from './Recommendation';
export type FaceShapeType = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'rectangle' | 'triangle';
export declare class FaceAnalysis extends Model {
    analysis_id: string;
    session_id?: string;
    user_id?: string;
    photo_key: string;
    face_shape: FaceShapeType;
    confidence_score: number;
    share_token: string;
    created_at: Date;
    expires_at?: Date;
    is_deleted: boolean;
    session?: AnonymousSession;
    user?: User;
    recommendations: Recommendation[];
}

import { Model } from 'sequelize-typescript';
import { FaceAnalysis } from './FaceAnalysis';
export declare class AnonymousSession extends Model {
    session_id: string;
    device_fingerprint?: string;
    created_at: Date;
    last_activity: Date;
    ip_address?: string;
    user_agent?: string;
    face_analyses: FaceAnalysis[];
}

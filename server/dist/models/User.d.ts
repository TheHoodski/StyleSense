import { Model } from 'sequelize-typescript';
import { FaceAnalysis } from './FaceAnalysis';
import { Subscription } from './Subscription';
import { UserActivity } from './UserActivity';
import { SavedRecommendation } from './SavedRecommendation';
import { Recommendation } from './Recommendation';
export declare class User extends Model {
    user_id: string;
    email: string;
    password_hash: string;
    get password(): string | undefined;
    set password(value: string | undefined);
    is_premium: boolean;
    subscription_expires_at?: Date;
    created_at: Date;
    updated_at: Date;
    last_login?: Date;
    comparePassword(password: string): Promise<boolean>;
    face_analyses: FaceAnalysis[];
    subscriptions: Subscription[];
    activities: UserActivity[];
    saved_recommendations: SavedRecommendation[];
    recommendations: Recommendation[];
    static hashPassword(instance: User): Promise<void>;
}

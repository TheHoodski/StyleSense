import { Model } from 'sequelize-typescript';
import { User } from './User';
import { Recommendation } from './Recommendation';
export declare class SavedRecommendation extends Model {
    saved_id: string;
    user_id: string;
    recommendation_id: string;
    notes?: string;
    created_at: Date;
    user: User;
    recommendation: Recommendation;
}

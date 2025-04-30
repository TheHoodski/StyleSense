import { Model } from 'sequelize-typescript';
import { User } from './User';
export type ActivityType = 'login' | 'register' | 'analyze_photo' | 'view_recommendations' | 'save_recommendation' | 'subscribe' | 'cancel_subscription' | 'share_analysis';
export declare class UserActivity extends Model {
    activity_id: string;
    user_id: string;
    activity_type: ActivityType;
    details?: Record<string, any>;
    created_at: Date;
    ip_address?: string;
    user: User;
}

import { Model } from 'sequelize-typescript';
import { User } from './User';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'pending';
export type PaymentProvider = 'stripe' | 'paypal';
export declare class Subscription extends Model {
    subscription_id: string;
    user_id: string;
    plan_id: string;
    status: SubscriptionStatus;
    started_at: Date;
    expires_at?: Date;
    renewal_date?: Date;
    payment_provider: PaymentProvider;
    payment_reference: string;
    amount: number;
    currency: string;
    user: User;
}

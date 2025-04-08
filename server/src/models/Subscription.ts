// File: server/src/models/Subscription.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { User } from './User';

// Valid subscription statuses
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'pending';

// Valid payment providers
export type PaymentProvider = 'stripe' | 'paypal';

@Table({
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true
})
export class Subscription extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  subscription_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  user_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  plan_id!: string;

  @Column({
    type: DataType.ENUM('active', 'canceled', 'expired', 'pending'),
    allowNull: false,
    defaultValue: 'pending'
  })
  status!: SubscriptionStatus;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'started_at'
  })
  started_at!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  expires_at?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  renewal_date?: Date;

  @Column({
    type: DataType.ENUM('stripe', 'paypal'),
    allowNull: false
  })
  payment_provider!: PaymentProvider;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  payment_reference!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  amount!: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  })
  currency!: string;

  // Relationships
  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  })
  user!: User;
}
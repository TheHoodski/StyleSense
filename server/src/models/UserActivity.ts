// File: server/src/models/UserActivity.ts
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

// Valid activity types
export type ActivityType = 
  'login' | 
  'register' | 
  'analyze_photo' | 
  'view_recommendations' | 
  'save_recommendation' | 
  'subscribe' | 
  'cancel_subscription' | 
  'share_analysis';

@Table({
  tableName: 'user_activity',
  timestamps: true,
  underscored: true
})
export class UserActivity extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  activity_id!: string;

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
  activity_type!: ActivityType;

  @Column({
    type: DataType.JSONB,
    allowNull: true
  })
  details?: Record<string, any>;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  created_at!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  ip_address?: string;

  // Relationships
  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  })
  user!: User;
}
// File: server/src/models/SavedRecommendation.ts
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
  import { Recommendation } from './Recommendation';
  
  @Table({
    tableName: 'saved_recommendations',
    timestamps: true,
    underscored: true
  })
  export class SavedRecommendation extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
    })
    saved_id!: string;
  
    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      allowNull: false
    })
    user_id!: string;
  
    @ForeignKey(() => Recommendation)
    @Column({
      type: DataType.UUID,
      allowNull: false
    })
    recommendation_id!: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true
    })
    notes?: string;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      field: 'created_at'
    })
    created_at!: Date;
  
    // Relationships
    @BelongsTo(() => User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    })
    user!: User;
  
    @BelongsTo(() => Recommendation, {
      foreignKey: 'recommendation_id',
      onDelete: 'CASCADE'
    })
    recommendation!: Recommendation;
  }
// File: server/src/models/Recommendation.ts
import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    CreatedAt,
    ForeignKey,
    BelongsTo,
    HasMany
  } from 'sequelize-typescript';
  import { FaceAnalysis } from './FaceAnalysis';
  import { User } from './User';
  import { HaircutStyle } from './HaircutStyle';
  import { SavedRecommendation } from './SavedRecommendation';
  
  @Table({
    tableName: 'recommendations',
    timestamps: true,
    underscored: true
  })
  export class Recommendation extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
    })
    recommendation_id!: string;
  
    @ForeignKey(() => FaceAnalysis)
    @Column({
      type: DataType.UUID,
      allowNull: false
    })
    analysis_id!: string;
  
    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      allowNull: true
    })
    user_id?: string;
  
    @ForeignKey(() => HaircutStyle)
    @Column({
      type: DataType.UUID,
      allowNull: false
    })
    style_id!: string;
  
    @Column({
      type: DataType.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    })
    relevance_score!: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false
    })
    position!: number;
  
    @Column({
      type: DataType.TEXT,
      allowNull: false
    })
    explanation!: string;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      field: 'created_at'
    })
    created_at!: Date;
  
    // Relationships
    @BelongsTo(() => FaceAnalysis, {
      foreignKey: 'analysis_id',
      onDelete: 'CASCADE'
    })
    analysis!: FaceAnalysis;
  
    @BelongsTo(() => User, {
      foreignKey: 'user_id',
      onDelete: 'SET NULL'
    })
    user?: User;
  
    @BelongsTo(() => HaircutStyle, {
      foreignKey: 'style_id'
    })
    style!: HaircutStyle;
  
    @HasMany(() => SavedRecommendation, {
      foreignKey: 'recommendation_id'
    })
    saved_instances!: SavedRecommendation[];
  }
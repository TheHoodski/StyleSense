// File: server/src/models/FaceAnalysis.ts
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
  import { User } from './User';
  import { AnonymousSession } from './AnonymousSession';
  import { Recommendation } from './Recommendation';
  
  // Valid face shape types
  export type FaceShapeType = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'rectangle' | 'triangle';
  
  @Table({
    tableName: 'face_analyses',
    timestamps: true,
    underscored: true
  })
  export class FaceAnalysis extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
    })
    analysis_id!: string;
  
    @ForeignKey(() => AnonymousSession)
    @Column({
      type: DataType.UUID,
      allowNull: true
    })
    session_id?: string;
  
    @ForeignKey(() => User)
    @Column({
      type: DataType.UUID,
      allowNull: true
    })
    user_id?: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    photo_key!: string;
  
    @Column({
      type: DataType.ENUM('oval', 'round', 'square', 'heart', 'diamond', 'rectangle', 'triangle'),
      allowNull: false
    })
    face_shape!: FaceShapeType;
  
    @Column({
      type: DataType.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    })
    confidence_score!: number;
  
    @Column({
      type: DataType.STRING,
      unique: true,
      allowNull: false
    })
    share_token!: string;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      field: 'created_at'
    })
    created_at!: Date;
  
    @Column({
      type: DataType.DATE,
      allowNull: true
    })
    expires_at?: Date;
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false
    })
    is_deleted!: boolean;
  
    // Relationships
    @BelongsTo(() => AnonymousSession, {
      foreignKey: 'session_id',
      onDelete: 'SET NULL'
    })
    session?: AnonymousSession;
  
    @BelongsTo(() => User, {
      foreignKey: 'user_id',
      onDelete: 'SET NULL'
    })
    user?: User;
  
    @HasMany(() => Recommendation, {
      foreignKey: 'analysis_id',
      onDelete: 'CASCADE'
    })
    recommendations!: Recommendation[];
  }
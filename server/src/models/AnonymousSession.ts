// File: server/src/models/AnonymousSession.ts
import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany
  } from 'sequelize-typescript';
  import { FaceAnalysis } from './FaceAnalysis';
  
  @Table({
    tableName: 'anonymous_sessions',
    timestamps: true,
    underscored: true
  })
  export class AnonymousSession extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
    })
    session_id!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true
    })
    device_fingerprint?: string;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      field: 'created_at'
    })
    created_at!: Date;
  
    @UpdatedAt
    @Column({
      type: DataType.DATE,
      field: 'last_activity'
    })
    last_activity!: Date;
  
    @Column({
      type: DataType.STRING,
      allowNull: true
    })
    ip_address?: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true
    })
    user_agent?: string;
  
    // Relationships
    @HasMany(() => FaceAnalysis, {
      foreignKey: 'session_id',
      onDelete: 'CASCADE'
    })
    face_analyses!: FaceAnalysis[];
  }
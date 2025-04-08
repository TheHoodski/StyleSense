// File: server/src/models/HaircutStyle.ts
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
  import { Recommendation } from './Recommendation';
  import { FaceShapeType } from './FaceAnalysis';
  
  // Valid length categories
  export type LengthCategory = 'short' | 'medium' | 'long';
  
  // Valid hair types
  export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';
  
  // Valid gender categories
  export type GenderCategory = 'male' | 'female' | 'unisex';
  
  @Table({
    tableName: 'haircut_styles',
    timestamps: true,
    underscored: true
  })
  export class HaircutStyle extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4
    })
    style_id!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    name!: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: false
    })
    description!: string;
  
    @Column({
      type: DataType.ARRAY(DataType.STRING),
      allowNull: false
    })
    suitable_face_shapes!: FaceShapeType[];
  
    @Column({
      type: DataType.ARRAY(DataType.STRING),
      allowNull: false
    })
    suitable_hair_types!: HairType[];
  
    @Column({
      type: DataType.ARRAY(DataType.STRING),
      allowNull: false
    })
    suitable_genders!: GenderCategory[];
  
    @Column({
      type: DataType.ENUM('short', 'medium', 'long'),
      allowNull: false
    })
    length_category!: LengthCategory;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    })
    maintenance_level!: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: false
    })
    image_url!: string;
  
    @Column({
      type: DataType.JSONB,
      allowNull: true
    })
    style_attributes?: Record<string, any>;
  
    @CreatedAt
    @Column({
      type: DataType.DATE,
      field: 'created_at'
    })
    created_at!: Date;
  
    @UpdatedAt
    @Column({
      type: DataType.DATE,
      field: 'updated_at'
    })
    updated_at!: Date;
  
    // Relationships
    @HasMany(() => Recommendation, {
      foreignKey: 'style_id'
    })
    recommendations!: Recommendation[];
  }
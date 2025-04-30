import { Model } from 'sequelize-typescript';
import { Recommendation } from './Recommendation';
import { FaceShapeType } from './FaceAnalysis';
export type LengthCategory = 'short' | 'medium' | 'long';
export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';
export type GenderCategory = 'male' | 'female' | 'unisex';
export declare class HaircutStyle extends Model {
    style_id: string;
    name: string;
    description: string;
    suitable_face_shapes: FaceShapeType[];
    suitable_hair_types: HairType[];
    suitable_genders: GenderCategory[];
    length_category: LengthCategory;
    maintenance_level: number;
    image_url: string;
    style_attributes?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    recommendations: Recommendation[];
}

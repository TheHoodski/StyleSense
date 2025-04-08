// File: server/src/types/index.ts
import { FaceShapeType } from '../models/FaceAnalysis';
import { HairType, LengthCategory, GenderCategory } from '../models/HaircutStyle';

// User types
export interface UserDto {
  id: string;
  email: string;
  isPremium: boolean;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
}

// Authentication types
export interface AuthTokenPayload {
  userId: string;
  email: string;
  isPremium: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  confirmPassword: string;
}

// Face analysis types
export interface FaceAnalysisResult {
  success: boolean;
  error?: string;
  faceShape?: FaceShapeType;
  confidenceScore?: number;
  features?: {
    faceWidth?: number;
    faceHeight?: number;
    jawWidth?: number;
    jawAngle?: number;
    cheekboneWidth?: number;
    foreheadWidth?: number;
    chinShape?: string;
  };
}

export interface FaceAnalysisDto {
  id: string;
  faceShape: FaceShapeType;
  confidenceScore: number;
  photoUrl?: string;
  shareToken?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Haircut style types
export interface HaircutStyleDto {
  id: string;
  name: string;
  description: string;
  suitableFaceShapes: FaceShapeType[];
  suitableHairTypes: HairType[];
  suitableGenders: GenderCategory[];
  lengthCategory: LengthCategory;
  maintenanceLevel: number;
  imageUrl: string;
  styleAttributes?: Record<string, any>;
}

// Recommendation types
export interface RecommendationDto {
  id: string;
  analysisId: string;
  styleId: string;
  relevanceScore: number;
  position: number;
  explanation: string;
  style: HaircutStyleDto;
}

export interface SavedRecommendationDto {
  id: string;
  userId: string;
  recommendation: RecommendationDto;
  notes?: string;
  createdAt: Date;
}

// Filtering and search types
export interface StyleFilterOptions {
  faceShapes?: FaceShapeType[];
  hairTypes?: HairType[];
  genders?: GenderCategory[];
  lengthCategories?: LengthCategory[];
  maxMaintenanceLevel?: number;
}

// Subscription types
export interface SubscriptionDto {
  id: string;
  userId: string;
  planId: string;
  status: string;
  startedAt: Date;
  expiresAt?: Date;
  renewalDate?: Date;
  amount: number;
  currency: string;
}

// Error response type
export interface ErrorResponse {
  error: {
    message: string;
    status: number;
    requestId?: string;
  };
}
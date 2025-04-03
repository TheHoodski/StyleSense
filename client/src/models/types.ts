// Route: /src/models/types.ts

// User related types
export interface User {
  id: string;
  email?: string;
  isPremium: boolean;
  subscriptionExpiresAt?: Date;
}

// Face analysis types
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'rectangle' | 'triangle';

export interface FaceAnalysis {
  id: string;
  faceShape: FaceShape;
  confidenceScore: number;
  photoUrl?: string;
  shareToken?: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Hairstyle types
export interface HaircutStyle {
  id: string;
  name: string;
  description: string;
  suitableFaceShapes: FaceShape[];
  suitableHairTypes: string[];
  suitableGenders: string[];
  lengthCategory: 'short' | 'medium' | 'long';
  maintenanceLevel: number; // 1-5
  imageUrl: string;
  styleAttributes?: Record<string, any>;
}

export interface Recommendation {
  id: string;
  analysisId: string;
  styleId: string;
  relevanceScore: number;
  position: number;
  explanation: string;
  style: HaircutStyle; // Populated style object
}

// Component props
export interface PhotoUploadProps {
  onPhotoSelected?: (file: File | null, previewUrl: string | null) => void;
}

export interface FaceAnalysisResultProps {
  analysis: FaceAnalysis;
  photoUrl?: string;
}

export interface HaircutCardProps {
  recommendation: Recommendation;
  onClick?: (recommendation: Recommendation) => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  as?: React.ElementType;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'alt' | 'white';
  isPremium?: boolean;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'success' | 'warning' | 'error' | 'premium';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
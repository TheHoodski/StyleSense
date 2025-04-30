// File: server/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../app';
import { AuthTokenPayload } from '../types';
import { User } from '../models/User';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware to verify authentication status
 * If authentication is optional, it will set req.user if a valid token is provided
 * but will not block the request if no token is provided
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
  optional: boolean = false
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
      if (optional) {
        return next();
      }
      throw new AppError('Authentication required', 401);
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
      
      // Set user in request
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        isPremium: decoded.isPremium
      };
      
      next();
    } catch (error) {
      if (optional) {
        return next();
      }
      throw new AppError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to verify premium status
 * Requires authMiddleware to be applied first
 */
export const premiumMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    
    if (!req.user.isPremium) {
      throw new AppError('Premium subscription required', 403);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware that makes authentication optional
 */
export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  authMiddleware(req, res, next, true);
};

/**
 * Create a JWT token for a user
 */
export const createToken = (user: User): string => {
  const payload: AuthTokenPayload = {
    userId: user.user_id,
    email: user.email,
    isPremium: user.is_premium
  };
  
  // Create token that expires in 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
export declare const authMiddleware: (req: Request, _res: Response, next: NextFunction, optional?: boolean) => Promise<void>;
export declare const premiumMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
export declare const optionalAuthMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const createToken: (user: User) => string;

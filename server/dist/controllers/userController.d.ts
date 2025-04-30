import { Request, Response, NextFunction } from 'express';
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const userController: {
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    cancelSubscription: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

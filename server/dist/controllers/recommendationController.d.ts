import { Request, Response, NextFunction } from 'express';
export declare const getRecommendationsByAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSharedRecommendations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const saveRecommendation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSavedRecommendations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteSavedRecommendation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPremiumRecommendations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const recommendationController: {
    getRecommendationsByAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSharedRecommendations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    saveRecommendation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSavedRecommendations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteSavedRecommendation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPremiumRecommendations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

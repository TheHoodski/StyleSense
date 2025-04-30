import { Request, Response, NextFunction } from 'express';
export declare const analyzeFace: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const analyzePhotoWithClientData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSharedAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const analysisController: {
    analyzeFace: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    analyzePhotoWithClientData: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSharedAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteAnalysis: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

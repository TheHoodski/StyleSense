import { Request, Response, NextFunction } from 'express';
export declare const getStyles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getStyleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getStylesByFaceShape: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const filterStyles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const stylesController: {
    getStyles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStyleById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getStylesByFaceShape: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    filterStyles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

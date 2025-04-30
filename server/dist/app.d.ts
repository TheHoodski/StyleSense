import 'dotenv/config';
declare global {
    namespace Express {
        interface Request {
            id: string;
            user?: {
                id: string;
                email?: string;
                isPremium: boolean;
            };
        }
    }
}
declare class AppError extends Error {
    status: number;
    constructor(message: string, status: number);
}
declare const app: import("express-serve-static-core").Express;
export { app, AppError };

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.optionalAuthMiddleware = exports.premiumMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authMiddleware = async (req, _res, next, optional = false) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            if (optional) {
                return next();
            }
            throw new app_1.AppError('Authentication required', 401);
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = {
                id: decoded.userId,
                email: decoded.email,
                isPremium: decoded.isPremium
            };
            next();
        }
        catch (error) {
            if (optional) {
                return next();
            }
            throw new app_1.AppError('Invalid token', 401);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const premiumMiddleware = (req, _res, next) => {
    try {
        if (!req.user) {
            throw new app_1.AppError('Authentication required', 401);
        }
        if (!req.user.isPremium) {
            throw new app_1.AppError('Premium subscription required', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.premiumMiddleware = premiumMiddleware;
const optionalAuthMiddleware = (req, res, next) => {
    (0, exports.authMiddleware)(req, res, next, true);
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const createToken = (user) => {
    const payload = {
        userId: user.user_id,
        email: user.email,
        isPremium: user.is_premium
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
exports.createToken = createToken;
//# sourceMappingURL=authMiddleware.js.map
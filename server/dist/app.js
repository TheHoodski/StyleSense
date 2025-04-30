"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const uuid_1 = require("uuid");
require("dotenv/config");
const analysisRoutes_1 = __importDefault(require("./routes/analysisRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const stylesRoutes_1 = __importDefault(require("./routes/stylesRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const database_1 = require("./config/database");
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const app = (0, express_1.default)();
exports.app = app;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    req.id = (0, uuid_1.v4)();
    next();
});
app.use('/api/analysis', analysisRoutes_1.default);
app.use('/api/recommendations', recommendationRoutes_1.default);
app.use('/api/styles', stylesRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/files', fileRoutes_1.default);
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Resource not found',
            status: 404,
            requestId: req.id
        }
    });
});
app.use((err, req, res, _next) => {
    console.error(`[Error] [${req.id}]:`, err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        error: {
            message,
            status,
            requestId: req.id
        }
    });
});
(0, database_1.initDatabase)()
    .then(() => {
    console.log('Database initialized successfully');
})
    .catch(error => {
    console.error('Database initialization failed:', error);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map
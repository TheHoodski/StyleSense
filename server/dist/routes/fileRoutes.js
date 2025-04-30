"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const s3Utils_1 = require("../utils/s3Utils");
const router = express_1.default.Router();
const UPLOADS_DIR = path_1.default.join(__dirname, '../../uploads');
const serveFile = (req, res, next) => {
    try {
        const fullPath = req.path;
        const relativePath = fullPath.startsWith('/') ? fullPath.slice(1) : fullPath;
        const filePath = path_1.default.join(UPLOADS_DIR, relativePath);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        const contentType = (0, s3Utils_1.getContentType)(filePath);
        res.setHeader('Content-Type', contentType);
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.on('error', (err) => {
            console.error('Error reading file stream:', err);
            return res.status(500).json({ error: 'Failed to read file' });
        });
        return fileStream.pipe(res);
    }
    catch (error) {
        console.error('Error serving file:', error);
        return res.status(500).json({ error: 'Failed to serve file' });
    }
    finally {
        next();
    }
};
router.get('/*', (req, res, next) => {
    serveFile(req, res, next);
});
exports.default = router;
//# sourceMappingURL=fileRoutes.js.map
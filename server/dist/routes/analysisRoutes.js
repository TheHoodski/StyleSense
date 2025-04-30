"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const analysisController_1 = require("../controllers/analysisController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../uploads/temp');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        const uniqueId = (0, uuid_1.v4)();
        const fileExtension = path_1.default.extname(file.originalname);
        cb(null, `${uniqueId}${fileExtension}`);
    }
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
router.use(authMiddleware_1.optionalAuthMiddleware);
router.post('/face', upload.single('photo'), analysisController_1.analysisController.analyzeFace);
router.get('/:analysisId', analysisController_1.analysisController.getAnalysis);
router.get('/share/:shareToken', analysisController_1.analysisController.getSharedAnalysis);
router.delete('/:analysisId', analysisController_1.analysisController.deleteAnalysis);
router.post('/face-with-analysis', upload.single('photo'), analysisController_1.analysisController.analyzePhotoWithClientData);
exports.default = router;
//# sourceMappingURL=analysisRoutes.js.map
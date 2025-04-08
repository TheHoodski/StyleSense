// File: server/src/routes/analysisRoutes.ts
import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { analysisController } from '../controllers/analysisController';
import { optionalAuthMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = path.join(__dirname, '../../uploads/temp');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueId}${fileExtension}`);
  }
});

// File filter - only accept images
const fileFilter = (_req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Apply optional auth middleware to all routes
router.use(optionalAuthMiddleware);

// Routes
router.post('/face', upload.single('photo'), analysisController.analyzeFace);
router.get('/:analysisId', analysisController.getAnalysis);
router.get('/share/:shareToken', analysisController.getSharedAnalysis);
router.delete('/:analysisId', analysisController.deleteAnalysis);

export default router;
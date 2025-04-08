// File: server/src/routes/stylesRoutes.ts
import express from 'express';
import { stylesController } from '../controllers/stylesController';

const router = express.Router();

// Get all styles (can be filtered by query parameters)
router.get('/', stylesController.getStyles);

// Get style by ID
router.get('/:styleId', stylesController.getStyleById);

// Get styles suitable for a specific face shape
router.get('/face-shape/:faceShape', stylesController.getStylesByFaceShape);

// Filter styles by multiple criteria (POST to allow complex filtering)
router.post('/filter', stylesController.filterStyles);

export default router;
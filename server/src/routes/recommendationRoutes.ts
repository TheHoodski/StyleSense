// File: server/src/routes/recommendationRoutes.ts
import express from 'express';
import { recommendationController } from '../controllers/recommendationController';
import { authMiddleware, optionalAuthMiddleware, premiumMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes (with optional auth)
router.get('/analysis/:analysisId', optionalAuthMiddleware, recommendationController.getRecommendationsByAnalysis);
router.get('/shared/:shareToken', recommendationController.getSharedRecommendations);

// User routes (require authentication)
router.post('/save/:recommendationId', authMiddleware, recommendationController.saveRecommendation);
router.get('/saved', authMiddleware, recommendationController.getSavedRecommendations);
router.delete('/saved/:savedId', authMiddleware, recommendationController.deleteSavedRecommendation);

// Premium routes (require premium subscription)
router.get('/premium/analysis/:analysisId', authMiddleware, premiumMiddleware, recommendationController.getPremiumRecommendations);

export default router;
// File: server/src/routes/userRoutes.ts
import express from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Auth routes (no auth required)
router.post('/register', userController.register);
router.post('/login', userController.login);

// User routes (require authentication)
router.use(authMiddleware);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/subscription', userController.createSubscription);
router.get('/subscription', userController.getSubscription);
router.delete('/subscription', userController.cancelSubscription);

export default router;
// File: server/src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Import routes
import analysisRoutes from './routes/analysisRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import stylesRoutes from './routes/stylesRoutes';
import userRoutes from './routes/userRoutes';

// Extend Express Request type to include custom properties
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

// Custom error class
class AppError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Generate request ID for tracking
app.use((req: Request, _res: Response, next: NextFunction) => {
    req.id = uuidv4();
    next();
  });

// API routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/styles', stylesRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      status: 404,
      requestId: req.id
    }
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, AppError };
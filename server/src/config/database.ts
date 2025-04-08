// File: server/src/config/database.ts
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

// Import models
import { AnonymousSession } from '../models/AnonymousSession';
import { User } from '../models/User';
import { FaceAnalysis } from '../models/FaceAnalysis';
import { HaircutStyle } from '../models/HaircutStyle';
import { Recommendation } from '../models/Recommendation';
import { SavedRecommendation } from '../models/SavedRecommendation';
import { Subscription } from '../models/Subscription';
import { UserActivity } from '../models/UserActivity';

// Configure database connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'stylesense',
  logging: process.env.NODE_ENV !== 'production',
  models: [
    AnonymousSession,
    User,
    FaceAnalysis,
    HaircutStyle,
    Recommendation,
    SavedRecommendation,
    Subscription,
    UserActivity
  ]
});

// Database initialization function
export const initDatabase = async (): Promise<void> => {
  try {
    // Only sync in development mode
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    } else {
      // In production, just authenticate
      await sequelize.authenticate();
      console.log('Database connection established successfully');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
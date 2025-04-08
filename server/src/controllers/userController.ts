// File: server/src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../app';
import { User } from '../models/User';
import { Op } from 'sequelize';
import { Subscription } from '../models/Subscription';
import { UserActivity } from '../models/UserActivity';
import { createToken } from '../middlewares/authMiddleware';
import { LoginCredentials, RegisterData, SubscriptionDto, UserDto } from '../types';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, confirmPassword }: RegisterData = req.body;
    
    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email
      }
    });
    
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }
    
    // Create new user
    const newUser = await User.create({
      user_id: uuidv4(),
      email,
      password, // Will be hashed via setter
      is_premium: false
    });
    
    // Create user activity record
    await UserActivity.create({
      activity_id: uuidv4(),
      user_id: newUser.user_id,
      activity_type: 'register',
      ip_address: req.ip
    });
    
    // Generate JWT token
    const token = createToken(newUser);
    
    // Prepare user DTO for response
    const userDto: UserDto = {
      id: newUser.user_id,
      email: newUser.email,
      isPremium: newUser.is_premium,
      createdAt: newUser.created_at
    };
    
    res.status(201).json({
      user: userDto,
      token
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password }: LoginCredentials = req.body;
    
    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    // Find user
    const user = await User.findOne({
      where: {
        email
      }
    });
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Update last login
    await user.update({
      last_login: new Date()
    });
    
    // Create user activity record
    await UserActivity.create({
      activity_id: uuidv4(),
      user_id: user.user_id,
      activity_type: 'login',
      ip_address: req.ip
    });
    
    // Generate JWT token
    const token = createToken(user);
    
    // Prepare user DTO for response
    const userDto: UserDto = {
      id: user.user_id,
      email: user.email,
      isPremium: user.is_premium,
      subscriptionExpiresAt: user.subscription_expires_at,
      createdAt: user.created_at
    };
    
    res.status(200).json({
      user: userDto,
      token
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Get user with subscription info
    const user = await User.findOne({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Subscription,
          as: 'subscriptions',
          where: {
            status: 'active'
          },
          required: false,
          limit: 1,
          order: [['expires_at', 'DESC']]
        }
      ]
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Format response
    const userDto: UserDto = {
      id: user.user_id,
      email: user.email,
      isPremium: user.is_premium,
      subscriptionExpiresAt: user.subscription_expires_at,
      createdAt: user.created_at
    };
    
    // Add subscription details if available
    let subscription = null;
    if (user.subscriptions && user.subscriptions.length > 0) {
      const sub = user.subscriptions[0];
      subscription = {
        id: sub.subscription_id,
        planId: sub.plan_id,
        status: sub.status,
        startedAt: sub.started_at,
        expiresAt: sub.expires_at,
        renewalDate: sub.renewal_date
      };
    }
    
    res.status(200).json({
      user: userDto,
      subscription
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { email, password, currentPassword } = req.body;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Get user
    const user = await User.findOne({
      where: {
        user_id: userId
      }
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Update fields
    let updateData: any = {};
    
    if (email && email !== user.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({
        where: {
          email,
          user_id: { [Op.ne]: userId }
        }
      });
      
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
      
      updateData.email = email;
    }
    
    // If password change is requested
    if (password) {
      // Require current password
      if (!currentPassword) {
        throw new AppError('Current password is required', 400);
      }
      
      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }
      
      updateData.password = password;
    }
    
    // Update user if there are changes
    if (Object.keys(updateData).length > 0) {
      await user.update(updateData);
      
      // Create activity record
      await UserActivity.create({
        activity_id: uuidv4(),
        user_id: userId,
        activity_type: 'update_profile',
        ip_address: req.ip
      });
    }
    
    // Return updated user
    const userDto: UserDto = {
      id: user.user_id,
      email: user.email,
      isPremium: user.is_premium,
      subscriptionExpiresAt: user.subscription_expires_at,
      createdAt: user.created_at
    };
    
    res.status(200).json({
      user: userDto,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Create a subscription
 */
export const createSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { 
      planId, 
      paymentProvider, 
      paymentReference, 
      amount, 
      currency = 'USD',
      durationMonths = 1
    } = req.body;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Validate input
    if (!planId || !paymentProvider || !paymentReference || !amount) {
      throw new AppError('Missing required subscription fields', 400);
    }
    
    // Get user
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Calculate dates
    const startedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);
    
    // Create subscription
    const subscription = await Subscription.create({
      subscription_id: uuidv4(),
      user_id: userId,
      plan_id: planId,
      status: 'active',
      started_at: startedAt,
      expires_at: expiresAt,
      renewal_date: expiresAt,
      payment_provider: paymentProvider,
      payment_reference: paymentReference,
      amount,
      currency
    });
    
    // Update user premium status
    await user.update({
      is_premium: true,
      subscription_expires_at: expiresAt
    });
    
    // Create activity record
    await UserActivity.create({
      activity_id: uuidv4(),
      user_id: userId,
      activity_type: 'subscribe',
      details: {
        planId,
        paymentProvider,
        durationMonths
      },
      ip_address: req.ip
    });
    
    // Format subscription for response
    const subscriptionDto: SubscriptionDto = {
      id: subscription.subscription_id,
      userId: subscription.user_id,
      planId: subscription.plan_id,
      status: subscription.status,
      startedAt: subscription.started_at,
      expiresAt: subscription.expires_at,
      renewalDate: subscription.renewal_date,
      amount: subscription.amount,
      currency: subscription.currency
    };
    
    res.status(201).json({
      subscription: subscriptionDto,
      message: 'Subscription created successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get user subscription
 */
export const getSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Get active subscription
    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
        status: 'active'
      },
      order: [['expires_at', 'DESC']]
    });
    
    if (!subscription) {
      res.status(200).json({
        subscription: null,
        message: 'No active subscription found'
      });
    }
    
    // Format subscription for response
    const subscriptionDto: SubscriptionDto | null = subscription ? {
      id: subscription.subscription_id,
      userId: subscription.user_id,
      planId: subscription.plan_id,
      status: subscription.status,
      startedAt: subscription.started_at,
      expiresAt: subscription.expires_at,
      renewalDate: subscription.renewal_date,
      amount: subscription.amount,
      currency: subscription.currency
    } : null;
    
    res.status(200).json({
      subscription: subscriptionDto
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
    
    // Get active subscription
    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
        status: 'active'
      }
    });
    
    if (!subscription) {
      throw new AppError('No active subscription found', 404);
    }
    
    // Update subscription status
    await subscription.update({
      status: 'canceled'
    });
    
    // Create activity record
    await UserActivity.create({
      activity_id: uuidv4(),
      user_id: userId,
      activity_type: 'cancel_subscription',
      details: {
        subscriptionId: subscription.subscription_id
      },
      ip_address: req.ip
    });
    
    res.status(200).json({
      message: 'Subscription canceled successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Export the controller object for routes
export const userController = {
  register,
  login,
  getProfile,
  updateProfile,
  createSubscription,
  getSubscription,
  cancelSubscription
};
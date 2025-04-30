"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.cancelSubscription = exports.getSubscription = exports.createSubscription = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const uuid_1 = require("uuid");
const app_1 = require("../app");
const User_1 = require("../models/User");
const sequelize_1 = require("sequelize");
const Subscription_1 = require("../models/Subscription");
const UserActivity_1 = require("../models/UserActivity");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const register = async (req, res, next) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (!email || !password) {
            throw new app_1.AppError('Email and password are required', 400);
        }
        if (password !== confirmPassword) {
            throw new app_1.AppError('Passwords do not match', 400);
        }
        const existingUser = await User_1.User.findOne({
            where: {
                email
            }
        });
        if (existingUser) {
            throw new app_1.AppError('Email already in use', 409);
        }
        const newUser = await User_1.User.create({
            user_id: (0, uuid_1.v4)(),
            email,
            password,
            is_premium: false
        });
        await UserActivity_1.UserActivity.create({
            activity_id: (0, uuid_1.v4)(),
            user_id: newUser.user_id,
            activity_type: 'register',
            ip_address: req.ip
        });
        const token = (0, authMiddleware_1.createToken)(newUser);
        const userDto = {
            id: newUser.user_id,
            email: newUser.email,
            isPremium: newUser.is_premium,
            createdAt: newUser.created_at
        };
        res.status(201).json({
            user: userDto,
            token
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new app_1.AppError('Email and password are required', 400);
        }
        const user = await User_1.User.findOne({
            where: {
                email
            }
        });
        if (!user) {
            throw new app_1.AppError('Invalid credentials', 401);
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new app_1.AppError('Invalid credentials', 401);
        }
        await user.update({
            last_login: new Date()
        });
        await UserActivity_1.UserActivity.create({
            activity_id: (0, uuid_1.v4)(),
            user_id: user.user_id,
            activity_type: 'login',
            ip_address: req.ip
        });
        const token = (0, authMiddleware_1.createToken)(user);
        const userDto = {
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        const user = await User_1.User.findOne({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: Subscription_1.Subscription,
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
            throw new app_1.AppError('User not found', 404);
        }
        const userDto = {
            id: user.user_id,
            email: user.email,
            isPremium: user.is_premium,
            subscriptionExpiresAt: user.subscription_expires_at,
            createdAt: user.created_at
        };
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
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { email, password, currentPassword } = req.body;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        const user = await User_1.User.findOne({
            where: {
                user_id: userId
            }
        });
        if (!user) {
            throw new app_1.AppError('User not found', 404);
        }
        let updateData = {};
        if (email && email !== user.email) {
            const existingUser = await User_1.User.findOne({
                where: {
                    email,
                    user_id: { [sequelize_1.Op.ne]: userId }
                }
            });
            if (existingUser) {
                throw new app_1.AppError('Email already in use', 409);
            }
            updateData.email = email;
        }
        if (password) {
            if (!currentPassword) {
                throw new app_1.AppError('Current password is required', 400);
            }
            const isPasswordValid = await user.comparePassword(currentPassword);
            if (!isPasswordValid) {
                throw new app_1.AppError('Current password is incorrect', 401);
            }
            updateData.password = password;
        }
        if (Object.keys(updateData).length > 0) {
            await user.update(updateData);
            await UserActivity_1.UserActivity.create({
                activity_id: (0, uuid_1.v4)(),
                user_id: userId,
                activity_type: 'update_profile',
                ip_address: req.ip
            });
        }
        const userDto = {
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const createSubscription = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { planId, paymentProvider, paymentReference, amount, currency = 'USD', durationMonths = 1 } = req.body;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        if (!planId || !paymentProvider || !paymentReference || !amount) {
            throw new app_1.AppError('Missing required subscription fields', 400);
        }
        const user = await User_1.User.findByPk(userId);
        if (!user) {
            throw new app_1.AppError('User not found', 404);
        }
        const startedAt = new Date();
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + durationMonths);
        const subscription = await Subscription_1.Subscription.create({
            subscription_id: (0, uuid_1.v4)(),
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
        await user.update({
            is_premium: true,
            subscription_expires_at: expiresAt
        });
        await UserActivity_1.UserActivity.create({
            activity_id: (0, uuid_1.v4)(),
            user_id: userId,
            activity_type: 'subscribe',
            details: {
                planId,
                paymentProvider,
                durationMonths
            },
            ip_address: req.ip
        });
        const subscriptionDto = {
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
    }
    catch (error) {
        next(error);
    }
};
exports.createSubscription = createSubscription;
const getSubscription = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        const subscription = await Subscription_1.Subscription.findOne({
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
        const subscriptionDto = subscription ? {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getSubscription = getSubscription;
const cancelSubscription = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new app_1.AppError('User not authenticated', 401);
        }
        const subscription = await Subscription_1.Subscription.findOne({
            where: {
                user_id: userId,
                status: 'active'
            }
        });
        if (!subscription) {
            throw new app_1.AppError('No active subscription found', 404);
        }
        await subscription.update({
            status: 'canceled'
        });
        await UserActivity_1.UserActivity.create({
            activity_id: (0, uuid_1.v4)(),
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
    }
    catch (error) {
        next(error);
    }
};
exports.cancelSubscription = cancelSubscription;
exports.userController = {
    register: exports.register,
    login: exports.login,
    getProfile: exports.getProfile,
    updateProfile: exports.updateProfile,
    createSubscription: exports.createSubscription,
    getSubscription: exports.getSubscription,
    cancelSubscription: exports.cancelSubscription
};
//# sourceMappingURL=userController.js.map
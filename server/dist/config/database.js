"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const AnonymousSession_1 = require("../models/AnonymousSession");
const User_1 = require("../models/User");
const FaceAnalysis_1 = require("../models/FaceAnalysis");
const HaircutStyle_1 = require("../models/HaircutStyle");
const Recommendation_1 = require("../models/Recommendation");
const SavedRecommendation_1 = require("../models/SavedRecommendation");
const Subscription_1 = require("../models/Subscription");
const UserActivity_1 = require("../models/UserActivity");
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'stylesense',
    logging: process.env.NODE_ENV !== 'production',
    models: [
        AnonymousSession_1.AnonymousSession,
        User_1.User,
        FaceAnalysis_1.FaceAnalysis,
        HaircutStyle_1.HaircutStyle,
        Recommendation_1.Recommendation,
        SavedRecommendation_1.SavedRecommendation,
        Subscription_1.Subscription,
        UserActivity_1.UserActivity
    ]
});
const initDatabase = async () => {
    console.log('Database connection parameters:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Username: ${process.env.DB_USER}`);
    console.log(`Password: ${process.env.DB_PASSWORD ? '[HIDDEN]' : 'missing'}`);
    console.log(`Schema: ${process.env.DB_SCHEMA || 'default'}`);
    try {
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('Database synchronized');
        }
        else {
            await sequelize.authenticate();
            console.log('Database connection established successfully');
        }
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};
exports.initDatabase = initDatabase;
exports.default = sequelize;
//# sourceMappingURL=database.js.map
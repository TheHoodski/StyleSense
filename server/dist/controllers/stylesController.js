"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylesController = exports.filterStyles = exports.getStylesByFaceShape = exports.getStyleById = exports.getStyles = void 0;
const sequelize_1 = require("sequelize");
const app_1 = require("../app");
const HaircutStyle_1 = require("../models/HaircutStyle");
const database_1 = __importDefault(require("../config/database"));
const getStyles = async (req, res, next) => {
    try {
        const { faceShape, hairType, gender, lengthCategory, maxMaintenance, limit = 50, offset = 0 } = req.query;
        const whereConditions = {};
        if (faceShape) {
            whereConditions[sequelize_1.Op.and] = database_1.default.literal(`'${faceShape}' = ANY(suitable_face_shapes)`);
        }
        if (hairType) {
            whereConditions[sequelize_1.Op.and] = database_1.default.literal(`'${hairType}' = ANY(suitable_hair_types)`);
        }
        if (gender) {
            whereConditions[sequelize_1.Op.and] = database_1.default.literal(`'${gender}' = ANY(suitable_genders)`);
        }
        if (lengthCategory) {
            whereConditions.length_category = lengthCategory;
        }
        if (maxMaintenance) {
            whereConditions.maintenance_level = {
                [sequelize_1.Op.lte]: parseInt(maxMaintenance, 10)
            };
        }
        const styles = await HaircutStyle_1.HaircutStyle.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [['name', 'ASC']]
        });
        const formattedStyles = styles.rows.map(style => ({
            id: style.style_id,
            name: style.name,
            description: style.description,
            suitableFaceShapes: style.suitable_face_shapes,
            suitableHairTypes: style.suitable_hair_types,
            suitableGenders: style.suitable_genders,
            lengthCategory: style.length_category,
            maintenanceLevel: style.maintenance_level,
            imageUrl: style.image_url,
            styleAttributes: style.style_attributes
        }));
        res.status(200).json({
            styles: formattedStyles,
            meta: {
                total: styles.count,
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10)
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStyles = getStyles;
const getStyleById = async (req, res, next) => {
    try {
        const { styleId } = req.params;
        const style = await HaircutStyle_1.HaircutStyle.findOne({
            where: {
                style_id: styleId
            }
        });
        if (!style) {
            throw new app_1.AppError('Haircut style not found', 404);
        }
        const formattedStyle = {
            id: style.style_id,
            name: style.name,
            description: style.description,
            suitableFaceShapes: style.suitable_face_shapes,
            suitableHairTypes: style.suitable_hair_types,
            suitableGenders: style.suitable_genders,
            lengthCategory: style.length_category,
            maintenanceLevel: style.maintenance_level,
            imageUrl: style.image_url,
            styleAttributes: style.style_attributes
        };
        res.status(200).json(formattedStyle);
    }
    catch (error) {
        next(error);
    }
};
exports.getStyleById = getStyleById;
const getStylesByFaceShape = async (req, res, next) => {
    try {
        const { faceShape } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        const validFaceShapes = ['oval', 'round', 'square', 'heart', 'diamond', 'rectangle', 'triangle'];
        if (!validFaceShapes.includes(faceShape)) {
            throw new app_1.AppError('Invalid face shape', 400);
        }
        const styles = await HaircutStyle_1.HaircutStyle.findAndCountAll({
            where: database_1.default.literal(`'${faceShape}' = ANY(suitable_face_shapes)`),
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [['name', 'ASC']]
        });
        const formattedStyles = styles.rows.map(style => ({
            id: style.style_id,
            name: style.name,
            description: style.description,
            suitableFaceShapes: style.suitable_face_shapes,
            suitableHairTypes: style.suitable_hair_types,
            suitableGenders: style.suitable_genders,
            lengthCategory: style.length_category,
            maintenanceLevel: style.maintenance_level,
            imageUrl: style.image_url,
            styleAttributes: style.style_attributes
        }));
        res.status(200).json({
            styles: formattedStyles,
            meta: {
                faceShape,
                total: styles.count,
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10)
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStylesByFaceShape = getStylesByFaceShape;
const filterStyles = async (req, res, next) => {
    try {
        const filterOptions = req.body;
        const { limit = 50, offset = 0 } = req.query;
        const whereConditions = {};
        const andConditions = [];
        if (filterOptions.faceShapes && filterOptions.faceShapes.length > 0) {
            const faceShapeConditions = filterOptions.faceShapes.map(shape => database_1.default.literal(`'${shape}' = ANY(suitable_face_shapes)`));
            andConditions.push({ [sequelize_1.Op.or]: faceShapeConditions });
        }
        if (filterOptions.hairTypes && filterOptions.hairTypes.length > 0) {
            const hairTypeConditions = filterOptions.hairTypes.map(type => database_1.default.literal(`'${type}' = ANY(suitable_hair_types)`));
            andConditions.push({ [sequelize_1.Op.or]: hairTypeConditions });
        }
        if (filterOptions.genders && filterOptions.genders.length > 0) {
            const genderConditions = filterOptions.genders.map(gender => database_1.default.literal(`'${gender}' = ANY(suitable_genders)`));
            andConditions.push({ [sequelize_1.Op.or]: genderConditions });
        }
        if (filterOptions.lengthCategories && filterOptions.lengthCategories.length > 0) {
            whereConditions.length_category = {
                [sequelize_1.Op.in]: filterOptions.lengthCategories
            };
        }
        if (filterOptions.maxMaintenanceLevel) {
            whereConditions.maintenance_level = {
                [sequelize_1.Op.lte]: filterOptions.maxMaintenanceLevel
            };
        }
        if (andConditions.length > 0) {
            whereConditions[sequelize_1.Op.and] = andConditions;
        }
        const styles = await HaircutStyle_1.HaircutStyle.findAndCountAll({
            where: whereConditions,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order: [['name', 'ASC']]
        });
        const formattedStyles = styles.rows.map(style => ({
            id: style.style_id,
            name: style.name,
            description: style.description,
            suitableFaceShapes: style.suitable_face_shapes,
            suitableHairTypes: style.suitable_hair_types,
            suitableGenders: style.suitable_genders,
            lengthCategory: style.length_category,
            maintenanceLevel: style.maintenance_level,
            imageUrl: style.image_url,
            styleAttributes: style.style_attributes
        }));
        res.status(200).json({
            styles: formattedStyles,
            meta: {
                filters: filterOptions,
                total: styles.count,
                limit: parseInt(limit, 10),
                offset: parseInt(offset, 10)
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.filterStyles = filterStyles;
exports.stylesController = {
    getStyles: exports.getStyles,
    getStyleById: exports.getStyleById,
    getStylesByFaceShape: exports.getStylesByFaceShape,
    filterStyles: exports.filterStyles
};
//# sourceMappingURL=stylesController.js.map
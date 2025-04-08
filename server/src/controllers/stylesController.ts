// File: server/src/controllers/stylesController.ts
import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { AppError } from '../app';
import { HaircutStyle } from '../models/HaircutStyle';
import { FaceShapeType } from '../models/FaceAnalysis';
import { StyleFilterOptions } from '../types';
import sequelize from '../config/database';

/**
 * Get all haircut styles (with optional filtering)
 */
export const getStyles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      faceShape,
      hairType,
      gender,
      lengthCategory,
      maxMaintenance,
      limit = 50,
      offset = 0
    } = req.query;
    
    // Build query conditions
    const whereConditions: any = {};
    
    if (faceShape) {
      whereConditions[Op.and] = sequelize.literal(`'${faceShape}' = ANY(suitable_face_shapes)`);
    }
    
    if (hairType) {
      whereConditions[Op.and] = sequelize.literal(`'${hairType}' = ANY(suitable_hair_types)`);
    }
    
    if (gender) {
      whereConditions[Op.and] = sequelize.literal(`'${gender}' = ANY(suitable_genders)`);
    }
    
    if (lengthCategory) {
      whereConditions.length_category = lengthCategory;
    }
    
    if (maxMaintenance) {
      whereConditions.maintenance_level = {
        [Op.lte]: parseInt(maxMaintenance as string, 10)
      };
    }
    
    // Get styles
    const styles = await HaircutStyle.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      order: [['name', 'ASC']]
    });
    
    // Format response
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
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific haircut style by ID
 */
export const getStyleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { styleId } = req.params;
    
    const style = await HaircutStyle.findOne({
      where: {
        style_id: styleId
      }
    });
    
    if (!style) {
      throw new AppError('Haircut style not found', 404);
    }
    
    // Format response
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
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get styles suitable for a specific face shape
 */
export const getStylesByFaceShape = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { faceShape } = req.params;
    const {
      limit = 50,
      offset = 0
    } = req.query;
    
    // Validate face shape
    const validFaceShapes: FaceShapeType[] = ['oval', 'round', 'square', 'heart', 'diamond', 'rectangle', 'triangle'];
    
    if (!validFaceShapes.includes(faceShape as FaceShapeType)) {
      throw new AppError('Invalid face shape', 400);
    }
    
    // Get styles for this face shape
    const styles = await HaircutStyle.findAndCountAll({
      where: sequelize.literal(`'${faceShape}' = ANY(suitable_face_shapes)`),
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      order: [['name', 'ASC']]
    });
    
    // Format response
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
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Filter styles by multiple criteria
 */
export const filterStyles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filterOptions: StyleFilterOptions = req.body;
    const { limit = 50, offset = 0 } = req.query;
    
    // Build query conditions
    const whereConditions: any = {};
    const andConditions: any[] = [];
    
    // Face shapes filter
    if (filterOptions.faceShapes && filterOptions.faceShapes.length > 0) {
      // Match any of the specified face shapes
      const faceShapeConditions = filterOptions.faceShapes.map(shape => 
        sequelize.literal(`'${shape}' = ANY(suitable_face_shapes)`)
      );
      andConditions.push({ [Op.or]: faceShapeConditions });
    }
    
    // Hair types filter
    if (filterOptions.hairTypes && filterOptions.hairTypes.length > 0) {
      const hairTypeConditions = filterOptions.hairTypes.map(type => 
        sequelize.literal(`'${type}' = ANY(suitable_hair_types)`)
      );
      andConditions.push({ [Op.or]: hairTypeConditions });
    }
    
    // Gender filter
    if (filterOptions.genders && filterOptions.genders.length > 0) {
      const genderConditions = filterOptions.genders.map(gender => 
        sequelize.literal(`'${gender}' = ANY(suitable_genders)`)
      );
      andConditions.push({ [Op.or]: genderConditions });
    }
    
    // Length category filter
    if (filterOptions.lengthCategories && filterOptions.lengthCategories.length > 0) {
      whereConditions.length_category = {
        [Op.in]: filterOptions.lengthCategories
      };
    }
    
    // Maintenance level filter
    if (filterOptions.maxMaintenanceLevel) {
      whereConditions.maintenance_level = {
        [Op.lte]: filterOptions.maxMaintenanceLevel
      };
    }
    
    // Combine conditions
    if (andConditions.length > 0) {
      whereConditions[Op.and] = andConditions;
    }
    
    // Get styles
    const styles = await HaircutStyle.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      order: [['name', 'ASC']]
    });
    
    // Format response
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
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Export the controller object for routes
export const stylesController = {
  getStyles,
  getStyleById,
  getStylesByFaceShape,
  filterStyles
};
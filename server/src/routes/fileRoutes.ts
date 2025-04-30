// File: server/src/routes/fileRoutes.ts
import express from 'express';
import path from 'path';
import fs from 'fs';
import { getContentType } from '../utils/s3Utils';

const router = express.Router();

// Base directory for uploads
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Create a middleware to handle file serving
const serveFile = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Get the full path from the URL
    const fullPath = req.path;
    
    // Remove leading slash if present
    const relativePath = fullPath.startsWith('/') ? fullPath.slice(1) : fullPath;
    
    // Construct the file path
    const filePath = path.join(UPLOADS_DIR, relativePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Determine content type
    const contentType = getContentType(filePath);
    
    // Set content type header
    res.setHeader('Content-Type', contentType);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => {
      console.error('Error reading file stream:', err);
      return res.status(500).json({ error: 'Failed to read file' });
    });
    
    // Pipe and return to ensure the function terminates properly
    return fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(500).json({ error: 'Failed to serve file' });
  } finally {
    next();
  }
};

// Use a more straightforward approach for Express routes
router.get('/*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    serveFile(req, res, next);
  });
  

export default router;
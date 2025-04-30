// File: server/src/utils/s3Utils.ts (Local Version)
import path from 'path';
import { promises as fsPromises } from 'fs';

// Local storage paths
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const FACES_DIR = path.join(UPLOADS_DIR, 'faces');

// Make sure directories exist
(async () => {
  try {
    await fsPromises.mkdir(FACES_DIR, { recursive: true });
    console.log('Storage directories created');
  } catch (error) {
    console.error('Error creating storage directories:', error);
  }
})();

/**
 * Upload a file to local storage (replaces S3 upload)
 * @param filePath Local source file path
 * @param key Destination key (path)
 */
export const uploadToS3 = async (filePath: string, key: string): Promise<void> => {
  try {
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(path.join(UPLOADS_DIR, key));
    await fsPromises.mkdir(destDir, { recursive: true });
    
    // Copy file to destination
    await fsPromises.copyFile(filePath, path.join(UPLOADS_DIR, key));
    
    console.log(`File uploaded to local storage: ${key}`);
  } catch (error) {
    console.error('Error uploading file to local storage:', error);
    throw error;
  }
};

/**
 * Delete a file from local storage (replaces S3 delete)
 * @param key File key (path)
 */
export const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    const filePath = path.join(UPLOADS_DIR, key);
    
    // Check if file exists
    await fsPromises.access(filePath);
    
    // Delete file
    await fsPromises.unlink(filePath);
    
    console.log(`File deleted from local storage: ${key}`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`File not found in local storage: ${key}`);
      return; // File doesn't exist, so consider it "deleted"
    }
    
    console.error('Error deleting file from local storage:', error);
    throw error;
  }
};

/**
 * Get a URL for a file in local storage (replaces S3 signed URL)
 * @param key File key (path)
 * @param expiresIn Expiry time in seconds (unused in local version)
 */
export const getSignedS3Url = async (key: string, expiresIn: number = 3600): Promise<string> => {
  // In a production app with a real web server, this would return a URL to access the file
  // For this simplified version, we'll return a local file path
  const baseUrl = process.env.LOCAL_FILE_SERVER_URL || 'http://localhost:5000';
  const apiPath = '/api/files'; // Add a route in Express to serve these files
  
  const expirationTime = Date.now() + expiresIn * 1000; // Calculate expiration time
  const signedUrl = `${baseUrl}${apiPath}/${encodeURIComponent(key)}?expires=${expirationTime}`; // Use expiresIn in the URL
  return signedUrl;
};

/**
 * Determine content type based on file extension
 * @param filename Filename with extension
 */
export const getContentType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'pdf':
      return 'application/pdf';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
};
// File: server/src/utils/s3Utils.ts
import fs from 'fs';
import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand,
  GetObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 bucket name
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'stylesense-dev';

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

/**
 * Upload a file to S3
 * @param filePath Local file path
 * @param key S3 key (path)
 */
export const uploadToS3 = async (filePath: string, key: string): Promise<void> => {
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: getContentType(key)
  };
  
  await s3Client.send(new PutObjectCommand(params));
};

/**
 * Delete a file from S3
 * @param key S3 key (path)
 */
export const deleteFromS3 = async (key: string): Promise<void> => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };
  
  await s3Client.send(new DeleteObjectCommand(params));
};

/**
 * Get a signed URL for an S3 object
 * @param key S3 key (path)
 * @param expiresIn Expiry time in seconds (default: 3600)
 */
export const getSignedS3Url = async (key: string, expiresIn: number = 3600): Promise<string> => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };
  
  const command = new GetObjectCommand(params);
  
  return getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Determine content type based on file extension
 * @param filename Filename with extension
 */
const getContentType = (filename: string): string => {
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
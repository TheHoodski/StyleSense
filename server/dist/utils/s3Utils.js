"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentType = exports.getSignedS3Url = exports.deleteFromS3 = exports.uploadToS3 = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const UPLOADS_DIR = path_1.default.join(__dirname, '../../uploads');
const FACES_DIR = path_1.default.join(UPLOADS_DIR, 'faces');
(async () => {
    try {
        await fs_1.promises.mkdir(FACES_DIR, { recursive: true });
        console.log('Storage directories created');
    }
    catch (error) {
        console.error('Error creating storage directories:', error);
    }
})();
const uploadToS3 = async (filePath, key) => {
    try {
        const destDir = path_1.default.dirname(path_1.default.join(UPLOADS_DIR, key));
        await fs_1.promises.mkdir(destDir, { recursive: true });
        await fs_1.promises.copyFile(filePath, path_1.default.join(UPLOADS_DIR, key));
        console.log(`File uploaded to local storage: ${key}`);
    }
    catch (error) {
        console.error('Error uploading file to local storage:', error);
        throw error;
    }
};
exports.uploadToS3 = uploadToS3;
const deleteFromS3 = async (key) => {
    try {
        const filePath = path_1.default.join(UPLOADS_DIR, key);
        await fs_1.promises.access(filePath);
        await fs_1.promises.unlink(filePath);
        console.log(`File deleted from local storage: ${key}`);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`File not found in local storage: ${key}`);
            return;
        }
        console.error('Error deleting file from local storage:', error);
        throw error;
    }
};
exports.deleteFromS3 = deleteFromS3;
const getSignedS3Url = async (key, expiresIn = 3600) => {
    const baseUrl = process.env.LOCAL_FILE_SERVER_URL || 'http://localhost:5000';
    const apiPath = '/api/files';
    const expirationTime = Date.now() + expiresIn * 1000;
    const signedUrl = `${baseUrl}${apiPath}/${encodeURIComponent(key)}?expires=${expirationTime}`;
    return signedUrl;
};
exports.getSignedS3Url = getSignedS3Url;
const getContentType = (filename) => {
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
exports.getContentType = getContentType;
//# sourceMappingURL=s3Utils.js.map
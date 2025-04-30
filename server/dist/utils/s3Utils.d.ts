export declare const uploadToS3: (filePath: string, key: string) => Promise<void>;
export declare const deleteFromS3: (key: string) => Promise<void>;
export declare const getSignedS3Url: (key: string, expiresIn?: number) => Promise<string>;
export declare const getContentType: (filename: string) => string;

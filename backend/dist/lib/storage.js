import { Storage } from '@google-cloud/storage';
import { config } from '../config.js';
export class StorageService {
    storage;
    uploadBucket;
    processedBucket;
    constructor() {
        this.storage = new Storage({
            projectId: config.gcp.projectId,
            keyFilename: config.gcp.keyFilename
        });
        this.uploadBucket = config.gcp.uploadBucket;
        this.processedBucket = config.gcp.processedBucket;
    }
    async uploadFile(file, path) {
        const bucket = this.storage.bucket(this.uploadBucket);
        const blob = bucket.file(path);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimetype,
            },
        });
        return new Promise((resolve, reject) => {
            blobStream.on('error', reject);
            blobStream.on('finish', () => {
                resolve(`gs://${this.uploadBucket}/${path}`);
            });
            blobStream.end(file.buffer);
        });
    }
    async listProcessedFiles() {
        try {
            const bucket = this.storage.bucket(this.processedBucket);
            const [files] = await bucket.getFiles();
            return files.map(file => ({
                name: file.name,
                url: `https://storage.googleapis.com/${this.processedBucket}/${file.name}`,
                metadata: file.metadata
            }));
        }
        catch (error) {
            console.error('Error listing processed files:', error);
            throw error;
        }
    }
    async getSignedUrl(filename) {
        try {
            const bucket = this.storage.bucket(this.processedBucket);
            const file = bucket.file(filename);
            const [url] = await file.getSignedUrl({
                version: 'v4',
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            });
            return url;
        }
        catch (error) {
            console.error('Error getting signed url:', error);
            throw error;
        }
    }
}

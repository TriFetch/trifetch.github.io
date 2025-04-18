import { Storage } from '@google-cloud/storage';
import { config } from '../config.js';

export class StorageService {
  private storage: Storage;
  private bucketName: string;
  
  constructor() {
    this.storage = new Storage({
      projectId: config.gcp.projectId,
      keyFilename: config.gcp.keyFilename
    });
    this.bucketName = config.gcp.uploadBucket; // Using test-llmd for both upload and download
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
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
        resolve(`gs://${this.bucketName}/${path}`);
      });
      blobStream.end(file.buffer);
    });
  }

  async listProcessedFiles() {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles();
      return files
        .filter(file => file.name.endsWith('.zip'))
        .map(file => ({
          name: file.name,
          url: `https://storage.googleapis.com/${this.bucketName}/${file.name}`,
          metadata: file.metadata
        }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async getSignedUrl(filename: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      return url;
    } catch (error) {
      console.error('Error getting signed url:', error);
      throw error;
    }
  }

  async getNextPatientNumber(): Promise<number> {
    const bucket = this.storage.bucket(this.bucketName);
    const [files] = await bucket.getFiles({ prefix: 'rose_test/' });
    return files.length;
  }
}

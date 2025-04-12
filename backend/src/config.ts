import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const envSchema = z.object({
    PORT: z.string().default('3000'),
    GCP_PROJECT_ID: z.string(),
    GCP_BUCKET_NAME: z.string(),
    GCP_KEY_FILENAME: z.string()
});

const env = envSchema.parse(process.env);

export const config = {
    port: parseInt(env.PORT),
    gcp: {
        projectId: env.GCP_PROJECT_ID,
        uploadBucket: env.GCP_BUCKET_NAME,  // Using the same bucket for both operations
        bucketName: env.GCP_BUCKET_NAME,
        keyFilename: env.GCP_KEY_FILENAME
    }
} as const;
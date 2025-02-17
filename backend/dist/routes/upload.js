import { Router } from 'express';
import multer from 'multer';
import { StorageService } from '../lib/storage.js';
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    }
});
const router = Router();
const storage = new StorageService();
router.post('/', upload.single('dicom'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Validate file type if needed
        if (!req.file.originalname.endsWith('.dcm')) {
            return res.status(400).json({ error: 'Invalid file type. Only .dcm files are allowed' });
        }
        const path = `dicom/${Date.now()}-${req.file.originalname}`;
        const url = await (req.file, path);
        res.json({
            message: 'Upload successful',
            url
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;

import express from 'express';
import { StorageService } from '../lib/storage.js';
const router = express.Router();
const storage = new StorageService();
// Get DICOM file by ID/path
router.get('/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        // Get a signed URL for the DICOM file
        const url = await storage.getSignedUrl(filename);
        // Instead of serving the file directly, redirect to the signed URL
        res.json({ url });
    }
    catch (error) {
        res.status(404).json({ error: 'DICOM file not found' });
    }
});
// Get metadata for a DICOM file (optional)
router.get('/:filename/metadata', async (req, res) => {
    try {
        const filename = req.params.filename;
        // Here you would use a DICOM parser library like dicom-parser
        // to extract metadata from the file
        res.json({ filename, status: 'metadata endpoint placeholder' });
    }
    catch (error) {
        res.status(404).json({ error: 'Failed to get DICOM metadata' });
    }
});
export default router;

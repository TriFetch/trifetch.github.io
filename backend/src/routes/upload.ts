import { Router } from 'express';
import multer from 'multer';
import { StorageService } from '../lib/storage.js';
import AdmZip from 'adm-zip';

// Add type definition for ZIP entry
interface ZipEntry {
    entryName: string;
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for ZIP files
    }
});

const router = Router();
const storage = new StorageService();

router.post('/', upload.single('zipFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate file type
        if (!req.file.originalname.endsWith('.zip')) {
            return res.status(400).json({ error: 'Invalid file type. Only .zip files are allowed' });
        }

        // Process ZIP file
        const zip = new AdmZip(req.file.buffer);
        const zipEntries = zip.getEntries();

        // Validate ZIP contents
        const hasDicom = zipEntries.some((entry: ZipEntry) => entry.entryName.endsWith('.dcm'));
        const hasCsv = zipEntries.some((entry: ZipEntry) => entry.entryName.endsWith('.csv'));
        const hasTxt = zipEntries.some((entry: ZipEntry) => entry.entryName.endsWith('.txt'));

        if (!hasDicom || !hasCsv || !hasTxt) {
            return res.status(400).json({ 
                error: 'ZIP file must contain at least one .dcm, one .csv, and one .txt file' 
            });
        }

        // Get next patient number for filename
        const baseFileName = req.file.originalname.replace('.zip', '');

        const parts = baseFileName.split('_');
        if (parts.length !== 4) {
            return res.status(400).json({ 
                error: 'Invalid filename format. Expected: organ_scantype_resolution_gender.zip' 
            });
        }
        
        const patientNumber = await storage.getNextPatientNumber();
        const path = `rose_test/patient${patientNumber}_${baseFileName}.zip`;
        const url = await storage.uploadFile(req.file, path);

        res.json({
            message: 'Upload successful',
            url,
            path
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
  
import { Router } from 'express';
import { StorageService } from '../lib/storage.js';

const router = Router();
const storage = new StorageService();

router.get('/files', async (req, res) => {
  try {
    const files = await storage.listProcessedFiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list files' });
  }
});

router.get('/file/:filename', async (req, res) => {
  try {
    const url = await storage.getSignedUrl(req.params.filename);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get file URL' });
  }
});

export default router;
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import uploadRouter from './routes/upload.js';
import datasetRouter from './routes/dataset.js';
import dicomRouter from './routes/dicom.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/upload', uploadRouter);
app.use('/dataset', datasetRouter);
app.use('/dicom', dicomRouter);
// Health check
app.get('/health', (_, res) => res.send('OK'));

app.listen(config.port, () => {
console.log(`Server running on port ${config.port}`);
});

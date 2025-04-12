import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import uploadRouter from './routes/upload.js';
import datasetRouter from './routes/dataset.js';
import dicomRouter from './routes/dicom.js';

const app = express();

// Configure CORS for both development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://trifetch.github.io', 
        ...(process.env.ALLOWED_ORIGIN ? [process.env.ALLOWED_ORIGIN] : [])
      ]
    : 'http://localhost:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/upload', uploadRouter);
app.use('/dataset', datasetRouter);
app.use('/dicom', dicomRouter);

// Health check
app.get('/health', (_, res) => res.send('OK'));

// Get port from environment variable in production or use default
const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

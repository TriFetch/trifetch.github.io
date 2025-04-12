# TriFetch Medical Imaging Platform

TriFetch is a web-based platform for medical image upload, processing, and access.

## Project Structure

- `/docs` - Frontend website (HTML, CSS, JavaScript)
- `/backend` - Backend API server (Node.js, Express, TypeScript)

## Deployment Instructions

### Frontend Deployment

The frontend is a static website that can be deployed to GitHub Pages or any static hosting service:

1. The files in the `/docs` directory are ready for deployment
2. For GitHub Pages:
   - Push this repository to GitHub
   - Go to repository settings > Pages
   - Set source to "main branch" and folder to "/docs"
   - Your site will be available at https://yourusername.github.io/trifetch

3. For other static hosting (Netlify, Vercel, etc.):
   - Point the deployment to the `/docs` directory

**Important**: Update the API_URL in each HTML file to point to your deployed backend URL.

### Backend Deployment

The backend can be deployed to various platforms:

#### Environment Setup

1. Copy `.env.example` to `.env` and update values:
   ```
   cp backend/.env.example backend/.env
   ```

2. Set up GCP credentials:
   - Create a service account with Storage Admin permissions
   - Download the key file as JSON
   - Place it in the backend directory as `key.json` or specify a different path in GCP_KEY_FILENAME

#### Deployment Options

**Cloud Run (Recommended)**:
1. Build the Docker image:
   ```
   cd backend
   docker build -t trifetch-backend .
   ```

2. Deploy to Cloud Run:
   ```
   gcloud run deploy trifetch-backend \
     --image trifetch-backend \
     --platform managed \
     --allow-unauthenticated
   ```

**Heroku**:
1. Create a Procfile in the backend directory:
   ```
   echo "web: npm run start:prod" > backend/Procfile
   ```

2. Deploy to Heroku:
   ```
   cd backend
   heroku create
   git push heroku main
   ```

**Node.js/PM2 on VPS**:
1. SSH into your server
2. Clone this repository
3. Install dependencies and build:
   ```
   cd backend
   npm install
   npm run build
   ```
4. Install PM2 and start the service:
   ```
   npm install -g pm2
   pm2 start npm -- run start:prod
   ```

## Local Development

1. Start the backend:
   ```
   cd backend
   npm install
   npm run dev
   ```

2. Serve the frontend:
   ```
   cd docs
   npx serve .
   ```

3. Visit http://localhost:5000 in your browser

## API Documentation

- `POST /upload` - Upload medical images (zip file)
- `GET /dataset/files` - List all processed files
- `GET /dataset/file/:filename` - Get signed URL for a specific file
- `GET /dicom/:filename` - Get DICOM image for viewing

FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Create directory for potential runtime key mount
RUN mkdir -p /app/keys

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV GCP_KEY_FILENAME=/app/keys/key.json

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start:prod"] 
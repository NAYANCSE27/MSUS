# MSUS Website - Production Docker Build
# Multi-stage build for frontend and backend

# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build Next.js app
RUN npm run build

# ==========================================
# Stage 2: Build Backend
# ==========================================
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/ ./

# ==========================================
# Stage 3: Production Image
# ==========================================
FROM node:18-alpine AS production

# Install PM2 globally
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Copy backend from builder
COPY --from=backend-builder /app/backend ./backend

# Copy frontend build
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/

# Install serve for frontend static files
RUN cd frontend && npm install serve

# Create uploads directory
RUN mkdir -p /app/backend/uploads

# Expose ports
EXPOSE 5000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start both services using PM2
COPY ecosystem.config.js ./
CMD ["pm2-runtime", "ecosystem.config.js"]

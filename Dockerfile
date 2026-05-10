# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build and run backend
FROM node:18-alpine
WORKDIR /app/backend

# Copy backend
COPY backend/package*.json ./
RUN npm install

COPY backend/ .

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist /app/frontend

# Expose port
EXPOSE 5000

# Start backend
CMD ["node", "src/server.js"]

# Use official Node.js LTS (Node 24 slim for smaller footprint)
FROM node:24-slim AS base

# Set working directory
WORKDIR /app

# Install dependencies first (leverage Docker layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript (if you’re using TS)
RUN npm run build

# Expose port
EXPOSE 3000

# Healthcheck for self-healing (Docker/Kubernetes can restart if unhealthy)
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Run the app (entry point is index.ts compiled to dist/index.js)
CMD ["node", "dist/index.js"]

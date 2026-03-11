FROM node:24-slim AS base

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Healthcheck for self-healing
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Run the app (entry point is dist/index.js)
CMD ["node", "dist/index.js"]

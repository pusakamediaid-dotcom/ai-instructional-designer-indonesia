# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# AI Instructional Designer Indonesia — production image
# Multi-stage build untuk hasil image kecil (~150 MB)
# Cocok untuk Google Cloud Run, Railway, Render, atau VPS.
# ------------------------------------------------------------

# --- Stage 1: build ------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (memanfaatkan cache Docker layer)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source & build
COPY . .
RUN npm run build

# --- Stage 2: runtime ----------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install hanya production deps (buang devDependencies)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Ambil hasil build dari stage sebelumnya
COPY --from=builder /app/dist ./dist

# Cloud Run inject PORT via env var; default 8080 untuk Cloud Run
EXPOSE 8080
ENV PORT=8080

# Non-root user untuk keamanan
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

CMD ["node", "dist/server.cjs"]

# ==============================================================================
# Multi-Stage Dockerfile for Veyroo Tech Frontend SPA
# Stage 1: Build & Compile React / Vite application
# Stage 2: Production Nginx High-Performance Web Server
# ==============================================================================

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies with clean cache
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build-time environment arguments (can be overridden via --build-arg)
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_APP_ENV=production

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}

# Build optimized static distribution bundle
RUN npm run build

# ==============================================================================
# Stage 2: Production Web Server
# ==============================================================================
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Install wget for healthcheck probe
RUN apk add --no-cache wget

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom production nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

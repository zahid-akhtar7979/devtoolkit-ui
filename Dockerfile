# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Debug: List the contents of the dist directory
RUN ls -la dist/

# Production stage
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Debug: List the contents of the nginx html directory
RUN ls -la /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to handle dynamic port configuration
RUN printf '#!/bin/sh\n\
# Replace port in nginx config with PORT environment variable\n\
if [ -n "$PORT" ]; then\n\
  sed -i "s/listen 3000/listen $PORT/g" /etc/nginx/conf.d/default.conf\n\
fi\n\
# Start nginx\n\
nginx -g "daemon off;"\n' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Expose port (will be overridden by Railway's PORT env var)
EXPOSE 3000

# Use the entrypoint script
CMD ["/docker-entrypoint.sh"]
#!/bin/bash

echo "🚀 Starting DevToolkit UI deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start frontend service
echo "🌐 Building and starting frontend service..."
docker-compose up --build -d

# Wait for service to be ready
echo "⏳ Waiting for frontend service to be ready..."
sleep 10

# Check if service is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Frontend service is running successfully!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "📝 Note: Make sure backend API is running at http://localhost:8080/api"
    echo ""
    echo "📋 To view logs: docker-compose logs -f"
    echo "🛑 To stop service: docker-compose down"
else
    echo "❌ Frontend service failed to start. Check logs with: docker-compose logs"
    exit 1
fi 
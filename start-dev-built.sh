#!/bin/bash

echo "🏗️ Building and Starting Micro Frontend Development Environment"
echo "==============================================================="

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
pkill -f "vite.*--port.*300[0-4]" 2>/dev/null || true

# Build all micro frontends first
echo "🔨 Building all micro frontends..."
lerna run build --scope='@micro-frontend/*-module' --concurrency 1

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ All micro frontends built successfully"

# Start all services in preview mode (serves built assets)
echo "🚀 Starting all micro frontends in preview mode..."
echo "   Host App:      http://localhost:3000"
echo "   CRM Module:    http://localhost:3001"
echo "   Inventory:     http://localhost:3002"
echo "   HR Module:     http://localhost:3003"
echo "   Finance:       http://localhost:3004"
echo ""
echo "💡 Note: Using preview mode for proper federation support"
echo "🛑 Press Ctrl+C to stop all servers"
echo ""

# Start all services in preview mode
concurrently \
  "cd host && npm run dev" \
  "cd apps/crm-module && npm run preview" \
  "cd apps/inventory-module && npm run preview" \
  "cd apps/hr-module && npm run preview" \
  "cd apps/finance-module && npm run preview"

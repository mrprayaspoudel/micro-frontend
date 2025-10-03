#!/bin/bash

# Micro Frontend Development Startup Script
# This script helps developers quickly start all micro frontends

set -e

echo "🚀 Starting Micro Frontend Development Environment"
echo "=================================================="

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if lerna is available
if ! command -v lerna &> /dev/null; then
    echo "📦 Installing lerna globally..."
    npm install -g lerna
fi

# Bootstrap lerna packages
echo "🔧 Bootstrapping packages..."
lerna bootstrap

# Build shared packages first
echo "🏗️ Building shared packages..."
lerna run build --scope='@shared/*'

# Check if ports are available
echo "🔍 Checking port availability..."

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

ports_available=true
for port in 3000 3001 3002 3003 3004; do
    if ! check_port $port; then
        ports_available=false
    fi
done

if [ "$ports_available" = false ]; then
    echo ""
    echo "❌ Some ports are already in use. Please stop the running processes or use different ports."
    echo "   You can find which processes are using the ports with: lsof -i :3000,3001,3002,3003,3004"
    echo "   Kill processes with: kill -9 <PID>"
    exit 1
fi

echo ""
echo "🎯 Starting all micro frontends..."
echo "   Host App:      http://localhost:3000"
echo "   CRM Module:    http://localhost:3001"
echo "   Inventory:     http://localhost:3002"
echo "   HR Module:     http://localhost:3003"
echo "   Finance:       http://localhost:3004"
echo ""
echo "💡 Tip: All modules must be running for the host to work properly!"
echo "🛑 Press Ctrl+C to stop all servers"
echo ""

# Start all services
npm run start:dev

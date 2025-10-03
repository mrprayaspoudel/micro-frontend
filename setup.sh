#!/bin/bash

# Micro Frontend Development Setup & Startup Script
# Usage: 
#   ./setup.sh         - Setup only (install dependencies and build)
#   ./setup.sh --start - Setup and start development servers

set -e

START_SERVERS=false

# Parse command line arguments
if [[ "$1" == "--start" ]]; then
    START_SERVERS=true
fi

echo "🚀 Setting up Micro Frontend Development Environment"
echo "=================================================="

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install dependencies for all workspaces (modern approach)
echo "📦 Installing dependencies for all packages..."
npm install

# Build shared packages first
echo "🏗️ Building shared packages..."
npm run build:shared

echo "✅ Micro Frontend setup completed!"
echo ""

if [ "$START_SERVERS" = true ]; then
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
    npm start
else
    echo "🔧 To start development:"
    echo "1. ./setup.sh --start  (setup and start all applications)"
    echo "2. npm start           (start applications only)"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "📱 Individual app ports:"
    echo "   - Host App: http://localhost:3000"
    echo "   - CRM Module: http://localhost:3001"
    echo "   - Inventory Module: http://localhost:3002"
    echo "   - HR Module: http://localhost:3003"
    echo "   - Finance Module: http://localhost:3004"
    echo ""
    echo "🔐 Default login credentials:"
    echo "   - Email: admin@techcorp.com"
    echo "   - Password: password123"
fi

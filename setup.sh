#!/bin/bash

# Development Setup & Startup Script
# Usage: 
#   ./setup.sh         - Setup only (install dependencies and build)
#   ./setup.sh --start - Setup and start development servers

set -e

START_SERVERS=false

# Parse command line arguments
if [[ "$1" == "--start" ]]; then
    START_SERVERS=true
fi

echo "🚀 Setting up Development Environment"
echo "=================================================="

# Install dependencies for root and all workspaces
echo "📦 Installing dependencies for all packages..."
npm install

# Verify all workspace packages have their dependencies
echo "📦 Ensuring all workspace dependencies are installed..."
npm install --workspaces --if-present

# Build shared packages first
echo "🏗️ Building shared packages..."
npm run build:shared

echo "✅ setup completed!"
echo ""

if [ "$START_SERVERS" = true ]; then
    # Check and clear ports if needed
    echo "🔍 Checking port availability..."

    clear_port() {
        if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "⚠️ Port $1 is in use - killing existing process..."
            lsof -ti:$1 | xargs kill -9 2>/dev/null || true
            sleep 1
            # Double check if port is now free
            if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
                echo "❌ Failed to free port $1"
                return 1
            else
                echo "✅ Port $1 is now available"
                return 0
            fi
        else
            echo "✅ Port $1 is already available"
            return 0
        fi
    }

    echo "🧹 Clearing ports for development servers..."
    for port in 3000 3001 3002 3003 3004; do
        clear_port $port
    done

    echo ""
    echo "🎯 Starting all micro frontends..."
    echo "   Host App: http://localhost:3000"
    echo "   CRM Module: http://localhost:3001"
    echo "   Inventory Module: http://localhost:3002"
    echo "   HR Module: http://localhost:3003"
    echo "   Finance Module: http://localhost:3004"
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
fi

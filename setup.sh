#!/bin/bash

# Micro Frontend Development Setup Script

echo "🚀 Setting up Micro Frontend Development Environment"

# Install dependencies for root
echo "📦 Installing root dependencies..."
npm install

# Install dependencies for shared packages
echo "📦 Installing shared package dependencies..."
echo "  Installing ui-components..."
(cd shared/ui-components && npm install)
echo "  Installing state..."
(cd shared/state && npm install)
echo "  Installing utils..."
(cd shared/utils && npm install)

# Install dependencies for host app
echo "📦 Installing host app dependencies..."
(cd host && npm install)

# Install dependencies for micro frontend apps
echo "📦 Installing CRM module dependencies..."
(cd apps/crm-module && npm install)

echo "📦 Installing Inventory module dependencies..."
(cd apps/inventory-module && npm install)

echo "📦 Installing HR module dependencies..."
(cd apps/hr-module && npm install)

echo "📦 Installing Finance module dependencies..."
(cd apps/finance-module && npm install)

echo "✅ Micro Frontend setup completed!"
echo ""
echo "🔧 To start development:"
echo "1. npm run start:dev (starts all applications)"
echo "2. Open http://localhost:3000 in your browser"
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

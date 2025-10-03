#!/bin/bash

echo "🔍 Testing Micro Frontend Remote Entry Points..."
echo "=============================================="

# Test function for each remote entry
test_remote_entry() {
    local name=$1
    local url=$2
    
    if curl -s -f "$url" > /dev/null; then
        echo "✅ $name: $url"
        return 0
    else
        echo "❌ $name: $url (FAILED)"
        return 1
    fi
}

# Test all remote entries (production/preview paths)
failed=0

test_remote_entry "CRM Module" "http://localhost:3001/assets/remoteEntry.js" || failed=1
test_remote_entry "Inventory Module" "http://localhost:3002/assets/remoteEntry.js" || failed=1
test_remote_entry "HR Module" "http://localhost:3003/assets/remoteEntry.js" || failed=1
test_remote_entry "Finance Module" "http://localhost:3004/assets/remoteEntry.js" || failed=1

echo ""

if [ $failed -eq 0 ]; then
    echo "🎉 All micro frontend remote entries are accessible!"
    echo "🚀 You can now navigate to: http://localhost:3000"
else
    echo "⚠️  Some remote entries are not accessible."
    echo "📋 Make sure all development servers are running:"
    echo "   npm run start:dev"
fi

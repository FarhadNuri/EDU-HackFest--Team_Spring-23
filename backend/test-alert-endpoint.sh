#!/bin/bash

echo "🧪 Testing Alert System Endpoint"
echo "=================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:5001/api/auth/login > /dev/null 2>&1; then
    echo "❌ Backend server is not running on port 5001"
    echo "Please start the server with: cd backend && npm run dev"
    exit 1
fi

echo "✅ Backend server is running"
echo ""

# Test without authentication (should fail)
echo "Test 1: Calling /api/alerts/generate without auth..."
RESPONSE=$(curl -s http://localhost:5001/api/alerts/generate)
echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "not logged in\|Unauthorized"; then
    echo "✅ Test 1 Passed: Endpoint requires authentication"
else
    echo "❌ Test 1 Failed: Expected authentication error"
fi

echo ""
echo "=================================="
echo "To test with authentication:"
echo "1. Login via frontend"
echo "2. Click 'Smart Alerts' button"
echo "3. Check browser console for SMS simulation"
echo "=================================="

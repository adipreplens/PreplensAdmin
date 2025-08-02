#!/bin/bash

echo "🚀 Preplens Admin - Deployment Script"
echo "====================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "📦 Building frontend..."
cd preplensadmin
npm run build

echo "🌐 Deploying frontend to Vercel..."
vercel --prod

echo "🔧 Deploying backend to Railway..."
cd backend
railway up

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Set environment variables in Railway dashboard"
echo "3. Test your deployment"
echo ""
echo "🔗 Check DEPLOYMENT.md for detailed instructions" 
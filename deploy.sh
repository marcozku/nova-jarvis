#!/bin/bash

# Nova JARVIS Deployment Script

echo "🚀 Deploying Nova JARVIS to Vercel..."

# Install Vercel CLI if not exists
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Build for production
echo "🔨 Building for production..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📱 You can now access Nova JARVIS from your phone!"

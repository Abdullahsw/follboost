#!/bin/bash

echo "Fixing deployment issues for FollBoost..."

# Build the project with proper settings
NODE_ENV=production npm run build

# Ensure the dist directory has the necessary files for routing
cp public/.htaccess dist/
cp public/_redirects dist/
cp public/web.config dist/

echo "Deployment fixes applied successfully!"
echo "Your application should now work correctly when deployed."

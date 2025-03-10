#!/bin/bash

echo "Deploying FollBoost website..."

# Create the website directory if it doesn't exist
mkdir -p /var/www/follboost

# Navigate to the website directory
cd /var/www/follboost

# Check if the directory is already a git repository
if [ -d ".git" ]; then
    echo "Git repository exists, pulling latest changes..."
    git pull origin main
else
    echo "Cloning repository..."
    # Replace with your actual GitHub repository URL
    git clone https://github.com/yourusername/follboost.git .
fi

# Install dependencies and build
if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install
    
    echo "Building application..."
    npm run build
fi

# Set correct permissions
echo "Setting correct permissions..."
chown -R www-data:www-data /var/www/follboost
find /var/www/follboost -type d -exec chmod 755 {} \;
find /var/www/follboost -type f -exec chmod 644 {} \;

# Make sure .sh files are executable
find /var/www/follboost -name "*.sh" -exec chmod +x {} \;

echo "Deployment completed successfully!"

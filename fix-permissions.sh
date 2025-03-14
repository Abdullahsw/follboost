#!/bin/bash

echo "Fixing permissions for FollBoost project..."

# Set variables
DEPLOY_DIR="/var/www/follboost"

# Check if the deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "Error: Deployment directory $DEPLOY_DIR does not exist."
  exit 1
fi

# Set ownership to www-data (Apache user)
echo "Setting ownership to www-data..."
sudo chown -R www-data:www-data "$DEPLOY_DIR"

# Set directory permissions to 755 (rwxr-xr-x)
echo "Setting directory permissions to 755..."
sudo find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;

# Set file permissions to 644 (rw-r--r--)
echo "Setting file permissions to 644..."
sudo find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;

# Make sure scripts are executable
echo "Making scripts executable..."
sudo find "$DEPLOY_DIR" -name "*.sh" -exec chmod +x {} \;

# Ensure .htaccess is present in the dist directory
if [ ! -f "$DEPLOY_DIR/dist/.htaccess" ] && [ -f "$DEPLOY_DIR/.htaccess" ]; then
  echo "Copying .htaccess to dist directory..."
  sudo cp "$DEPLOY_DIR/.htaccess" "$DEPLOY_DIR/dist/"
fi

echo "Permissions fixed successfully!"

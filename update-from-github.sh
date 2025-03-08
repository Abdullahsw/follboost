#!/bin/bash

# Script to update the application from GitHub
# Run with: sudo bash update-from-github.sh

echo "Starting update process from GitHub..."

# Navigate to the web directory
cd /var/www/html/

# Check if this is a git repository
if [ ! -d ".git" ]; then
  echo "Error: This directory is not a Git repository."
  echo "If you need to clone the repository first, use:"
  echo "git clone https://github.com/your-username/your-repo.git ."
  exit 1
fi

# Save any local changes (optional)
echo "Checking for local changes..."
if [ -n "$(git status --porcelain)" ]; then
  echo "Local changes detected. Creating backup..."
  timestamp=$(date +"%Y%m%d_%H%M%S")
  git stash save "Automatic backup before pull $timestamp"
  echo "Local changes saved to stash."
fi

# Pull the latest changes
echo "Pulling latest changes from GitHub..."
git pull origin main

# Check if pull was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to pull from GitHub. Please check your internet connection or repository access."
  exit 1
fi

# Fix permissions after update
echo "Updating file permissions..."
chown -R www-data:www-data /var/www/html/
find /var/www/html/ -type d -exec chmod 755 {} \;
find /var/www/html/ -type f -exec chmod 644 {} \;

# Make scripts executable
find /var/www/html/ -name "*.sh" -exec chmod 755 {} \;

# Restart Apache
echo "Restarting Apache..."
systemctl restart apache2

echo "Update completed successfully!"
echo "If you encounter any issues, check the Apache error logs:"
echo "sudo tail -n 50 /var/log/apache2/error.log"

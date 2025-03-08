#!/bin/bash

# Script to set up Git repository in the web directory
# Run with: sudo bash git-setup.sh your-repo-url

if [ $# -eq 0 ]; then
  echo "Error: Repository URL is required."
  echo "Usage: sudo bash git-setup.sh https://github.com/username/repo.git"
  exit 1
fi

REPO_URL=$1

echo "Setting up Git repository from $REPO_URL..."

# Navigate to the web directory
cd /var/www/html/

# Check if directory is empty
if [ "$(ls -A /var/www/html/)" ]; then
  echo "Warning: Directory is not empty."
  read -p "Do you want to backup existing files? (y/n): " backup_choice
  
  if [ "$backup_choice" = "y" ]; then
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_dir="/var/www/backup_$timestamp"
    echo "Creating backup at $backup_dir"
    mkdir -p $backup_dir
    cp -r /var/www/html/* $backup_dir/
    echo "Backup created successfully."
  fi
  
  read -p "Clear the directory before cloning? (y/n): " clear_choice
  if [ "$clear_choice" = "y" ]; then
    echo "Clearing directory..."
    rm -rf /var/www/html/*
    rm -rf /var/www/html/.* 2>/dev/null || true
  else
    echo "Aborting. Please clear the directory manually or choose to clear it."
    exit 1
  fi
fi

# Install Git if not already installed
if ! command -v git &> /dev/null; then
  echo "Git not found. Installing Git..."
  apt-get update
  apt-get install -y git
fi

# Clone the repository
echo "Cloning repository..."
git clone $REPO_URL .

# Check if clone was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to clone repository. Please check the URL and your internet connection."
  exit 1
fi

# Set proper permissions
echo "Setting file permissions..."
chown -R www-data:www-data /var/www/html/
find /var/www/html/ -type d -exec chmod 755 {} \;
find /var/www/html/ -type f -exec chmod 644 {} \;

# Make scripts executable
find /var/www/html/ -name "*.sh" -exec chmod 755 {} \;

# Configure Git to store credentials (optional)
echo "Configuring Git..."
git config --global credential.helper store

echo "Git repository setup completed successfully!"
echo "You can now update the application using: sudo bash update-from-github.sh"

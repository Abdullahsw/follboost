#!/bin/bash

echo "Setting up Git for FollBoost project..."

# Set variables
DEPLOY_DIR="/var/www/follboost"
GIT_REPO="https://github.com/yourusername/follboost.git"

# Check if Git is installed
if ! command -v git &> /dev/null; then
  echo "Git is not installed. Installing Git..."
  sudo apt-get update
  sudo apt-get install -y git
fi

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "Creating deployment directory..."
  sudo mkdir -p "$DEPLOY_DIR"
fi

# Set ownership
sudo chown -R $USER:$USER "$DEPLOY_DIR"

# Navigate to deployment directory
cd "$DEPLOY_DIR"

# Initialize Git repository if it doesn't exist
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
  
  # Add remote repository
  echo "Adding remote repository..."
  git remote add origin $GIT_REPO
  
  # Set up Git credentials (optional)
  echo "Setting up Git credentials..."
  read -p "Enter your Git username: " GIT_USERNAME
  read -p "Enter your Git email: " GIT_EMAIL
  
  git config user.name "$GIT_USERNAME"
  git config user.email "$GIT_EMAIL"
  
  # Configure Git to store credentials
  git config credential.helper store
  
  # Pull from repository
  echo "Pulling from repository..."
  git pull origin main
else
  echo "Git repository already initialized."
  echo "Pulling latest changes..."
  git pull origin main
fi

echo "Git setup completed successfully!"

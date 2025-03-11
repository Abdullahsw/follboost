#!/bin/bash

echo "Setting up server for FollBoost website..."

# Update packages
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y curl git

# Install Node.js 18.x if not already installed
if ! command -v node &> /dev/null; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  node -v
  npm -v
fi

# Enable required Apache modules
sudo a2enmod rewrite
sudo a2enmod headers

# Restart Apache to apply changes
sudo systemctl restart apache2

# Check if the virtual host is enabled
if [ ! -f /etc/apache2/sites-enabled/follboost.com.conf ]; then
  echo "Enabling follboost.com virtual host..."
  sudo a2ensite follboost.com.conf
  sudo systemctl reload apache2
fi

# Check Apache configuration
echo "Checking Apache configuration..."
sudo apache2ctl configtest

# Fix permissions for node_modules
echo "Fixing permissions for node_modules..."
sudo chmod -R 755 /var/www/follboost/node_modules
sudo chmod +x /var/www/follboost/node_modules/.bin/*
sudo chmod +x /var/www/follboost/node_modules/@esbuild/linux-x64/bin/esbuild

# Create build directory if it doesn't exist
sudo mkdir -p /var/www/follboost/dist
sudo chown -R www-data:www-data /var/www/follboost/dist

echo "Server setup completed!"

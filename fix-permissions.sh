#!/bin/bash

echo "Fixing permissions for FollBoost website..."

# Set ownership to Apache user
sudo chown -R www-data:www-data /var/www/follboost

# Set correct permissions
sudo find /var/www/follboost -type d -exec chmod 755 {} \;
sudo find /var/www/follboost -type f -exec chmod 644 {} \;

# Make sure .sh files are executable
sudo find /var/www/follboost -name "*.sh" -exec chmod +x {} \;

# Make sure .htaccess is properly set
sudo chmod 644 /var/www/follboost/.htaccess

echo "Permissions fixed successfully!"

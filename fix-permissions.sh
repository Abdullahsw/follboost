#!/bin/bash

# Fix permissions script for FollBoost application
# Run this script with sudo: sudo bash fix-permissions.sh

echo "Starting permission fix for web files..."

# Set ownership to www-data (Apache user)
sudo chown -R www-data:www-data /var/www/html/

# Set directory permissions to 755 (rwxr-xr-x)
sudo find /var/www/html/ -type d -exec chmod 755 {} \;

# Set file permissions to 644 (rw-r--r--)
sudo find /var/www/html/ -type f -exec chmod 644 {} \;

# Make scripts executable
sudo find /var/www/html/ -name "*.sh" -exec chmod 755 {} \;

# Ensure logs directory exists and has correct permissions
sudo mkdir -p /var/www/html/logs
sudo chown -R www-data:www-data /var/www/html/logs
sudo chmod -R 755 /var/www/html/logs

# Special permissions for sensitive files
if [ -f /var/www/html/.env ]; then
    sudo chmod 600 /var/www/html/.env
    sudo chown www-data:www-data /var/www/html/.env
fi

# Restart Apache to apply changes
sudo systemctl restart apache2

echo "Permissions fixed successfully!"
echo "If you still experience issues, check the Apache error logs:"
echo "sudo tail -n 50 /var/log/apache2/error.log"

#!/bin/bash

# Fix permissions for web files
chmod -R 755 /var/www/html/
chown -R www-data:www-data /var/www/html/

# Restart Apache
systemctl restart apache2

echo "Permissions fixed and Apache restarted."

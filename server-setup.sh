#!/bin/bash

echo "Setting up server environment for FollBoost..."

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install required packages
echo "Installing required packages..."
sudo apt-get install -y apache2 curl git jq

# Enable required Apache modules
echo "Enabling Apache modules..."
sudo a2enmod rewrite
sudo a2enmod headers

# Create deployment directory
echo "Creating deployment directory..."
sudo mkdir -p /var/www/follboost

# Set ownership
sudo chown -R $USER:$USER /var/www/follboost

# Create a test file to verify Apache is working
echo "Creating test file..."
echo "<html><body><h1>FollBoost Test Page</h1><p>If you can see this, Apache is working correctly.</p></body></html>" | sudo tee /var/www/html/test.html > /dev/null

# Create a PHP info file to verify PHP is working
echo "Creating PHP info file..."
echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php > /dev/null

# Configure Apache virtual host
echo "Configuring Apache virtual host..."
cat > follboost.conf << 'EOF'
<VirtualHost *:80>
    ServerName follboost.com
    ServerAlias www.follboost.com
    DocumentRoot /var/www/follboost/dist

    <Directory /var/www/follboost/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/follboost.com_error.log
    CustomLog ${APACHE_LOG_DIR}/follboost.com_access.log combined
</VirtualHost>
EOF

sudo mv follboost.conf /etc/apache2/sites-available/follboost.com.conf

# Enable the site
echo "Enabling the site..."
sudo a2ensite follboost.com.conf

# Restart Apache
echo "Restarting Apache..."
sudo systemctl restart apache2

echo "Server setup completed successfully!"
echo "You can now deploy your application to /var/www/follboost"
echo "To test Apache, visit http://31.187.76.192/test.html"
echo "To check PHP, visit http://31.187.76.192/info.php"

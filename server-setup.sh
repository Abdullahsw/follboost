#!/bin/bash

echo "Setting up server for FollBoost website..."

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

# Create a test index.html file if it doesn't exist
if [ ! -f /var/www/follboost/index.html ]; then
  echo "Creating test index.html file..."
  sudo tee /var/www/follboost/index.html > /dev/null << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>FollBoost</title>
</head>
<body>
    <h1>Welcome to the real FollBoost site!</h1>
    <p>If you can see this, your Apache configuration is working correctly.</p>
</body>
</html>
EOF
fi

echo "Server setup completed!"

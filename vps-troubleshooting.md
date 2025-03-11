# VPS Troubleshooting Guide for FollBoost

## Fix Blank Page Issues

Follow these steps to resolve the blank page issue when accessing your website through the VPS IP address:

### 1. Check Apache Service Status

```bash
sudo systemctl status apache2
```

If Apache is not running, start it:

```bash
sudo systemctl start apache2
```

### 2. Create a Basic Test Page

```bash
sudo nano /var/www/html/index.html
```

Add this content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>FollBoost Test</title>
</head>
<body>
    <h1>FollBoost Test Page</h1>
    <p>If you can see this, your Apache server is working correctly.</p>
</body>
</html>
```

### 3. Check Apache Configuration

```bash
sudo apache2ctl -t
```

Fix any syntax errors reported.

### 4. Verify Document Root

Check if your website files are in the correct location:

```bash
sudo ls -la /var/www/follboost
```

If empty or missing, create the directory and set permissions:

```bash
sudo mkdir -p /var/www/follboost
sudo chown -R www-data:www-data /var/www/follboost
```

### 5. Deploy Your Website

```bash
# Navigate to your website directory
cd /var/www/follboost

# Clone your repository (if not already done)
sudo git clone https://github.com/yourusername/follboost.git .

# Install dependencies
sudo npm install

# Build the project
sudo npm run build
```

### 6. Fix Virtual Host Configuration

```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```

Update to point to your website directory:

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/follboost

    <Directory /var/www/follboost>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### 7. Enable Required Apache Modules

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 8. Check Error Logs

```bash
sudo tail -n 50 /var/log/apache2/error.log
```

### 9. Create a .htaccess File

```bash
sudo nano /var/www/follboost/.htaccess
```

Add this content for a React SPA:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### 10. Set Proper Permissions

```bash
sudo chown -R www-data:www-data /var/www/follboost
sudo find /var/www/follboost -type d -exec chmod 755 {} \;
sudo find /var/www/follboost -type f -exec chmod 644 {} \;
```

### 11. Test with a Simple PHP File

```bash
sudo nano /var/www/follboost/info.php
```

Add this content:

```php
<?php
phpinfo();
?>
```

Then visit: http://your-vps-ip/info.php

### 12. Configure Domain Virtual Host

```bash
sudo nano /etc/apache2/sites-available/follboost.com.conf
```

Add this configuration:

```apache
<VirtualHost *:80>
    ServerName follboost.com
    ServerAlias www.follboost.com
    DocumentRoot /var/www/follboost

    <Directory /var/www/follboost>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/follboost.com_error.log
    CustomLog ${APACHE_LOG_DIR}/follboost.com_access.log combined
</VirtualHost>
```

Enable the site:

```bash
sudo a2ensite follboost.com.conf
sudo systemctl restart apache2
```

### 13. Update DNS Settings

Make sure your domain's DNS A records point to your VPS IP address: 31.187.76.192

### 14. Install SSL Certificate

```bash
sudo apt update
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d follboost.com -d www.follboost.com
```

### 15. Create a Deployment Script

```bash
sudo nano /var/www/deploy-follboost.sh
```

Add this content:

```bash
#!/bin/bash

echo "Deploying FollBoost website..."

# Navigate to the website directory
cd /var/www/follboost

# Pull the latest changes from GitHub
git pull origin main

# Install dependencies and build
npm install
npm run build

# Set correct permissions
chown -R www-data:www-data /var/www/follboost
find /var/www/follboost -type d -exec chmod 755 {} \;
find /var/www/follboost -type f -exec chmod 644 {} \;

echo "Deployment completed successfully!"
```

Make it executable:

```bash
sudo chmod +x /var/www/deploy-follboost.sh
```

Run the deployment script:

```bash
sudo /var/www/deploy-follboost.sh
```

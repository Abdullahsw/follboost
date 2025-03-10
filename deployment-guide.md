# Deployment Guide for FollBoost.com

## 1. Configure Apache Virtual Host

Create a new virtual host configuration file for your domain:

```bash
sudo nano /etc/apache2/sites-available/follboost.com.conf
```

Add the following configuration:

```apache
<VirtualHost *:80>
    ServerName follboost.com
    ServerAlias www.follboost.com
    ServerAdmin webmaster@follboost.com
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

Enable the site and restart Apache:

```bash
sudo a2ensite follboost.com.conf
sudo systemctl restart apache2
```

## 2. Update DNS Records

Log in to your domain registrar's website and update the DNS records:

1. Create an A record for `follboost.com` pointing to `31.187.76.192`
2. Create an A record for `www.follboost.com` pointing to `31.187.76.192`

DNS changes may take up to 24-48 hours to propagate globally.

## 3. Deploy Website from GitHub

Create the website directory if it doesn't exist:

```bash
sudo mkdir -p /var/www/follboost
```

Clone or update the repository:

```bash
# If deploying for the first time
sudo git clone https://github.com/yourusername/follboost.git /var/www/follboost

# If updating an existing deployment
cd /var/www/follboost
sudo git pull origin main
```

## 4. Set Correct Permissions

Set the correct ownership and permissions:

```bash
# Set ownership to Apache user
sudo chown -R www-data:www-data /var/www/follboost

# Set correct permissions
sudo find /var/www/follboost -type d -exec chmod 755 {} \;
sudo find /var/www/follboost -type f -exec chmod 644 {} \;
```

## 5. Install Dependencies and Build (if needed)

If your site requires npm packages and building:

```bash
cd /var/www/follboost
sudo npm install
sudo npm run build
```

## 6. Configure SSL with Let's Encrypt (Recommended)

Install Certbot:

```bash
sudo apt update
sudo apt install certbot python3-certbot-apache
```

Obtain and install SSL certificate:

```bash
sudo certbot --apache -d follboost.com -d www.follboost.com
```

Follow the prompts to complete the SSL setup.

## 7. Test Your Website

Visit your website at https://follboost.com to ensure everything is working correctly.

## 8. Automated Deployment Script

Create a deployment script for future updates:

```bash
sudo nano /var/www/deploy-follboost.sh
```

Add the following content:

```bash
#!/bin/bash

echo "Deploying FollBoost website updates..."

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

Make the script executable:

```bash
sudo chmod +x /var/www/deploy-follboost.sh
```

To update your website in the future, simply run:

```bash
sudo /var/www/deploy-follboost.sh
```

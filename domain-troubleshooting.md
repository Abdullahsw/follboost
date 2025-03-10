# Domain Troubleshooting Guide for FollBoost.com

## Problem: White Screen When Accessing via Domain Name

If your site works via IP address (31.187.76.192) but shows a white screen via domain name (follboost.com), this typically indicates one of these issues:

## 1. Apache Virtual Host Configuration

Your Apache virtual host might not be properly configured or enabled. Fix this by:

```bash
# Check if the virtual host file exists
sudo ls -la /etc/apache2/sites-available/follboost.com.conf

# Check if the virtual host is enabled
sudo ls -la /etc/apache2/sites-enabled/follboost.com.conf

# If not enabled, enable it
sudo a2ensite follboost.com.conf

# Restart Apache
sudo systemctl restart apache2
```

## 2. DNS Propagation

DNS changes might not have fully propagated. Verify your DNS settings:

```bash
# Check if the domain resolves to your IP
nslookup follboost.com
dig follboost.com
```

The output should show your VPS IP: 31.187.76.192

## 3. .htaccess Issues

Check if your .htaccess file has incorrect rules:

```bash
sudo nano /var/www/follboost/.htaccess
```

Temporarily rename it to troubleshoot:

```bash
sudo mv /var/www/follboost/.htaccess /var/www/follboost/.htaccess.bak
```

## 4. Apache Error Logs

Check Apache error logs for specific issues:

```bash
sudo tail -n 50 /var/log/apache2/error.log
sudo tail -n 50 /var/log/apache2/follboost.com_error.log
```

## 5. CORS or Content Security Policy

If your site has CORS or CSP settings, they might be blocking content when accessed via domain name. Check your headers:

```bash
curl -I https://follboost.com
```

## 6. SSL Certificate Issues

If you're using HTTPS, SSL certificate issues can cause problems:

```bash
# Check SSL certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew --dry-run
```

## 7. Fix Apache Configuration

Ensure your Apache configuration is correct:

```bash
# Create a proper virtual host configuration
sudo nano /etc/apache2/sites-available/follboost.com.conf
```

Add this configuration:

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

Then enable and restart:

```bash
sudo a2ensite follboost.com.conf
sudo apache2ctl configtest
sudo systemctl restart apache2
```

## 8. Check File Permissions

Ensure proper file permissions:

```bash
sudo chown -R www-data:www-data /var/www/follboost
sudo find /var/www/follboost -type d -exec chmod 755 {} \;
sudo find /var/www/follboost -type f -exec chmod 644 {} \;
```

## 9. Test with a Simple HTML File

Create a simple test file to check if the server is working:

```bash
sudo nano /var/www/follboost/test.html
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
    <p>If you can see this, your domain is working correctly.</p>
</body>
</html>
```

Then try accessing: http://follboost.com/test.html

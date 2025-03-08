# Deployment Instructions for FollBoost

## Server Requirements

- Apache 2.4+
- PHP 7.4+ with extensions: curl, json, mbstring, xml, openssl, pdo, pdo_mysql
- MySQL 5.7+ or MariaDB 10.3+

## Deployment Steps

### 1. Server Setup

Run the server setup script to prepare your server environment:

```bash
sudo bash server-setup.sh
```

This script will:
- Install required packages
- Enable necessary Apache modules
- Set proper file permissions
- Create test files to verify the setup

### 2. File Upload

Upload all project files to the `/var/www/html` directory on your server. You can use FTP, SFTP, or SCP for this purpose.

```bash
scp -r * username@your-server-ip:/var/www/html/
```

Or use an FTP client like FileZilla to upload the files.

### 3. Set Permissions

After uploading files, run the deployment script to set proper permissions:

```bash
sudo bash /var/www/html/deploy.sh
```

### 4. Configure Database

Create a database and user for the application:

```sql
CREATE DATABASE follboost CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'follboost_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON follboost.* TO 'follboost_user'@'localhost';
FLUSH PRIVILEGES;
```

Update the database configuration in your `.env` file or config file.

### 5. Verify Installation

Access the following URLs to verify your installation:

- Main site: `http://your-server-ip/`
- PHP test: `http://your-server-ip/test.php`
- Troubleshooting: `http://your-server-ip/troubleshoot.php`

## Troubleshooting Common Issues

### White/Blank Page

If you see a white page with no content:

1. Check PHP error logs: `/var/log/apache2/error.log`
2. Enable error display in `.htaccess`:
   ```
   php_flag display_errors on
   php_value error_reporting E_ALL
   ```
3. Verify file permissions: Files should be 644, directories 755
4. Check PHP memory limit: Should be at least 128M

### 500 Internal Server Error

1. Check Apache error logs: `/var/log/apache2/error.log`
2. Verify `.htaccess` syntax is correct
3. Ensure mod_rewrite is enabled: `sudo a2enmod rewrite`
4. Restart Apache: `sudo systemctl restart apache2`

### Database Connection Issues

1. Verify database credentials in your config files
2. Check if MySQL is running: `sudo systemctl status mysql`
3. Test database connection manually:
   ```php
   <?php
   $db = new PDO('mysql:host=localhost;dbname=follboost', 'follboost_user', 'your_password');
   echo "Connected successfully";
   ?>
   ```

## Security Considerations

1. Remove test files in production:
   ```bash
   rm /var/www/html/info.php
   rm /var/www/html/test.php
   ```

2. Set up SSL/HTTPS (recommended):
   ```bash
   sudo apt-get install certbot python3-certbot-apache
   sudo certbot --apache -d yourdomain.com
   ```

3. Regularly update your server:
   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

4. Secure your `.env` file:
   ```bash
   chmod 600 /var/www/html/.env
   ```

## Maintenance

### Regular Backups

Set up regular database backups:

```bash
mysqldump -u follboost_user -p follboost > /path/to/backup/follboost_$(date +%Y%m%d).sql
```

### Updating the Application

1. Create a backup before updating
2. Upload new files
3. Run the deployment script
4. Clear any caches

## Contact Support

If you encounter issues that you cannot resolve, please contact our support team with:

1. Error messages from logs
2. Output from the troubleshoot.php page
3. Server specifications
4. Steps to reproduce the issue

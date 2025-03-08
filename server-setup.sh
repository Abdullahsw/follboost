#!/bin/bash

# Server setup script for FollBoost application
# Run this script with sudo: sudo bash server-setup.sh

# Exit on error
set -e

echo "Starting server setup for FollBoost application..."

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Please use sudo."
    exit 1
fi

# Update system packages
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y apache2 php php-cli php-fpm php-json php-common php-mysql php-zip php-gd php-mbstring php-curl php-xml php-pear php-bcmath unzip curl

# Enable required Apache modules
echo "Enabling Apache modules..."
a2enmod rewrite
a2enmod headers
a2enmod ssl
a2enmod expires
a2enmod deflate

# Restart Apache to apply changes
systemctl restart apache2

# Set proper permissions for web directory
echo "Setting proper permissions for web directory..."
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

# Create logs directory if it doesn't exist
echo "Creating logs directory..."
mkdir -p /var/www/html/logs
chown -R www-data:www-data /var/www/html/logs
chmod -R 755 /var/www/html/logs

# Create a PHP info file for testing
echo "Creating PHP info file..."
echo '<?php phpinfo(); ?>' > /var/www/html/info.php
chown www-data:www-data /var/www/html/info.php
chmod 644 /var/www/html/info.php

# Create a test file to check if PHP is working
echo "Creating test file..."
cat > /var/www/html/test.php << 'EOL'
<?php
echo "<h1>PHP is working!</h1>";
echo "<p>Server time: " . date('Y-m-d H:i:s') . "</p>";

// Test database connection if applicable
/*
try {
    $db = new PDO('mysql:host=localhost;dbname=your_database', 'username', 'password');
    echo "<p style='color:green'>Database connection successful!</p>";
} catch (PDOException $e) {
    echo "<p style='color:red'>Database connection failed: " . $e->getMessage() . "</p>";
}
*/

// Test file permissions
$logsDir = __DIR__ . '/logs';
if (is_dir($logsDir)) {
    if (is_writable($logsDir)) {
        echo "<p style='color:green'>Logs directory exists and is writable.</p>";
    } else {
        echo "<p style='color:red'>Logs directory exists but is not writable.</p>";
    }
} else {
    echo "<p style='color:red'>Logs directory does not exist.</p>";
}

// Test PHP extensions
$requiredExtensions = ['curl', 'json', 'mbstring', 'xml', 'openssl'];
foreach ($requiredExtensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<p style='color:green'>Extension $ext is loaded.</p>";
    } else {
        echo "<p style='color:red'>Extension $ext is NOT loaded.</p>";
    }
}
?>
EOL

chown www-data:www-data /var/www/html/test.php
chmod 644 /var/www/html/test.php

# Create a deployment script
echo "Creating deployment script..."
cat > /var/www/html/deploy.sh << 'EOL'
#!/bin/bash

# Deployment script for FollBoost application
# Run this script after uploading new files

# Exit on error
set -e

echo "Starting deployment process..."

# Set proper permissions
echo "Setting proper permissions..."
chown -R www-data:www-data /var/www/html
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Make specific scripts executable
chmod +x /var/www/html/*.sh

# Create logs directory if it doesn't exist
echo "Ensuring logs directory exists..."
mkdir -p /var/www/html/logs
chown -R www-data:www-data /var/www/html/logs
chmod -R 755 /var/www/html/logs

echo "Deployment completed successfully!"
EOL

chmod +x /var/www/html/deploy.sh

# Create a troubleshooting script
echo "Creating troubleshooting script..."
cat > /var/www/html/troubleshoot.php << 'EOL'
<?php
// Set error reporting for troubleshooting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>FollBoost Troubleshooting</h1>";

// Check PHP version
echo "<h2>PHP Version</h2>";
echo "<p>Current PHP version: " . phpversion() . "</p>";
if (version_compare(phpversion(), '7.4.0', '>=')) {
    echo "<p style='color:green'>PHP version is sufficient.</p>";
} else {
    echo "<p style='color:red'>PHP version is too low. Minimum required is 7.4.0</p>";
}

// Check extensions
echo "<h2>PHP Extensions</h2>";
$requiredExtensions = ['curl', 'json', 'mbstring', 'xml', 'openssl', 'pdo', 'pdo_mysql'];
foreach ($requiredExtensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<p style='color:green'>Extension $ext is loaded.</p>";
    } else {
        echo "<p style='color:red'>Extension $ext is NOT loaded.</p>";
    }
}

// Check file permissions
echo "<h2>File Permissions</h2>";
$dirsToCheck = ['.', 'logs'];
foreach ($dirsToCheck as $dir) {
    if (file_exists($dir)) {
        if (is_writable($dir)) {
            echo "<p style='color:green'>Directory '$dir' is writable.</p>";
        } else {
            echo "<p style='color:red'>Directory '$dir' is not writable.</p>";
        }
    } else {
        echo "<p style='color:red'>Directory '$dir' does not exist.</p>";
    }
}

// Check .htaccess
echo "<h2>.htaccess File</h2>";
if (file_exists('.htaccess')) {
    echo "<p style='color:green'>.htaccess file exists.</p>";
    
    // Check if mod_rewrite is enabled
    if (function_exists('apache_get_modules') && in_array('mod_rewrite', apache_get_modules())) {
        echo "<p style='color:green'>mod_rewrite is enabled.</p>";
    } else {
        echo "<p style='color:red'>Could not confirm if mod_rewrite is enabled.</p>";
    }
} else {
    echo "<p style='color:red'>.htaccess file does not exist.</p>";
}

// Check index.php
echo "<h2>Main Files</h2>";
if (file_exists('index.php')) {
    echo "<p style='color:green'>index.php file exists.</p>";
} else {
    echo "<p style='color:red'>index.php file does not exist.</p>";
}

// Check for error logs
echo "<h2>Error Logs</h2>";
$errorLog = ini_get('error_log');
echo "<p>PHP error_log path: $errorLog</p>";

if (file_exists($errorLog)) {
    echo "<p style='color:green'>Error log file exists.</p>";
    
    // Show last few lines of error log
    $logContent = file_exists($errorLog) ? file($errorLog) : [];
    $lastLines = array_slice($logContent, -20);
    
    if (!empty($lastLines)) {
        echo "<h3>Last 20 lines of error log:</h3>";
        echo "<pre>" . implode('', $lastLines) . "</pre>";
    } else {
        echo "<p>Error log is empty or not readable.</p>";
    }
} else {
    echo "<p style='color:red'>Error log file does not exist or path is incorrect.</p>";
}

// Server information
echo "<h2>Server Information</h2>";
echo "<p>Server software: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p>Server name: " . $_SERVER['SERVER_NAME'] . "</p>";
echo "<p>Document root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Current script: " . $_SERVER['SCRIPT_FILENAME'] . "</p>";

// Check for common issues
echo "<h2>Common Issues Check</h2>";

// Check for white page (blank page) issue
ob_start();
include_once('index.php');
$output = ob_get_clean();

if (empty(trim($output))) {
    echo "<p style='color:red'>index.php produces a blank page. This could be due to PHP errors with display_errors turned off.</p>";
    echo "<p>Recommendations:</p>";
    echo "<ul>";
    echo "<li>Check PHP error logs for details</li>";
    echo "<li>Temporarily enable error display in .htaccess or php.ini</li>";
    echo "<li>Check for syntax errors in your PHP files</li>";
    echo "</ul>";
} else {
    echo "<p style='color:green'>index.php produces output.</p>";
}

// Memory limit check
echo "<p>Memory limit: " . ini_get('memory_limit') . "</p>";
if (intval(ini_get('memory_limit')) < 128) {
    echo "<p style='color:red'>Memory limit may be too low. Recommended: 128M or higher.</p>";
} else {
    echo "<p style='color:green'>Memory limit is sufficient.</p>";
}

// Max execution time
echo "<p>Max execution time: " . ini_get('max_execution_time') . " seconds</p>";
if (intval(ini_get('max_execution_time')) < 30) {
    echo "<p style='color:red'>Max execution time may be too low. Recommended: 30 seconds or higher.</p>";
} else {
    echo "<p style='color:green'>Max execution time is sufficient.</p>";
}

// Check for maintenance mode
if (file_exists('maintenance.php') || file_exists('maintenance.html')) {
    echo "<p style='color:red'>Site may be in maintenance mode.</p>";
}

echo "<h2>Conclusion</h2>";
echo "<p>If you're still experiencing issues, please check the server error logs and ensure all files are properly uploaded.</p>";
echo "<p>You can also try running the deployment script: <code>sudo bash /var/www/html/deploy.sh</code></p>";
?>
EOL

chown www-data:www-data /var/www/html/troubleshoot.php
chmod 644 /var/www/html/troubleshoot.php

echo "Server setup completed successfully!"
echo "You can now access your website at http://your-server-ip/"
echo "To test PHP functionality, visit http://your-server-ip/test.php"
echo "To view PHP information, visit http://your-server-ip/info.php"
echo "To troubleshoot issues, visit http://your-server-ip/troubleshoot.php"
echo ""
echo "Remember to delete info.php in production for security reasons."
echo "Run the deployment script after uploading new files: bash /var/www/html/deploy.sh"

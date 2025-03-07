<?php
/**
 * Configuration File
 * Contains application configuration settings
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Load environment variables from .env file if available
if (file_exists(__DIR__ . '/../../../.env')) {
    $envFile = file_get_contents(__DIR__ . '/../../../.env');
    $lines = explode("\n", $envFile);
    foreach ($lines as $line) {
        if (empty(trim($line)) || strpos(trim($line), '#') === 0) {
            continue;
        }
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

// Application environment (development, production)
$config['app_env'] = getenv('APP_ENV') ?: 'production';

// Database configuration
$config['db_host'] = getenv('DB_HOST') ?: 'localhost';
$config['db_name'] = getenv('DB_NAME') ?: 'follboost';
$config['db_user'] = getenv('DB_USER') ?: 'root';
$config['db_pass'] = getenv('DB_PASS') ?: '';

// Security settings
$config['encryption_key'] = getenv('ENCRYPTION_KEY') ?: 'change-this-to-a-random-string';
$config['api_rate_limit'] = getenv('API_RATE_LIMIT') ?: 100; // Requests per hour

// API provider defaults
$config['default_api_timeout'] = 30; // seconds

// Session configuration
$config['session_lifetime'] = 3600; // 1 hour

// Error logging
$config['log_errors'] = true;
$config['error_log_path'] = __DIR__ . '/../../logs/error.log';

// Return configuration array
return $config;
?>
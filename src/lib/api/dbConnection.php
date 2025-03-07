<?php
/**
 * Database Connection
 * Establishes secure connection to the database
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include configuration
$config = require_once 'config.php';

try {
    // Create PDO connection with error handling
    $dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $db = new PDO($dsn, $config['db_user'], $config['db_pass'], $options);
    
    // Set secure attributes
    $db->exec("SET SESSION sql_mode = 'STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");
    
} catch (PDOException $e) {
    // Log error without exposing sensitive information
    error_log('Database connection error: ' . $e->getMessage());
    
    // Return generic error message
    if ($config['app_env'] === 'development') {
        die('Database connection error: ' . $e->getMessage());
    } else {
        die('A database error occurred. Please try again later.');
    }
}
?>
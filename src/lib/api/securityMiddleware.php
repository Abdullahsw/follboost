<?php
/**
 * Security Middleware
 * This file contains security functions to protect the application
 */

// Prevent direct access to PHP files
if (!defined('SECURE_ACCESS')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access to this file is not allowed.');
}

/**
 * Sanitize input data to prevent XSS attacks
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitizeInput($value);
        }
        return $data;
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate API key format
 */
function validateApiKey($apiKey) {
    // Check if API key matches expected format (alphanumeric, 32-64 chars)
    return preg_match('/^[a-zA-Z0-9]{32,64}$/', $apiKey);
}

/**
 * Validate URL format
 */
function validateUrl($url) {
    return filter_var($url, FILTER_VALIDATE_URL);
}

/**
 * Generate CSRF token
 */
function generateCsrfToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 */
function verifyCsrfToken($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        return false;
    }
    return true;
}

/**
 * Log security events
 */
function logSecurityEvent($event, $severity = 'info') {
    $logFile = __DIR__ . '/../../logs/security.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $message = "[$timestamp] [$severity] [$ip] $event\n";
    
    // Ensure log directory exists
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    file_put_contents($logFile, $message, FILE_APPEND);
}

/**
 * Set secure headers
 */
function setSecureHeaders() {
    // Prevent clickjacking
    header('X-Frame-Options: DENY');
    
    // Enable XSS protection
    header('X-XSS-Protection: 1; mode=block');
    
    // Prevent MIME type sniffing
    header('X-Content-Type-Options: nosniff');
    
    // Content Security Policy
    header("Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';");
    
    // HTTP Strict Transport Security
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    
    // Referrer Policy
    header('Referrer-Policy: same-origin');
}

/**
 * Initialize security measures
 */
function initSecurity() {
    // Start session securely if not already started
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', 1);
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_samesite', 'Strict');
        session_start();
    }
    
    // Set secure headers
    setSecureHeaders();
    
    // Sanitize input data
    $_GET = sanitizeInput($_GET);
    $_POST = sanitizeInput($_POST);
    $_COOKIE = sanitizeInput($_COOKIE);
    
    // Disable error reporting in production
    if (getenv('APP_ENV') !== 'development') {
        error_reporting(0);
        ini_set('display_errors', 0);
    }
}

// Initialize security when this file is included
initSecurity();
?>
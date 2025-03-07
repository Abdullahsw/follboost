<?php
/**
 * API Handler
 * Securely handles API requests to external service providers
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include security middleware
require_once 'securityMiddleware.php';

class ApiHandler {
    private $api_url;
    private $api_key;
    private $api_secret;
    private $timeout = 30;
    private $last_response;
    private $last_error;

    /**
     * Constructor
     */
    public function __construct($api_url, $api_key, $api_secret = null) {
        // Validate inputs
        if (empty($api_url) || empty($api_key)) {
            throw new Exception('API URL and key are required');
        }
        
        if (!filter_var($api_url, FILTER_VALIDATE_URL)) {
            throw new Exception('Invalid API URL format');
        }
        
        $this->api_url = $api_url;
        $this->api_key = $api_key;
        $this->api_secret = $api_secret;
        
        // Get timeout from config if available
        $config = require_once 'config.php';
        if (isset($config['default_api_timeout'])) {
            $this->timeout = $config['default_api_timeout'];
        }
    }

    /**
     * Set request timeout
     */
    public function setTimeout($seconds) {
        $this->timeout = max(1, min(120, intval($seconds)));
    }

    /**
     * Get last response
     */
    public function getLastResponse() {
        return $this->last_response;
    }

    /**
     * Get last error
     */
    public function getLastError() {
        return $this->last_error;
    }

    /**
     * Connect to API securely
     */
    private function connect($params) {
        try {
            // Initialize cURL session
            $ch = curl_init($this->api_url);
            
            // Set cURL options
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query($params),
                CURLOPT_TIMEOUT => $this->timeout,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_USERAGENT => 'FollBoost/1.0',
                CURLOPT_HTTPHEADER => [
                    'Accept: application/json',
                    'X-Requested-With: XMLHttpRequest'
                ]
            ]);
            
            // Handle SSL verification based on URL
            if (strpos($this->api_url, 'https://') === 0) {
                // For production, enable SSL verification
                if (getenv('APP_ENV') === 'production') {
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
                } else {
                    // For development, allow self-signed certificates
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                }
            }
            
            // Execute request
            $response = curl_exec($ch);
            $this->last_response = $response;
            
            // Check for errors
            if (curl_errno($ch)) {
                $this->last_error = curl_error($ch);
                curl_close($ch);
                logSecurityEvent("API connection error: {$this->last_error}", 'error');
                return ['error' => "Connection error: {$this->last_error}"];
            }
            
            // Get HTTP status code
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            // Handle HTTP errors
            if ($httpCode >= 400) {
                $this->last_error = "HTTP error: {$httpCode}";
                logSecurityEvent("API HTTP error: {$httpCode}", 'error');
                return ['error' => "HTTP error: {$httpCode}"];
            }
            
            // Parse response
            $result = $this->parseResponse($response);
            
            // Log API request (without sensitive data)
            $logParams = $params;
            if (isset($logParams['key'])) $logParams['key'] = '***REDACTED***';
            logSecurityEvent("API request to {$this->api_url}: " . json_encode($logParams), 'info');
            
            return $result;
            
        } catch (Exception $e) {
            $this->last_error = $e->getMessage();
            logSecurityEvent("API exception: {$e->getMessage()}", 'error');
            return ['error' => "API error: {$e->getMessage()}"];
        }
    }

    /**
     * Parse API response
     */
    private function parseResponse($response) {
        // Try to decode as JSON
        $decoded = json_decode($response, true);
        
        // If JSON parsing failed, handle as text
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Some APIs return non-JSON responses
            if (is_string($response) && !empty($response)) {
                // Try to extract JSON from string (some APIs wrap JSON in text)
                if (preg_match('/\{.*\}/s', $response, $matches)) {
                    $jsonPart = $matches[0];
                    $decoded = json_decode($jsonPart, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        return $decoded;
                    }
                }
                
                // Return as text if no JSON found
                return ['text_response' => $response];
            }
            
            // Empty or invalid response
            return ['error' => 'Invalid response format'];
        }
        
        return $decoded;
    }

    /**
     * Make API request
     */
    public function request($action, $data = []) {
        // Prepare request parameters
        $params = [
            'key' => $this->api_key,
            'action' => $action
        ];
        
        // Add API secret if provided
        if (!empty($this->api_secret)) {
            $params['secret'] = $this->api_secret;
        }
        
        // Merge with additional data
        $params = array_merge($params, $data);
        
        // Validate parameters
        foreach ($params as $key => $value) {
            // Skip validation for key and secret
            if (in_array($key, ['key', 'secret'])) continue;
            
            // Sanitize other parameters
            $params[$key] = sanitizeInput($value);
        }
        
        // Make the request
        return $this->connect($params);
    }

    /**
     * Test connection to API
     */
    public function testConnection() {
        try {
            // Try to get balance as a simple test
            $result = $this->request('balance');
            
            // Check for errors
            if (isset($result['error'])) {
                return ['success' => false, 'message' => $result['error']];
            }
            
            // Check for valid response
            if (isset($result['balance']) || isset($result['funds']) || 
                (is_array($result) && count($result) > 0)) {
                return ['success' => true, 'message' => 'Connection successful'];
            }
            
            // Unknown response format
            return ['success' => false, 'message' => 'Unexpected response format'];
            
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
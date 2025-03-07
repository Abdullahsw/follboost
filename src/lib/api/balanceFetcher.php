<?php
/**
 * Balance Fetcher
 * Secure script to test API connection and fetch balance and services
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include security middleware
require_once 'securityMiddleware.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is authenticated
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.0 401 Unauthorized');
    echo "Authentication required. Please log in.";
    exit;
}

// Include API handler
require_once 'apiHandler.php';

// Set content type based on request
$isJsonRequest = isset($_GET['format']) && $_GET['format'] === 'json';
if ($isJsonRequest) {
    header('Content-Type: application/json');
} else {
    header('Content-Type: text/plain');
}

// Get API credentials from request or use defaults
$api_url = isset($_POST['api_url']) ? sanitizeInput($_POST['api_url']) : 'https://smmstone.com/api/v2';
$api_key = isset($_POST['api_key']) ? $_POST['api_key'] : '4df4da01af90be38e69b0f516a1d3b87';
$api_secret = isset($_POST['api_secret']) ? $_POST['api_secret'] : null;

// Validate inputs
if (!validateUrl($api_url)) {
    outputResult(false, "Invalid API URL format. URL must start with http:// or https://");
    exit;
}

if (!validateApiKey($api_key)) {
    outputResult(false, "Invalid API key format");
    exit;
}

try {
    // Create API handler
    $api = new ApiHandler($api_url, $api_key, $api_secret);
    
    // Test connection
    outputResult(true, "Testing connection...");
    $testResult = $api->testConnection();
    
    if (!$testResult['success']) {
        outputResult(false, "Connection failed: {$testResult['message']}");
        exit;
    }
    
    outputResult(true, "Connection successful!");
    
    // Fetch balance
    outputResult(true, "Fetching balance...");
    $balance = $api->request('balance');
    
    if (isset($balance['error'])) {
        outputResult(false, "Error fetching balance: {$balance['error']}");
    } else if (isset($balance['balance'])) {
        outputResult(true, "Balance: {$balance['balance']}", ['balance' => $balance]);
    } else {
        outputResult(false, "Unexpected balance response format", ['response' => $balance]);
    }
    
    // Fetch services
    outputResult(true, "Fetching services...");
    $services = $api->request('services');
    
    if (isset($services['error'])) {
        outputResult(false, "Error fetching services: {$services['error']}");
    } else if (is_array($services)) {
        $serviceCount = count($services);
        outputResult(true, "Services fetched successfully! Found {$serviceCount} services.", ['services' => $services]);
    } else {
        outputResult(false, "Unexpected services response format", ['response' => $services]);
    }
    
} catch (Exception $e) {
    outputResult(false, "Error: {$e->getMessage()}");
    logSecurityEvent("Error in balanceFetcher.php: {$e->getMessage()}", 'error');
}

/**
 * Output result in appropriate format
 */
function outputResult($success, $message, $data = null) {
    global $isJsonRequest;
    
    if ($isJsonRequest) {
        // JSON output
        $result = [
            'success' => $success,
            'message' => $message
        ];
        
        if ($data !== null) {
            $result = array_merge($result, $data);
        }
        
        echo json_encode($result) . "\n";
    } else {
        // Plain text output
        echo $message . "\n";
        
        if ($data !== null && isset($data['balance'])) {
            echo "Balance details: " . json_encode($data['balance']) . "\n";
        }
        
        if ($data !== null && isset($data['services'])) {
            echo "Services count: " . count($data['services']) . "\n";
            echo "First 5 services: \n";
            
            $count = 0;
            foreach ($data['services'] as $id => $service) {
                if ($count++ >= 5) break;
                
                $serviceName = isset($service['name']) ? $service['name'] : 'Unknown';
                $serviceId = isset($service['service']) ? $service['service'] : $id;
                $serviceRate = isset($service['rate']) ? $service['rate'] : 'N/A';
                
                echo "- ID: {$serviceId}, Name: {$serviceName}, Rate: {$serviceRate}\n";
            }
            
            echo "...\n";
            echo "(Total services: " . count($data['services']) . ")\n";
        }
    }
}
?>
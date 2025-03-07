<?php
/**
 * API Proxy
 * This file acts as a secure proxy between frontend and backend API services
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
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.0 405 Method Not Allowed');
    header('Allow: POST');
    echo json_encode(['error' => 'Only POST requests are allowed']);
    exit;
}

// Verify CSRF token
if (!isset($_POST['csrf_token']) || !verifyCsrfToken($_POST['csrf_token'])) {
    logSecurityEvent('CSRF token validation failed', 'warning');
    header('HTTP/1.0 403 Forbidden');
    echo json_encode(['error' => 'Invalid CSRF token']);
    exit;
}

// Get request parameters
$action = $_POST['action'] ?? '';
$providerId = $_POST['provider_id'] ?? '';

// Validate action
if (!in_array($action, ['balance', 'services', 'order', 'status'])) {
    header('HTTP/1.0 400 Bad Request');
    echo json_encode(['error' => 'Invalid action']);
    exit;
}

// Include database connection
require_once 'dbConnection.php';

// Include service manager
require_once 'serviceManager.php';

try {
    // Create service manager instance
    $serviceManager = new ServiceManager($db);
    
    // Process the request based on action
    switch ($action) {
        case 'balance':
            // Get balance for specific provider or all providers
            if (!empty($providerId)) {
                $result = $serviceManager->getProviderBalance($providerId);
            } else {
                $result = $serviceManager->getBalances();
            }
            break;
            
        case 'services':
            // Get services for specific provider or all providers
            if (!empty($providerId)) {
                $result = $serviceManager->getProviderServices($providerId);
            } else {
                $result = $serviceManager->getAllServices();
            }
            break;
            
        case 'order':
            // Validate order parameters
            if (!isset($_POST['service']) || !isset($_POST['link']) || !isset($_POST['quantity'])) {
                throw new Exception('Missing required order parameters');
            }
            
            // Create order
            $result = $serviceManager->createOrder(
                $providerId,
                $_POST['service'],
                $_POST['link'],
                $_POST['quantity'],
                $_POST['comments'] ?? ''
            );
            break;
            
        case 'status':
            // Validate order ID
            if (!isset($_POST['order_id'])) {
                throw new Exception('Missing order ID');
            }
            
            // Get order status
            $result = $serviceManager->getOrderStatus($providerId, $_POST['order_id']);
            break;
    }
    
    // Return success response
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'data' => $result]);
    
} catch (Exception $e) {
    // Log error
    logSecurityEvent('API error: ' . $e->getMessage(), 'error');
    
    // Return error response
    header('HTTP/1.0 500 Internal Server Error');
    echo json_encode(['error' => 'An error occurred processing your request']);
}
?>
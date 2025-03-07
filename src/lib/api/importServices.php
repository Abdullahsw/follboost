<?php
/**
 * Import Services
 * Securely imports services from providers
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include required files
require_once 'securityMiddleware.php';
require_once 'dbConnection.php';
require_once 'serviceManager.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is authenticated
if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    header('HTTP/1.0 401 Unauthorized');
    echo json_encode(['error' => 'Authentication required']);
    exit;
}

// Set content type to JSON for API responses
header('Content-Type: application/json');

try {
    // Create service manager instance
    $serviceManager = new ServiceManager($db);
    
    // Get request parameters
    $action = $_GET['action'] ?? 'all';
    $providerId = $_GET['provider_id'] ?? null;
    
    // Process based on action
    switch ($action) {
        case 'services':
            // Fetch services from specific provider or all providers
            if ($providerId) {
                $services = $serviceManager->getProviderServices($providerId);
                echo json_encode(['success' => true, 'services' => $services]);
            } else {
                $allServices = $serviceManager->getAllServices();
                echo json_encode(['success' => true, 'providers' => $allServices]);
            }
            break;
            
        case 'balance':
            // Fetch balance from specific provider or all providers
            if ($providerId) {
                $balance = $serviceManager->getProviderBalance($providerId);
                echo json_encode(['success' => true, 'balance' => $balance]);
            } else {
                $balances = $serviceManager->getBalances();
                echo json_encode(['success' => true, 'balances' => $balances]);
            }
            break;
            
        case 'import':
            // Import services to database
            if (!$providerId) {
                throw new Exception('Provider ID is required for import');
            }
            
            // Verify CSRF token
            if (!isset($_POST['csrf_token']) || !verifyCsrfToken($_POST['csrf_token'])) {
                throw new Exception('Invalid CSRF token');
            }
            
            // Get import parameters
            $profitMargin = isset($_POST['profit_margin']) ? floatval($_POST['profit_margin']) : 20;
            $selectedServices = isset($_POST['services']) ? json_decode($_POST['services'], true) : [];
            
            // Validate parameters
            if ($profitMargin <= 0 || $profitMargin > 1000) {
                throw new Exception('Invalid profit margin');
            }
            
            if (empty($selectedServices)) {
                throw new Exception('No services selected for import');
            }
            
            // Import services
            $importResult = importServicesToDatabase($db, $serviceManager, $providerId, $selectedServices, $profitMargin);
            echo json_encode(['success' => true, 'imported' => $importResult['count'], 'message' => $importResult['message']]);
            break;
            
        case 'test':
            // Test connection to provider
            if (!$providerId) {
                throw new Exception('Provider ID is required for testing');
            }
            
            $testResult = $serviceManager->testProviderConnection($providerId);
            echo json_encode($testResult);
            break;
            
        default:
            // Default action: fetch both services and balances
            $allServices = $serviceManager->getAllServices();
            $balances = $serviceManager->getBalances();
            echo json_encode([
                'success' => true, 
                'providers' => $allServices, 
                'balances' => $balances
            ]);
    }
    
} catch (Exception $e) {
    // Log error
    logSecurityEvent('Error in importServices.php: ' . $e->getMessage(), 'error');
    
    // Return error response
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

/**
 * Import services to database
 */
function importServicesToDatabase($db, $serviceManager, $providerId, $selectedServices, $profitMargin) {
    try {
        // Get services from provider
        $providerServices = $serviceManager->getProviderServices($providerId);
        
        // Filter selected services
        $servicesToImport = [];
        foreach ($providerServices as $service) {
            $serviceId = $service['service'] ?? $service['id'] ?? null;
            if ($serviceId && in_array($serviceId, $selectedServices)) {
                $servicesToImport[] = $service;
            }
        }
        
        if (empty($servicesToImport)) {
            return ['count' => 0, 'message' => 'No matching services found'];
        }
        
        // Import services to database
        $importCount = 0;
        foreach ($servicesToImport as $service) {
            $serviceId = $service['service'] ?? $service['id'] ?? null;
            $name = $service['name'] ?? 'Unknown Service';
            $category = $service['category'] ?? $service['type'] ?? 'Other';
            $rate = isset($service['rate']) ? floatval($service['rate']) : 0;
            $min = isset($service['min']) ? intval($service['min']) : 0;
            $max = isset($service['max']) ? intval($service['max']) : 0;
            $description = $service['description'] ?? '';
            
            // Calculate price with profit margin
            $price = $rate * (1 + ($profitMargin / 100));
            
            // Insert service
            $stmt = $db->prepare("INSERT INTO services 
                (provider_id, service_id, name, category, price, cost, min_order, max_order, description, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW()) 
                ON DUPLICATE KEY UPDATE 
                name = VALUES(name), 
                category = VALUES(category), 
                price = VALUES(price), 
                cost = VALUES(cost), 
                min_order = VALUES(min_order), 
                max_order = VALUES(max_order), 
                description = VALUES(description), 
                updated_at = NOW()");
                
            $result = $stmt->execute([
                $providerId,
                $serviceId,
                $name,
                $category,
                $price,
                $rate,
                $min,
                $max,
                $description
            ]);
            
            if ($result) {
                $importCount++;
            }
        }
        
        return [
            'count' => $importCount, 
            'message' => "Successfully imported {$importCount} services"
        ];
        
    } catch (Exception $e) {
        logSecurityEvent('Error importing services: ' . $e->getMessage(), 'error');
        throw new Exception('Failed to import services: ' . $e->getMessage());
    }
}
?>
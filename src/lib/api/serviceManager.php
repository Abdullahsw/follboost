<?php
/**
 * Service Manager
 * Manages service providers and API operations with enhanced security
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include required files
require_once 'securityMiddleware.php';
require_once 'serviceProviders.php';
require_once 'apiHandler.php';
require_once 'encryptionService.php';

class ServiceManager {
    private $db;
    private $serviceProviders;
    private $providers;
    private $encryption;
    private $requestLog = [];

    /**
     * Constructor
     */
    public function __construct($db) {
        $this->db = $db;
        $this->serviceProviders = new ServiceProviders($db);
        $this->providers = $this->serviceProviders->getAllProviders();
        $this->encryption = new EncryptionService();
    }

    /**
     * Get all services from all providers
     */
    public function getAllServices() {
        $allServices = [];
        $errors = [];
        
        foreach ($this->providers as $provider) {
            try {
                // Get provider credentials
                $credentials = $this->serviceProviders->getProviderCredentials($provider['id']);
                if (!$credentials) {
                    $errors[$provider['name']] = 'Provider credentials not found';
                    continue;
                }
                
                // Create API handler
                $api = new ApiHandler(
                    $provider['api_url'], 
                    $credentials['api_key'],
                    $credentials['api_secret'] ?? null
                );
                
                // Request services
                $services = $api->request('services');
                
                // Log request
                $this->logApiRequest($provider['id'], 'services', $api->getLastResponse(), $api->getLastError());
                
                // Store services
                $allServices[$provider['name']] = $services;
                
            } catch (Exception $e) {
                logSecurityEvent("Error fetching services from {$provider['name']}: {$e->getMessage()}", 'error');
                $errors[$provider['name']] = $e->getMessage();
                $allServices[$provider['name']] = ['error' => 'Failed to fetch services'];
            }
        }
        
        // Log errors if any
        if (!empty($errors)) {
            logSecurityEvent('Errors fetching services: ' . json_encode($errors), 'warning');
        }
        
        return $allServices;
    }

    /**
     * Get services from a specific provider
     */
    public function getProviderServices($providerId) {
        try {
            // Get provider
            $provider = $this->serviceProviders->getProvider($providerId);
            if (!$provider) {
                throw new Exception('Provider not found');
            }
            
            // Get provider credentials
            $credentials = $this->serviceProviders->getProviderCredentials($providerId);
            if (!$credentials) {
                throw new Exception('Provider credentials not found');
            }
            
            // Create API handler
            $api = new ApiHandler(
                $provider['api_url'], 
                $credentials['api_key'],
                $credentials['api_secret'] ?? null
            );
            
            // Request services
            $services = $api->request('services');
            
            // Log request
            $this->logApiRequest($providerId, 'services', $api->getLastResponse(), $api->getLastError());
            
            return $services;
            
        } catch (Exception $e) {
            logSecurityEvent("Error fetching services from provider {$providerId}: {$e->getMessage()}", 'error');
            throw new Exception('Failed to fetch services');
        }
    }

    /**
     * Get balances from all providers
     */
    public function getBalances() {
        $balances = [];
        $errors = [];
        
        foreach ($this->providers as $provider) {
            try {
                // Get provider credentials
                $credentials = $this->serviceProviders->getProviderCredentials($provider['id']);
                if (!$credentials) {
                    $errors[$provider['name']] = 'Provider credentials not found';
                    continue;
                }
                
                // Create API handler
                $api = new ApiHandler(
                    $provider['api_url'], 
                    $credentials['api_key'],
                    $credentials['api_secret'] ?? null
                );
                
                // Request balance
                $balance = $api->request('balance');
                
                // Log request
                $this->logApiRequest($provider['id'], 'balance', $api->getLastResponse(), $api->getLastError());
                
                // Store balance
                $balances[$provider['name']] = $balance;
                
            } catch (Exception $e) {
                logSecurityEvent("Error fetching balance from {$provider['name']}: {$e->getMessage()}", 'error');
                $errors[$provider['name']] = $e->getMessage();
                $balances[$provider['name']] = ['error' => 'Failed to fetch balance'];
            }
        }
        
        // Log errors if any
        if (!empty($errors)) {
            logSecurityEvent('Errors fetching balances: ' . json_encode($errors), 'warning');
        }
        
        return $balances;
    }

    /**
     * Get balance from a specific provider
     */
    public function getProviderBalance($providerId) {
        try {
            // Get provider
            $provider = $this->serviceProviders->getProvider($providerId);
            if (!$provider) {
                throw new Exception('Provider not found');
            }
            
            // Get provider credentials
            $credentials = $this->serviceProviders->getProviderCredentials($providerId);
            if (!$credentials) {
                throw new Exception('Provider credentials not found');
            }
            
            // Create API handler
            $api = new ApiHandler(
                $provider['api_url'], 
                $credentials['api_key'],
                $credentials['api_secret'] ?? null
            );
            
            // Request balance
            $balance = $api->request('balance');
            
            // Log request
            $this->logApiRequest($providerId, 'balance', $api->getLastResponse(), $api->getLastError());
            
            return $balance;
            
        } catch (Exception $e) {
            logSecurityEvent("Error fetching balance from provider {$providerId}: {$e->getMessage()}", 'error');
            throw new Exception('Failed to fetch balance');
        }
    }

    /**
     * Create a new order
     */
    public function createOrder($providerId, $service, $link, $quantity, $comments = '') {
        try {
            // Validate inputs
            if (empty($providerId) || empty($service) || empty($link) || empty($quantity)) {
                throw new Exception('Missing required parameters');
            }
            
            if (!filter_var($quantity, FILTER_VALIDATE_INT) || $quantity <= 0) {
                throw new Exception('Invalid quantity');
            }
            
            // Get provider
            $provider = $this->serviceProviders->getProvider($providerId);
            if (!$provider) {
                throw new Exception('Provider not found');
            }
            
            // Get provider credentials
            $credentials = $this->serviceProviders->getProviderCredentials($providerId);
            if (!$credentials) {
                throw new Exception('Provider credentials not found');
            }
            
            // Create API handler
            $api = new ApiHandler(
                $provider['api_url'], 
                $credentials['api_key'],
                $credentials['api_secret'] ?? null
            );
            
            // Prepare order data
            $orderData = [
                'service' => $service,
                'link' => $link,
                'quantity' => $quantity
            ];
            
            // Add comments if provided
            if (!empty($comments)) {
                $orderData['comments'] = $comments;
            }
            
            // Create order
            $result = $api->request('add', $orderData);
            
            // Log request
            $this->logApiRequest($providerId, 'add', $api->getLastResponse(), $api->getLastError(), $orderData);
            
            // Check for errors
            if (isset($result['error'])) {
                throw new Exception($result['error']);
            }
            
            // Store order in database
            $this->storeOrder($providerId, $service, $link, $quantity, $result);
            
            return $result;
            
        } catch (Exception $e) {
            logSecurityEvent("Error creating order with provider {$providerId}: {$e->getMessage()}", 'error');
            throw new Exception('Failed to create order: ' . $e->getMessage());
        }
    }

    /**
     * Store order in database
     */
    private function storeOrder($providerId, $service, $link, $quantity, $result) {
        try {
            // Extract order ID from result
            $orderId = null;
            if (isset($result['order'])) {
                $orderId = $result['order'];
            } elseif (isset($result['id'])) {
                $orderId = $result['id'];
            }
            
            // Prepare order data
            $stmt = $this->db->prepare("INSERT INTO orders 
                (provider_id, service_id, link, quantity, api_order_id, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())");
                
            $stmt->execute([
                $providerId,
                $service,
                $link,
                $quantity,
                $orderId
            ]);
            
            return $this->db->lastInsertId();
            
        } catch (PDOException $e) {
            logSecurityEvent('Database error in storeOrder: ' . $e->getMessage(), 'error');
            // Continue execution even if storage fails
            return false;
        }
    }

    /**
     * Get order status
     */
    public function getOrderStatus($providerId, $orderId) {
        try {
            // Validate inputs
            if (empty($providerId) || empty($orderId)) {
                throw new Exception('Missing required parameters');
            }
            
            // Get provider
            $provider = $this->serviceProviders->getProvider($providerId);
            if (!$provider) {
                throw new Exception('Provider not found');
            }
            
            // Get provider credentials
            $credentials = $this->serviceProviders->getProviderCredentials($providerId);
            if (!$credentials) {
                throw new Exception('Provider credentials not found');
            }
            
            // Create API handler
            $api = new ApiHandler(
                $provider['api_url'], 
                $credentials['api_key'],
                $credentials['api_secret'] ?? null
            );
            
            // Request status
            $result = $api->request('status', ['order' => $orderId]);
            
            // Log request
            $this->logApiRequest($providerId, 'status', $api->getLastResponse(), $api->getLastError(), ['order' => $orderId]);
            
            // Check for errors
            if (isset($result['error'])) {
                throw new Exception($result['error']);
            }
            
            // Update order status in database
            $this->updateOrderStatus($orderId, $result);
            
            return $result;
            
        } catch (Exception $e) {
            logSecurityEvent("Error checking order status with provider {$providerId}: {$e->getMessage()}", 'error');
            throw new Exception('Failed to check order status: ' . $e->getMessage());
        }
    }

    /**
     * Update order status in database
     */
    private function updateOrderStatus($apiOrderId, $statusResult) {
        try {
            // Extract status from result
            $status = 'pending';
            if (isset($statusResult['status'])) {
                $status = $statusResult['status'];
            }
            
            // Map API status to our status
            $mappedStatus = $this->mapOrderStatus($status);
            
            // Update order
            $stmt = $this->db->prepare("UPDATE orders 
                SET status = ?, api_response = ?, updated_at = NOW() 
                WHERE api_order_id = ?");
                
            $stmt->execute([
                $mappedStatus,
                json_encode($statusResult),
                $apiOrderId
            ]);
            
            return true;
            
        } catch (PDOException $e) {
            logSecurityEvent('Database error in updateOrderStatus: ' . $e->getMessage(), 'error');
            // Continue execution even if update fails
            return false;
        }
    }

    /**
     * Map API order status to our status
     */
    private function mapOrderStatus($apiStatus) {
        $statusMap = [
            'pending' => 'pending',
            'in_progress' => 'processing',
            'processing' => 'processing',
            'active' => 'processing',
            'completed' => 'completed',
            'partial' => 'partial',
            'canceled' => 'cancelled',
            'refunded' => 'refunded',
            'failed' => 'failed'
        ];
        
        return $statusMap[strtolower($apiStatus)] ?? 'pending';
    }

    /**
     * Log API request
     */
    private function logApiRequest($providerId, $action, $response, $error = null, $params = []) {
        try {
            // Remove sensitive data
            if (isset($params['key'])) unset($params['key']);
            if (isset($params['secret'])) unset($params['secret']);
            
            // Prepare log data
            $stmt = $this->db->prepare("INSERT INTO api_logs 
                (provider_id, action, params, response, error, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())");
                
            $stmt->execute([
                $providerId,
                $action,
                json_encode($params),
                is_string($response) ? $response : json_encode($response),
                $error
            ]);
            
            return true;
            
        } catch (PDOException $e) {
            // Log to file if database logging fails
            logSecurityEvent('Database error in logApiRequest: ' . $e->getMessage(), 'error');
            return false;
        }
    }

    /**
     * Test connection to a provider
     */
    public function testProviderConnection($providerId) {
        try {
            // Get provider
            $provider = $this->serviceProviders->getProvider($providerId);
            if (!$provider) {
                throw new Exception('Provider not found');
            }
            
            // Get provider credentials
            $credentials = $this->serviceProviders->getProviderCredentials($providerId);
            if (!$credentials) {
                throw new Exception('Provider credentials not found');
            }
            
            // Create API handler
            $api = new ApiHandler(
                $provider['api_url'], 
                $credentials['api_key'],
                $credentials['api_secret'] ?? null
            );
            
            // Test connection
            $result = $api->testConnection();
            
            // Log test
            logSecurityEvent("API connection test for provider {$provider['name']}: " . 
                ($result['success'] ? 'Success' : 'Failed - ' . $result['message']), 
                $result['success'] ? 'info' : 'warning');
            
            return $result;
            
        } catch (Exception $e) {
            logSecurityEvent("Error testing connection to provider {$providerId}: {$e->getMessage()}", 'error');
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
?>
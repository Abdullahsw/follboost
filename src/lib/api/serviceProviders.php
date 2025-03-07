<?php
/**
 * Service Providers Manager
 * Handles CRUD operations for service providers with enhanced security
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include security middleware
require_once 'securityMiddleware.php';

// Include encryption service
require_once 'encryptionService.php';

class ServiceProviders {
    private $db;
    private $encryption;

    public function __construct($db) {
        $this->db = $db;
        $this->encryption = new EncryptionService();
    }

    /**
     * Get all active service providers
     */
    public function getAllProviders() {
        try {
            $stmt = $this->db->prepare("SELECT id, name, api_url, status, created_at, updated_at FROM service_providers WHERE status = 'active'");
            $stmt->execute();
            $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Decrypt sensitive data when needed for specific operations
            // API keys are not included in the general listing for security
            
            return $providers;
        } catch (PDOException $e) {
            logSecurityEvent('Database error in getAllProviders: ' . $e->getMessage(), 'error');
            throw new Exception('Error retrieving service providers');
        }
    }

    /**
     * Get a specific provider by ID
     */
    public function getProvider($id) {
        try {
            $stmt = $this->db->prepare("SELECT id, name, api_url, status, created_at, updated_at FROM service_providers WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            logSecurityEvent('Database error in getProvider: ' . $e->getMessage(), 'error');
            throw new Exception('Error retrieving service provider');
        }
    }

    /**
     * Get provider API credentials (secure method)
     */
    public function getProviderCredentials($id) {
        try {
            $stmt = $this->db->prepare("SELECT api_key, api_secret FROM service_providers WHERE id = ? AND status = 'active' LIMIT 1");
            $stmt->execute([$id]);
            $credentials = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($credentials) {
                // Decrypt API credentials
                $credentials['api_key'] = $this->encryption->decrypt($credentials['api_key']);
                if (!empty($credentials['api_secret'])) {
                    $credentials['api_secret'] = $this->encryption->decrypt($credentials['api_secret']);
                }
            }
            
            return $credentials;
        } catch (PDOException $e) {
            logSecurityEvent('Database error in getProviderCredentials: ' . $e->getMessage(), 'error');
            throw new Exception('Error retrieving provider credentials');
        }
    }

    /**
     * Add a new service provider with encrypted credentials
     */
    public function addProvider($name, $api_url, $api_key, $api_secret = null) {
        try {
            // Validate inputs
            if (empty($name) || empty($api_url) || empty($api_key)) {
                throw new Exception('Missing required fields');
            }
            
            if (!validateUrl($api_url)) {
                throw new Exception('Invalid API URL format');
            }
            
            if (!validateApiKey($api_key)) {
                throw new Exception('Invalid API key format');
            }
            
            // Encrypt sensitive data
            $encryptedApiKey = $this->encryption->encrypt($api_key);
            $encryptedApiSecret = $api_secret ? $this->encryption->encrypt($api_secret) : null;
            
            // Insert with prepared statement
            $stmt = $this->db->prepare("INSERT INTO service_providers 
                (name, api_url, api_key, api_secret, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, 'active', NOW(), NOW())");
                
            $result = $stmt->execute([$name, $api_url, $encryptedApiKey, $encryptedApiSecret]);
            
            if ($result) {
                logSecurityEvent("New service provider added: {$name}", 'info');
                return $this->db->lastInsertId();
            }
            
            return false;
        } catch (PDOException $e) {
            logSecurityEvent('Database error in addProvider: ' . $e->getMessage(), 'error');
            throw new Exception('Error adding service provider');
        }
    }

    /**
     * Update a service provider
     */
    public function updateProvider($id, $data) {
        try {
            // Start building the query
            $query = "UPDATE service_providers SET updated_at = NOW()";
            $params = [];
            
            // Add fields to update
            if (isset($data['name'])) {
                $query .= ", name = ?";
                $params[] = $data['name'];
            }
            
            if (isset($data['api_url'])) {
                if (!validateUrl($data['api_url'])) {
                    throw new Exception('Invalid API URL format');
                }
                $query .= ", api_url = ?";
                $params[] = $data['api_url'];
            }
            
            if (isset($data['api_key'])) {
                if (!validateApiKey($data['api_key'])) {
                    throw new Exception('Invalid API key format');
                }
                $query .= ", api_key = ?";
                $params[] = $this->encryption->encrypt($data['api_key']);
            }
            
            if (isset($data['api_secret'])) {
                $query .= ", api_secret = ?";
                $params[] = $data['api_secret'] ? $this->encryption->encrypt($data['api_secret']) : null;
            }
            
            if (isset($data['status'])) {
                if (!in_array($data['status'], ['active', 'inactive'])) {
                    throw new Exception('Invalid status value');
                }
                $query .= ", status = ?";
                $params[] = $data['status'];
            }
            
            // Finish the query
            $query .= " WHERE id = ?";
            $params[] = $id;
            
            // Execute the update
            $stmt = $this->db->prepare($query);
            $result = $stmt->execute($params);
            
            if ($result) {
                logSecurityEvent("Service provider updated: ID {$id}", 'info');
                return true;
            }
            
            return false;
        } catch (PDOException $e) {
            logSecurityEvent('Database error in updateProvider: ' . $e->getMessage(), 'error');
            throw new Exception('Error updating service provider');
        }
    }

    /**
     * Delete a service provider
     */
    public function deleteProvider($id) {
        try {
            // Use soft delete by setting status to 'deleted'
            $stmt = $this->db->prepare("UPDATE service_providers SET status = 'deleted', updated_at = NOW() WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($result) {
                logSecurityEvent("Service provider deleted: ID {$id}", 'info');
                return true;
            }
            
            return false;
        } catch (PDOException $e) {
            logSecurityEvent('Database error in deleteProvider: ' . $e->getMessage(), 'error');
            throw new Exception('Error deleting service provider');
        }
    }
}
?>
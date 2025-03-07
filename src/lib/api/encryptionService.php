<?php
/**
 * Encryption Service
 * Handles encryption and decryption of sensitive data
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include configuration
$config = require_once 'config.php';

class EncryptionService {
    private $key;
    private $method = 'aes-256-cbc';
    
    /**
     * Constructor
     */
    public function __construct($key = null) {
        global $config;
        $this->key = $key ?: $config['encryption_key'];
        
        // Validate encryption key
        if (empty($this->key) || $this->key === 'change-this-to-a-random-string') {
            throw new Exception('Invalid encryption key. Please set a secure key in your configuration.');
        }
    }
    
    /**
     * Encrypt data
     */
    public function encrypt($data) {
        // Generate initialization vector
        $ivlen = openssl_cipher_iv_length($this->method);
        $iv = openssl_random_pseudo_bytes($ivlen);
        
        // Encrypt data
        $encrypted = openssl_encrypt($data, $this->method, $this->key, 0, $iv);
        
        // Combine IV and encrypted data
        $combined = base64_encode($iv . $encrypted);
        
        return $combined;
    }
    
    /**
     * Decrypt data
     */
    public function decrypt($data) {
        // Decode combined data
        $combined = base64_decode($data);
        
        // Extract IV
        $ivlen = openssl_cipher_iv_length($this->method);
        $iv = substr($combined, 0, $ivlen);
        
        // Extract encrypted data
        $encrypted = substr($combined, $ivlen);
        
        // Decrypt data
        $decrypted = openssl_decrypt($encrypted, $this->method, $this->key, 0, $iv);
        
        return $decrypted;
    }
    
    /**
     * Hash password securely
     */
    public function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }
    
    /**
     * Verify password against hash
     */
    public function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
}
?>
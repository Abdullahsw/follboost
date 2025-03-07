<?php
/**
 * Add Provider Form
 * Secure form for adding new service providers
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include required files
require_once 'securityMiddleware.php';
require_once 'dbConnection.php';
require_once 'serviceProviders.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is authenticated
if (!isset($_SESSION['user_id']) || !isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    header('Location: login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}

// Initialize variables
$success = false;
$error = '';
$name = '';
$api_url = '';
$api_key = '';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !verifyCsrfToken($_POST['csrf_token'])) {
        $error = 'Invalid form submission. Please try again.';
    } else {
        // Sanitize and validate inputs
        $name = sanitizeInput($_POST['name'] ?? '');
        $api_url = sanitizeInput($_POST['api_url'] ?? '');
        $api_key = $_POST['api_key'] ?? ''; // Don't sanitize API key to preserve special characters
        $api_secret = $_POST['api_secret'] ?? '';
        
        // Validate inputs
        if (empty($name)) {
            $error = 'Service name is required';
        } elseif (empty($api_url)) {
            $error = 'API URL is required';
        } elseif (empty($api_key)) {
            $error = 'API key is required';
        } elseif (!validateUrl($api_url)) {
            $error = 'Invalid API URL format';
        } elseif (!validateApiKey($api_key)) {
            $error = 'Invalid API key format';
        } else {
            try {
                // Create service providers instance
                $serviceProviders = new ServiceProviders($db);
                
                // Test connection before adding
                $api = new ApiHandler($api_url, $api_key, $api_secret);
                $testResult = $api->testConnection();
                
                if ($testResult['success']) {
                    // Add provider
                    $providerId = $serviceProviders->addProvider($name, $api_url, $api_key, $api_secret);
                    
                    if ($providerId) {
                        $success = true;
                        $name = $api_url = $api_key = $api_secret = '';
                        logSecurityEvent("Admin added new service provider: {$name}", 'info');
                    } else {
                        $error = 'Failed to add provider. Please try again.';
                    }
                } else {
                    $error = 'Connection test failed: ' . $testResult['message'];
                }
            } catch (Exception $e) {
                $error = 'Error: ' . $e->getMessage();
                logSecurityEvent("Error adding provider: {$e->getMessage()}", 'error');
            }
        }
    }
}

// Generate CSRF token
$csrfToken = generateCsrfToken();
?>

<!DOCTYPE html>
<html lang="en" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إضافة مزود خدمة جديد</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #45a049;
        }
        .alert {
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .note {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>إضافة مزود خدمة جديد</h1>
        
        <?php if ($success): ?>
        <div class="alert alert-success">
            تمت إضافة مزود الخدمة بنجاح!
        </div>
        <?php endif; ?>
        
        <?php if ($error): ?>
        <div class="alert alert-danger">
            <?php echo $error; ?>
        </div>
        <?php endif; ?>
        
        <form method="POST" autocomplete="off">
            <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">
            
            <div class="form-group">
                <label for="name">اسم مزود الخدمة:</label>
                <input type="text" id="name" name="name" value="<?php echo $name; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="api_url">عنوان API:</label>
                <input type="text" id="api_url" name="api_url" value="<?php echo $api_url; ?>" required>
                <div class="note">مثال: https://smmstone.com/api/v2</div>
            </div>
            
            <div class="form-group">
                <label for="api_key">مفتاح API:</label>
                <input type="password" id="api_key" name="api_key" required>
                <div class="note">يجب أن يكون المفتاح بتنسيق صحيح (أحرف وأرقام فقط)</div>
            </div>
            
            <div class="form-group">
                <label for="api_secret">كلمة سر API (اختياري):</label>
                <input type="password" id="api_secret" name="api_secret">
            </div>
            
            <div class="form-group">
                <button type="submit">إضافة مزود الخدمة</button>
            </div>
        </form>
        
        <div style="margin-top: 20px; text-align: center;">
            <a href="manageProviders.php">العودة إلى قائمة مزودي الخدمة</a>
        </div>
    </div>
    
    <script>
    // Client-side validation
    document.querySelector('form').addEventListener('submit', function(e) {
        const name = document.getElementById('name').value.trim();
        const apiUrl = document.getElementById('api_url').value.trim();
        const apiKey = document.getElementById('api_key').value.trim();
        
        let isValid = true;
        let errorMessage = '';
        
        if (!name) {
            errorMessage = 'اسم مزود الخدمة مطلوب';
            isValid = false;
        } else if (!apiUrl) {
            errorMessage = 'عنوان API مطلوب';
            isValid = false;
        } else if (!apiKey) {
            errorMessage = 'مفتاح API مطلوب';
            isValid = false;
        } else if (!apiUrl.match(/^https?:\/\/.+/)) {
            errorMessage = 'عنوان API يجب أن يبدأ بـ http:// أو https://';
            isValid = false;
        } else if (!apiKey.match(/^[a-zA-Z0-9]{32,64}$/)) {
            errorMessage = 'مفتاح API يجب أن يتكون من أحرف وأرقام فقط (32-64 حرف)';
            isValid = false;
        }
        
        if (!isValid) {
            e.preventDefault();
            alert(errorMessage);
        }
    });
    </script>
</body>
</html>
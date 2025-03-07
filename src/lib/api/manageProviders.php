<?php
/**
 * Manage Providers
 * Secure interface for managing service providers
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Include required files
require_once 'securityMiddleware.php';
require_once 'dbConnection.php';
require_once 'serviceProviders.php';
require_once 'serviceManager.php';

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
$success = '';
$error = '';
$providers = [];

// Create service providers instance
$serviceProviders = new ServiceProviders($db);

// Process actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !verifyCsrfToken($_POST['csrf_token'])) {
        $error = 'Invalid form submission. Please try again.';
    } else {
        $action = $_POST['action'] ?? '';
        $providerId = $_POST['provider_id'] ?? '';
        
        switch ($action) {
            case 'delete':
                if (empty($providerId)) {
                    $error = 'Provider ID is required';
                } else {
                    try {
                        $result = $serviceProviders->deleteProvider($providerId);
                        if ($result) {
                            $success = 'Provider deleted successfully';
                            logSecurityEvent("Admin deleted provider ID: {$providerId}", 'info');
                        } else {
                            $error = 'Failed to delete provider';
                        }
                    } catch (Exception $e) {
                        $error = 'Error: ' . $e->getMessage();
                        logSecurityEvent("Error deleting provider: {$e->getMessage()}", 'error');
                    }
                }
                break;
                
            case 'update_status':
                if (empty($providerId)) {
                    $error = 'Provider ID is required';
                } else {
                    $status = $_POST['status'] ?? '';
                    if (!in_array($status, ['active', 'inactive'])) {
                        $error = 'Invalid status';
                    } else {
                        try {
                            $result = $serviceProviders->updateProvider($providerId, ['status' => $status]);
                            if ($result) {
                                $success = 'Provider status updated successfully';
                                logSecurityEvent("Admin updated provider status: ID {$providerId} to {$status}", 'info');
                            } else {
                                $error = 'Failed to update provider status';
                            }
                        } catch (Exception $e) {
                            $error = 'Error: ' . $e->getMessage();
                            logSecurityEvent("Error updating provider status: {$e->getMessage()}", 'error');
                        }
                    }
                }
                break;
                
            case 'test_connection':
                if (empty($providerId)) {
                    $error = 'Provider ID is required';
                } else {
                    try {
                        $serviceManager = new ServiceManager($db);
                        $testResult = $serviceManager->testProviderConnection($providerId);
                        
                        if ($testResult['success']) {
                            $success = 'Connection test successful';
                        } else {
                            $error = 'Connection test failed: ' . $testResult['message'];
                        }
                    } catch (Exception $e) {
                        $error = 'Error: ' . $e->getMessage();
                        logSecurityEvent("Error testing provider connection: {$e->getMessage()}", 'error');
                    }
                }
                break;
        }
    }
}

// Get all providers
try {
    $providers = $serviceProviders->getAllProviders();
} catch (Exception $e) {
    $error = 'Error loading providers: ' . $e->getMessage();
    logSecurityEvent("Error loading providers: {$e->getMessage()}", 'error');
}

// Generate CSRF token
$csrfToken = generateCsrfToken();
?>

<!DOCTYPE html>
<html lang="en" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة مزودي الخدمة</title>
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
            max-width: 1000px;
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
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: right;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .actions {
            display: flex;
            gap: 5px;
            justify-content: center;
        }
        .btn {
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-primary {
            background-color: #007bff;
            color: white;
        }
        .btn-success {
            background-color: #28a745;
            color: white;
        }
        .btn-danger {
            background-color: #dc3545;
            color: white;
        }
        .btn-warning {
            background-color: #ffc107;
            color: #212529;
        }
        .btn-info {
            background-color: #17a2b8;
            color: white;
        }
        .add-new {
            margin-bottom: 20px;
            text-align: left;
        }
        .status-active {
            color: #28a745;
            font-weight: bold;
        }
        .status-inactive {
            color: #dc3545;
            font-weight: bold;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 300px;
            border-radius: 5px;
        }
        .modal-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>إدارة مزودي الخدمة</h1>
        
        <?php if ($success): ?>
        <div class="alert alert-success">
            <?php echo $success; ?>
        </div>
        <?php endif; ?>
        
        <?php if ($error): ?>
        <div class="alert alert-danger">
            <?php echo $error; ?>
        </div>
        <?php endif; ?>
        
        <div class="add-new">
            <a href="addProvider.php" class="btn btn-primary">إضافة مزود جديد</a>
        </div>
        
        <?php if (empty($providers)): ?>
        <p>لا يوجد مزودي خدمة حالياً.</p>
        <?php else: ?>
        <table>
            <thead>
                <tr>
                    <th>المعرف</th>
                    <th>الاسم</th>
                    <th>عنوان API</th>
                    <th>الحالة</th>
                    <th>تاريخ الإضافة</th>
                    <th>آخر تحديث</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($providers as $provider): ?>
                <tr>
                    <td><?php echo htmlspecialchars($provider['id']); ?></td>
                    <td><?php echo htmlspecialchars($provider['name']); ?></td>

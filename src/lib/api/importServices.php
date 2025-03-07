<?php
include 'dbConnection.php';
include 'serviceManager.php';

$serviceManager = new ServiceManager($db);

// Fetch all services
$allServices = $serviceManager->getAllServices();
echo "All Services: ";
print_r($allServices);

// Fetch balances
$balances = $serviceManager->getBalances();
echo "Balances: ";
print_r($balances);
?>
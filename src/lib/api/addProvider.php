<?php
include 'dbConnection.php'; // File for database connection
include 'serviceProviders.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $api_url = $_POST['api_url'];
    $api_key = $_POST['api_key'];

    $serviceProviders = new ServiceProviders($db);
    $serviceProviders->addProvider($name, $api_url, $api_key);

    echo "Provider added successfully!";
}
?>

<form method="POST">
    <label>Service Name: </label>
    <input type="text" name="name" required><br>
    <label>API URL: </label>
    <input type="text" name="api_url" required><br>
    <label>API Key: </label>
    <input type="text" name="api_key" required><br>
    <button type="submit">Add Provider</button>
</form>
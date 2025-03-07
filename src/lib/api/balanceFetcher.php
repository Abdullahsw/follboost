<?php
$api_url = 'https://smmstone.com/api/v2';
$api_key = '4df4da01af90be38e69b0f516a1d3b87';

// Function to make API requests
function connect($url, $data)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error = 'cURL Error: ' . curl_error($ch);
        curl_close($ch);
        return $error;
    }

    curl_close($ch);
    return $response;
}

// Test connection
echo "Testing connection...\n";
$response = connect($api_url, ['key' => $api_key, 'action' => 'balance']);
if (strpos($response, 'cURL Error') !== false) {
    die("Connection failed: $response\n");
} else {
    echo "Connection successful!\n";
}

// Fetch balance
echo "Fetching balance...\n";
$balance_response = connect($api_url, ['key' => $api_key, 'action' => 'balance']);
$balance_data = json_decode($balance_response, true);
if (isset($balance_data['balance'])) {
    echo "Balance: " . $balance_data['balance'] . "\n";
} else {
    echo "Error fetching balance: " . $balance_response . "\n";
}

// Fetch services
echo "Fetching services...\n";
$services_response = connect($api_url, ['key' => $api_key, 'action' => 'services']);
$services_data = json_decode($services_response, true);
if (is_array($services_data)) {
    echo "Services fetched successfully!\n";
    print_r($services_data);
} else {
    echo "Error fetching services: " . $services_response . "\n";
}
?>
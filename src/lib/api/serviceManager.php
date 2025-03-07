<?php
include 'serviceProviders.php';
include 'apiHandler.php';

class ServiceManager
{
    private $providers;

    public function __construct($db)
    {
        $serviceProviders = new ServiceProviders($db);
        $this->providers = $serviceProviders->getAllProviders();
    }

    public function getAllServices()
    {
        $allServices = [];
        foreach ($this->providers as $provider) {
            $api = new ApiHandler($provider['api_url'], $provider['api_key']);
            $services = $api->request('services');
            $allServices[$provider['name']] = $services;
        }
        return $allServices;
    }

    public function getBalances()
    {
        $balances = [];
        foreach ($this->providers as $provider) {
            $api = new ApiHandler($provider['api_url'], $provider['api_key']);
            $balance = $api->request('balance');
            $balances[$provider['name']] = $balance;
        }
        return $balances;
    }
}
?>
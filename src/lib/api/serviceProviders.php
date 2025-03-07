<?php
class ServiceProviders
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getAllProviders()
    {
        $query = "SELECT * FROM service_providers";
        $result = $this->db->query($query);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function addProvider($name, $api_url, $api_key)
    {
        $query = "INSERT INTO service_providers (name, api_url, api_key) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("sss", $name, $api_url, $api_key);
        $stmt->execute();
    }
}
?>
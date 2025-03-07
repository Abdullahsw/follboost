<?php
class ApiHandler
{
    private $api_url;
    private $api_key;

    public function __construct($api_url, $api_key)
    {
        $this->api_url = $api_url;
        $this->api_key = $api_key;
    }

    private function connect($post)
    {
        $_post = [];
        foreach ($post as $name => $value) {
            $_post[] = $name . '=' . urlencode($value);
        }

        $ch = curl_init($this->api_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, join('&', $_post));
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

    public function request($action, $data = [])
    {
        $post = array_merge(['key' => $this->api_key, 'action' => $action], $data);
        return json_decode($this->connect($post), true);
    }
}
?>
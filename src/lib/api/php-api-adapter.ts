/**
 * PHP API Adapter
 * This adapter translates between the React frontend and PHP-based SMM panel APIs
 */

import axios from "axios";

export interface PhpApiResponse {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

export class PhpApiAdapter {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Connect to the PHP API
   * This method mimics the PHP cURL implementation commonly used in SMM panels
   * Updated to handle different API formats including smmstone.com
   */
  /**
   * Connect to the PHP API
   * Implementation of the improved PHP sendRequest function:
   *
   * private function sendRequest($data)
   * {
   *     $data['key'] = $this->api_key; // Add the API key to the request data
   *     $query = http_build_query($data); // Convert data to query string format
   *
   *     $curl = curl_init($this->api_url); // Initialize cURL
   *     curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   *     curl_setopt($curl, CURLOPT_POST, true);
   *     curl_setopt($curl, CURLOPT_POSTFIELDS, $query);
   *     curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification
   *     curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
   *
   *     $response = curl_exec($curl);
   *
   *     // Check for cURL errors
   *     if (curl_errno($curl)) {
   *         return 'cURL Error: ' . curl_error($curl);
   *     }
   *
   *     curl_close($curl);
   *
   *     // Decode and return the API response
   *     return json_decode($response, true);
   * }
   */
  public async connect(params: Record<string, any>): Promise<PhpApiResponse> {
    try {
      console.log(`Making PHP API request to ${this.apiUrl}`, params);

      // Add the API key to the request data (like $data['key'] = $this->api_key)
      const requestParams = {
        key: this.apiKey,
        ...params,
      };

      // Convert data to query string format (like http_build_query($data))
      const formData = new URLSearchParams();
      Object.entries(requestParams).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      const query = formData.toString();

      // Special handling for smmstone.com which requires GET requests
      if (this.apiUrl.includes("smmstone.com")) {
        console.log("Detected smmstone.com API, using GET request...");
        try {
          // Try multiple endpoint variations for smmstone.com
          const endpoints = [
            this.apiUrl,
            this.apiUrl.replace("/api/v2", "/api/v1"),
            this.apiUrl.replace("/api/v1", "/api/v2"),
            this.apiUrl.replace("/api", "/api/v2"),
            this.apiUrl.includes("/api")
              ? this.apiUrl
              : `${this.apiUrl}/api/v2`,
          ];

          let response;
          let successEndpoint = null;

          // Try each endpoint until one works
          for (const endpoint of endpoints) {
            try {
              console.log(`Trying smmstone.com endpoint: ${endpoint}`);
              response = await axios.get(`${endpoint}?${query}`, {
                headers: {
                  "User-Agent": "FollBoost/1.0",
                  Accept: "application/json",
                },
                timeout: 30000,
                // Disable SSL verification
                httpsAgent: new (require("https").Agent)({
                  rejectUnauthorized: false,
                }),
              });

              // If we got here, the request succeeded
              successEndpoint = endpoint;
              console.log(`Successful connection to endpoint: ${endpoint}`);
              break;
            } catch (endpointError) {
              console.log(
                `Failed to connect to endpoint ${endpoint}: ${endpointError.message}`,
              );
              // Continue to next endpoint
            }
          }

          if (!response) {
            throw new Error("All smmstone.com endpoints failed");
          }

          console.log(
            `PHP API response received from ${successEndpoint}:`,
            response.data,
          );

          // Special handling for smmstone.com response
          // Sometimes the response is a string that needs to be parsed
          if (typeof response.data === "string") {
            try {
              // Try to parse the response as JSON
              const parsedData = JSON.parse(response.data);
              return parsedData;
            } catch (parseError) {
              console.error("Error parsing smmstone.com response:", parseError);
              // If parsing fails, return an object with the raw string to maintain expected structure
              return {
                data: response.data,
                success: true, // Mark as success to allow further processing
                message: "Raw response received",
              };
            }
          }

          return response.data;
        } catch (error) {
          throw error; // Let the main error handler deal with it
        }
      }

      // Standard POST request for other providers (like curl_setopt($curl, CURLOPT_POST, true))
      try {
        const response = await axios.post(this.apiUrl, query, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "FollBoost/1.0",
          },
          timeout: 30000,
          // Disable SSL verification
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        });

        console.log(`PHP API response received:`, response.data);
        return response.data;
      } catch (postError) {
        // If POST fails, try GET as fallback (some APIs accept both methods)
        console.log("POST request failed, trying GET as fallback...");
        const response = await axios.get(`${this.apiUrl}?${query}`, {
          headers: {
            "User-Agent": "FollBoost/1.0",
            Accept: "application/json",
          },
          timeout: 30000,
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        });

        console.log(`PHP API response received:`, response.data);
        return response.data;
      }
    } catch (error) {
      console.error("PHP API request failed:", error);

      // Check for cURL-like errors
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          return {
            success: false,
            error: `cURL Error: Connection refused. Please check if the API URL is correct and the server is running.`,
          };
        } else if (
          error.code === "ETIMEDOUT" ||
          error.code === "ECONNABORTED"
        ) {
          return {
            success: false,
            error: `cURL Error: Connection timed out. The API server is taking too long to respond.`,
          };
        } else if (error.response) {
          console.error(
            `PHP API error details: Status ${error.response.status}`,
            error.response.data,
          );
          return {
            success: false,
            error: `Request failed with status ${error.response.status}: ${error.response.statusText}`,
          };
        } else if (error.request) {
          return {
            success: false,
            error: `cURL Error: No response received from the server.`,
          };
        }
      }

      // Generic error fallback
      return {
        success: false,
        error: `cURL Error: ${error.message || "Unknown error"}`,
      };
    }
  }

  /**
   * Get services list from PHP API
   * Implements the PHP fetchServices function:
   * public function fetchServices()
   * {
   *     $response = $this->sendRequest([
   *         'key' => $this->api_key,
   *         'action' => 'services'
   *     ]);
   *
   *     if (isset($response['error'])) {
   *         return 'Error: ' . $response['error'];
   *     }
   *
   *     if (empty($response)) {
   *         return 'Error: No response received from the API.';
   *     }
   *
   *     return 'Services: ' . json_encode($response);
   * }
   */
  public async getServices(): Promise<PhpApiResponse> {
    const response = await this.connect({
      action: "services",
    });

    // Handle PHP-style response format
    if (response && !response.error) {
      // If the response is already in the expected format, return it directly
      if (
        Array.isArray(response) ||
        (typeof response === "object" && Object.keys(response).length > 0)
      ) {
        return response;
      }

      // Format the response to match the PHP function's format
      return {
        data: `Services: ${JSON.stringify(response)}`,
        success: true,
      };
    }

    return response;
  }

  /**
   * Get account balance from PHP API
   * Implements the PHP fetchBalance function:
   * public function fetchBalance()
   * {
   *     $response = $this->sendRequest([
   *         'key' => $this->api_key,
   *         'action' => 'balance'
   *     ]);
   *
   *     if (isset($response['error'])) {
   *         return 'Error: ' . $response['error'];
   *     }
   *
   *     if (empty($response)) {
   *         return 'Error: No response received from the API.';
   *     }
   *
   *     return 'Balance: ' . json_encode($response);
   * }
   */
  public async getBalance(): Promise<PhpApiResponse> {
    const response = await this.connect({
      action: "balance",
    });

    // Handle PHP-style response format
    if (response && !response.error) {
      // If the response is already in the expected format, return it directly
      if (
        response.balance !== undefined ||
        (typeof response === "object" && Object.keys(response).length > 0)
      ) {
        return {
          data: `Balance: ${JSON.stringify(response)}`,
          success: true,
        };
      }
    }

    return response;
  }

  /**
   * Add order through PHP API
   * Implements the PHP placeOrder function:
   * public function placeOrder($orderData)
   * {
   *     return $this->sendRequest(array_merge(['action' => 'add'], $orderData));
   * }
   */
  public async addOrder(
    service: string | number,
    link: string,
    quantity: number,
    comments?: string,
    runs?: number,
    interval?: number,
  ): Promise<PhpApiResponse> {
    const params: Record<string, any> = {
      action: "add",
      service,
      link,
      quantity,
    };

    // Add optional parameters if provided
    if (comments) params.comments = comments;
    if (runs) params.runs = runs;
    if (interval) params.interval = interval;

    console.log(`Sending order request to API: ${JSON.stringify(params)}`);
    return this.connect(params);
  }

  /**
   * Check order status through PHP API
   */
  public async getOrderStatus(
    orderId: string | number,
  ): Promise<PhpApiResponse> {
    return this.connect({
      action: "status",
      order: orderId,
    });
  }
}

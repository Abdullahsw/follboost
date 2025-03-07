/**
 * API Connection Tester
 * Implements the PHP testApiConnection function to verify connectivity
 */

import axios from "axios";

export interface ApiConnectionResult {
  success: boolean;
  message: string;
  rawResponse?: any;
}

export class ApiConnectionTester {
  /**
   * Test API connection
   * Implementation of PHP function:
   * public function testApiConnection()
   * {
   *     $testData = [
   *         'key' => $this->api_key,
   *         'action' => 'services'
   *     ];
   *
   *     $response = $this->sendRequest($testData);
   *
   *     if (isset($response['error'])) {
   *         return 'Error: ' . $response['error'];
   *     }
   *
   *     if (empty($response)) {
   *         return 'Error: No response received from the API. Please check the URL and network settings.';
   *     }
   *
   *     return 'Connection successful. Services fetched: ' . json_encode($response);
   * }
   */
  public static async testApiConnection(
    url: string,
    apiKey: string,
  ): Promise<ApiConnectionResult> {
    try {
      console.log(
        `Testing API connection to ${url} with key ${apiKey.substring(0, 5)}...`,
      );

      // Prepare test data
      const testData = {
        key: apiKey,
        action: "services",
      };

      // Convert to form data (as in PHP)
      const formData = new URLSearchParams();
      Object.entries(testData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Make the request
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "FollBoost/1.0",
        },
        timeout: 15000, // 15 seconds timeout
      });

      console.log("API response:", response.data);

      // Check for error in response
      if (response.data && response.data.error) {
        return {
          success: false,
          message: `Error: ${response.data.error}`,
          rawResponse: response.data,
        };
      }

      // Check for empty response
      if (
        !response.data ||
        (typeof response.data === "object" &&
          Object.keys(response.data).length === 0)
      ) {
        return {
          success: false,
          message:
            "Error: No response received from the API. Please check the URL and network settings.",
          rawResponse: response.data,
        };
      }

      // Success case
      return {
        success: true,
        message: `Connection successful. Services fetched: ${JSON.stringify(response.data).substring(0, 100)}...`,
        rawResponse: response.data,
      };
    } catch (error) {
      console.error("API connection test failed:", error);

      let errorMessage = "Unknown error occurred";

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          errorMessage =
            "Connection refused. Please check if the API URL is correct and the server is running.";
        } else if (
          error.code === "ETIMEDOUT" ||
          error.code === "ECONNABORTED"
        ) {
          errorMessage =
            "Connection timed out. The API server is taking too long to respond.";
        } else if (error.response) {
          errorMessage = `API request failed with status ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          errorMessage = "No response received from the API server.";
        } else {
          errorMessage = error.message || "Unknown error occurred";
        }
      } else {
        errorMessage = error.message || "Unknown error occurred";
      }

      return {
        success: false,
        message: `Error: ${errorMessage}`,
        rawResponse: null,
      };
    }
  }

  /**
   * Try multiple API formats for smmstone.com
   * Some SMM providers have specific requirements
   */
  public static async testSmmStoneConnection(
    apiKey: string,
  ): Promise<ApiConnectionResult> {
    // Known working formats for smmstone.com
    const formats = [
      { url: "https://smmstone.com/api/v2", method: "POST", format: "form" },
      { url: "https://smmstone.com/api/v2", method: "GET", format: "query" },
      { url: "https://smmstone.com/api/v1", method: "POST", format: "form" },
      {
        url: "https://panel.smmstone.com/api/v2",
        method: "POST",
        format: "form",
      },
    ];

    let lastError = null;

    // Try each format
    for (const format of formats) {
      try {
        console.log(
          `Trying ${format.method} request to ${format.url} with ${format.format} format...`,
        );

        const testData = {
          key: apiKey,
          action: "services",
        };

        let response;

        if (format.method === "POST" && format.format === "form") {
          // Form data POST request
          const formData = new URLSearchParams();
          Object.entries(testData).forEach(([key, value]) => {
            formData.append(key, String(value));
          });

          response = await axios.post(format.url, formData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "FollBoost/1.0",
            },
            timeout: 10000,
          });
        } else if (format.method === "POST" && format.format === "json") {
          // JSON POST request
          response = await axios.post(format.url, testData, {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "FollBoost/1.0",
            },
            timeout: 10000,
          });
        } else if (format.method === "GET" && format.format === "query") {
          // GET request with query parameters
          const queryParams = new URLSearchParams(testData).toString();
          response = await axios.get(`${format.url}?${queryParams}`, {
            headers: {
              "User-Agent": "FollBoost/1.0",
            },
            timeout: 10000,
          });
        }

        console.log("Response received:", response.data);

        // Check if response is valid
        if (response.data && !response.data.error) {
          return {
            success: true,
            message: `Connection successful using ${format.method} to ${format.url}. Services fetched.`,
            rawResponse: response.data,
          };
        } else if (response.data && response.data.error) {
          lastError = response.data.error;
          console.log(`Error from API: ${response.data.error}`);
        }
      } catch (error) {
        console.error(
          `Failed with format ${format.url} (${format.method}):`,
          error.message,
        );
        lastError = error.message;
      }
    }

    // If all formats failed
    return {
      success: false,
      message: `All connection attempts failed. Last error: ${lastError}`,
      rawResponse: null,
    };
  }
}

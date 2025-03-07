/**
 * Direct Network Test
 * Direct implementation of the PHP curl test for network connectivity
 */

import axios from "axios";

export interface DirectTestResult {
  success: boolean;
  message: string;
  response?: string;
}

export class DirectNetworkTest {
  /**
   * Test direct network connectivity to an API endpoint
   * Direct implementation of the PHP code:
   *
   * $api_url = 'https://smmstone.com/api/v2';
   *
   * $curl = curl_init($api_url);
   * curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   * curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification
   * curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
   *
   * $response = curl_exec($curl);
   *
   * if (curl_errno($curl)) {
   *     echo 'Network Error: ' . curl_error($curl);
   * } else {
   *     echo 'Connection Successful. Response: ' . $response;
   * }
   *
   * curl_close($curl);
   */
  public static async testDirectConnection(
    url: string,
  ): Promise<DirectTestResult> {
    try {
      console.log(`Testing direct network connectivity to ${url}`);

      // Try multiple request methods and configurations
      let response;

      try {
        // First try GET request
        response = await axios.get(url, {
          // Disable SSL verification (CURLOPT_SSL_VERIFYPEER, CURLOPT_SSL_VERIFYHOST)
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
          // Set timeout to 15 seconds
          timeout: 15000,
          // Don't follow redirects
          maxRedirects: 0,
          // Return raw response
          responseType: "text",
          // Set headers
          headers: {
            "User-Agent": "curl/7.68.0",
            Accept: "*/*",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
      } catch (getError) {
        console.log("GET request failed, trying HEAD request...");

        try {
          // Try HEAD request
          response = await axios.head(url, {
            httpsAgent: new (require("https").Agent)({
              rejectUnauthorized: false,
            }),
            timeout: 15000,
            maxRedirects: 0,
            headers: {
              "User-Agent": "curl/7.68.0",
              Accept: "*/*",
            },
          });

          // HEAD request succeeded but doesn't return body content
          return {
            success: true,
            message: "Connection Successful (HEAD request)",
            response: "HEAD request successful - no response body",
          };
        } catch (headError) {
          console.log("HEAD request failed, trying OPTIONS request...");

          try {
            // Try OPTIONS request
            response = await axios.options(url, {
              httpsAgent: new (require("https").Agent)({
                rejectUnauthorized: false,
              }),
              timeout: 15000,
              maxRedirects: 0,
              headers: {
                "User-Agent": "curl/7.68.0",
                Accept: "*/*",
              },
            });

            // OPTIONS request succeeded but doesn't return body content
            return {
              success: true,
              message: "Connection Successful (OPTIONS request)",
              response: "OPTIONS request successful - no response body",
            };
          } catch (optionsError) {
            // All request methods failed, throw the original error
            throw getError;
          }
        }
      }

      return {
        success: true,
        message: "Connection Successful",
        response: response.data.substring(0, 500), // Limit response size
      };
    } catch (error) {
      console.error("Direct network test failed:", error);

      // Format error similar to curl_error output
      let errorMessage = "Network Error: ";

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          errorMessage += "Connection refused";
        } else if (
          error.code === "ETIMEDOUT" ||
          error.code === "ECONNABORTED"
        ) {
          errorMessage += "Operation timed out";
        } else if (error.code === "ENOTFOUND") {
          errorMessage += "Could not resolve host";
        } else if (error.response) {
          // We got a response with an error status
          return {
            success: false,
            message: `Connection made but server returned error status: ${error.response.status}`,
            response: error.response.data?.substring(0, 500),
          };
        } else {
          errorMessage += error.message || "Unknown error";
        }
      } else {
        errorMessage += error.message || "Unknown error";
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Test direct network connectivity to smmstone.com API
   */
  public static async testSmmStoneDirectConnection(): Promise<DirectTestResult> {
    return this.testDirectConnection("https://smmstone.com/api/v2");
  }
}

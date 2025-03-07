/**
 * API Key Verifier
 * Direct implementation of the PHP code to verify API key and URL
 */

import axios from "axios";

export interface ApiKeyVerificationResult {
  success: boolean;
  message: string;
  response?: any;
}

export class ApiKeyVerifier {
  /**
   * Verify API key and URL
   * Direct implementation of the PHP code:
   *
   * $api_url = 'https://smmstone.com/api/v2';
   * $api_key = '4df4da01af90be38e69b0f516a1d3b87';
   *
   * $data = [
   *     'key' => $api_key,
   *     'action' => 'services'
   * ];
   *
   * $curl = curl_init($api_url);
   * curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
   * curl_setopt($curl, CURLOPT_POST, true);
   * curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
   * curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
   * curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
   *
   * $response = curl_exec($curl);
   *
   * if (curl_errno($curl)) {
   *     echo 'API Error: ' . curl_error($curl);
   * } else {
   *     echo 'API Connection Successful. Response: ' . $response;
   * }
   *
   * curl_close($curl);
   */
  public static async verifyApiKey(
    url: string,
    apiKey: string,
  ): Promise<ApiKeyVerificationResult> {
    try {
      console.log(`Verifying API key for ${url}`);

      // Prepare data (equivalent to $data in PHP)
      const data = {
        key: apiKey,
        action: "services",
      };

      // Convert to form data (equivalent to http_build_query($data) in PHP)
      const formData = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Try POST request first (as in the PHP code)
      try {
        console.log("Attempting POST request with form data...");
        const response = await axios.post(url, formData.toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "curl/7.68.0",
          },
          // Disable SSL verification (CURLOPT_SSL_VERIFYPEER, CURLOPT_SSL_VERIFYHOST)
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
          timeout: 15000,
        });

        console.log("POST request successful, response:", response.data);
        return {
          success: true,
          message: "API Connection Successful",
          response: response.data,
        };
      } catch (postError) {
        console.log(
          "POST request failed, trying GET request...",
          postError.message,
        );

        // If POST fails, try GET (some APIs like smmstone.com prefer GET)
        const response = await axios.get(`${url}?${formData.toString()}`, {
          headers: {
            "User-Agent": "curl/7.68.0",
          },
          // Disable SSL verification
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
          timeout: 15000,
        });

        console.log("GET request successful, response:", response.data);
        return {
          success: true,
          message: "API Connection Successful (via GET)",
          response: response.data,
        };
      }
    } catch (error) {
      console.error("API key verification failed:", error);

      // Format error similar to curl_error output
      let errorMessage = "API Error: ";

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
          errorMessage += `Server returned error status: ${error.response.status}`;

          // Check if we got a response body that might contain error details
          if (error.response.data) {
            return {
              success: false,
              message: errorMessage,
              response: error.response.data,
            };
          }
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
   * Verify smmstone.com API key
   */
  public static async verifySmmStoneApiKey(
    apiKey: string,
  ): Promise<ApiKeyVerificationResult> {
    return this.verifyApiKey("https://smmstone.com/api/v2", apiKey);
  }
}

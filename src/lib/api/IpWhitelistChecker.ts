/**
 * IP Whitelist Checker
 * Verifies if the server's IP is whitelisted with the SMM provider
 */

import axios from "axios";

export interface IpCheckResult {
  success: boolean;
  message: string;
  serverIp?: string;
  isWhitelisted?: boolean;
  curlEnabled?: boolean;
  httpsEnabled?: boolean;
  details?: string;
}

export class IpWhitelistChecker {
  /**
   * Check if the current server's IP is whitelisted
   */
  public static async checkIpWhitelisting(
    apiUrl: string,
    apiKey: string,
  ): Promise<IpCheckResult> {
    try {
      // Step 1: Get server's IP address
      const serverIp = await this.getServerIp();
      if (!serverIp) {
        return {
          success: false,
          message: "Could not determine server IP address",
        };
      }

      console.log(`Server IP address: ${serverIp}`);

      // Step 2: Check if IP is whitelisted by making an API request
      const isWhitelisted = await this.testApiAccess(apiUrl, apiKey);

      // Step 3: Check if cURL is enabled
      const curlEnabled = await this.checkCurlSupport();

      // Step 4: Check if HTTPS is enabled
      const httpsEnabled = await this.checkHttpsSupport();

      if (isWhitelisted && curlEnabled && httpsEnabled) {
        return {
          success: true,
          message:
            "Server IP is whitelisted and all required settings are enabled",
          serverIp,
          isWhitelisted: true,
          curlEnabled: true,
          httpsEnabled: true,
        };
      } else {
        let details = [];
        if (!isWhitelisted) details.push("IP is not whitelisted");
        if (!curlEnabled) details.push("cURL support is not enabled");
        if (!httpsEnabled) details.push("HTTPS support is not enabled");

        return {
          success: false,
          message: "Server configuration issues detected",
          serverIp,
          isWhitelisted,
          curlEnabled,
          httpsEnabled,
          details: details.join(", "),
        };
      }
    } catch (error) {
      console.error("IP whitelist check failed:", error);
      return {
        success: false,
        message: `IP whitelist check failed: ${error.message}`,
      };
    }
  }

  /**
   * Get the server's public IP address
   */
  private static async getServerIp(): Promise<string | null> {
    try {
      // Use a public IP echo service
      const response = await axios.get("https://api.ipify.org?format=json", {
        timeout: 5000,
      });

      if (response.data && response.data.ip) {
        return response.data.ip;
      }

      return null;
    } catch (error) {
      console.error("Failed to get server IP:", error);
      return null;
    }
  }

  /**
   * Test if the API can be accessed (indicating IP is whitelisted)
   */
  private static async testApiAccess(
    apiUrl: string,
    apiKey: string,
  ): Promise<boolean> {
    try {
      // Prepare data
      const formData = new URLSearchParams();
      formData.append("key", apiKey);
      formData.append("action", "balance");

      // Try GET request first for smmstone.com
      if (apiUrl.includes("smmstone.com")) {
        try {
          const response = await axios.get(`${apiUrl}?${formData.toString()}`, {
            headers: { "User-Agent": "FollBoost/1.0" },
            timeout: 10000,
            httpsAgent: new (require("https").Agent)({
              rejectUnauthorized: false,
            }),
          });

          // If we get a response without error, IP is likely whitelisted
          return !response.data.error;
        } catch (error) {
          // Check if error is due to IP restriction
          if (axios.isAxiosError(error) && error.response) {
            if (
              error.response.status === 403 ||
              error.response.status === 401
            ) {
              console.log("IP restriction detected from response status");
              return false;
            }

            // Check for specific error messages in response
            if (
              error.response.data &&
              typeof error.response.data === "string"
            ) {
              const responseText = error.response.data.toLowerCase();
              if (
                responseText.includes("ip") &&
                (responseText.includes("not allowed") ||
                  responseText.includes("whitelist") ||
                  responseText.includes("blocked"))
              ) {
                console.log("IP restriction detected from response text");
                return false;
              }
            }
          }

          // If error is not clearly IP-related, try POST method
          console.log("GET request failed, trying POST...");
        }
      }

      // Try POST request
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "FollBoost/1.0",
        },
        timeout: 10000,
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
      });

      // If we get a response without error, IP is likely whitelisted
      return !response.data.error;
    } catch (error) {
      // Check if error is due to IP restriction
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403 || error.response.status === 401) {
          console.log("IP restriction detected from response status");
          return false;
        }

        // Check for specific error messages in response
        if (error.response.data && typeof error.response.data === "string") {
          const responseText = error.response.data.toLowerCase();
          if (
            responseText.includes("ip") &&
            (responseText.includes("not allowed") ||
              responseText.includes("whitelist") ||
              responseText.includes("blocked"))
          ) {
            console.log("IP restriction detected from response text");
            return false;
          }
        }
      }

      console.error("API access test failed:", error);
      return false;
    }
  }

  /**
   * Check if cURL support is enabled
   */
  private static async checkCurlSupport(): Promise<boolean> {
    try {
      // Make a simple request to test HTTP client capabilities
      await axios.get("https://httpbin.org/get", {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error("cURL support check failed:", error);
      return false;
    }
  }

  /**
   * Check if HTTPS support is enabled
   */
  private static async checkHttpsSupport(): Promise<boolean> {
    try {
      // Make a request to an HTTPS endpoint
      await axios.get("https://www.google.com", {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error("HTTPS support check failed:", error);
      return false;
    }
  }

  /**
   * Get instructions for whitelisting IP
   */
  public static getWhitelistInstructions(serverIp: string): string[] {
    return [
      `1. قم بتسجيل الدخول إلى حساب مزود خدمة SMM الخاص بك.`,
      `2. انتقل إلى إعدادات API أو قسم الأمان.`,
      `3. أضف عنوان IP الخاص بالخادم (${serverIp}) إلى القائمة البيضاء.`,
      `4. احفظ التغييرات واختبر الاتصال مرة أخرى.`,
    ];
  }
}

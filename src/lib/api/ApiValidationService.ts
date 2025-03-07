/**
 * API Validation Service
 * Handles comprehensive validation of API connections
 */

import axios from "axios";
import { serviceProviderManager } from "./ServiceProviderManager";

export interface ValidationResult {
  success: boolean;
  message: string;
  details: {
    urlReachable: boolean;
    apiKeyValid: boolean;
    ipAllowed: boolean;
    curlSupport: boolean;
    httpsSupport: boolean;
    errors?: string[];
  };
}

export class ApiValidationService {
  /**
   * Comprehensive validation of API connection
   */
  public static async validateApiConnection(
    url: string,
    apiKey: string,
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const details = {
      urlReachable: false,
      apiKeyValid: false,
      ipAllowed: true, // Assume true until proven otherwise
      curlSupport: true, // Assume true until proven otherwise
      httpsSupport: true, // Assume true until proven otherwise
      errors: [],
    };

    try {
      console.log(`Validating API connection to ${url}`);

      // Step 1: Check if URL is reachable with improved error handling
      try {
        // Simple HEAD request to check if the domain is reachable
        // Use longer timeout and disable SSL verification to improve success rate
        await axios.head(url, {
          timeout: 10000,
          headers: { "User-Agent": "FollBoost/1.0" },
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        });
        details.urlReachable = true;
        console.log(`URL ${url} is reachable`);
      } catch (error) {
        // Try GET request as fallback - some APIs block HEAD requests
        try {
          console.log(`HEAD request failed, trying GET request as fallback...`);
          await axios.get(`${url}?action=balance&key=test`, {
            timeout: 10000,
            headers: { "User-Agent": "FollBoost/1.0" },
            httpsAgent: new (require("https").Agent)({
              rejectUnauthorized: false,
            }),
          });
          details.urlReachable = true;
          console.log(`URL ${url} is reachable via GET request`);
        } catch (getError) {
          // Both HEAD and GET failed
          details.urlReachable = false;

          // Provide more specific error message based on error type
          let errorMessage = "";
          if (axios.isAxiosError(getError)) {
            if (getError.code === "ENOTFOUND") {
              errorMessage = `DNS resolution failed. The domain may not exist.`;
            } else if (getError.code === "ECONNREFUSED") {
              errorMessage = `Connection refused. The server may be down or blocking connections.`;
            } else if (
              getError.code === "ETIMEDOUT" ||
              getError.code === "ECONNABORTED"
            ) {
              errorMessage = `Connection timed out. The server might be slow or unreachable.`;
            } else if (getError.response) {
              // We got a response, so the URL is actually reachable
              details.urlReachable = true;
              errorMessage = `Received error response ${getError.response.status}, but URL is reachable.`;
              console.log(
                `URL ${url} is reachable but returned error status ${getError.response.status}`,
              );
            } else {
              errorMessage = getError.message;
            }
          } else {
            errorMessage = getError.message;
          }

          if (!details.urlReachable) {
            errors.push(`URL is not reachable: ${errorMessage}`);
            console.error(`URL ${url} is not reachable:`, errorMessage);
          }
        }
      }

      // Step 2: Validate API key
      if (details.urlReachable) {
        try {
          // Try to make a simple API request that requires authentication
          const formData = new URLSearchParams();
          formData.append("key", apiKey);
          formData.append("action", "balance");

          // Special handling for smmstone.com which requires GET requests
          let response;
          if (url.includes("smmstone.com")) {
            response = await axios.get(`${url}?${formData.toString()}`, {
              headers: { "User-Agent": "FollBoost/1.0" },
              timeout: 10000,
              httpsAgent: new (require("https").Agent)({
                rejectUnauthorized: false,
              }),
            });
          } else {
            response = await axios.post(url, formData, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "FollBoost/1.0",
              },
              timeout: 10000,
              httpsAgent: new (require("https").Agent)({
                rejectUnauthorized: false,
              }),
            });
          }

          // Check if response indicates API key is valid
          if (response.data && !response.data.error) {
            details.apiKeyValid = true;
            console.log("API key is valid");
          } else {
            details.apiKeyValid = false;
            const errorMsg =
              response.data?.error || "Invalid API key or unauthorized access";
            errors.push(`API key validation failed: ${errorMsg}`);
            console.error("API key validation failed:", errorMsg);
          }
        } catch (error) {
          // Check if error suggests IP restriction
          if (
            error.response &&
            (error.response.status === 403 || error.response.status === 401)
          ) {
            details.apiKeyValid = false;
            details.ipAllowed = false;
            errors.push(
              "IP address may be restricted. Check IP whitelist settings in the API provider panel.",
            );
            console.error("Possible IP restriction detected:", error.message);
          } else {
            details.apiKeyValid = false;
            errors.push(`API key validation failed: ${error.message}`);
            console.error("API key validation failed:", error.message);
          }
        }
      }

      // Step 3: Check HTTPS support
      if (url.startsWith("https://")) {
        try {
          await axios.head(url, {
            timeout: 5000,
            httpsAgent: new (require("https").Agent)({
              rejectUnauthorized: true,
            }),
          });
          details.httpsSupport = true;
          console.log("HTTPS is properly supported");
        } catch (error) {
          if (
            error.code === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
            error.code === "ERR_TLS_CERT_ALTNAME_INVALID" ||
            error.code === "CERT_HAS_EXPIRED"
          ) {
            details.httpsSupport = false;
            errors.push(`HTTPS certificate issue: ${error.message}`);
            console.error("HTTPS certificate issue:", error.message);
          }
        }
      }

      // Step 4: Check cURL support (indirectly through axios capabilities)
      // This is more of a client-side check since we're using axios which abstracts cURL
      try {
        const testRequest = await axios.get("https://httpbin.org/get", {
          timeout: 5000,
        });
        if (testRequest.status === 200) {
          details.curlSupport = true;
          console.log("HTTP request capabilities are working properly");
        }
      } catch (error) {
        details.curlSupport = false;
        errors.push(`HTTP request test failed: ${error.message}`);
        console.error("HTTP request test failed:", error.message);
      }

      // Determine overall success
      const success =
        details.urlReachable && details.apiKeyValid && details.ipAllowed;
      details.errors = errors;

      return {
        success,
        message: success
          ? "API connection validated successfully"
          : `API validation failed: ${errors.join(", ")}`,
        details,
      };
    } catch (error) {
      console.error("API validation failed with unexpected error:", error);
      return {
        success: false,
        message: `API validation failed with unexpected error: ${error.message}`,
        details: {
          urlReachable: false,
          apiKeyValid: false,
          ipAllowed: false,
          curlSupport: false,
          httpsSupport: false,
          errors: [error.message],
        },
      };
    }
  }

  /**
   * Validate an existing provider
   */
  public static async validateProvider(
    providerId: string,
  ): Promise<ValidationResult> {
    const provider = serviceProviderManager.getProvider(providerId);
    if (!provider) {
      return {
        success: false,
        message: "Provider not found",
        details: {
          urlReachable: false,
          apiKeyValid: false,
          ipAllowed: false,
          curlSupport: false,
          httpsSupport: false,
          errors: ["Provider not found"],
        },
      };
    }

    return this.validateApiConnection(provider.url, provider.apiKey);
  }
}

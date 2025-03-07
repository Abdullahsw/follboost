/**
 * API Network Tester
 * Handles network connectivity testing for API endpoints
 */

import axios from "axios";

export interface NetworkTestResult {
  success: boolean;
  message: string;
  details?: {
    dns?: boolean;
    connection?: boolean;
    timeout?: boolean;
    cors?: boolean;
    proxy?: boolean;
    ssl?: boolean;
  };
}

export class ApiNetworkTester {
  /**
   * Test network connectivity to an API endpoint
   */
  public static async testNetworkConnectivity(
    url: string,
  ): Promise<NetworkTestResult> {
    try {
      console.log(`Testing network connectivity to ${url}`);

      // Extract domain from URL for DNS check
      let domain = "";
      try {
        domain = new URL(url).hostname;
      } catch (e) {
        return {
          success: false,
          message: `Invalid URL format: ${url}`,
          details: {
            dns: false,
            connection: false,
          },
        };
      }

      // First try a simple HEAD request with longer timeout
      try {
        await axios.head(url, {
          timeout: 10000,
          headers: {
            "User-Agent": "FollBoost/1.0",
          },
          // Disable SSL verification
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        });

        return {
          success: true,
          message: `Successfully connected to ${url}`,
          details: {
            dns: true,
            connection: true,
            timeout: false,
            cors: false,
            ssl: true,
          },
        };
      } catch (error) {
        console.error(`Initial connection test failed:`, error);

        // Analyze the error
        const details = {
          dns: true, // Assume DNS is working unless proven otherwise
          connection: false,
          timeout: false,
          cors: false,
          proxy: false,
          ssl: true, // Assume SSL is working unless proven otherwise
        };

        let errorMessage = "";

        if (axios.isAxiosError(error)) {
          if (error.code === "ENOTFOUND") {
            details.dns = false;
            errorMessage = `DNS resolution failed for ${domain}. The domain may not exist or DNS servers might be unreachable.`;
          } else if (error.code === "ECONNREFUSED") {
            errorMessage = `Connection refused by ${domain}. The server may be down or blocking connections.`;
          } else if (
            error.code === "ETIMEDOUT" ||
            error.code === "ECONNABORTED"
          ) {
            details.timeout = true;
            errorMessage = `Connection timed out while trying to reach ${domain}. The server might be slow or unreachable.`;
          } else if (
            error.code === "CERT_HAS_EXPIRED" ||
            error.code === "DEPTH_ZERO_SELF_SIGNED_CERT"
          ) {
            details.ssl = false;
            errorMessage = `SSL certificate issue with ${domain}. The certificate may be invalid, self-signed, or expired.`;
          } else if (error.response) {
            // We got a response, so connection works
            details.connection = true;

            if (error.response.status === 403) {
              errorMessage = `Access forbidden (403) to ${url}. The server may be blocking requests from this IP address.`;
              details.proxy = true;
            } else if (error.response.status === 429) {
              errorMessage = `Too many requests (429) to ${url}. The server is rate limiting requests.`;
            } else {
              errorMessage = `Received error response ${error.response.status} from ${url}.`;
            }
          } else {
            errorMessage = `Network error: ${error.message}`;
          }
        } else {
          errorMessage = `Unknown error: ${error.message}`;
        }

        return {
          success: false,
          message: errorMessage,
          details,
        };
      }
    } catch (error) {
      console.error("Network test failed with unexpected error:", error);
      return {
        success: false,
        message: `Network test failed: ${error.message}`,
        details: {
          dns: false,
          connection: false,
        },
      };
    }
  }

  /**
   * Test if the API is accessible through a proxy
   */
  public static async testWithProxy(url: string): Promise<NetworkTestResult> {
    try {
      console.log(`Testing API access through proxy: ${url}`);

      // Use a CORS proxy to test if the API is accessible
      const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

      const response = await axios.get(corsProxyUrl, {
        timeout: 15000,
        headers: {
          "User-Agent": "FollBoost/1.0",
        },
      });

      if (response.status === 200) {
        return {
          success: true,
          message: `Successfully connected to ${url} through proxy`,
          details: {
            dns: true,
            connection: true,
            proxy: true,
          },
        };
      } else {
        return {
          success: false,
          message: `Proxy connection returned status ${response.status}`,
          details: {
            dns: true,
            connection: true,
            proxy: false,
          },
        };
      }
    } catch (error) {
      console.error("Proxy test failed:", error);
      return {
        success: false,
        message: `Proxy test failed: ${error.message}`,
        details: {
          proxy: false,
        },
      };
    }
  }

  /**
   * Get suggested fixes based on network test results
   */
  public static getSuggestedFixes(result: NetworkTestResult): string[] {
    const suggestions: string[] = [];

    if (!result.success) {
      if (result.details?.dns === false) {
        suggestions.push("تحقق من صحة اسم النطاق في عنوان API");
        suggestions.push(
          "تأكد من اتصال الإنترنت وإمكانية الوصول إلى خوادم DNS",
        );
      }

      if (result.details?.timeout === true) {
        suggestions.push("قد يكون الخادم بطيئًا، حاول زيادة مهلة الاتصال");
        suggestions.push("تحقق من سرعة الاتصال بالإنترنت");
      }

      if (result.details?.ssl === false) {
        suggestions.push("هناك مشكلة في شهادة SSL للخادم، تحقق من صحة الشهادة");
        suggestions.push(
          "حاول استخدام http:// بدلاً من https:// إذا كان ذلك ممكنًا",
        );
      }

      if (result.details?.proxy === true) {
        suggestions.push(
          "قد يكون الخادم يحظر طلبات API المباشرة، تحقق من إعدادات CORS",
        );
        suggestions.push(
          "تواصل مع مزود الخدمة للتأكد من السماح لعنوان IP الخاص بك",
        );
      }

      // General suggestions
      suggestions.push("تأكد من أن عنوان API صحيح ومكتوب بشكل صحيح");
      suggestions.push("تحقق من إمكانية الوصول إلى الخادم من خلال متصفح الويب");
      suggestions.push(
        "تأكد من عدم وجود جدار حماية أو برنامج أمان يمنع الاتصال",
      );
    }

    return suggestions;
  }
}

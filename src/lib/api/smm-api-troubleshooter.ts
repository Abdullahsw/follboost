/**
 * SMM API Troubleshooter
 * Helps diagnose and fix common API connection issues
 */

import axios from "axios";

export interface TroubleshootResult {
  success: boolean;
  message: string;
  details?: string;
  fixApplied?: boolean;
}

export class SmmApiTroubleshooter {
  /**
   * Test API connection with detailed diagnostics
   */
  public static async diagnoseConnection(
    url: string,
    apiKey: string,
  ): Promise<TroubleshootResult> {
    console.log(`Diagnosing API connection to ${url}`);

    try {
      // Check URL format
      if (!this.isValidUrl(url)) {
        const fixedUrl = this.fixApiUrl(url);
        return {
          success: false,
          message: "عنوان API غير صحيح",
          details: `The URL format is invalid. It should start with http:// or https://. Suggested fix: ${fixedUrl}`,
          fixApplied: true,
        };
      }

      // Try direct connection test
      const result = await this.testDirectConnection(url, apiKey);
      if (result.success) {
        return result;
      }

      // If direct test failed, try alternative formats
      return await this.tryAlternativeFormats(url, apiKey);
    } catch (error) {
      console.error("Diagnosis failed with error:", error);
      return {
        success: false,
        message: "فشل تشخيص الاتصال",
        details: error.message || "Unknown error during diagnosis",
      };
    }
  }

  /**
   * Check if URL is valid
   */
  private static isValidUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://");
  }

  /**
   * Fix common URL issues
   */
  private static fixApiUrl(url: string): string {
    // Add https:// if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }

    // Remove trailing slash if present
    if (url.endsWith("/")) {
      return url.slice(0, -1);
    }

    return url;
  }

  /**
   * Test direct connection to API
   */
  private static async testDirectConnection(
    url: string,
    apiKey: string,
  ): Promise<TroubleshootResult> {
    try {
      // Prepare request parameters
      const params = new URLSearchParams();
      params.append("key", apiKey);
      params.append("action", "balance");

      // Make request
      const response = await axios.post(url, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "FollBoost/1.0",
        },
        timeout: 10000,
      });

      // Check response
      if (
        response.data &&
        (response.data.balance !== undefined || response.data.success === true)
      ) {
        return {
          success: true,
          message: "تم الاتصال بنجاح",
          details: `Connection successful. Balance: ${response.data.balance || "N/A"}`,
        };
      }

      // If we got a response but not the expected format
      return {
        success: false,
        message: "تم الاتصال ولكن الاستجابة غير متوقعة",
        details: `Received response but in unexpected format: ${JSON.stringify(response.data)}`,
      };
    } catch (error) {
      console.log("Direct connection test failed:", error.message);
      return {
        success: false,
        message: "فشل اختبار الاتصال المباشر",
        details: error.message,
      };
    }
  }

  /**
   * Try alternative API formats
   */
  private static async tryAlternativeFormats(
    url: string,
    apiKey: string,
  ): Promise<TroubleshootResult> {
    // Common API endpoint variations
    const urlVariations = [
      url,
      `${url}/api/v2`,
      `${url}/api/v1`,
      `${url}/api`,
      url.replace("/api/v2", "/api/v1"),
      url.replace("/api/v1", "/api/v2"),
      url.replace("/api", "/api/v2"),
    ];

    // Common key parameter names
    const keyParams = [
      { key: "key", action: "balance" },
      { key: "api_key", action: "balance" },
      { key: "api_token", action: "balance" },
      { key: "key", action: "services" },
      { key: "key", action: "" },
    ];

    // Try each combination
    for (const testUrl of urlVariations) {
      for (const param of keyParams) {
        try {
          console.log(
            `Trying alternative format: ${testUrl} with param ${param.key}`,
          );

          // Prepare request
          const params = new URLSearchParams();
          params.append(param.key, apiKey);
          if (param.action) {
            params.append("action", param.action);
          }

          // Try POST request
          const response = await axios.post(testUrl, params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "FollBoost/1.0",
            },
            timeout: 5000,
          });

          // Check if response looks valid
          if (
            response.data &&
            (response.data.balance !== undefined ||
              response.data.success === true ||
              Array.isArray(response.data) ||
              (typeof response.data === "object" &&
                Object.keys(response.data).length > 0))
          ) {
            return {
              success: true,
              message: "تم الاتصال بنجاح باستخدام تنسيق بديل",
              details: `Connection successful using alternative format: ${testUrl} with param ${param.key}`,
              fixApplied: true,
            };
          }
        } catch (error) {
          // Continue to next variation
          console.log(
            `Alternative format failed: ${testUrl} with param ${param.key}`,
          );
        }
      }
    }

    // If all alternatives failed
    return {
      success: false,
      message: "فشل الاتصال بجميع التنسيقات المحتملة",
      details:
        "Tried multiple URL variations and parameter formats but none succeeded. Please verify your API credentials.",
    };
  }

  /**
   * Suggest fixes for common API issues
   */
  public static suggestFixes(url: string, apiKey: string): string[] {
    const suggestions = [];

    // URL suggestions
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      suggestions.push(`أضف https:// في بداية عنوان API: https://${url}`);
    }

    if (url.endsWith("/")) {
      suggestions.push(
        `قم بإزالة الشرطة (/) من نهاية عنوان API: ${url.slice(0, -1)}`,
      );
    }

    // Common API path suggestions
    if (!url.includes("/api")) {
      suggestions.push(`جرب إضافة /api إلى عنوان API: ${url}/api`);
    }

    if (!url.includes("/api/v")) {
      suggestions.push(`جرب إضافة /api/v2 إلى عنوان API: ${url}/api/v2`);
    }

    // API key suggestions
    if (apiKey.length < 10) {
      suggestions.push("مفتاح API قصير جدًا، تأكد من نسخه بالكامل");
    }

    if (apiKey.includes(" ")) {
      suggestions.push("مفتاح API يحتوي على مسافات، قم بإزالتها");
    }

    // General suggestions
    suggestions.push("تحقق من تفعيل API في لوحة تحكم مزود الخدمة");
    suggestions.push("تأكد من أن عنوان IP الخاص بك مسموح به في إعدادات API");

    return suggestions;
  }
}

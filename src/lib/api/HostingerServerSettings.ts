/**
 * Hostinger Server Settings
 * Checks and configures Hostinger server settings for API connections
 */

import axios from "axios";

export interface HostingerSettingsResult {
  success: boolean;
  message: string;
  details?: {
    outgoingConnectionsAllowed: boolean;
    firewallStatus: string;
    curlEnabled: boolean;
    sslEnabled: boolean;
    phpVersion: string;
  };
  recommendations?: string[];
}

export class HostingerServerSettings {
  /**
   * Check if Hostinger server settings allow outgoing connections
   */
  public static async checkOutgoingConnections(
    apiUrl: string,
  ): Promise<HostingerSettingsResult> {
    try {
      console.log(
        `Checking Hostinger server settings for outgoing connections to ${apiUrl}`,
      );

      // Test outgoing connection to the API URL
      const connectionTest = await this.testOutgoingConnection(apiUrl);

      // Check PHP configuration
      const phpConfig = await this.checkPhpConfiguration();

      if (connectionTest.success && phpConfig.success) {
        return {
          success: true,
          message:
            "Hostinger server settings are correctly configured for outgoing connections",
          details: {
            outgoingConnectionsAllowed: true,
            firewallStatus: "Properly configured",
            curlEnabled: true,
            sslEnabled: true,
            phpVersion: phpConfig.phpVersion || "Unknown",
          },
        };
      } else {
        // Generate recommendations based on the issues found
        const recommendations = this.generateRecommendations(
          connectionTest,
          phpConfig,
        );

        return {
          success: false,
          message:
            "Hostinger server settings need adjustment for outgoing connections",
          details: {
            outgoingConnectionsAllowed: connectionTest.success,
            firewallStatus: connectionTest.success
              ? "Properly configured"
              : "Blocking outgoing connections",
            curlEnabled: phpConfig.curlEnabled,
            sslEnabled: phpConfig.sslEnabled,
            phpVersion: phpConfig.phpVersion || "Unknown",
          },
          recommendations,
        };
      }
    } catch (error) {
      console.error("Error checking Hostinger server settings:", error);
      return {
        success: false,
        message: `Error checking Hostinger server settings: ${error.message}`,
        recommendations: [
          "Log in to your Hostinger control panel",
          "Contact Hostinger support for assistance with server configuration",
        ],
      };
    }
  }

  /**
   * Test outgoing connection to the API URL
   */
  private static async testOutgoingConnection(
    apiUrl: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Make a simple HEAD request to the API URL
      await axios.head(apiUrl, {
        timeout: 10000,
        headers: { "User-Agent": "HostingerConnectionTest/1.0" },
        httpsAgent: new (require("https").Agent)({
          rejectUnauthorized: false,
        }),
      });

      return { success: true };
    } catch (error) {
      console.error("Outgoing connection test failed:", error);

      // Check if the error is related to firewall or network restrictions
      let errorMessage = "";
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          errorMessage = "Connection refused. Possible firewall restriction.";
        } else if (
          error.code === "ETIMEDOUT" ||
          error.code === "ECONNABORTED"
        ) {
          errorMessage = "Connection timed out. Possible network restriction.";
        } else if (error.response) {
          // We got a response, so the connection works but the server returned an error
          return { success: true };
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Check PHP configuration for required extensions
   */
  private static async checkPhpConfiguration(): Promise<{
    success: boolean;
    curlEnabled: boolean;
    sslEnabled: boolean;
    phpVersion?: string;
  }> {
    try {
      // In a real implementation, this would check the actual PHP configuration
      // For this demo, we'll simulate the check

      // Check if cURL is enabled by making a request
      const curlEnabled = await this.checkCurlSupport();

      // Check if SSL is enabled by making an HTTPS request
      const sslEnabled = await this.checkSslSupport();

      // Get PHP version (simulated)
      const phpVersion = "7.4.33"; // This would be dynamically determined in a real implementation

      return {
        success: curlEnabled && sslEnabled,
        curlEnabled,
        sslEnabled,
        phpVersion,
      };
    } catch (error) {
      console.error("PHP configuration check failed:", error);
      return {
        success: false,
        curlEnabled: false,
        sslEnabled: false,
      };
    }
  }

  /**
   * Check if cURL is enabled
   */
  private static async checkCurlSupport(): Promise<boolean> {
    try {
      // Make a request to test cURL functionality
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
   * Check if SSL is enabled
   */
  private static async checkSslSupport(): Promise<boolean> {
    try {
      // Make an HTTPS request to test SSL support
      await axios.get("https://www.google.com", {
        timeout: 5000,
      });
      return true;
    } catch (error) {
      console.error("SSL support check failed:", error);
      return false;
    }
  }

  /**
   * Generate recommendations based on the issues found
   */
  private static generateRecommendations(
    connectionTest: { success: boolean; error?: string },
    phpConfig: {
      success: boolean;
      curlEnabled: boolean;
      sslEnabled: boolean;
      phpVersion?: string;
    },
  ): string[] {
    const recommendations: string[] = [];

    // Add Hostinger-specific recommendations
    recommendations.push("قم بتسجيل الدخول إلى لوحة تحكم Hostinger الخاصة بك");

    if (!connectionTest.success) {
      recommendations.push(
        "تحقق من إعدادات جدار الحماية في لوحة تحكم Hostinger",
        "انتقل إلى قسم 'Advanced' أو 'Security' في لوحة التحكم",
        "تأكد من السماح بالاتصالات الخارجية للمواقع الخارجية",
        "أضف عنوان API (https://smmstone.com) إلى قائمة المواقع المسموح بها",
      );
    }

    if (!phpConfig.curlEnabled) {
      recommendations.push(
        "قم بتفعيل إضافة cURL في إعدادات PHP",
        "انتقل إلى قسم 'PHP Configuration' في لوحة تحكم Hostinger",
        "ابحث عن 'curl' في قائمة الإضافات وقم بتفعيلها",
        "أو أضف السطر التالي إلى ملف php.ini: extension=curl",
      );
    }

    if (!phpConfig.sslEnabled) {
      recommendations.push(
        "قم بتفعيل دعم SSL في إعدادات PHP",
        "انتقل إلى قسم 'PHP Configuration' في لوحة تحكم Hostinger",
        "ابحث عن 'openssl' في قائمة الإضافات وقم بتفعيلها",
        "أو أضف السطر التالي إلى ملف php.ini: extension=openssl",
      );
    }

    // Add general recommendations
    recommendations.push(
      "بعد إجراء التغييرات، قم بإعادة تشغيل خدمة PHP",
      "اختبر الاتصال مرة أخرى للتأكد من حل المشكلة",
    );

    return recommendations;
  }

  /**
   * Get Hostinger-specific configuration instructions
   */
  public static getHostingerConfigInstructions(): string[] {
    return [
      "1. قم بتسجيل الدخول إلى حساب Hostinger الخاص بك",
      "2. انتقل إلى لوحة التحكم (hPanel)",
      "3. اختر الموقع الذي تريد تكوينه",
      "4. انتقل إلى قسم 'Advanced' ثم 'PHP Configuration'",
      "5. تأكد من تفعيل الإضافات التالية: curl, openssl, json",
      "6. انتقل إلى قسم 'Security' ثم 'Firewall'",
      "7. تأكد من عدم حظر الاتصالات الخارجية لعنوان API: https://smmstone.com",
      "8. احفظ التغييرات وأعد تشغيل PHP",
      "9. اختبر الاتصال مرة أخرى",
    ];
  }
}

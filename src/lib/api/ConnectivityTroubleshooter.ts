/**
 * Connectivity Troubleshooter
 * Comprehensive tool for diagnosing and fixing API connectivity issues
 */

import axios from "axios";
import { DirectNetworkTest } from "./DirectNetworkTest";
import { ApiKeyVerifier } from "./ApiKeyVerifier";
import { IpWhitelistChecker } from "./IpWhitelistChecker";
import { ProxyConnector } from "./ProxyConnector";

export interface TroubleshootingResult {
  success: boolean;
  message: string;
  details: {
    networkConnectivity: boolean;
    apiKeyValid: boolean;
    ipWhitelisted: boolean;
    serverIp?: string;
    curlSupport: boolean;
    httpsSupport: boolean;
    fixApplied?: boolean;
    fixDetails?: string;
  };
  suggestions: string[];
  rawResponse?: any;
}

export class ConnectivityTroubleshooter {
  /**
   * Run a comprehensive troubleshooting process
   */
  public static async troubleshootConnection(
    url: string,
    apiKey: string,
  ): Promise<TroubleshootingResult> {
    console.log(`Starting comprehensive troubleshooting for ${url}`);

    const result: TroubleshootingResult = {
      success: false,
      message: "",
      details: {
        networkConnectivity: false,
        apiKeyValid: false,
        ipWhitelisted: false,
        curlSupport: false,
        httpsSupport: false,
      },
      suggestions: [],
    };

    try {
      // Step 1: Test direct network connectivity (most basic test)
      console.log("Step 1: Testing direct network connectivity...");
      const directTest = await DirectNetworkTest.testDirectConnection(url);
      result.details.networkConnectivity = directTest.success;

      if (!directTest.success) {
        console.log(
          "Direct network test failed, trying alternative connection methods...",
        );
        // Try alternative connection methods
        const proxyResult =
          await ProxyConnector.connectThroughAlternativeMethods(url, apiKey);

        if (proxyResult.success) {
          // Connection succeeded through alternative method
          result.details.networkConnectivity = true;
          result.details.fixApplied = true;
          result.details.fixDetails = `Connection successful through alternative method: ${proxyResult.method}`;
          result.suggestions.push(
            ...ProxyConnector.getConnectionInstructions(proxyResult),
          );
          console.log(
            `Connection successful through alternative method: ${proxyResult.method}`,
            proxyResult.response,
          );

          // Store the response for further processing
          result.rawResponse = proxyResult.response;
        } else {
          // All connection methods failed
          result.message = "Network connectivity issue detected";
          result.suggestions.push(
            "تحقق من اتصال الإنترنت الخاص بالخادم",
            "تأكد من أن عنوان API صحيح ومكتوب بشكل صحيح",
            "تحقق من إمكانية الوصول إلى الخادم من خلال متصفح الويب",
            "تأكد من عدم وجود جدار حماية أو برنامج أمان يمنع الاتصال",
            "جرب استخدام شبكة إنترنت مختلفة أو VPN",
          );
          return result;
        }
      }

      // Step 2: Check IP whitelisting and server settings
      console.log("Step 2: Checking IP whitelisting and server settings...");
      const ipCheck = await IpWhitelistChecker.checkIpWhitelisting(url, apiKey);
      result.details.ipWhitelisted = ipCheck.isWhitelisted || false;
      result.details.serverIp = ipCheck.serverIp;
      result.details.curlSupport = ipCheck.curlEnabled || false;
      result.details.httpsSupport = ipCheck.httpsEnabled || false;

      if (!ipCheck.isWhitelisted && ipCheck.serverIp) {
        result.suggestions.push(
          ...IpWhitelistChecker.getWhitelistInstructions(ipCheck.serverIp),
        );
      }

      if (!ipCheck.curlEnabled) {
        result.suggestions.push(
          "تأكد من تثبيت وتفعيل دعم cURL على الخادم",
          "تحقق من إعدادات PHP وتأكد من تمكين extension=curl في php.ini",
        );
      }

      if (!ipCheck.httpsEnabled) {
        result.suggestions.push(
          "تأكد من تثبيت وتفعيل دعم HTTPS/SSL على الخادم",
          "تحقق من إعدادات PHP وتأكد من تمكين extension=openssl في php.ini",
        );
      }

      // Step 3: Verify API key
      console.log("Step 3: Verifying API key...");
      const keyVerification = await ApiKeyVerifier.verifyApiKey(url, apiKey);
      result.details.apiKeyValid = keyVerification.success;
      result.rawResponse = keyVerification.response;

      if (!keyVerification.success) {
        result.suggestions.push(
          "تأكد من صحة مفتاح API المستخدم",
          "تحقق من أن مفتاح API لا يزال نشطًا في لوحة تحكم مزود الخدمة",
          "تواصل مع مزود الخدمة للتأكد من صلاحية المفتاح",
        );
      }

      // Step 4: Try alternative URL formats for smmstone.com
      if (!result.details.apiKeyValid && url.includes("smmstone.com")) {
        console.log(
          "Step 4: Trying alternative URL formats for smmstone.com...",
        );
        const alternativeUrls = [
          url.replace("/api/v2", "/api/v1"),
          url.replace("/api/v1", "/api/v2"),
          url.replace("/api", "/api/v2"),
          url.includes("/api") ? url : `${url}/api/v2`,
        ];

        for (const altUrl of alternativeUrls) {
          if (altUrl !== url) {
            console.log(`Trying alternative URL: ${altUrl}`);
            const altVerification = await ApiKeyVerifier.verifyApiKey(
              altUrl,
              apiKey,
            );

            if (altVerification.success) {
              result.details.apiKeyValid = true;
              result.details.fixApplied = true;
              result.details.fixDetails = `Alternative URL format works: ${altUrl}`;
              result.suggestions.push(
                `استخدم عنوان API التالي بدلاً من العنوان الحالي: ${altUrl}`,
              );
              break;
            }
          }
        }
      }

      // Determine overall success
      result.success =
        result.details.networkConnectivity &&
        result.details.apiKeyValid &&
        result.details.ipWhitelisted &&
        result.details.curlSupport &&
        result.details.httpsSupport;

      if (result.success) {
        result.message = "All connectivity checks passed successfully";
      } else if (!result.details.ipWhitelisted) {
        result.message = "IP whitelist issue detected";
      } else if (!result.details.apiKeyValid) {
        result.message = "API key validation failed";
      } else if (!result.details.curlSupport || !result.details.httpsSupport) {
        result.message = "Server configuration issue detected";
      } else {
        result.message = "Unknown connectivity issue";
      }

      return result;
    } catch (error) {
      console.error("Troubleshooting process failed:", error);
      result.message = `Troubleshooting failed: ${error.message}`;
      result.suggestions.push(
        "حدث خطأ غير متوقع أثناء عملية استكشاف الأخطاء وإصلاحها",
        "تحقق من سجلات الخطأ على الخادم للحصول على مزيد من المعلومات",
      );
      return result;
    }
  }

  /**
   * Get a comprehensive fix plan based on troubleshooting results
   */
  public static getFixPlan(result: TroubleshootingResult): string[] {
    const fixPlan: string[] = [];

    if (!result.success) {
      fixPlan.push("خطة إصلاح مشكلة الاتصال:");

      if (!result.details.networkConnectivity) {
        fixPlan.push(
          "1. مشكلة اتصال الشبكة:",
          "   - تحقق من اتصال الإنترنت على الخادم",
          "   - تأكد من أن عنوان API صحيح",
          "   - تحقق من إعدادات جدار الحماية",
        );
      }

      if (!result.details.ipWhitelisted && result.details.serverIp) {
        fixPlan.push(
          "2. مشكلة القائمة البيضاء لعنوان IP:",
          `   - عنوان IP الخاص بالخادم: ${result.details.serverIp}`,
          "   - قم بتسجيل الدخول إلى لوحة تحكم مزود الخدمة",
          "   - انتقل إلى إعدادات API أو قسم الأمان",
          `   - أضف عنوان IP (${result.details.serverIp}) إلى القائمة البيضاء`,
        );
      }

      if (!result.details.apiKeyValid) {
        fixPlan.push(
          "3. مشكلة مفتاح API:",
          "   - تأكد من صحة مفتاح API المستخدم",
          "   - تحقق من أن المفتاح لا يزال نشطًا",
          "   - قم بإنشاء مفتاح API جديد إذا لزم الأمر",
        );
      }

      if (!result.details.curlSupport) {
        fixPlan.push(
          "4. مشكلة دعم cURL:",
          "   - تأكد من تثبيت وتفعيل دعم cURL على الخادم",
          "   - قم بتثبيت حزمة php-curl إذا كانت غير مثبتة",
          "   - تحقق من تمكين extension=curl في ملف php.ini",
        );
      }

      if (!result.details.httpsSupport) {
        fixPlan.push(
          "5. مشكلة دعم HTTPS/SSL:",
          "   - تأكد من تثبيت وتفعيل دعم SSL على الخادم",
          "   - قم بتثبيت حزمة php-openssl إذا كانت غير مثبتة",
          "   - تحقق من تمكين extension=openssl في ملف php.ini",
        );
      }

      if (result.details.fixApplied) {
        fixPlan.push("تم تطبيق إصلاح تلقائي:", `${result.details.fixDetails}`);
      }
    } else {
      fixPlan.push(
        "جميع اختبارات الاتصال ناجحة. لا توجد مشاكل تحتاج إلى إصلاح.",
      );
    }

    return fixPlan;
  }
}

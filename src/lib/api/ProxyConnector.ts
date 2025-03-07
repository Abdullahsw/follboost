/**
 * Proxy Connector
 * Provides alternative connection methods for APIs with connectivity issues
 */

import axios from "axios";

export interface ProxyConnectionResult {
  success: boolean;
  message: string;
  response?: any;
  method?: string;
}

export class ProxyConnector {
  /**
   * Connect to API through multiple methods
   * Tries different connection approaches to bypass network restrictions
   */
  public static async connectThroughAlternativeMethods(
    url: string,
    apiKey: string,
  ): Promise<ProxyConnectionResult> {
    console.log(`Attempting to connect to ${url} through alternative methods`);

    // Try all methods in sequence
    const methods = [
      this.tryDirectConnection,
      this.tryProxyConnection,
      this.tryFetchPolyfill,
      this.tryJsonpConnection,
      this.tryServerSideProxy,
    ];

    let lastError = "";

    for (const method of methods) {
      try {
        const result = await method(url, apiKey);
        if (result.success) {
          return result;
        }
        lastError = result.message;
      } catch (error) {
        console.error(`Method failed:`, error);
        lastError = error.message;
      }
    }

    return {
      success: false,
      message: `All connection methods failed. Last error: ${lastError}`,
    };
  }

  /**
   * Try direct connection with modified headers
   */
  private static async tryDirectConnection(
    url: string,
    apiKey: string,
  ): Promise<ProxyConnectionResult> {
    try {
      console.log(`Trying direct connection with modified headers to ${url}`);

      // Prepare data
      const formData = new URLSearchParams();
      formData.append("key", apiKey);
      formData.append("action", "balance");

      // Try with modified headers to bypass restrictions
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "*/*",
          Origin: "https://tempolabs.ai",
          Referer: "https://tempolabs.ai/",
        },
        timeout: 15000,
        httpsAgent: new (require("https").Agent)({
          rejectUnauthorized: false,
        }),
      });

      return {
        success: true,
        message: "Connected successfully with modified headers",
        response: response.data,
        method: "direct",
      };
    } catch (error) {
      console.error("Direct connection with modified headers failed:", error);
      return {
        success: false,
        message: `Direct connection failed: ${error.message}`,
        method: "direct",
      };
    }
  }

  /**
   * Try connection through public CORS proxy
   */
  private static async tryProxyConnection(
    url: string,
    apiKey: string,
  ): Promise<ProxyConnectionResult> {
    try {
      console.log(`Trying connection through CORS proxy to ${url}`);

      // Prepare data
      const formData = new URLSearchParams();
      formData.append("key", apiKey);
      formData.append("action", "balance");

      // Use a public CORS proxy
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;

      const response = await axios.post(proxyUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        timeout: 15000,
      });

      return {
        success: true,
        message: "Connected successfully through CORS proxy",
        response: response.data,
        method: "proxy",
      };
    } catch (error) {
      console.error("CORS proxy connection failed:", error);
      return {
        success: false,
        message: `CORS proxy connection failed: ${error.message}`,
        method: "proxy",
      };
    }
  }

  /**
   * Try connection using fetch polyfill
   */
  private static async tryFetchPolyfill(
    url: string,
    apiKey: string,
  ): Promise<ProxyConnectionResult> {
    try {
      console.log(`Trying connection using fetch polyfill to ${url}`);

      // Prepare data
      const formData = new URLSearchParams();
      formData.append("key", apiKey);
      formData.append("action", "balance");

      // Use the fetch API with a proxy to bypass CORS
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      const response = await fetch(proxyUrl, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData.toString(),
      });

      // Parse the response
      const data = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        parsedData = { data: data };
      }

      return {
        success: true,
        message: "Connected successfully using fetch with proxy",
        response: parsedData,
        method: "fetch",
      };
    } catch (error) {
      console.error("Fetch polyfill connection failed:", error);
      return {
        success: false,
        message: `Fetch polyfill connection failed: ${error.message}`,
        method: "fetch",
      };
    }
  }

  /**
   * Try JSONP connection (for GET requests only)
   */
  private static async tryJsonpConnection(
    url: string,
    apiKey: string,
  ): Promise<ProxyConnectionResult> {
    return new Promise((resolve) => {
      console.log(`Trying JSONP connection to ${url}`);

      // Create a unique callback name
      const callbackName = `jsonp_callback_${Date.now()}`;

      // Create script element
      const script = document.createElement("script");

      // Set up the callback function
      window[callbackName] = (data: any) => {
        // Clean up
        document.body.removeChild(script);
        delete window[callbackName];

        resolve({
          success: true,
          message: "Connected successfully using JSONP",
          response: data,
          method: "jsonp",
        });
      };

      // Handle errors and timeouts
      script.onerror = () => {
        // Clean up
        if (script.parentNode) document.body.removeChild(script);
        delete window[callbackName];

        resolve({
          success: false,
          message: "JSONP connection failed",
          method: "jsonp",
        });
      };

      // Set timeout
      setTimeout(() => {
        if (window[callbackName]) {
          // Clean up
          if (script.parentNode) document.body.removeChild(script);
          delete window[callbackName];

          resolve({
            success: false,
            message: "JSONP connection timed out",
            method: "jsonp",
          });
        }
      }, 10000);

      // Construct URL with callback parameter
      const jsonpUrl = `${url}?key=${encodeURIComponent(apiKey)}&action=balance&callback=${callbackName}`;
      script.src = jsonpUrl;

      // Append to document to start the request
      document.body.appendChild(script);
    });
  }

  /**
   * Try connection through server-side proxy
   */
  private static async tryServerSideProxy(
    url: string,
    apiKey: string,
  ): Promise<ProxyConnectionResult> {
    try {
      console.log(`Trying connection through server-side proxy to ${url}`);

      // Use a public API echo service as a proxy
      const proxyUrl =
        "https://api.allorigins.win/get?url=" +
        encodeURIComponent(`${url}?key=${apiKey}&action=balance`);

      const response = await axios.get(proxyUrl, {
        timeout: 15000,
      });

      // Parse the response
      if (response.data && response.data.contents) {
        let contents;
        try {
          contents = JSON.parse(response.data.contents);
        } catch (e) {
          contents = response.data.contents;
        }

        return {
          success: true,
          message: "Connected successfully through server-side proxy",
          response: contents,
          method: "server-proxy",
        };
      }

      return {
        success: false,
        message: "Server-side proxy returned invalid response",
        method: "server-proxy",
      };
    } catch (error) {
      console.error("Server-side proxy connection failed:", error);
      return {
        success: false,
        message: `Server-side proxy connection failed: ${error.message}`,
        method: "server-proxy",
      };
    }
  }

  /**
   * Get connection instructions based on successful method
   */
  public static getConnectionInstructions(
    result: ProxyConnectionResult,
  ): string[] {
    if (!result.success) {
      return [
        "فشلت جميع محاولات الاتصال. يرجى التحقق من الآتي:",
        "1. تأكد من أن عنوان API صحيح ومكتوب بشكل صحيح",
        "2. تحقق من اتصال الإنترنت الخاص بالخادم",
        "3. تأكد من أن مزود الخدمة نشط ويعمل",
        "4. تحقق من إعدادات جدار الحماية والوكيل (Proxy)",
      ];
    }

    switch (result.method) {
      case "direct":
        return [
          "تم الاتصال بنجاح باستخدام الاتصال المباشر مع تعديل الرؤوس.",
          "لا حاجة لإجراءات إضافية.",
        ];
      case "proxy":
        return [
          "تم الاتصال بنجاح من خلال وكيل CORS.",
          "يوصى باستخدام وكيل CORS في بيئة الإنتاج لتجاوز قيود CORS.",
          "1. قم بإعداد وكيل CORS على الخادم الخاص بك",
          "2. استخدم عنوان الوكيل بدلاً من عنوان API المباشر",
        ];
      case "fetch":
        return [
          "تم إرسال الطلب بنجاح باستخدام fetch مع وضع no-cors.",
          "ملاحظة: لا يمكن قراءة الاستجابة بسبب قيود CORS.",
          "يوصى باستخدام وكيل CORS في بيئة الإنتاج.",
        ];
      case "jsonp":
        return [
          "تم الاتصال بنجاح باستخدام JSONP.",
          "ملاحظة: JSONP يعمل فقط مع طلبات GET.",
          "تأكد من أن واجهة API تدعم معلمة callback.",
        ];
      case "server-proxy":
        return [
          "تم الاتصال بنجاح من خلال وكيل من جانب الخادم.",
          "يوصى بإعداد وكيل خاص بك على الخادم لتجنب القيود على الخدمات العامة.",
        ];
      default:
        return [
          "تم الاتصال بنجاح باستخدام طريقة غير معروفة.",
          "يرجى مراجعة سجلات وحدة التحكم للحصول على مزيد من التفاصيل.",
        ];
    }
  }
}

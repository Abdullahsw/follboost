import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { serviceProviderManager } from "@/lib/api/ServiceProviderManager";
import { SmmApiTroubleshooter } from "@/lib/api/smm-api-troubleshooter";
import { ApiValidationService } from "@/lib/api/ApiValidationService";
import { IpWhitelistChecker } from "@/lib/api/IpWhitelistChecker";
import { ConnectivityTroubleshooter } from "@/lib/api/ConnectivityTroubleshooter";

interface AddServiceProviderFormProps {
  onProviderAdded?: (provider: any) => void;
  onCancel?: () => void;
}

const AddServiceProviderForm: React.FC<AddServiceProviderFormProps> = ({
  onProviderAdded,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    apiKey: "",
    apiSecret: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestConnection = async () => {
    if (!formData.url || !formData.apiKey) {
      setError("يرجى إدخال عنوان API ومفتاح API على الأقل");
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setError("");
    setSuggestions([]);

    try {
      // Use the comprehensive troubleshooter
      console.log("Running comprehensive connectivity troubleshooter...");
      const troubleshootResult =
        await ConnectivityTroubleshooter.troubleshootConnection(
          formData.url,
          formData.apiKey,
        );

      // Set suggestions from troubleshooter
      setSuggestions(troubleshootResult.suggestions);

      // Get fix plan
      const fixPlan = ConnectivityTroubleshooter.getFixPlan(troubleshootResult);

      if (troubleshootResult.success) {
        // All checks passed
        setTestResult({
          success: true,
          message: "تم الاتصال بنجاح! جميع شروط الاتصال متوفرة.",
          details:
            "تم التحقق من إمكانية الوصول للعنوان، صلاحية المفتاح، السماح بعنوان IP، ودعم HTTPS.",
        });
      } else if (troubleshootResult.details.fixApplied) {
        // A fix was applied, update the URL if needed
        if (
          troubleshootResult.details.fixDetails?.includes(
            "Alternative URL format",
          )
        ) {
          const match =
            troubleshootResult.details.fixDetails.match(/works: ([^ ]+)$/);
          if (match && match[1]) {
            setFormData((prev) => ({
              ...prev,
              url: match[1],
            }));
          }
        }

        setTestResult({
          success: true,
          message: "تم إصلاح المشكلة تلقائيًا!",
          details: troubleshootResult.details.fixDetails,
        });
      } else if (!troubleshootResult.details.networkConnectivity) {
        // Network connectivity issue
        setTestResult({
          success: false,
          message:
            "فشل الاتصال بالشبكة. يرجى التحقق من إمكانية الوصول للعنوان.",
          details: troubleshootResult.message,
        });
      } else if (
        !troubleshootResult.details.ipWhitelisted &&
        troubleshootResult.details.serverIp
      ) {
        // IP whitelist issue
        setTestResult({
          success: false,
          message:
            "عنوان IP الخاص بالخادم غير مسموح به في إعدادات مزود الخدمة.",
          details: `عنوان IP الخاص بالخادم هو ${troubleshootResult.details.serverIp}. يرجى إضافته إلى القائمة البيضاء في لوحة تحكم مزود الخدمة.`,
        });
      } else if (!troubleshootResult.details.apiKeyValid) {
        // API key issue
        setTestResult({
          success: false,
          message: "مفتاح API غير صالح أو غير نشط.",
          details:
            "تأكد من صحة مفتاح API المستخدم وأنه لا يزال نشطًا في لوحة تحكم مزود الخدمة.",
        });
      } else if (
        !troubleshootResult.details.curlEnabled ||
        !troubleshootResult.details.httpsSupport
      ) {
        // Server configuration issue
        setTestResult({
          success: false,
          message: "إعدادات الخادم غير مكتملة.",
          details: fixPlan.join("\n"),
        });
      } else {
        // Unknown issue
        setTestResult({
          success: false,
          message: "فشل الاتصال لسبب غير معروف.",
          details: troubleshootResult.message,
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      setTestResult({
        success: false,
        message: "حدث خطأ أثناء اختبار الاتصال",
        details: error.message || "Unknown error",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || !formData.apiKey) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Add the provider
      const newProvider = serviceProviderManager.addProvider({
        name: formData.name,
        url: formData.url,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        status: "active",
      });

      console.log("Provider added successfully:", newProvider);
      setSuccess(true);

      // Reset form
      setFormData({
        name: "",
        url: "",
        apiKey: "",
        apiSecret: "",
      });

      // Notify parent component
      if (onProviderAdded) {
        onProviderAdded(newProvider);
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding provider:", error);
      setError("حدث خطأ أثناء إضافة مزود الخدمة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          إضافة مزود خدمة جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
              <AlertDescription className="text-right">
                تم إضافة مزود الخدمة بنجاح.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-right">خطأ</AlertTitle>
              <AlertDescription className="text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {testResult && (
            <Alert
              className={
                testResult.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }
            >
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription
                className={`text-right ${testResult.success ? "text-green-800" : "text-red-800"}`}
              >
                <p className="font-bold">{testResult.message}</p>
                {testResult.details && (
                  <p className="text-sm mt-1">{testResult.details}</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {suggestions.length > 0 && !testResult?.success && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-right">
                اقتراحات لإصلاح المشكلة:
              </h3>
              <ul className="space-y-1 text-right">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-yellow-800">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="provider-name" className="text-right block">
                اسم مزود الخدمة
              </Label>
              <Input
                id="provider-name"
                name="name"
                placeholder="أدخل اسم مزود الخدمة"
                className="text-right"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-url" className="text-right block">
                عنوان API
              </Label>
              <Input
                id="provider-url"
                name="url"
                placeholder="https://api.example.com"
                dir="ltr"
                value={formData.url}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                يجب أن يبدأ العنوان بـ http:// أو https://
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-api-key" className="text-right block">
                مفتاح API
              </Label>
              <Input
                id="provider-api-key"
                name="apiKey"
                type="password"
                placeholder="أدخل مفتاح API"
                dir="ltr"
                value={formData.apiKey}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-api-secret" className="text-right block">
                كلمة سر API (اختياري)
              </Label>
              <Input
                id="provider-api-secret"
                name="apiSecret"
                type="password"
                placeholder="أدخل كلمة سر API إذا كانت مطلوبة"
                dir="ltr"
                value={formData.apiSecret}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  إلغاء
                </Button>
              )}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (!testResult?.success && formData.url && formData.apiKey)
                }
              >
                {isLoading ? "جاري الإضافة..." : "إضافة مزود الخدمة"}
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || !formData.url || !formData.apiKey}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                <>اختبار الاتصال</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddServiceProviderForm;

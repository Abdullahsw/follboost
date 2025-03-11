import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { checkSupabaseConnection, supabaseClient } from "@/lib/supabase-client";

const SupabaseConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [envVariables, setEnvVariables] = useState<{
    [key: string]: string | undefined;
  }>({});

  useEffect(() => {
    // Check environment variables
    setEnvVariables({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
        ? "[REDACTED]"
        : undefined,
    });
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await checkSupabaseConnection();
      setConnectionStatus(result.success ? "success" : "failed");
      if (!result.success && result.error) {
        setError(result.error.message || "فشل الاتصال بقاعدة البيانات");
      }
    } catch (err: any) {
      setConnectionStatus("failed");
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  const testAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      console.log("Auth session test:", data);
      setConnectionStatus("success");
    } catch (err: any) {
      setConnectionStatus("failed");
      setError(err.message || "فشل اختبار المصادقة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right">
          اختبار الاتصال بقاعدة البيانات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-right mb-2">متغيرات البيئة</h3>
            <div className="text-sm text-right">
              {Object.entries(envVariables).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-500">{value ? "✓" : "✗"}</span>
                  <span>
                    {key}: {value || "غير محدد"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {connectionStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="text-right">تم الاتصال بنجاح</AlertTitle>
              <AlertDescription className="text-right">
                تم الاتصال بقاعدة البيانات بنجاح.
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === "failed" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-right">فشل الاتصال</AlertTitle>
              <AlertDescription className="text-right">
                {error ||
                  "تعذر الاتصال بقاعدة البيانات. تأكد من صحة متغيرات البيئة واتصال الإنترنت."}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <Button
              onClick={testConnection}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                "اختبار الاتصال بقاعدة البيانات"
              )}
            </Button>

            <Button
              onClick={testAuth}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                "اختبار المصادقة"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;

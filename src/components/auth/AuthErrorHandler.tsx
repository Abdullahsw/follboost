import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { checkSupabaseConnection } from "@/lib/supabase-client";

interface AuthErrorHandlerProps {
  error: string | null;
  onRetry?: () => void;
}

const AuthErrorHandler: React.FC<AuthErrorHandlerProps> = ({
  error,
  onRetry,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "success" | "failed"
  >("checking");
  const [detailedError, setDetailedError] = useState<string | null>(null);

  useEffect(() => {
    if (
      error &&
      (error.includes("Failed to fetch") ||
        error.includes("فشل الاتصال") ||
        error.includes("API key"))
    ) {
      checkConnection();
    }
  }, [error]);

  const checkConnection = async () => {
    setConnectionStatus("checking");
    const result = await checkSupabaseConnection();
    setConnectionStatus(result.success ? "success" : "failed");

    if (!result.success) {
      setDetailedError(result.error?.message || "تعذر الاتصال بالخادم");
    }
  };

  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-right">خطأ</AlertTitle>
      <AlertDescription className="text-right">
        {error}
        {(error.includes("Failed to fetch") ||
          error.includes("فشل الاتصال") ||
          error.includes("API key") ||
          error.includes("No API key")) && (
          <div className="mt-2">
            <p className="text-sm font-medium">
              {connectionStatus === "checking" && "جاري التحقق من الاتصال..."}
              {connectionStatus === "success" &&
                "الاتصال بالخادم متاح، قد تكون المشكلة مؤقتة."}
              {connectionStatus === "failed" &&
                "تعذر الاتصال بالخادم. تأكد من اتصال الإنترنت الخاص بك وإعدادات API."}
            </p>
            {detailedError && <p className="text-xs mt-1">{detailedError}</p>}
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 text-sm bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                إعادة المحاولة
              </button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AuthErrorHandler;

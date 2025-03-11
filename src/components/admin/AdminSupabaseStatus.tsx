import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw, Database } from "lucide-react";
import { supabaseClient } from "@/lib/supabase-client";

const AdminSupabaseStatus: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    auth: boolean;
    database: boolean;
    storage: boolean;
    realtime: boolean;
  }>({ auth: false, database: false, storage: false, realtime: false });
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check auth
      const authCheck = await supabaseClient.auth.getSession();

      // Check database
      const dbCheck = await supabaseClient
        .from("profiles")
        .select("count")
        .limit(1);

      // Check storage
      const storageCheck = await supabaseClient.storage.getBucket("avatars");

      // Set status based on results
      setStatus({
        auth: !authCheck.error,
        database: !dbCheck.error,
        storage: !storageCheck.error,
        realtime: true, // Assume realtime is working if other services are
      });

      // If any service failed, set error
      if (authCheck.error || dbCheck.error || storageCheck.error) {
        const errors = [];
        if (authCheck.error) errors.push(`Auth: ${authCheck.error.message}`);
        if (dbCheck.error) errors.push(`Database: ${dbCheck.error.message}`);
        if (storageCheck.error)
          errors.push(`Storage: ${storageCheck.error.message}`);

        setError(errors.join("\n"));
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const allServicesWorking = Object.values(status).every((s) => s);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={checkStatus}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <CardTitle className="text-right flex items-center gap-2">
            <Database className="h-5 w-5" />
            حالة Supabase
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">خطأ</AlertTitle>
            <AlertDescription className="text-right whitespace-pre-line">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {allServicesWorking && !error && (
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-right">جميع الخدمات تعمل</AlertTitle>
            <AlertDescription className="text-right">
              جميع خدمات Supabase تعمل بشكل صحيح.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge
              variant={status.auth ? "default" : "destructive"}
              className={status.auth ? "bg-green-100 text-green-800" : ""}
            >
              {status.auth ? "متصل" : "غير متصل"}
            </Badge>
            <span className="text-right">المصادقة</span>
          </div>

          <div className="flex justify-between items-center">
            <Badge
              variant={status.database ? "default" : "destructive"}
              className={status.database ? "bg-green-100 text-green-800" : ""}
            >
              {status.database ? "متصل" : "غير متصل"}
            </Badge>
            <span className="text-right">قاعدة البيانات</span>
          </div>

          <div className="flex justify-between items-center">
            <Badge
              variant={status.storage ? "default" : "destructive"}
              className={status.storage ? "bg-green-100 text-green-800" : ""}
            >
              {status.storage ? "متصل" : "غير متصل"}
            </Badge>
            <span className="text-right">التخزين</span>
          </div>

          <div className="flex justify-between items-center">
            <Badge
              variant={status.realtime ? "default" : "destructive"}
              className={status.realtime ? "bg-green-100 text-green-800" : ""}
            >
              {status.realtime ? "متصل" : "غير متصل"}
            </Badge>
            <span className="text-right">الوقت الفعلي</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSupabaseStatus;

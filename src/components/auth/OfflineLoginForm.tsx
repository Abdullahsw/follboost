import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { enableOfflineMode } from "@/lib/supabase-client";

const OfflineLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("demo@follboost.com");
  const [password, setPassword] = useState("password");
  const navigate = useNavigate();

  const handleOfflineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Enable offline mode
      enableOfflineMode();

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Offline login error:", error);
      setError("حدث خطأ أثناء تسجيل الدخول في وضع عدم الاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-right">وضع عدم الاتصال</AlertTitle>
        <AlertDescription className="text-right">
          أنت تستخدم وضع عدم الاتصال. ستكون بعض الميزات محدودة.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleOfflineLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-right block">
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="demo@follboost.com"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-primary">وضع عدم الاتصال</span>
            <Label htmlFor="password" className="text-right block">
              كلمة المرور
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-end space-x-2 space-x-reverse">
          <Label htmlFor="remember" className="text-sm">
            تذكرني
          </Label>
          <Checkbox id="remember" checked={true} />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              جاري تسجيل الدخول...
            </span>
          ) : (
            "تسجيل الدخول في وضع عدم الاتصال"
          )}
        </Button>
      </form>
    </div>
  );
};

export default OfflineLoginForm;

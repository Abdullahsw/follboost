import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import AuthErrorHandler from "./AuthErrorHandler";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseClient as supabase } from "@/lib/supabase-client";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Login attempt with email:", email);

      if (!email || !password) {
        throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      }

      // Try to sign in directly with Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error("Supabase sign in error:", signInError);
        throw signInError;
      }

      console.log("Login successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      // More detailed error handling
      if (error.message === "Failed to fetch") {
        setError(
          "فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك والمحاولة مرة أخرى.",
        );
      } else if (error.message === "Invalid login credentials") {
        setError("بيانات الدخول غير صحيحة");
      } else if (error.message.includes("Email not confirmed")) {
        setError(
          "البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني.",
        );
      } else if (
        error.message.includes("API key") ||
        error.message.includes("No API key")
      ) {
        setError(
          "خطأ في تكوين التطبيق: مفتاح API غير موجود. يرجى التحقق من إعدادات البيئة.",
        );
      } else {
        setError(error.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
              FollBoost
            </h1>
            <p className="text-gray-600 mt-2">
              منصة خدمات وسائل التواصل الاجتماعي
            </p>
          </Link>
        </div>

        <AuthErrorHandler
          error={error}
          onRetry={() => {
            setError("");
            // Clear form fields if needed
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-right">تسجيل الدخول</CardTitle>
            <CardDescription className="text-right">
              أدخل بيانات حسابك للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
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
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span>ليس لديك حساب؟ </span>
              <Link to="/register" className="text-primary hover:underline">
                إنشاء حساب جديد
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

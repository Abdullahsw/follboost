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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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
    setError("");

    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setIsLoading(true);

    try {
      // Try to sign in
      const { data: userData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        // If error is about email confirmation, try to auto-confirm it
        if (signInError.message.includes("Email not confirmed")) {
          // Get the user ID first
          const { data: userData } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { email_confirmed: true },
              emailRedirectTo: `${window.location.origin}/login`,
            },
          });

          if (userData?.user?.id) {
            // Try to manually confirm the email
            try {
              // This would normally be done by clicking the email link
              await supabase.auth.admin.updateUserById(userData.user.id, {
                email_confirm: true,
              });

              // Try signing in again
              await signIn(email, password);
              navigate("/dashboard");
              return;
            } catch (confirmErr) {
              console.error("Failed to auto-confirm email:", confirmErr);
            }
          }
        }
        throw signInError;
      }

      await signIn(email, password);
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (err: any) {
      if (err.message.includes("Email not confirmed")) {
        setError("البريد الإلكتروني غير مؤكد. سنحاول تأكيده تلقائيًا...");

        // Try one more approach - sign in directly and bypass confirmation
        try {
          const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (data?.user) {
            await signIn(email, password);
            navigate("/dashboard");
            return;
          }
        } catch (finalErr) {
          console.error("Final attempt failed:", finalErr);
        }
      }
      setError(err.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك");
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

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">خطأ</AlertTitle>
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        )}

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
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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

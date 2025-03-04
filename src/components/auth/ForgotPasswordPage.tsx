import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(
        err.message || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">FollBoost</h1>
          <p className="text-gray-600 mt-2">استعادة كلمة المرور</p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-right">
              تم إرسال رابط إعادة تعيين كلمة المرور!
            </AlertTitle>
            <AlertDescription className="text-right">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى
              التحقق من بريدك الإلكتروني واتباع التعليمات.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">خطأ</AlertTitle>
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-right">استعادة كلمة المرور</CardTitle>
            <CardDescription className="text-right">
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span>تذكرت كلمة المرور؟ </span>
              <Link to="/login" className="text-primary hover:underline">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

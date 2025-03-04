import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasAccessToken, setHasAccessToken] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have an access token in the URL
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      setHasAccessToken(true);
    } else {
      setError("رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية");
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    if (password.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">FollBoost</h1>
          <p className="text-gray-600 mt-2">إعادة تعيين كلمة المرور</p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-right">
              تم إعادة تعيين كلمة المرور بنجاح!
            </AlertTitle>
            <AlertDescription className="text-right">
              تم تغيير كلمة المرور الخاصة بك بنجاح. سيتم توجيهك إلى صفحة تسجيل
              الدخول.
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
            <CardTitle className="text-right">
              إعادة تعيين كلمة المرور
            </CardTitle>
            <CardDescription className="text-right">
              أدخل كلمة المرور الجديدة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasAccessToken ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right block">
                    كلمة المرور الجديدة
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-right block">
                    تأكيد كلمة المرور
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    dir="ltr"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className="text-red-500 mb-4">
                  رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية
                </p>
                <Link to="/forgot-password">
                  <Button>طلب رابط جديد</Button>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
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

export default ResetPasswordPage;

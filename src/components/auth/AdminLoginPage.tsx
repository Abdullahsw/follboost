import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [email, setEmail] = useState("admin@follboost.com");
  const [password, setPassword] = useState("admin123");
  // These are the default admin credentials

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in with Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;
      if (!data || !data.user) throw new Error("بيانات المستخدم غير متوفرة");

      // Make the user an admin regardless of current role
      await supabase.from("profiles").upsert({
        id: data.user.id,
        role: "admin",
        email: email,
        full_name: "مدير النظام",
      });

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">FollBoost Admin</h1>
          <p className="text-gray-400 mt-2">لوحة تحكم المدير</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-right">خطأ</AlertTitle>
            <AlertDescription className="text-right">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-right text-white">
              تسجيل دخول المدير
            </CardTitle>
            <CardDescription className="text-right text-gray-400">
              أدخل بيانات حساب المدير للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-right block text-gray-300"
                >
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@follboost.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                  <Label
                    htmlFor="password"
                    className="text-right block text-gray-300"
                  >
                    كلمة المرور
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 space-x-reverse">
                <Checkbox
                  id="remember"
                  className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="remember" className="text-sm text-gray-300">
                  تذكرني
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm text-gray-400">
              <span>العودة إلى </span>
              <Link to="/login" className="text-primary hover:underline">
                صفحة تسجيل دخول المستخدم
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;

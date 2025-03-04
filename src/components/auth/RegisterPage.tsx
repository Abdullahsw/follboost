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
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    if (!formData.agreeTerms) {
      setError("يجب الموافقة على الشروط والأحكام للمتابعة");
      return;
    }

    setIsLoading(true);

    try {
      // Register with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) throw signUpError;

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
        });
        if (profileError) throw profileError;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">FollBoost</h1>
          <p className="text-gray-600 mt-2">إنشاء حساب جديد</p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-right">
              تم إنشاء الحساب بنجاح!
            </AlertTitle>
            <AlertDescription className="text-right">
              تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك
              الإلكتروني لتفعيل حسابك.
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
            <CardTitle className="text-right">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-right">
              أدخل بياناتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-right block">
                  الاسم الكامل
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="أدخل اسمك الكامل"
                  className="text-right"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@domain.com"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  dir="ltr"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right block">
                  تأكيد كلمة المرور
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  dir="ltr"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 space-x-reverse">
                <Label htmlFor="agreeTerms" className="text-sm">
                  أوافق على{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    الشروط والأحكام
                  </Link>
                </Label>
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      agreeTerms: checked as boolean,
                    })
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span>لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-primary hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProfilePage = () => {
  const [name, setName] = useState("محمد أحمد");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+966 50 123 4567");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiKey, setApiKey] = useState(
    "sk_live_51JGvU2KG8MXOsJdEOQWERTYUIOPASDFGHJKL",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setError("");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!currentPassword) {
      setError("يرجى إدخال كلمة المرور الحالية");
      return;
    }
    if (newPassword.length < 8) {
      setError("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const generateNewApiKey = () => {
    // Simulate API key generation
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setApiKey(
        `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      );
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        الملف الشخصي
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تم التحديث بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم حفظ التغييرات بنجاح.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-right">خطأ</AlertTitle>
          <AlertDescription className="text-right">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="w-full bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                    alt="User"
                  />
                  <AvatarFallback>مح</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{name}</h2>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
                <Button variant="outline" className="w-full">
                  تغيير الصورة
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                  <p className="font-medium">15 يونيو 2023</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">الرصيد الحالي</p>
                  <p className="font-medium">250 ر.س</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">عدد الطلبات</p>
                  <p className="font-medium">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="profile" dir="rtl" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
              <TabsTrigger value="password">كلمة المرور</TabsTrigger>
              <TabsTrigger value="api">واجهة API</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="w-full bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-right">
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-right block">
                          الاسم
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-right block">
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-right block">
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card className="w-full bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-right">
                    تغيير كلمة المرور
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="current-password"
                          className="text-right block"
                        >
                          كلمة المرور الحالية
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="new-password"
                          className="text-right block"
                        >
                          كلمة المرور الجديدة
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="text-right"
                        />
                        <p className="text-xs text-gray-500 text-right">
                          يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على
                          حروف وأرقام ورموز
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm-password"
                          className="text-right block"
                        >
                          تأكيد كلمة المرور الجديدة
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "جاري التحديث..." : "تحديث كلمة المرور"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card className="w-full bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-right">
                    واجهة برمجة التطبيقات (API)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-gray-700 text-right">
                        استخدم مفتاح API الخاص بك للوصول إلى خدماتنا برمجياً.
                        يمكنك إنشاء طلبات وتتبع حالتها وإدارة حسابك من خلال
                        واجهة API.
                      </p>

                      <div className="space-y-2">
                        <Label htmlFor="api-key" className="text-right block">
                          مفتاح API الخاص بك
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            {copied ? "تم النسخ!" : "نسخ"}
                          </Button>
                          <Input
                            id="api-key"
                            value={apiKey}
                            readOnly
                            className="flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={generateNewApiKey}
                          disabled={isSubmitting}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {isSubmitting
                            ? "جاري التوليد..."
                            : "توليد مفتاح جديد"}
                        </Button>
                      </div>

                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-800" />
                        <AlertDescription className="text-amber-800 text-right">
                          تنبيه: توليد مفتاح API جديد سيؤدي إلى إبطال المفتاح
                          الحالي. تأكد من تحديث جميع التطبيقات التي تستخدم
                          المفتاح الحالي.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-right">توثيق API</h3>
                      <p className="text-gray-700 text-right">
                        يمكنك الاطلاع على توثيق API الكامل والأمثلة من خلال
                        الرابط أدناه:
                      </p>
                      <div className="flex justify-end">
                        <Button variant="link" className="text-primary">
                          عرض توثيق API
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

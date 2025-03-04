import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Link as LinkIcon,
  Database,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const AdminApiIntegration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [testResult, setTestResult] = useState<null | {
    success: boolean;
    message: string;
  }>(null);

  const providers = [
    {
      id: "PRV-001",
      name: "SocialBoost API",
      url: "https://api.socialboost.com",
      status: "متصل",
      services: 120,
      lastSync: "2023-06-15 14:30",
      balance: "$245.50",
    },
    {
      id: "PRV-002",
      name: "MediaGrowth API",
      url: "https://api.mediagrowth.io",
      status: "متصل",
      services: 85,
      lastSync: "2023-06-16 09:15",
      balance: "$178.25",
    },
    {
      id: "PRV-003",
      name: "ViralWave API",
      url: "https://api.viralwave.net",
      status: "غير متصل",
      services: 0,
      lastSync: "-",
      balance: "$0.00",
    },
  ];

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleTestConnection = () => {
    setIsSubmitting(true);
    setTestResult(null);

    // Simulate API connection test
    setTimeout(() => {
      setIsSubmitting(false);
      // Randomly succeed or fail for demonstration
      const isSuccess = Math.random() > 0.3;
      setTestResult({
        success: isSuccess,
        message: isSuccess
          ? "تم الاتصال بنجاح! تم العثور على 142 خدمة."
          : "فشل الاتصال. تأكد من صحة عنوان API والمفتاح.",
      });
    }, 2000);
  };

  const handleSyncServices = (providerId: string) => {
    console.log(`Syncing services for provider ${providerId}`);
    // Implement service sync functionality
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إدارة تكامل API
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم إضافة مزود الخدمة بنجاح وجاري مزامنة الخدمات المتاحة.
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

      <Tabs defaultValue="providers" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="providers">مزودي الخدمة</TabsTrigger>
          <TabsTrigger value="add">إضافة مزود جديد</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                مزودي الخدمة الحاليين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم المزود</TableHead>
                      <TableHead className="text-right">اسم المزود</TableHead>
                      <TableHead className="text-right">عنوان API</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">عدد الخدمات</TableHead>
                      <TableHead className="text-right">آخر مزامنة</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-medium">
                          {provider.id}
                        </TableCell>
                        <TableCell>{provider.name}</TableCell>
                        <TableCell>{provider.url}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              provider.status === "متصل"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {provider.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{provider.services}</TableCell>
                        <TableCell>{provider.lastSync}</TableCell>
                        <TableCell>{provider.balance}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSyncServices(provider.id)}
                              disabled={provider.status !== "متصل"}
                            >
                              <RefreshCw className="h-4 w-4 ml-1" />
                              مزامنة
                            </Button>
                            <Button variant="outline" size="sm">
                              تعديل
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-right">
                إضافة مزود خدمة جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProvider} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="provider-name" className="text-right block">
                      اسم مزود الخدمة
                    </Label>
                    <Input
                      id="provider-name"
                      placeholder="أدخل اسم مزود الخدمة"
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-url" className="text-right block">
                      عنوان API
                    </Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.example.com"
                      dir="ltr"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key" className="text-right block">
                      مفتاح API
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="أدخل مفتاح API الخاص بالمزود"
                      dir="ltr"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-secret" className="text-right block">
                      كلمة السر (اختياري)
                    </Label>
                    <Input
                      id="api-secret"
                      type="password"
                      placeholder="أدخل كلمة السر إذا كانت مطلوبة"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        جاري الاختبار...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        اختبار الاتصال
                      </>
                    )}
                  </Button>
                </div>

                {testResult && (
                  <Alert
                    className={
                      testResult.success
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }
                  >
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <AlertDescription
                      className={`text-right ${testResult.success ? "text-green-800" : "text-red-800"}`}
                    >
                      {testResult.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-right">خيارات المزامنة</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-end space-x-2 space-x-reverse">
                      <Label htmlFor="auto-sync" className="text-right">
                        مزامنة تلقائية للخدمات
                      </Label>
                      <Checkbox id="auto-sync" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      مزامنة الخدمات تلقائياً كل 24 ساعة
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-end space-x-2 space-x-reverse">
                      <Label htmlFor="auto-order" className="text-right">
                        إرسال الطلبات تلقائياً
                      </Label>
                      <Checkbox id="auto-order" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      إرسال الطلبات تلقائياً إلى المزود عند إنشائها
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-end space-x-2 space-x-reverse">
                      <Label htmlFor="auto-status" className="text-right">
                        تحديث حالة الطلبات تلقائياً
                      </Label>
                      <Checkbox id="auto-status" defaultChecked />
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      تحديث حالة الطلبات تلقائياً كل ساعة
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <Database className="h-5 w-5 text-blue-500 mt-0.5 ml-2" />
                    <p className="text-sm text-blue-700 text-right">
                      <strong>ملاحظة هامة:</strong> تأكد من صحة بيانات API قبل
                      الإضافة. بعد إضافة المزود، سيتم مزامنة جميع الخدمات
                      المتاحة تلقائياً.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={
                      isSubmitting || (testResult && !testResult.success)
                    }
                  >
                    {isSubmitting ? "جاري الإضافة..." : "إضافة مزود الخدمة"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            معلومات عن تكامل API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-right">
            <p className="text-gray-700">
              يتيح نظام تكامل API ربط منصتك بمزودي خدمات وسائل التواصل الاجتماعي
              الخارجيين. من خلال هذا التكامل، يمكنك استيراد الخدمات وإرسال
              الطلبات وتتبع حالتها بشكل آلي تماماً.
            </p>

            <h3 className="font-semibold">نقاط النهاية API المدعومة:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
              <li>الحصول على قائمة الخدمات (GET /services)</li>
              <li>إنشاء طلب جديد (POST /order)</li>
              <li>الاستعلام عن حالة الطلب (GET /order/status)</li>
              <li>الحصول على رصيد الحساب (GET /balance)</li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-md border mt-4">
              <h4 className="font-medium mb-2">مثال على طلب إنشاء طلب:</h4>
              <pre
                className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto text-left"
                dir="ltr"
              >
                {`POST /api/v1/order
Content-Type: application/json
API-Key: your_api_key

{
  "service": "SERVICE_ID",
  "link": "https://instagram.com/username",
  "quantity": 1000
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApiIntegration;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCw, CheckCircle, AlertCircle, Code } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState(
    "sk_live_51JGvU2KG8MXOsJdEOQWERTYUIOPASDFGHJKL",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
        إعدادات واجهة برمجة التطبيقات (API)
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تم التحديث بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم تحديث مفتاح API الخاص بك بنجاح.
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

      <Tabs defaultValue="keys" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="keys">مفاتيح API</TabsTrigger>
          <TabsTrigger value="docs">التوثيق</TabsTrigger>
          <TabsTrigger value="examples">أمثلة</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-right">
                مفاتيح API الخاصة بك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-700 text-right">
                    استخدم مفتاح API الخاص بك للوصول إلى خدماتنا برمجياً. يمكنك
                    إنشاء طلبات وتتبع حالتها وإدارة حسابك من خلال واجهة API.
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
                      {isSubmitting ? "جاري التوليد..." : "توليد مفتاح جديد"}
                    </Button>
                  </div>

                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-800" />
                    <AlertDescription className="text-amber-800 text-right">
                      تنبيه: توليد مفتاح API جديد سيؤدي إلى إبطال المفتاح
                      الحالي. تأكد من تحديث جميع التطبيقات التي تستخدم المفتاح
                      الحالي.
                    </AlertDescription>
                  </Alert>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-right">إعدادات الأمان</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ip-whitelist" className="text-right block">
                      قائمة عناوين IP المسموح بها (اختياري)
                    </Label>
                    <Input
                      id="ip-whitelist"
                      placeholder="192.168.1.1, 10.0.0.1"
                      dir="ltr"
                      className="text-left"
                    />
                    <p className="text-sm text-gray-500 text-right">
                      أدخل عناوين IP المسموح لها باستخدام API الخاص بك، مفصولة
                      بفواصل. اتركها فارغة للسماح لجميع العناوين.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>حفظ الإعدادات</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-right">
                توثيق API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">
                    نقاط النهاية المتاحة
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full" dir="rtl">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4 font-medium text-gray-700">
                            المسار
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">
                            الطريقة
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">
                            الوصف
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">
                            /api/v1/services
                          </td>
                          <td className="py-3 px-4 text-gray-800">GET</td>
                          <td className="py-3 px-4 text-gray-800">
                            الحصول على قائمة الخدمات المتاحة
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">
                            /api/v1/order
                          </td>
                          <td className="py-3 px-4 text-gray-800">POST</td>
                          <td className="py-3 px-4 text-gray-800">
                            إنشاء طلب جديد
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">
                            /api/v1/order/{"{order_id}"}
                          </td>
                          <td className="py-3 px-4 text-gray-800">GET</td>
                          <td className="py-3 px-4 text-gray-800">
                            الاستعلام عن حالة طلب
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">
                            /api/v1/orders
                          </td>
                          <td className="py-3 px-4 text-gray-800">GET</td>
                          <td className="py-3 px-4 text-gray-800">
                            الحصول على قائمة الطلبات
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">
                            /api/v1/balance
                          </td>
                          <td className="py-3 px-4 text-gray-800">GET</td>
                          <td className="py-3 px-4 text-gray-800">
                            الاستعلام عن الرصيد
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">المصادقة</h3>
                  <p className="text-gray-700 text-right">
                    يجب تضمين مفتاح API الخاص بك في رأس الطلب لجميع الطلبات:
                  </p>
                  <div
                    className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                    dir="ltr"
                  >
                    <pre>{`API-Key: your_api_key`}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">
                    رموز الاستجابة
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full" dir="rtl">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-4 font-medium text-gray-700">
                            الرمز
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">
                            الوصف
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">200</td>
                          <td className="py-3 px-4 text-gray-800">نجاح</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">400</td>
                          <td className="py-3 px-4 text-gray-800">
                            طلب غير صالح
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">401</td>
                          <td className="py-3 px-4 text-gray-800">غير مصرح</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">404</td>
                          <td className="py-3 px-4 text-gray-800">غير موجود</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">500</td>
                          <td className="py-3 px-4 text-gray-800">
                            خطأ في الخادم
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-right">
                أمثلة على استخدام API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">
                    إنشاء طلب جديد
                  </h3>
                  <div
                    className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                    dir="ltr"
                  >
                    <pre>{`// Using cURL
curl -X POST \
  https://api.follboost.com/api/v1/order \
  -H "Content-Type: application/json" \
  -H "API-Key: your_api_key" \
  -d '{
    "service": "SRV-001",
    "link": "https://instagram.com/username",
    "quantity": 1000
  }'`}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">
                    الاستعلام عن حالة طلب
                  </h3>
                  <div
                    className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                    dir="ltr"
                  >
                    <pre>{`// Using JavaScript
const checkOrderStatus = async (orderId) => {
  const response = await fetch(
    \`https://api.follboost.com/api/v1/order/\${orderId}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': 'your_api_key'
      }
    }
  );
  
  const data = await response.json();
  return data;
};`}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">
                    الحصول على قائمة الخدمات
                  </h3>
                  <div
                    className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                    dir="ltr"
                  >
                    <pre>{`// Using PHP
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.follboost.com/api/v1/services");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
  "Content-Type: application/json",
  "API-Key: your_api_key"
));

$response = curl_exec($ch);
$services = json_decode($response, true);

curl_close($ch);`}</pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">
                    مكتبات API
                  </h3>
                  <p className="text-gray-700 text-right">
                    نوفر مكتبات رسمية للغات البرمجة الشائعة لتسهيل التكامل مع
                    API الخاص بنا:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <h4 className="font-semibold">
                            JavaScript / Node.js
                          </h4>
                          <Code className="h-5 w-5 text-yellow-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          مكتبة رسمية لـ JavaScript و Node.js
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          تحميل المكتبة
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <h4 className="font-semibold">PHP</h4>
                          <Code className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          مكتبة رسمية لـ PHP
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          تحميل المكتبة
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <h4 className="font-semibold">Python</h4>
                          <Code className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          مكتبة رسمية لـ Python
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          تحميل المكتبة
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiSettings;

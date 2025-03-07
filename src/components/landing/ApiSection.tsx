import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const ApiSection = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-right">
          <h3 className="text-2xl font-bold">واجهة برمجة التطبيقات (API)</h3>
          <p className="text-gray-700">
            نقدم واجهة برمجة تطبيقات (API) قوية وسهلة الاستخدام تتيح لك دمج
            خدماتنا مباشرة في تطبيقاتك وأنظمتك الخاصة.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
            <li>إنشاء طلبات جديدة برمجياً</li>
            <li>الاستعلام عن حالة الطلبات الحالية</li>
            <li>استيراد قائمة الخدمات المتاحة وأسعارها</li>
            <li>إدارة رصيد حسابك</li>
            <li>إحصائيات وتقارير مفصلة</li>
          </ul>
          <div className="pt-4">
            <Button onClick={() => navigate("/login")}>
              تسجيل الدخول للوصول إلى API
            </Button>
          </div>
        </div>

        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <Tabs defaultValue="order" dir="rtl">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="order">إنشاء طلب</TabsTrigger>
                <TabsTrigger value="status">حالة الطلب</TabsTrigger>
                <TabsTrigger value="services">الخدمات</TabsTrigger>
              </TabsList>

              <TabsContent value="order">
                <div
                  className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                  dir="ltr"
                >
                  <pre>{`POST /api/v1/order
Content-Type: application/json
API-Key: your_api_key

{
  "service": "SRV-001",
  "link": "https://instagram.com/username",
  "quantity": 1000
}`}</pre>
                </div>
              </TabsContent>

              <TabsContent value="status">
                <div
                  className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                  dir="ltr"
                >
                  <pre>{`GET /api/v1/order/ORD-123456
Content-Type: application/json
API-Key: your_api_key`}</pre>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div
                  className="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto text-left"
                  dir="ltr"
                >
                  <pre>{`GET /api/v1/services
Content-Type: application/json
API-Key: your_api_key`}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-right">
        <h3 className="text-xl font-bold text-blue-800 mb-2">مميزات API</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-700">
          <div className="space-y-2">
            <h4 className="font-semibold">سهولة الاستخدام</h4>
            <p className="text-sm">واجهة برمجية بسيطة وموثقة بشكل كامل</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">أمان عالي</h4>
            <p className="text-sm">تشفير SSL وأنظمة مصادقة متقدمة</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">توثيق شامل</h4>
            <p className="text-sm">أمثلة كود بلغات برمجة متعددة</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-lg mb-4">
          للحصول على توثيق API الكامل والبدء في استخدامه، قم بإنشاء حساب أو
          تسجيل الدخول.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/login")}>
            تسجيل الدخول
          </Button>
          <Button onClick={() => navigate("/register")}>إنشاء حساب جديد</Button>
        </div>
      </div>
    </div>
  );
};

export default ApiSection;

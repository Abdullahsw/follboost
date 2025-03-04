import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, Users, Shield } from "lucide-react";
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

const AdminChildPanel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const childPanels = [
    {
      id: "CP-001",
      name: "لوحة المبيعات",
      owner: "ahmed@example.com",
      domain: "sales.follboost.com",
      status: "نشط",
      created: "2023-06-15",
      services: 45,
    },
    {
      id: "CP-002",
      name: "لوحة التسويق",
      owner: "marketing@example.com",
      domain: "marketing.follboost.com",
      status: "نشط",
      created: "2023-06-10",
      services: 32,
    },
    {
      id: "CP-003",
      name: "لوحة الدعم الفني",
      owner: "support@example.com",
      domain: "support.follboost.com",
      status: "معلق",
      created: "2023-06-18",
      services: 0,
    },
  ];

  const handleCreateChildPanel = (e: React.FormEvent) => {
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        نظام اللوحات الفرعية
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم إنشاء اللوحة الفرعية بنجاح وإرسال بيانات الدخول إلى البريد
            الإلكتروني المحدد.
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

      <Tabs defaultValue="panels" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="panels">اللوحات الفرعية</TabsTrigger>
          <TabsTrigger value="create">إنشاء لوحة فرعية</TabsTrigger>
        </TabsList>

        <TabsContent value="panels">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                اللوحات الفرعية الحالية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم اللوحة</TableHead>
                      <TableHead className="text-right">اسم اللوحة</TableHead>
                      <TableHead className="text-right">المالك</TableHead>
                      <TableHead className="text-right">النطاق</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">
                        تاريخ الإنشاء
                      </TableHead>
                      <TableHead className="text-right">عدد الخدمات</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {childPanels.map((panel) => (
                      <TableRow key={panel.id}>
                        <TableCell className="font-medium">
                          {panel.id}
                        </TableCell>
                        <TableCell>{panel.name}</TableCell>
                        <TableCell>{panel.owner}</TableCell>
                        <TableCell>{panel.domain}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${panel.status === "نشط" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                          >
                            {panel.status}
                          </span>
                        </TableCell>
                        <TableCell>{panel.created}</TableCell>
                        <TableCell>{panel.services}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              إدارة
                            </Button>
                            <Button variant="outline" size="sm">
                              تعليق
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

        <TabsContent value="create">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-right">
                إنشاء لوحة فرعية جديدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateChildPanel} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="panel-name" className="text-right block">
                      اسم اللوحة الفرعية
                    </Label>
                    <Input
                      id="panel-name"
                      placeholder="أدخل اسم اللوحة الفرعية"
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner-email" className="text-right block">
                      البريد الإلكتروني للمالك
                    </Label>
                    <Input
                      id="owner-email"
                      type="email"
                      placeholder="example@domain.com"
                      dir="ltr"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-right block">
                      النطاق الفرعي
                    </Label>
                    <div className="flex items-center">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-r-md">
                        .follboost.com
                      </span>
                      <Input
                        id="domain"
                        placeholder="subdomain"
                        className="rounded-r-none text-left"
                        dir="ltr"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-right block">
                      السمة
                    </Label>
                    <Input
                      id="theme"
                      placeholder="اختر سمة اللوحة الفرعية"
                      className="text-right"
                      defaultValue="الافتراضية"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-right">
                    الصلاحيات والخدمات
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-end space-x-2 space-x-reverse">
                      <Label htmlFor="all-services" className="text-right">
                        مشاركة جميع الخدمات
                      </Label>
                      <Checkbox id="all-services" />
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      سيتمكن مالك اللوحة الفرعية من الوصول إلى جميع الخدمات
                      المتاحة في اللوحة الرئيسية
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-end space-x-2 space-x-reverse">
                      <Label htmlFor="auto-update" className="text-right">
                        تحديث الخدمات تلقائياً
                      </Label>
                      <Checkbox id="auto-update" />
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      سيتم تحديث الخدمات في اللوحة الفرعية تلقائياً عند إضافة
                      خدمات جديدة في اللوحة الرئيسية
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-end space-x-2 space-x-reverse">
                      <Label htmlFor="custom-pricing" className="text-right">
                        السماح بتعديل الأسعار
                      </Label>
                      <Checkbox id="custom-pricing" />
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      سيتمكن مالك اللوحة الفرعية من تعديل أسعار الخدمات المقدمة
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5 ml-2" />
                    <p className="text-sm text-blue-700 text-right">
                      <strong>ملاحظة هامة:</strong> بعد إنشاء اللوحة الفرعية،
                      سيتم إرسال بيانات الدخول إلى البريد الإلكتروني المحدد.
                      يمكن للمالك تغيير كلمة المرور بعد تسجيل الدخول لأول مرة.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "جاري الإنشاء..." : "إنشاء اللوحة الفرعية"}
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
            معلومات عن نظام اللوحات الفرعية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-right">
            <p className="text-gray-700">
              نظام اللوحات الفرعية يتيح لك إنشاء مواقع فرعية مستقلة تعمل تحت
              إشرافك وتستخدم خدمات اللوحة الرئيسية. يمكن استخدام هذه الميزة
              لإنشاء وكالات تسويق خاصة بك أو منح شركائك لوحات تحكم خاصة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border rounded-lg p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold mb-1">إدارة العملاء</h3>
                <p className="text-sm text-gray-600">
                  يمكن لمالك اللوحة الفرعية إدارة عملائه الخاصين بشكل مستقل
                </p>
              </div>

              <div className="border rounded-lg p-4 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold mb-1">تخصيص الأسعار</h3>
                <p className="text-sm text-gray-600">
                  تحديد هوامش ربح مخصصة لكل خدمة في اللوحة الفرعية
                </p>
              </div>

              <div className="border rounded-lg p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold mb-1">تنفيذ تلقائي</h3>
                <p className="text-sm text-gray-600">
                  تنفيذ الطلبات تلقائياً من خلال اللوحة الرئيسية
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChildPanel;

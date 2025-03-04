import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Share2, Users, TrendingUp, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReferralProgramPage = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://follboost.com/ref/user123";
  const referralCode = "USER123";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = `انضم إلى FollBoost واحصل على خدمات وسائل التواصل الاجتماعي بأفضل الأسعار! استخدم رابط الإحالة الخاص بي: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaTwitter = () => {
    const text = `احصل على خدمات وسائل التواصل الاجتماعي بأفضل الأسعار مع FollBoost! استخدم رمز الإحالة الخاص بي: ${referralCode}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const referrals = [
    {
      id: 1,
      user: "ahmed@example.com",
      date: "2023-06-15",
      status: "نشط",
      orders: 5,
      commission: 25,
    },
    {
      id: 2,
      user: "sara@example.com",
      date: "2023-06-10",
      status: "نشط",
      orders: 3,
      commission: 15,
    },
    {
      id: 3,
      user: "mohammed@example.com",
      date: "2023-06-05",
      status: "نشط",
      orders: 8,
      commission: 40,
    },
  ];

  const commissions = [
    {
      id: "COM-001",
      date: "2023-06-15",
      user: "ahmed@example.com",
      order: "ORD-123",
      amount: 5,
      status: "مدفوع",
    },
    {
      id: "COM-002",
      date: "2023-06-12",
      user: "sara@example.com",
      order: "ORD-124",
      amount: 3,
      status: "مدفوع",
    },
    {
      id: "COM-003",
      date: "2023-06-10",
      user: "ahmed@example.com",
      order: "ORD-125",
      amount: 7,
      status: "مدفوع",
    },
    {
      id: "COM-004",
      date: "2023-06-08",
      user: "mohammed@example.com",
      order: "ORD-126",
      amount: 10,
      status: "مدفوع",
    },
    {
      id: "COM-005",
      date: "2023-06-05",
      user: "sara@example.com",
      order: "ORD-127",
      amount: 5,
      status: "مدفوع",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        برنامج الإحالة
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-right flex items-center justify-end gap-2">
              إجمالي الإحالات
              <Users className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 text-center">
              {referrals.length}
            </div>
            <p className="text-sm text-gray-500 text-center">
              مستخدمين تمت إحالتهم
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-right flex items-center justify-end gap-2">
              إجمالي العمولات
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 text-center">
              {commissions.reduce(
                (total, commission) => total + commission.amount,
                0,
              )}{" "}
              ر.س
            </div>
            <p className="text-sm text-gray-500 text-center">عمولات مكتسبة</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-right flex items-center justify-end gap-2">
              معدل التحويل
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 text-center">
              15%
            </div>
            <p className="text-sm text-gray-500 text-center">
              نسبة تحويل الزيارات إلى مستخدمين
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            رابط الإحالة الخاص بك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 text-right">
                شارك الرابط أدناه مع أصدقائك وعملائك. عندما يقومون بالتسجيل
                واستخدام خدماتنا، ستحصل على عمولة 5% من قيمة كل طلب يقومون به!
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralLink)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "تم النسخ!" : "نسخ الرابط"}
                </Button>
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 text-left dir-ltr"
                />
              </div>

              {copied && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800 text-right">
                    تم نسخ الرابط إلى الحافظة!
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-right">رمز الإحالة</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralCode)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  نسخ الرمز
                </Button>
                <Input
                  value={referralCode}
                  readOnly
                  className="flex-1 text-center font-bold tracking-wider"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-right">
                مشاركة عبر وسائل التواصل
              </h3>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={shareViaTwitter}>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
                  </svg>
                  تويتر
                </Button>
                <Button variant="outline" onClick={shareViaWhatsApp}>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  واتساب
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  مشاركة
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="referrals" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="referrals">المستخدمين المُحالين</TabsTrigger>
          <TabsTrigger value="commissions">العمولات</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                المستخدمين المُحالين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">#</TableHead>
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">
                        تاريخ التسجيل
                      </TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">عدد الطلبات</TableHead>
                      <TableHead className="text-right">
                        إجمالي العمولة
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>{referral.id}</TableCell>
                        <TableCell>{referral.user}</TableCell>
                        <TableCell>{referral.date}</TableCell>
                        <TableCell>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {referral.status}
                          </span>
                        </TableCell>
                        <TableCell>{referral.orders}</TableCell>
                        <TableCell>{referral.commission} ر.س</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                سجل العمولات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم العمولة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell>{commission.id}</TableCell>
                        <TableCell>{commission.date}</TableCell>
                        <TableCell>{commission.user}</TableCell>
                        <TableCell>{commission.order}</TableCell>
                        <TableCell>{commission.amount} ر.س</TableCell>
                        <TableCell>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {commission.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            كيفية عمل برنامج الإحالة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-right">
            <p className="text-gray-700">
              برنامج الإحالة في FollBoost يتيح لك كسب عمولات من خلال دعوة
              أصدقائك وعملائك لاستخدام خدماتنا. إليك كيفية عمل البرنامج:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mr-4">
              <li>شارك رابط الإحالة الخاص بك مع أصدقائك وعملائك ومتابعيك</li>
              <li>
                عندما يقوم شخص بالتسجيل من خلال رابطك، يتم تسجيله تلقائياً
                كمستخدم مُحال من قبلك
              </li>
              <li>
                تحصل على عمولة بنسبة 5% من قيمة كل طلب يقوم به المستخدم المُحال
              </li>
              <li>
                يتم إضافة العمولات إلى رصيدك تلقائياً ويمكنك استخدامها في طلباتك
                أو طلب سحبها
              </li>
            </ol>
            <p className="text-gray-700">
              لا يوجد حد أقصى لعدد المستخدمين الذين يمكنك إحالتهم أو للعمولات
              التي يمكنك كسبها. كلما زاد عدد المستخدمين المُحالين، زادت أرباحك!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralProgramPage;

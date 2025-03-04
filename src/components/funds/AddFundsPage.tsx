import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AddFundsPage = () => {
  const [amount, setAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      setError("يرجى إدخال مبلغ صحيح");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setAmount("100");
      }, 3000);
    }, 1500);
  };

  const predefinedAmounts = [50, 100, 200, 500, 1000];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إضافة رصيد
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">
            تمت إضافة الرصيد بنجاح!
          </AlertTitle>
          <AlertDescription className="text-right">
            تم إضافة {amount} ر.س إلى رصيدك بنجاح. يمكنك الآن استخدام الرصيد
            لإنشاء طلبات جديدة.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-right">
                اختر طريقة الدفع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="online-payment" dir="rtl" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="online-payment">دفع إلكتروني</TabsTrigger>
                  <TabsTrigger value="bank-transfer">تحويل بنكي</TabsTrigger>
                </TabsList>

                <TabsContent value="online-payment">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-right block">اختر المبلغ</Label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {predefinedAmounts.map((predefinedAmount) => (
                          <Button
                            key={predefinedAmount}
                            type="button"
                            variant={
                              amount === predefinedAmount.toString()
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setAmount(predefinedAmount.toString())
                            }
                          >
                            {predefinedAmount} ر.س
                          </Button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="custom-amount" className="shrink-0">
                          مبلغ آخر:
                        </Label>
                        <Input
                          id="custom-amount"
                          type="number"
                          min="10"
                          step="10"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-32"
                        />
                        <span>ر.س</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-right block">
                        اختر وسيلة الدفع
                      </Label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-end space-x-2 space-x-reverse border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                          <div className="flex-1 text-right">
                            <div className="font-medium">
                              بطاقة ائتمان / مدى
                            </div>
                            <div className="text-sm text-gray-500">
                              Visa, Mastercard, mada
                            </div>
                          </div>
                          <RadioGroupItem
                            value="credit-card"
                            id="credit-card"
                          />
                          <CreditCard className="h-5 w-5 text-primary ml-2" />
                        </div>
                        <div className="flex items-center justify-end space-x-2 space-x-reverse border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                          <div className="flex-1 text-right">
                            <div className="font-medium">محفظة إلكترونية</div>
                            <div className="text-sm text-gray-500">
                              Apple Pay, STC Pay
                            </div>
                          </div>
                          <RadioGroupItem value="e-wallet" id="e-wallet" />
                          <Wallet className="h-5 w-5 text-primary ml-2" />
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm text-blue-700 text-right">
                        <strong>ملاحظة:</strong> سيتم تحويلك إلى صفحة الدفع
                        الآمنة لإتمام العملية. جميع المعاملات مشفرة ومؤمنة.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting
                          ? "جاري المعالجة..."
                          : "إتمام عملية الدفع"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="bank-transfer">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-right block">
                        معلومات الحساب البنكي
                      </Label>
                      <div className="border rounded-md p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            البنك الأهلي السعودي
                          </span>
                          <span className="text-gray-500">اسم البنك</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">
                            شركة فول بوست للتسويق الإلكتروني
                          </span>
                          <span className="text-gray-500">اسم المستفيد</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">
                            SA0380000000608010167519
                          </span>
                          <span className="text-gray-500">رقم الآيبان</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-right block">
                        خطوات التحويل البنكي
                      </Label>
                      <ol className="list-decimal list-inside space-y-2 text-right">
                        <li>
                          قم بتحويل المبلغ المطلوب إلى الحساب المذكور أعلاه
                        </li>
                        <li>احتفظ بإيصال التحويل أو لقطة شاشة للعملية</li>
                        <li>
                          أرسل صورة الإيصال إلى فريق الدعم عبر قسم الدعم الفني
                        </li>
                        <li>سيتم إضافة الرصيد لحسابك خلال 24 ساعة كحد أقصى</li>
                      </ol>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-md">
                      <p className="text-sm text-amber-700 text-right">
                        <strong>هام:</strong> يرجى التأكد من إضافة رقم الطلب أو
                        اسم المستخدم الخاص بك في تفاصيل التحويل لتسهيل عملية
                        التحقق.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.open("/help", "_blank")}
                      >
                        التواصل مع الدعم الفني
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-right">
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">{amount} ر.س</span>
                  <span className="text-gray-500">المبلغ</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">0 ر.س</span>
                  <span className="text-gray-500">رسوم الخدمة</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold">
                  <span>{amount} ر.س</span>
                  <span>الإجمالي</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-right">مزايا إضافة الرصيد</h3>
                <ul className="space-y-2 text-right">
                  <li className="flex items-center justify-end gap-2">
                    <span>تنفيذ الطلبات بشكل فوري</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>خصومات على الطلبات الكبيرة</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>أولوية في تنفيذ الطلبات</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            سجل المعاملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" dir="rtl">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    رقم العملية
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    التاريخ
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    المبلغ
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    طريقة الدفع
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">TRX-001</td>
                  <td className="py-3 px-4 text-gray-800">2023-06-15</td>
                  <td className="py-3 px-4 text-gray-800">100 ر.س</td>
                  <td className="py-3 px-4 text-gray-800">بطاقة ائتمان</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      مكتمل
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">TRX-002</td>
                  <td className="py-3 px-4 text-gray-800">2023-06-10</td>
                  <td className="py-3 px-4 text-gray-800">200 ر.س</td>
                  <td className="py-3 px-4 text-gray-800">تحويل بنكي</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      مكتمل
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">TRX-003</td>
                  <td className="py-3 px-4 text-gray-800">2023-06-05</td>
                  <td className="py-3 px-4 text-gray-800">50 ر.س</td>
                  <td className="py-3 px-4 text-gray-800">محفظة إلكترونية</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      مكتمل
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFundsPage;

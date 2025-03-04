import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Globe, DollarSign } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LanguageCurrencySettings = () => {
  const [language, setLanguage] = useState("ar");
  const [currency, setCurrency] = useState("SAR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSaveSettings = () => {
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

  const languages = [
    { id: "ar", name: "العربية", flag: "🇸🇦" },
    { id: "en", name: "English", flag: "🇺🇸" },
  ];

  const currencies = [
    { id: "SAR", name: "ريال سعودي", symbol: "ر.س", rate: 1 },
    { id: "USD", name: "دولار أمريكي", symbol: "$", rate: 0.27 },
    { id: "IQD", name: "دينار عراقي", symbol: "د.ع", rate: 350 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إعدادات اللغة والعملة
      </h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">
            تم حفظ الإعدادات بنجاح!
          </AlertTitle>
          <AlertDescription className="text-right">
            تم تحديث إعدادات اللغة والعملة بنجاح.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-right flex items-center justify-end gap-2">
              إعدادات اللغة
              <Globe className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label className="text-right block">اختر لغة التطبيق</Label>
              <RadioGroup
                value={language}
                onValueChange={setLanguage}
                className="space-y-3"
              >
                {languages.map((lang) => (
                  <div
                    key={lang.id}
                    className="flex items-center justify-end space-x-2 space-x-reverse border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex-1 text-right">
                      <div className="font-medium">{lang.name}</div>
                    </div>
                    <RadioGroupItem value={lang.id} id={`lang-${lang.id}`} />
                    <span className="text-xl ml-2">{lang.flag}</span>
                  </div>
                ))}
              </RadioGroup>

              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <p className="text-sm text-blue-700 text-right">
                  <strong>ملاحظة:</strong> سيتم تغيير لغة واجهة التطبيق فقط. لن
                  يؤثر ذلك على محتوى الخدمات أو الطلبات الحالية.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-right flex items-center justify-end gap-2">
              إعدادات العملة
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label className="text-right block">اختر عملة الدفع</Label>
              <RadioGroup
                value={currency}
                onValueChange={setCurrency}
                className="space-y-3"
              >
                {currencies.map((curr) => (
                  <div
                    key={curr.id}
                    className="flex items-center justify-end space-x-2 space-x-reverse border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex-1 text-right">
                      <div className="font-medium">{curr.name}</div>
                      <div className="text-sm text-gray-500">
                        سعر الصرف:{" "}
                        {curr.rate === 1
                          ? "العملة الأساسية"
                          : `1 ر.س = ${curr.rate} ${curr.symbol}`}
                      </div>
                    </div>
                    <RadioGroupItem value={curr.id} id={`curr-${curr.id}`} />
                    <span className="text-xl font-bold ml-2">
                      {curr.symbol}
                    </span>
                  </div>
                ))}
              </RadioGroup>

              <div className="bg-amber-50 p-4 rounded-md mt-4">
                <p className="text-sm text-amber-700 text-right">
                  <strong>هام:</strong> عند تغيير العملة، سيتم تحويل جميع
                  الأسعار والأرصدة تلقائياً حسب سعر الصرف الحالي.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            أمثلة على تحويل العملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full" dir="rtl">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      الخدمة
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      السعر (ر.س)
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      السعر ($)
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      السعر (د.ع)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      1000 متابع انستغرام
                    </td>
                    <td className="py-3 px-4 text-gray-800">50 ر.س</td>
                    <td className="py-3 px-4 text-gray-800">$13.50</td>
                    <td className="py-3 px-4 text-gray-800">17,500 د.ع</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      5000 مشاهدة يوتيوب
                    </td>
                    <td className="py-3 px-4 text-gray-800">75 ر.س</td>
                    <td className="py-3 px-4 text-gray-800">$20.25</td>
                    <td className="py-3 px-4 text-gray-800">26,250 د.ع</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      2000 إعجاب تيك توك
                    </td>
                    <td className="py-3 px-4 text-gray-800">60 ر.س</td>
                    <td className="py-3 px-4 text-gray-800">$16.20</td>
                    <td className="py-3 px-4 text-gray-800">21,000 د.ع</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Separator className="my-4" />

            <div className="text-right">
              <p className="text-gray-700">
                <strong>ملاحظة:</strong> أسعار الصرف قابلة للتغيير وتُحدث بشكل
                دوري من قبل إدارة الموقع.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSubmitting} size="lg">
          {isSubmitting ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </div>
  );
};

export default LanguageCurrencySettings;

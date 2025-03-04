import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CreateOrderPageProps {
  preSelectedService?: string;
}

const CreateOrderPage = ({ preSelectedService }: CreateOrderPageProps) => {
  const [selectedService, setSelectedService] = useState(
    preSelectedService || "",
  );
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [quantity, setQuantity] = useState("1000");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");

  const services = [
    { id: "1", name: "متابعين", price: 0.05 },
    { id: "2", name: "إعجابات", price: 0.03 },
    { id: "3", name: "مشاهدات", price: 0.01 },
    { id: "4", name: "تعليقات", price: 0.15 },
    { id: "5", name: "إعادة نشر", price: 0.08 },
  ];

  const platforms = [
    { id: "1", name: "انستغرام" },
    { id: "2", name: "تويتر" },
    { id: "3", name: "فيسبوك" },
    { id: "4", name: "يوتيوب" },
    { id: "5", name: "تيك توك" },
  ];

  const calculatePrice = () => {
    const service = services.find((s) => s.id === selectedService);
    if (!service) return 0;
    return service.price * parseInt(quantity || "0");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!selectedService) {
      setError("يرجى اختيار الخدمة");
      return;
    }
    if (!selectedPlatform) {
      setError("يرجى اختيار المنصة");
      return;
    }
    if (!link) {
      setError("يرجى إدخال الرابط");
      return;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      setError("يرجى إدخال كمية صحيحة");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setOrderSuccess(false);
        setSelectedService("");
        setSelectedPlatform("");
        setQuantity("1000");
        setLink("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إنشاء طلب جديد
      </h1>

      {orderSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تم إنشاء الطلب بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم إضافة طلبك إلى قائمة الطلبات النشطة وسيتم تنفيذه في أقرب وقت
            ممكن.
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

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            تفاصيل الطلب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-right block">
                  اختر الخدمة
                </Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {service.price} ر.س لكل وحدة
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform" className="text-right block">
                  اختر المنصة
                </Label>
                <Select
                  value={selectedPlatform}
                  onValueChange={setSelectedPlatform}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-right block">
                رابط الحساب / المنشور
              </Label>
              <Input
                id="link"
                placeholder="https://"
                dir="ltr"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <p className="text-sm text-gray-500 text-right">
                أدخل الرابط الكامل للحساب أو المنشور المراد زيادة
                المتابعين/الإعجابات له
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-right block">
                  الكمية
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="100"
                  step="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right block">السعر الإجمالي</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-gray-100 flex items-center justify-between">
                  <span>{calculatePrice().toFixed(2)} ر.س</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service-description" className="text-right block">
                وصف الخدمة
              </Label>
              <div className="p-3 bg-gray-50 rounded-md text-right text-gray-700 text-sm">
                {selectedService === "1"
                  ? "متابعين عرب حقيقيين مع صور شخصية ومنشورات. لا يتطلب كلمة مرور، فقط حساب عام. تبدأ الزيادة خلال 1-2 ساعة من تأكيد الطلب."
                  : selectedService === "2"
                    ? "إعجابات عالية الجودة لمنشورات انستغرام. تبدأ خلال 30 دقيقة من تأكيد الطلب. لا تتطلب كلمة مرور، فقط رابط المنشور."
                    : selectedService === "3"
                      ? "مشاهدات عالية الاحتفاظ من مصادر متنوعة. تزيد تدريجياً لتجنب الحظر. تبدأ خلال 12 ساعة من تأكيد الطلب."
                      : selectedService === "4"
                        ? "تعليقات مخصصة من حسابات عربية حقيقية. يمكنك تحديد نص التعليقات. تبدأ خلال 2-3 ساعات من تأكيد الطلب."
                        : selectedService === "5"
                          ? "إعادة نشر من حسابات حقيقية لزيادة انتشار منشوراتك. تبدأ خلال 2-3 ساعات من تأكيد الطلب."
                          : "اختر خدمة لعرض وصفها التفصيلي"}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700 text-right">
                <strong>ملاحظة:</strong> سيتم خصم المبلغ من رصيدك الحالي. تأكد
                من وجود رصيد كافٍ قبل إتمام الطلب.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "جاري إنشاء الطلب..." : "إنشاء الطلب"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            معلومات هامة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-right">
            <p className="text-gray-700">
              <strong>سرعة التنفيذ:</strong> يتم تنفيذ الطلبات حسب الأولوية وحجم
              الطلب. يمكنك الاطلاع على أوقات التنفيذ المتوقعة في صفحة معلومات
              الخدمات.
            </p>
            <p className="text-gray-700">
              <strong>ضمان الخدمة:</strong> نقدم ضمان تعويض لمدة 30 يومًا في حال
              انخفاض العدد بعد اكتمال الطلب.
            </p>
            <p className="text-gray-700">
              <strong>الدعم الفني:</strong> في حال واجهتك أي مشكلة، يرجى التواصل
              مع فريق الدعم الفني على مدار الساعة.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrderPage;

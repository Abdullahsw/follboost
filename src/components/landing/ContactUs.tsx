import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

const ContactUs = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert("تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <h3 className="text-xl font-bold text-right mb-4">تواصل معنا</h3>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block">
                الاسم
              </Label>
              <Input
                id="name"
                placeholder="أدخل اسمك الكامل"
                className="text-right"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                dir="ltr"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-right block">
                الموضوع
              </Label>
              <Input
                id="subject"
                placeholder="موضوع الرسالة"
                className="text-right"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-right block">
                الرسالة
              </Label>
              <Textarea
                id="message"
                placeholder="اكتب رسالتك هنا..."
                className="text-right min-h-[120px]"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              إرسال الرسالة
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6 text-right">
        <h3 className="text-xl font-bold">معلومات الاتصال</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-3">
            <div>
              <h4 className="font-semibold">البريد الإلكتروني</h4>
              <p className="text-gray-600">support@follboost.com</p>
            </div>
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center justify-end gap-3">
            <div>
              <h4 className="font-semibold">رقم الهاتف</h4>
              <p className="text-gray-600">+966 50 123 4567</p>
            </div>
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center justify-end gap-3">
            <div>
              <h4 className="font-semibold">العنوان</h4>
              <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
            </div>
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center justify-end gap-3">
            <div>
              <h4 className="font-semibold">الدعم الفني</h4>
              <p className="text-gray-600">متاح 24/7</p>
            </div>
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-xl font-bold mb-4">
            تابعنا على وسائل التواصل الاجتماعي
          </h3>
          <div className="flex justify-end gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Instagram className="h-6 w-6 text-pink-600" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Twitter className="h-6 w-6 text-blue-400" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Facebook className="h-6 w-6 text-blue-600" />
            </a>
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-xl font-bold mb-4">ساعات العمل</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>9:00 صباحاً - 10:00 مساءً</span>
              <span>الأحد - الخميس</span>
            </div>
            <div className="flex justify-between">
              <span>10:00 صباحاً - 6:00 مساءً</span>
              <span>الجمعة - السبت</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

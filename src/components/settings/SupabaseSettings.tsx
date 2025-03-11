import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SupabaseConnectionTest from "../SupabaseConnectionTest";

const SupabaseSettings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إعدادات الاتصال بقاعدة البيانات
      </h1>

      <Card className="w-full bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-right">
            اختبار الاتصال بـ Supabase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6 text-right">
            استخدم هذه الأداة لاختبار الاتصال بقاعدة بيانات Supabase والتأكد من
            أن جميع الخدمات تعمل بشكل صحيح.
          </p>

          <SupabaseConnectionTest />

          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2 text-right">
              معلومات مهمة
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700 text-right text-sm">
              <li>
                تأكد من تكوين متغيرات البيئة الصحيحة في ملف .env أو في إعدادات
                الاستضافة.
              </li>
              <li>
                إذا كنت تستخدم Vercel، تأكد من إضافة متغيرات البيئة في إعدادات
                المشروع.
              </li>
              <li>
                تأكد من أن مفتاح API الخاص بـ Supabase صالح ولديه الأذونات
                المناسبة.
              </li>
              <li>
                إذا استمرت المشكلة، تحقق من سجلات الخطأ في وحدة تحكم المتصفح.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseSettings;

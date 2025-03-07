import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-right">
          <h3 className="text-2xl font-bold">من نحن</h3>
          <p className="text-gray-700">
            FollBoost هي منصة رائدة في مجال خدمات وسائل التواصل الاجتماعي، تأسست
            عام 2020 بهدف تقديم حلول مبتكرة وفعالة لتعزيز التواجد الرقمي للأفراد
            والشركات على مختلف منصات التواصل الاجتماعي.
          </p>
          <p className="text-gray-700">
            نحن نفخر بتقديم خدمات عالية الجودة وآمنة تماماً، مع التركيز على رضا
            العملاء وتحقيق نتائج ملموسة. فريقنا من الخبراء يعمل باستمرار على
            تطوير وتحسين خدماتنا لمواكبة التغيرات المستمرة في عالم وسائل التواصل
            الاجتماعي.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 space-y-4 text-right">
          <h3 className="text-2xl font-bold">رؤيتنا</h3>
          <p className="text-gray-700">
            أن نكون الخيار الأول والأفضل في مجال خدمات تعزيز وسائل التواصل
            الاجتماعي في الشرق الأوسط، من خلال تقديم خدمات متميزة وحلول مبتكرة
            تساعد عملائنا على تحقيق أهدافهم الرقمية.
          </p>
          <h3 className="text-2xl font-bold mt-6">مهمتنا</h3>
          <p className="text-gray-700">
            تمكين الأفراد والشركات من بناء وتعزيز تواجدهم الرقمي بطرق آمنة
            وفعالة، وتقديم خدمات عالية الجودة بأسعار منافسة، مع ضمان تجربة
            مستخدم سلسة ودعم فني متميز.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center mb-8">
          لماذا تختار FollBoost؟
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">جودة عالية</h4>
              <p className="text-gray-700">
                نقدم خدمات عالية الجودة من مصادر حقيقية وآمنة، مع ضمان استمرارية
                النتائج.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">أسعار منافسة</h4>
              <p className="text-gray-700">
                أسعار مناسبة لجميع الفئات مع خصومات خاصة للطلبات الكبيرة
                والعملاء الدائمين.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">دعم فني 24/7</h4>
              <p className="text-gray-700">
                فريق دعم فني متخصص متاح على مدار الساعة للإجابة على استفساراتك
                وحل أي مشكلة.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">واجهة سهلة الاستخدام</h4>
              <p className="text-gray-700">
                منصة بسيطة وسهلة الاستخدام تتيح لك إنشاء وإدارة طلباتك بكل
                سهولة.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">API متكامل</h4>
              <p className="text-gray-700">
                واجهة برمجية متكاملة تتيح لك دمج خدماتنا مع أنظمتك وتطبيقاتك
                الخاصة.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-right">
              <h4 className="text-xl font-bold mb-2">أمان وخصوصية</h4>
              <p className="text-gray-700">
                نضمن أمان وخصوصية بياناتك، ولا نطلب أبداً كلمات المرور الخاصة
                بحساباتك.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

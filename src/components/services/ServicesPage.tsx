import React from "react";
import DeliveryTimes from "./DeliveryTimes";
import ServiceFAQ from "./ServiceFAQ";

const ServicesPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        معلومات الخدمات
      </h1>

      {/* Service Delivery Times */}
      <DeliveryTimes />

      {/* Service FAQ */}
      <ServiceFAQ />

      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-right mb-4">
          لماذا تختلف أوقات التنفيذ؟
        </h2>
        <div className="space-y-4 text-right">
          <p className="text-gray-700">
            تختلف أوقات تنفيذ الخدمات بناءً على عدة عوامل مهمة:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
            <li>
              حجم الطلب - الطلبات الكبيرة تستغرق وقتًا أطول للتنفيذ بشكل طبيعي
            </li>
            <li>
              نوع المنصة - كل منصة لها قيود وسياسات مختلفة تؤثر على سرعة التنفيذ
            </li>
            <li>
              حالة الحساب المستهدف - الحسابات الخاصة أو المقيدة قد تستغرق وقتًا
              أطول
            </li>
            <li>
              الضغط الحالي على النظام - في أوقات الذروة قد تكون هناك فترات
              انتظار أطول
            </li>
          </ul>
          <p className="text-gray-700">
            نحن نسعى دائمًا لتقديم أسرع خدمة ممكنة مع الحفاظ على جودة عالية
            وأمان لحسابك. إذا كان لديك طلب عاجل، يرجى التواصل مع فريق الدعم
            للحصول على المساعدة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

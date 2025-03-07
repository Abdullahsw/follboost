import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PublicHeader from "./PublicHeader";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-8 flex justify-between items-center">
            <Button asChild variant="outline">
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
            <h1 className="text-3xl font-bold">سياسة الخصوصية</h1>
          </div>

          <div className="space-y-6 text-right">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">1. مقدمة</h2>
              <p className="text-gray-700">
                في FollBoost، نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية.
                توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا
                لمعلوماتك عند استخدامك لموقعنا وخدماتنا.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                2. المعلومات التي نجمعها
              </h2>
              <p className="text-gray-700">
                قد نجمع أنواعًا مختلفة من المعلومات، بما في ذلك:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>
                  معلومات التعريف الشخصية (مثل الاسم والبريد الإلكتروني ورقم
                  الهاتف)
                </li>
                <li>
                  معلومات الدفع (مثل تفاصيل بطاقة الائتمان أو معلومات الحساب
                  المصرفي)
                </li>
                <li>معلومات الحساب (مثل اسم المستخدم وكلمة المرور)</li>
                <li>معلومات الاستخدام (مثل كيفية استخدامك لموقعنا وخدماتنا)</li>
                <li>
                  معلومات الجهاز (مثل نوع المتصفح ونظام التشغيل وعنوان IP)
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">3. كيف نستخدم معلوماتك</h2>
              <p className="text-gray-700">
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>توفير وإدارة وتحسين خدماتنا</li>
                <li>معالجة المدفوعات وإدارة الحسابات</li>
                <li>التواصل معك بشأن خدماتنا وتقديم الدعم</li>
                <li>إرسال تحديثات وإشعارات وعروض ترويجية (إذا اخترت تلقيها)</li>
                <li>تحليل كيفية استخدام موقعنا وخدماتنا</li>
                <li>الامتثال للالتزامات القانونية وحماية حقوقنا</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">4. مشاركة المعلومات</h2>
              <p className="text-gray-700">
                لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في
                الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>
                  مع مقدمي الخدمات الذين يساعدوننا في تشغيل أعمالنا وتقديم
                  خدماتنا
                </li>
                <li>
                  عندما يكون ذلك مطلوبًا بموجب القانون أو للامتثال للإجراءات
                  القانونية
                </li>
                <li>
                  لحماية حقوقنا أو ممتلكاتنا أو سلامة مستخدمينا أو الجمهور
                </li>
                <li>
                  في حالة الاندماج أو الاستحواذ أو بيع الأصول، حيث قد يتم نقل
                  المعلومات كجزء من الأصول التجارية
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">5. أمان البيانات</h2>
              <p className="text-gray-700">
                نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الفقدان أو
                سوء الاستخدام أو الوصول غير المصرح به أو الإفصاح أو التعديل أو
                الإتلاف. ومع ذلك، لا يمكن ضمان أمان المعلومات المرسلة عبر
                الإنترنت بنسبة 100%.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">6. حقوقك</h2>
              <p className="text-gray-700">
                اعتمادًا على موقعك، قد يكون لديك حقوق معينة فيما يتعلق بمعلوماتك
                الشخصية، بما في ذلك:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
                <li>الوصول إلى معلوماتك الشخصية</li>
                <li>تصحيح المعلومات غير الدقيقة</li>
                <li>حذف معلوماتك الشخصية</li>
                <li>الاعتراض على معالجة معلوماتك</li>
                <li>نقل بياناتك إلى خدمة أخرى</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                7. ملفات تعريف الارتباط
              </h2>
              <p className="text-gray-700">
                نستخدم ملفات تعريف الارتباط وتقنيات مماثلة لتحسين تجربتك على
                موقعنا وتحليل كيفية استخدام موقعنا وتخصيص المحتوى والإعلانات.
                يمكنك ضبط إعدادات متصفحك لرفض ملفات تعريف الارتباط، ولكن ذلك قد
                يؤثر على قدرتك على استخدام بعض ميزات موقعنا.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                8. التغييرات على سياسة الخصوصية
              </h2>
              <p className="text-gray-700">
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي
                تغييرات جوهرية من خلال نشر السياسة الجديدة على موقعنا أو إرسال
                إشعار إليك.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">9. اتصل بنا</h2>
              <p className="text-gray-700">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا
                على privacy@follboost.com.
              </p>
            </div>

            <div className="pt-6 text-gray-500 text-sm">
              <p>آخر تحديث: {new Date().toLocaleDateString("ar-SA")}</p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button asChild>
              <Link to="/">العودة إلى الصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

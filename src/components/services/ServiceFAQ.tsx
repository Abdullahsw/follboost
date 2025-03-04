import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  faqs?: FAQItem[];
  title?: string;
}

const ServiceFAQ = ({
  faqs = [
    {
      question: "كم تستغرق عملية إضافة المتابعين؟",
      answer:
        "تختلف المدة حسب حجم الطلب والمنصة. عادةً ما تبدأ المتابعين بالظهور خلال 1-2 ساعة من تأكيد الطلب، وتكتمل الكمية الكاملة خلال 24 ساعة للطلبات الكبيرة.",
    },
    {
      question: "هل الخدمات آمنة على حسابي؟",
      answer:
        "نعم، جميع خدماتنا آمنة تمامًا. نحن نستخدم طرقًا متوافقة مع سياسات المنصات ونضمن عدم طلب كلمات المرور أو معلومات حساسة أبدًا.",
    },
    {
      question: "ماذا لو نقص عدد المتابعين بعد إتمام الطلب؟",
      answer:
        "نحن نقدم ضمان تعويض لمدة 30 يومًا. إذا انخفض عدد المتابعين خلال هذه الفترة، سنقوم بتعويضهم مجانًا. يرجى التواصل مع فريق الدعم لدينا.",
    },
    {
      question: "كم تستغرق عملية معالجة طلبات المشاهدات والإعجابات؟",
      answer:
        "طلبات الإعجابات عادة ما تبدأ خلال 30-60 دقيقة، بينما تستغرق المشاهدات وقتًا أطول قليلاً (2-12 ساعة) حسب المنصة وحجم الطلب.",
    },
    {
      question: "هل يمكنني تتبع حالة طلبي؟",
      answer:
        "نعم، يمكنك متابعة حالة جميع طلباتك في قسم 'إدارة الطلبات' في لوحة التحكم الخاصة بك، حيث يتم تحديث التقدم في الوقت الفعلي.",
    },
    {
      question: "كم تستغرق عملية استرداد الأموال إذا لم يتم تنفيذ طلبي؟",
      answer:
        "في الحالات النادرة التي لا نتمكن فيها من تنفيذ طلبك، يتم استرداد المبلغ إلى رصيد حسابك فورًا. يمكنك استخدامه في طلبات أخرى أو طلب تحويله إلى حسابك البنكي خلال 3-5 أيام عمل.",
    },
  ],
  title = "الأسئلة الشائعة",
}: ServiceFAQProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-right flex items-center justify-end gap-2">
          {title}
          <HelpCircle className="h-5 w-5 text-purple-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" dir="rtl">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-right">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-right">
                <p className="text-gray-700">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ServiceFAQ;

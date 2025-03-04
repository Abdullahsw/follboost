import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServiceDeliveryTime {
  service: string;
  platform: string;
  timeRange: string;
  note?: string;
}

interface DeliveryTimesProps {
  services?: ServiceDeliveryTime[];
  title?: string;
}

const DeliveryTimes = ({
  services = [
    {
      service: "متابعين",
      platform: "انستغرام",
      timeRange: "1-2 ساعة",
      note: "قد يستغرق وقت أطول للطلبات الكبيرة",
    },
    {
      service: "إعجابات",
      platform: "انستغرام",
      timeRange: "30-60 دقيقة",
    },
    {
      service: "تعليقات",
      platform: "انستغرام",
      timeRange: "2-3 ساعات",
      note: "التعليقات المخصصة تستغرق وقتًا أطول",
    },
    {
      service: "متابعين",
      platform: "تويتر",
      timeRange: "2-4 ساعات",
    },
    {
      service: "إعجابات",
      platform: "تويتر",
      timeRange: "1-2 ساعة",
    },
    {
      service: "إعادة تغريد",
      platform: "تويتر",
      timeRange: "2-3 ساعات",
    },
    {
      service: "مشاهدات",
      platform: "يوتيوب",
      timeRange: "12-24 ساعة",
      note: "تبدأ تدريجيًا لتجنب الحظر",
    },
    {
      service: "إعجابات",
      platform: "يوتيوب",
      timeRange: "6-12 ساعة",
    },
    {
      service: "متابعين",
      platform: "تيك توك",
      timeRange: "3-6 ساعات",
    },
    {
      service: "مشاهدات",
      platform: "تيك توك",
      timeRange: "2-4 ساعات",
    },
  ],
  title = "كم تستغرق الخدمات؟",
}: DeliveryTimesProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-right flex items-center justify-end gap-2">
          {title}
          <Clock className="h-5 w-5 text-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full" dir="rtl">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  الخدمة
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  المنصة
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  المدة المتوقعة
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  ملاحظات
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-colors`}
                >
                  <td className="py-3 px-4 text-gray-800">{service.service}</td>
                  <td className="py-3 px-4 text-gray-800">
                    {service.platform}
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {service.timeRange}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {service.note ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <span className="text-sm">معلومات إضافية</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{service.note}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-md text-right">
          <p className="text-sm text-blue-700">
            <strong>ملاحظة:</strong> الأوقات المذكورة تقديرية وقد تختلف حسب حجم
            الطلب وحالة المنصة. نحن نسعى دائمًا لتنفيذ الطلبات بأسرع وقت ممكن مع
            الحفاظ على جودة الخدمة.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTimes;

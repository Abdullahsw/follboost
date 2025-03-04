import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  platform: string;
  category: string;
  price: number;
  minOrder: number;
  maxOrder: number;
  description: string;
  estimatedTime: string;
  popular: boolean;
}

const ServicesList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const services: Service[] = [
    {
      id: "SRV-001",
      name: "متابعين انستغرام عرب",
      platform: "Instagram",
      category: "متابعين",
      price: 0.05,
      minOrder: 100,
      maxOrder: 10000,
      description:
        "متابعين عرب حقيقيين مع صور شخصية ومنشورات. لا يتطلب كلمة مرور، فقط حساب عام.",
      estimatedTime: "1-2 ساعة",
      popular: true,
    },
    {
      id: "SRV-002",
      name: "إعجابات انستغرام",
      platform: "Instagram",
      category: "إعجابات",
      price: 0.03,
      minOrder: 50,
      maxOrder: 5000,
      description:
        "إعجابات عالية الجودة لمنشورات انستغرام. تبدأ خلال 30 دقيقة من تأكيد الطلب.",
      estimatedTime: "30-60 دقيقة",
      popular: true,
    },
    {
      id: "SRV-003",
      name: "تعليقات انستغرام مخصصة",
      platform: "Instagram",
      category: "تعليقات",
      price: 0.15,
      minOrder: 10,
      maxOrder: 500,
      description:
        "تعليقات مخصصة من حسابات عربية حقيقية. يمكنك تحديد نص التعليقات.",
      estimatedTime: "2-3 ساعات",
      popular: false,
    },
    {
      id: "SRV-004",
      name: "متابعين تويتر",
      platform: "Twitter",
      category: "متابعين",
      price: 0.06,
      minOrder: 100,
      maxOrder: 5000,
      description:
        "متابعين تويتر عالي الجودة مع صور شخصية وتغريدات. لا يتطلب كلمة مرور.",
      estimatedTime: "2-4 ساعات",
      popular: false,
    },
    {
      id: "SRV-005",
      name: "إعجابات تويتر",
      platform: "Twitter",
      category: "إعجابات",
      price: 0.04,
      minOrder: 50,
      maxOrder: 10000,
      description:
        "إعجابات لتغريداتك من حسابات حقيقية. تبدأ خلال ساعة من تأكيد الطلب.",
      estimatedTime: "1-2 ساعة",
      popular: true,
    },
    {
      id: "SRV-006",
      name: "إعادة تغريد",
      platform: "Twitter",
      category: "إعادة تغريد",
      price: 0.08,
      minOrder: 20,
      maxOrder: 1000,
      description: "إعادة تغريد من حسابات حقيقية لزيادة انتشار تغريداتك.",
      estimatedTime: "2-3 ساعات",
      popular: false,
    },
    {
      id: "SRV-007",
      name: "مشاهدات يوتيوب",
      platform: "YouTube",
      category: "مشاهدات",
      price: 0.01,
      minOrder: 1000,
      maxOrder: 100000,
      description:
        "مشاهدات يوتيوب عالية الاحتفاظ من مصادر متنوعة. تزيد تدريجياً لتجنب الحظر.",
      estimatedTime: "12-24 ساعة",
      popular: true,
    },
    {
      id: "SRV-008",
      name: "إعجابات يوتيوب",
      platform: "YouTube",
      category: "إعجابات",
      price: 0.05,
      minOrder: 100,
      maxOrder: 10000,
      description:
        "إعجابات لفيديوهات يوتيوب من حسابات حقيقية لتحسين تفاعل القناة.",
      estimatedTime: "6-12 ساعة",
      popular: false,
    },
    {
      id: "SRV-009",
      name: "متابعين تيك توك",
      platform: "TikTok",
      category: "متابعين",
      price: 0.07,
      minOrder: 100,
      maxOrder: 10000,
      description:
        "متابعين تيك توك عالي الجودة لزيادة شعبية حسابك. لا يتطلب كلمة مرور.",
      estimatedTime: "3-6 ساعات",
      popular: true,
    },
    {
      id: "SRV-010",
      name: "مشاهدات تيك توك",
      platform: "TikTok",
      category: "مشاهدات",
      price: 0.02,
      minOrder: 500,
      maxOrder: 100000,
      description:
        "مشاهدات لفيديوهات تيك توك لزيادة فرص الظهور في صفحة الاكتشاف.",
      estimatedTime: "2-4 ساعات",
      popular: false,
    },
  ];

  const platforms = [
    { id: "all", name: "جميع المنصات" },
    { id: "Instagram", name: "انستغرام" },
    { id: "Twitter", name: "تويتر" },
    { id: "YouTube", name: "يوتيوب" },
    { id: "TikTok", name: "تيك توك" },
    { id: "Facebook", name: "فيسبوك" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleCreateOrder = (serviceId: string) => {
    navigate(`/create-order?service=${serviceId}`);
  };

  // Filter services based on search query and selected platform
  const filteredServices = services.filter((service) => {
    const matchesSearch = searchQuery
      ? service.name.includes(searchQuery) ||
        service.id.includes(searchQuery) ||
        service.description.includes(searchQuery)
      : true;

    const matchesPlatform =
      selectedPlatform === "all" || service.platform === selectedPlatform;

    return matchesSearch && matchesPlatform;
  });

  // Group services by platform
  const groupedServices = filteredServices.reduce(
    (acc, service) => {
      if (!acc[service.platform]) {
        acc[service.platform] = [];
      }
      acc[service.platform].push(service);
      return acc;
    },
    {} as Record<string, Service[]>,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        قائمة الخدمات
      </h1>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن خدمة برقم الخدمة أو الاسم..."
              className="pl-10 pr-4 w-full text-right"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap justify-end gap-2" dir="rtl">
          {platforms.map((platform) => (
            <Button
              key={platform.id}
              variant={selectedPlatform === platform.id ? "default" : "outline"}
              onClick={() => setSelectedPlatform(platform.id)}
              className="mb-2"
            >
              {platform.name}
            </Button>
          ))}
        </div>
      </div>

      {Object.keys(groupedServices).length > 0 ? (
        Object.entries(groupedServices).map(([platform, platformServices]) => (
          <div key={platform} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-right">
              خدمات{" "}
              {platform === "Instagram"
                ? "انستغرام"
                : platform === "Twitter"
                  ? "تويتر"
                  : platform === "YouTube"
                    ? "يوتيوب"
                    : platform === "TikTok"
                      ? "تيك توك"
                      : platform === "Facebook"
                        ? "فيسبوك"
                        : platform}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformServices.map((service) => (
                <Card
                  key={service.id}
                  className="w-full bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {service.popular && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            شائع
                          </Badge>
                        )}
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {service.id}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-right">
                        {service.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700 text-right text-sm">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-right">
                          <p className="text-gray-500">السعر</p>
                          <p className="font-medium">
                            {service.price} ر.س / وحدة
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">الحد الأدنى</p>
                          <p className="font-medium">
                            {service.minOrder.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">الحد الأقصى</p>
                          <p className="font-medium">
                            {service.maxOrder.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">الوقت المتوقع</p>
                          <p className="font-medium flex items-center justify-end gap-1">
                            <Clock className="h-3 w-3" />
                            {service.estimatedTime}
                          </p>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => handleCreateOrder(service.id)}
                      >
                        <ArrowRight className="h-4 w-4 ml-2" />
                        طلب الخدمة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">لا توجد خدمات مطابقة للبحث</p>
        </div>
      )}
    </div>
  );
};

export default ServicesList;

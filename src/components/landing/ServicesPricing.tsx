import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  platform: string;
  category: string;
  price: number;
  minOrder: number;
  maxOrder: number;
  description: string;
  popular: boolean;
}

const ServicesPricing = () => {
  const navigate = useNavigate();
  // Sample services data - in a real app, this would be fetched from an API
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
      popular: true,
    },
    {
      id: "SRV-003",
      name: "متابعين تويتر",
      platform: "Twitter",
      category: "متابعين",
      price: 0.06,
      minOrder: 100,
      maxOrder: 5000,
      description:
        "متابعين تويتر عالي الجودة مع صور شخصية وتغريدات. لا يتطلب كلمة مرور.",
      popular: false,
    },
    {
      id: "SRV-004",
      name: "مشاهدات يوتيوب",
      platform: "YouTube",
      category: "مشاهدات",
      price: 0.01,
      minOrder: 1000,
      maxOrder: 100000,
      description:
        "مشاهدات يوتيوب عالية الاحتفاظ من مصادر متنوعة. تزيد تدريجياً لتجنب الحظر.",
      popular: true,
    },
    {
      id: "SRV-005",
      name: "متابعين تيك توك",
      platform: "TikTok",
      category: "متابعين",
      price: 0.07,
      minOrder: 100,
      maxOrder: 10000,
      description:
        "متابعين تيك توك عالي الجودة لزيادة شعبية حسابك. لا يتطلب كلمة مرور.",
      popular: true,
    },
    {
      id: "SRV-006",
      name: "إعجابات فيسبوك",
      platform: "Facebook",
      category: "إعجابات",
      price: 0.04,
      minOrder: 50,
      maxOrder: 10000,
      description:
        "إعجابات لمنشوراتك من حسابات حقيقية. تبدأ خلال ساعة من تأكيد الطلب.",
      popular: false,
    },
  ];

  // Group services by platform
  const platforms = [...new Set(services.map((service) => service.platform))];

  return (
    <div className="space-y-12">
      {platforms.map((platform) => (
        <div key={platform} className="space-y-6">
          <h3 className="text-2xl font-bold">{platform} Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter((service) => service.platform === platform)
              .map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden border-2 hover:border-primary transition-all duration-300"
                >
                  <CardHeader className="pb-2 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {service.popular && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            Popular
                          </Badge>
                        )}
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {service.id}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold">
                        {service.name === "متابعين انستغرام عرب"
                          ? "Arabic Instagram Followers"
                          : service.name === "إعجابات انستغرام"
                            ? "Instagram Likes"
                            : service.name === "متابعين تويتر"
                              ? "Twitter Followers"
                              : service.name === "مشاهدات يوتيوب"
                                ? "YouTube Views"
                                : service.name === "متابعين تيك توك"
                                  ? "TikTok Followers"
                                  : service.name === "إعجابات فيسبوك"
                                    ? "Facebook Likes"
                                    : service.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <p className="text-gray-700 text-sm">
                        {service.description ===
                        "متابعين عرب حقيقيين مع صور شخصية ومنشورات. لا يتطلب كلمة مرور، فقط حساب عام."
                          ? "Real Arab followers with profile pictures and posts. No password required, just a public account."
                          : service.description ===
                              "إعجابات عالية الجودة لمنشورات انستغرام. تبدأ خلال 30 دقيقة من تأكيد الطلب."
                            ? "High-quality likes for Instagram posts. Starts within 30 minutes of order confirmation."
                            : service.description ===
                                "متابعين تويتر عالي الجودة مع صور شخصية وتغريدات. لا يتطلب كلمة مرور."
                              ? "High-quality Twitter followers with profile pictures and tweets. No password required."
                              : service.description ===
                                  "مشاهدات يوتيوب عالية الاحتفاظ من مصادر متنوعة. تزيد تدريجياً لتجنب الحظر."
                                ? "High-retention YouTube views from diverse sources. Increases gradually to avoid bans."
                                : service.description ===
                                    "متابعين تيك توك عالي الجودة لزيادة شعبية حسابك. لا يتطلب كلمة مرور."
                                  ? "High-quality TikTok followers to increase your account's popularity. No password required."
                                  : service.description ===
                                      "إعجابات لمنشوراتك من حسابات حقيقية. تبدأ خلال ساعة من تأكيد الطلب."
                                    ? "Likes for your posts from real accounts. Starts within an hour of order confirmation."
                                    : service.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium">
                            {service.price} SAR / unit
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Minimum</p>
                          <p className="font-medium">
                            {service.minOrder.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Maximum</p>
                          <p className="font-medium">
                            {service.maxOrder.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate("/login")}
                        className="w-full mt-4"
                      >
                        Login to Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-12">
        <p className="text-lg mb-4">
          These are just samples of our services. Log in to see more services
          and prices.
        </p>
        <Button onClick={() => navigate("/register")} size="lg">
          Create Account Now
        </Button>
      </div>
    </div>
  );
};

export default ServicesPricing;

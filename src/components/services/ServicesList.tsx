import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serviceProviderManager } from "@/lib/api/ServiceProviderManager";
import { ServiceFetcher } from "@/lib/api/ServiceFetcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ServicesList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<string[]>(["all"]);

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  // Load services when provider changes
  useEffect(() => {
    if (selectedProvider) {
      fetchServices(selectedProvider);
    } else {
      setServices([]);
      setPlatforms(["all"]);
    }
  }, [selectedProvider]);

  const loadProviders = () => {
    try {
      const providersList = serviceProviderManager.getProviders();
      setProviders(providersList);

      // Auto-select the first provider if available
      if (providersList.length > 0 && !selectedProvider) {
        setSelectedProvider(providersList[0].id);
      }
    } catch (error) {
      console.error("Error loading providers:", error);
      setError("حدث خطأ أثناء تحميل مزودي الخدمة");
    }
  };

  const fetchServices = async (providerId: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Use the ServiceFetcher to fetch services
      const result = await ServiceFetcher.fetchServices(providerId);

      if (result.success && result.services) {
        // Normalize services
        const normalizedServices = ServiceFetcher.normalizeServices(
          result.services,
        );
        setServices(normalizedServices);

        // Extract unique platforms
        const uniquePlatforms = Array.from(
          new Set(normalizedServices.map((service) => service.type || "Other")),
        );
        setPlatforms(["all", ...uniquePlatforms]);
      } else {
        setError(result.error || "فشل في جلب الخدمات");
        setServices([]);
        setPlatforms(["all"]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("حدث خطأ أثناء جلب الخدمات");
      setServices([]);
      setPlatforms(["all"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filtered services
  };

  const handleCreateOrder = (serviceId: string) => {
    navigate(`/dashboard/create-order?service=${serviceId}`);
  };

  const handleRefresh = () => {
    if (selectedProvider) {
      fetchServices(selectedProvider);
    }
  };

  // Filter services based on search query and platform
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.id.toString().includes(searchQuery);

    const matchesPlatform =
      selectedPlatform === "all" || service.type === selectedPlatform;

    return matchesSearch && matchesPlatform;
  });

  // Group services by platform for display
  const groupedServices = filteredServices.reduce(
    (acc, service) => {
      const platform = service.type || "Other";
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push(service);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        قائمة الخدمات
      </h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-right">خطأ</AlertTitle>
          <AlertDescription className="text-right">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <select
            className="w-full p-2 border rounded-md text-right"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="" disabled>
              اختر مزود الخدمة
            </option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-2/3">
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
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || !selectedProvider}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                تحديث الخدمات
              </>
            )}
          </Button>

          <div className="flex flex-wrap justify-end gap-2" dir="rtl">
            {platforms.map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? "default" : "outline"}
                onClick={() => setSelectedPlatform(platform)}
                className="mb-2"
              >
                {platform === "all" ? "جميع المنصات" : platform}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>جاري تحميل الخدمات...</span>
        </div>
      ) : Object.keys(groupedServices).length > 0 ? (
        Object.entries(groupedServices).map(([platform, platformServices]) => (
          <div key={platform} className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-gray-800 text-right">
              خدمات {platform}
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
                        {service.description || "لا يوجد وصف متاح"}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-right">
                          <p className="text-gray-500">السعر</p>
                          <p className="font-medium">
                            {service.rate.toFixed(3)} ر.س / وحدة
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">الحد الأدنى</p>
                          <p className="font-medium">
                            {service.min.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">الحد الأقصى</p>
                          <p className="font-medium">
                            {service.max.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-wrap gap-1">
                            {service.dripfeed && (
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                Drip Feed
                              </Badge>
                            )}
                            {service.refill && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Refill
                              </Badge>
                            )}
                          </div>
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
          <p className="text-gray-500">
            {selectedProvider
              ? "لا توجد خدمات متاحة أو مطابقة للبحث"
              : "يرجى اختيار مزود خدمة لعرض الخدمات المتاحة"}
          </p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-semibold mb-2 text-right">معلومات عن الخدمات</h3>
        <p className="text-sm text-blue-700 text-right">
          يتم تحديث قائمة الخدمات بشكل دوري من مزودي الخدمة. الأسعار قد تتغير
          حسب العرض والطلب. يرجى التأكد من اختيار الخدمة المناسبة قبل إنشاء
          الطلب.
        </p>
      </div>
    </div>
  );
};

export default ServicesList;

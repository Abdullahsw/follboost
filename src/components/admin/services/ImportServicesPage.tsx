import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServiceManager } from "@/lib/api/serviceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

const ImportServicesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState<Record<string, any>>({});
  const [balances, setBalances] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const serviceManager = new ServiceManager();
      await serviceManager.loadProviders();

      // Fetch services
      const allServices = await serviceManager.getAllServices();
      setServices(allServices);

      // Fetch balances
      const allBalances = await serviceManager.getBalances();
      setBalances(allBalances);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const renderServicesList = (providerName: string, providerServices: any) => {
    if (!providerServices || typeof providerServices !== "object") {
      return <p className="text-red-500">خطأ في بيانات الخدمات</p>;
    }

    if (providerServices.error) {
      return <p className="text-red-500">خطأ: {providerServices.error}</p>;
    }

    // Handle different API response formats
    let servicesList = [];
    if (Array.isArray(providerServices)) {
      servicesList = providerServices;
    } else if (typeof providerServices === "object") {
      servicesList = Object.values(providerServices);
    }

    if (servicesList.length === 0) {
      return <p>لا توجد خدمات متاحة</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-right">معرف الخدمة</th>
              <th className="border p-2 text-right">اسم الخدمة</th>
              <th className="border p-2 text-right">السعر</th>
              <th className="border p-2 text-right">الحد الأدنى</th>
              <th className="border p-2 text-right">الحد الأقصى</th>
            </tr>
          </thead>
          <tbody>
            {servicesList.map((service: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-2">
                  {service.service || service.id || index}
                </td>
                <td className="border p-2">{service.name || "غير معروف"}</td>
                <td className="border p-2">
                  {service.rate || service.price || "غير معروف"}
                </td>
                <td className="border p-2">{service.min || "غير معروف"}</td>
                <td className="border p-2">{service.max || "غير معروف"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBalanceInfo = (providerName: string, balanceData: any) => {
    if (!balanceData || typeof balanceData !== "object") {
      return <p className="text-red-500">خطأ في بيانات الرصيد</p>;
    }

    if (balanceData.error) {
      return <p className="text-red-500">خطأ: {balanceData.error}</p>;
    }

    // Handle different balance response formats
    let balance = "غير معروف";
    let currency = "USD";

    if (typeof balanceData === "number") {
      balance = balanceData.toString();
    } else if (balanceData.balance !== undefined) {
      balance = balanceData.balance.toString();
      currency = balanceData.currency || "USD";
    } else if (balanceData.funds !== undefined) {
      balance = balanceData.funds.toString();
      currency = balanceData.currency || "USD";
    }

    return (
      <div className="p-4 bg-blue-50 rounded-md">
        <h3 className="font-bold mb-2">رصيد الحساب</h3>
        <p>
          الرصيد: {balance} {currency}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              جاري التحديث...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              تحديث البيانات
            </>
          )}
        </Button>
        <h1 className="text-2xl font-bold">استيراد الخدمات</h1>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم جلب البيانات بنجاح.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-right">خطأ</AlertTitle>
          <AlertDescription className="text-right">{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
          <span className="mr-4">جاري جلب البيانات...</span>
        </div>
      ) : Object.keys(services).length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <p className="text-gray-500">
                لا توجد مزودي خدمات. يرجى إضافة مزود خدمة أولاً.
              </p>
              <Button
                className="mt-4"
                onClick={() =>
                  (window.location.href = "/admin/services/add-provider")
                }
              >
                إضافة مزود خدمة
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={Object.keys(services)[0]} dir="rtl">
          <TabsList className="mb-4">
            {Object.keys(services).map((providerName) => (
              <TabsTrigger key={providerName} value={providerName}>
                {providerName}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(services).map(([providerName, providerServices]) => (
            <TabsContent key={providerName} value={providerName}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-right">
                    خدمات {providerName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {balances[providerName] &&
                    renderBalanceInfo(providerName, balances[providerName])}
                  <div className="mt-4">
                    {renderServicesList(providerName, providerServices)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ImportServicesPage;

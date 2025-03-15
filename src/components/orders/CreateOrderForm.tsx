import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceProviderManager } from "@/lib/api/ServiceProviderManager";
import { OrderService, OrderData } from "@/lib/api/OrderService";
import { ServiceProviderManager } from "@/lib/api/ServiceProviderManager";

interface CreateOrderFormProps {
  onOrderCreated?: (orderId: string | number) => void;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({
  onOrderCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const [formData, setFormData] = useState<OrderData>({
    service: "",
    link: "",
    quantity: 0,
    comments: "",
  });

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  // Load services when provider changes
  useEffect(() => {
    if (selectedProvider) {
      loadServices(selectedProvider);
    } else {
      setServices([]);
    }
  }, [selectedProvider]);

  // Update service ID when service selection changes
  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        service: selectedService,
      }));
    }
  }, [selectedService]);

  const loadProviders = () => {
    try {
      const providersList = serviceProviderManager.getProviders();
      setProviders(providersList);
    } catch (error) {
      console.error("Error loading providers:", error);
      setError("حدث خطأ أثناء تحميل مزودي الخدمة");
    }
  };

  const loadServices = async (providerId: string) => {
    setIsLoadingServices(true);
    setError("");

    try {
      const servicesList =
        await ServiceProviderManager.fetchServices(providerId);
      setServices(servicesList);
    } catch (error) {
      console.error("Error loading services:", error);
      setError("حدث خطأ أثناء تحميل الخدمات");
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);
    setOrderResult(null);

    try {
      // Validate form
      if (!selectedProvider) {
        throw new Error("يرجى اختيار مزود الخدمة");
      }
      if (!formData.service) {
        throw new Error("يرجى اختيار الخدمة");
      }
      if (!formData.link) {
        throw new Error("يرجى إدخال الرابط");
      }
      if (!formData.quantity || formData.quantity <= 0) {
        throw new Error("يرجى إدخال كمية صحيحة");
      }

      // Get selected service details
      const serviceDetails = services.find(
        (s) => s.providerServiceId === formData.service,
      );
      if (!serviceDetails) {
        throw new Error("تفاصيل الخدمة غير متوفرة");
      }

      // Validate quantity against min/max
      if (formData.quantity < serviceDetails.min) {
        throw new Error(`الكمية يجب أن تكون على الأقل ${serviceDetails.min}`);
      }
      if (formData.quantity > serviceDetails.max) {
        throw new Error(
          `الكمية يجب أن تكون أقل من أو تساوي ${serviceDetails.max}`,
        );
      }

      // Place the order
      const result = await OrderService.placeOrder(selectedProvider, formData);

      if (result.success) {
        setSuccess(true);
        setOrderResult(result);

        // Call the callback if provided
        if (onOrderCreated && result.orderId) {
          onOrderCreated(result.orderId);
        }

        // Reset form
        setFormData({
          service: "",
          link: "",
          quantity: 0,
          comments: "",
        });
        setSelectedService("");
      } else {
        setError(result.error || "حدث خطأ أثناء إنشاء الطلب");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.message || "حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  // Get service details for the selected service
  const getSelectedServiceDetails = () => {
    if (!selectedService) return null;
    return services.find((s) => s.providerServiceId === selectedService);
  };

  const serviceDetails = getSelectedServiceDetails();

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          إنشاء طلب جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
              <AlertDescription className="text-right">
                تم إنشاء الطلب بنجاح.
                {orderResult?.orderId && (
                  <div className="mt-2">
                    <strong>رقم الطلب:</strong> {orderResult.orderId}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-right">خطأ</AlertTitle>
              <AlertDescription className="text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-right block">
                مزود الخدمة
              </Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="اختر مزود الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service" className="text-right block">
                الخدمة
              </Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
                disabled={isLoadingServices || !selectedProvider}
              >
                <SelectTrigger id="service">
                  <SelectValue
                    placeholder={
                      isLoadingServices
                        ? "جاري تحميل الخدمات..."
                        : !selectedProvider
                          ? "اختر مزود الخدمة أولاً"
                          : "اختر الخدمة"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem
                      key={service.id}
                      value={service.providerServiceId}
                    >
                      {service.name} - {service.price} ر.س
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-right block">
                الرابط
              </Label>
              <Input
                id="link"
                name="link"
                placeholder="https://instagram.com/username"
                dir="ltr"
                value={formData.link}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-right block">
                الكمية
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="أدخل الكمية"
                min={serviceDetails?.min || 1}
                max={serviceDetails?.max || 1000000}
                value={formData.quantity || ""}
                onChange={handleChange}
                required
              />
              {serviceDetails && (
                <p className="text-xs text-gray-500 mt-1 text-right">
                  الحد الأدنى: {serviceDetails.min} | الحد الأقصى:{" "}
                  {serviceDetails.max}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-right block">
              تعليقات (اختياري)
            </Label>
            <Textarea
              id="comments"
              name="comments"
              placeholder="أدخل أي تعليقات إضافية هنا"
              className="text-right min-h-[100px]"
              value={formData.comments}
              onChange={handleChange}
            />
          </div>

          {serviceDetails && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2 text-right">تفاصيل الخدمة</h3>
              <div className="text-sm text-blue-700 text-right">
                <p>
                  <strong>الاسم:</strong> {serviceDetails.name}
                </p>
                <p>
                  <strong>الوصف:</strong>{" "}
                  {serviceDetails.description || "لا يوجد وصف"}
                </p>
                <p>
                  <strong>السعر:</strong> {serviceDetails.price} ر.س لكل 1000
                </p>
                <p>
                  <strong>إجمالي السعر:</strong>{" "}
                  {((serviceDetails.price / 1000) * formData.quantity).toFixed(
                    2,
                  )}{" "}
                  ر.س
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري إنشاء الطلب..." : "إنشاء الطلب"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateOrderForm;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServiceManager } from "@/lib/api/serviceManager";

const AddServiceProviderPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    apiUrl: "",
    apiKey: "",
    apiSecret: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!formData.name || !formData.apiUrl || !formData.apiKey) {
        throw new Error("يرجى ملء جميع الحقول المطلوبة");
      }

      const serviceManager = new ServiceManager();
      const result = await serviceManager.addProvider(
        formData.name,
        formData.apiUrl,
        formData.apiKey,
        formData.apiSecret,
      );

      if (!result) {
        throw new Error("فشل إضافة مزود الخدمة");
      }

      setSuccess(true);
      setFormData({
        name: "",
        apiUrl: "",
        apiKey: "",
        apiSecret: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding provider:", error);
      setError(error.message || "حدث خطأ أثناء إضافة مزود الخدمة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-right">
          إضافة مزود خدمة جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
              <AlertDescription className="text-right">
                تم إضافة مزود الخدمة بنجاح.
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
              <Label htmlFor="name" className="text-right block">
                اسم مزود الخدمة
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="أدخل اسم مزود الخدمة"
                className="text-right"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiUrl" className="text-right block">
                عنوان API
              </Label>
              <Input
                id="apiUrl"
                name="apiUrl"
                placeholder="https://api.example.com"
                dir="ltr"
                value={formData.apiUrl}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                يجب أن يبدأ العنوان بـ http:// أو https://
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-right block">
                مفتاح API
              </Label>
              <Input
                id="apiKey"
                name="apiKey"
                type="password"
                placeholder="أدخل مفتاح API"
                dir="ltr"
                value={formData.apiKey}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret" className="text-right block">
                كلمة سر API (اختياري)
              </Label>
              <Input
                id="apiSecret"
                name="apiSecret"
                type="password"
                placeholder="أدخل كلمة سر API إذا كانت مطلوبة"
                dir="ltr"
                value={formData.apiSecret}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإضافة..." : "إضافة مزود الخدمة"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddServiceProviderPage;

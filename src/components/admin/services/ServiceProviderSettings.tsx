import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Trash,
  RefreshCw,
} from "lucide-react";
import ProviderBalanceDisplay from "./ProviderBalanceDisplay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  serviceProviderManager,
  ServiceProvider,
} from "@/lib/api/ServiceProviderManager";
import AddServiceProviderForm from "./AddServiceProviderForm";

interface ServiceProviderSettingsProps {
  onProvidersUpdated?: () => void;
}

const ServiceProviderSettings: React.FC<ServiceProviderSettingsProps> = ({
  onProvidersUpdated,
}) => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [isEditProviderDialogOpen, setIsEditProviderDialogOpen] =
    useState(false);
  const [isDeleteProviderDialogOpen, setIsDeleteProviderDialogOpen] =
    useState(false);
  const [isAddProviderDialogOpen, setIsAddProviderDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"providers" | "add">("providers");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = () => {
    try {
      const providersList = serviceProviderManager.getProviders();
      setProviders(providersList);
    } catch (error) {
      console.error("Error loading providers:", error);
      setError("حدث خطأ أثناء تحميل مزودي الخدمة");
    }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Get form data
      const name = (
        document.getElementById("provider-name") as HTMLInputElement
      )?.value;
      const url = (document.getElementById("provider-url") as HTMLInputElement)
        ?.value;
      const apiKey = (
        document.getElementById("provider-api-key") as HTMLInputElement
      )?.value;
      const apiSecret = (
        document.getElementById("provider-api-secret") as HTMLInputElement
      )?.value;

      // Validate form
      if (!name || !url || !apiKey) {
        setError("يرجى ملء جميع الحقول المطلوبة");
        setIsSubmitting(false);
        return;
      }

      // Validate URL format
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        setError("يجب أن يبدأ عنوان API بـ http:// أو https://");
        setIsSubmitting(false);
        return;
      }

      // Test connection before adding
      console.log(
        `Testing connection to ${url} with key ${apiKey.substring(0, 5)}...`,
      );
      const isConnected = await serviceProviderManager.testConnection({
        name,
        url,
        apiKey,
        apiSecret,
        status: "active",
      });

      if (!isConnected) {
        setError("فشل الاتصال بمزود الخدمة. يرجى التحقق من بيانات API.");
        setIsSubmitting(false);
        return;
      }

      // Add the provider
      const newProvider = serviceProviderManager.addProvider({
        name,
        url,
        apiKey,
        apiSecret,
        status: "active",
      });

      // Reload providers
      loadProviders();

      // Notify parent component
      if (onProvidersUpdated) {
        onProvidersUpdated();
      }

      setSuccess(true);
      setIsAddProviderDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding provider:", error);
      setError("حدث خطأ أثناء إضافة مزود الخدمة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!selectedProvider) {
      setError("لم يتم تحديد مزود الخدمة");
      setIsSubmitting(false);
      return;
    }

    try {
      // Get form data
      const name = (
        document.getElementById("edit-provider-name") as HTMLInputElement
      )?.value;
      const url = (
        document.getElementById("edit-provider-url") as HTMLInputElement
      )?.value;
      const apiKey = (
        document.getElementById("edit-provider-api-key") as HTMLInputElement
      )?.value;
      const apiSecret = (
        document.getElementById("edit-provider-api-secret") as HTMLInputElement
      )?.value;
      const status =
        (document.getElementById("edit-provider-status") as HTMLSelectElement)
          ?.value === "active"
          ? "active"
          : "inactive";

      // Validate form
      if (!name || !url || !apiKey) {
        setError("يرجى ملء جميع الحقول المطلوبة");
        setIsSubmitting(false);
        return;
      }

      // Update the provider
      const updatedProvider = serviceProviderManager.updateProvider(
        selectedProvider.id,
        {
          name,
          url,
          apiKey,
          apiSecret,
          status,
        },
      );

      if (!updatedProvider) {
        setError("فشل تحديث مزود الخدمة");
        setIsSubmitting(false);
        return;
      }

      // Reload providers
      loadProviders();

      // Notify parent component
      if (onProvidersUpdated) {
        onProvidersUpdated();
      }

      setSuccess(true);
      setIsEditProviderDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating provider:", error);
      setError("حدث خطأ أثناء تحديث مزود الخدمة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProvider = async () => {
    setIsSubmitting(true);
    setError("");

    if (!selectedProvider) {
      setError("لم يتم تحديد مزود الخدمة");
      setIsSubmitting(false);
      return;
    }

    try {
      // Delete the provider
      const isDeleted = serviceProviderManager.removeProvider(
        selectedProvider.id,
      );

      if (!isDeleted) {
        setError("فشل حذف مزود الخدمة");
        setIsSubmitting(false);
        return;
      }

      // Reload providers
      loadProviders();

      // Notify parent component
      if (onProvidersUpdated) {
        onProvidersUpdated();
      }

      setSuccess(true);
      setIsDeleteProviderDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting provider:", error);
      setError("حدث خطأ أثناء حذف مزود الخدمة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async () => {
    setIsSubmitting(true);
    setTestResult(null);
    setError("");

    try {
      // Get form data
      const name =
        (document.getElementById("provider-name") as HTMLInputElement)?.value ||
        "";
      const url =
        (document.getElementById("provider-url") as HTMLInputElement)?.value ||
        "";
      const apiKey =
        (document.getElementById("provider-api-key") as HTMLInputElement)
          ?.value || "";
      const apiSecret = (
        document.getElementById("provider-api-secret") as HTMLInputElement
      )?.value;

      // Validate form
      if (!url || !apiKey) {
        setError("يرجى إدخال عنوان API ومفتاح API على الأقل");
        setIsSubmitting(false);
        return;
      }

      // Validate URL format
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        setError("يجب أن يبدأ عنوان API بـ http:// أو https://");
        setIsSubmitting(false);
        return;
      }

      console.log(
        `Testing connection to ${url} with API key ${apiKey.substring(0, 5)}...`,
      );

      // Test connection with detailed logging
      try {
        // This would be a real API call in production
        const isConnected = await serviceProviderManager.testConnection({
          name,
          url,
          apiKey,
          apiSecret,
          status: "active",
        });

        if (isConnected) {
          console.log("Connection test successful");
          setTestResult({
            success: true,
            message: "تم الاتصال بنجاح! يمكنك الآن إضافة مزود الخدمة.",
          });
        } else {
          console.error("Connection test failed");
          setTestResult({
            success: false,
            message: "فشل الاتصال. تأكد من صحة عنوان API والمفتاح.",
          });
        }
      } catch (connectionError) {
        console.error("Connection test threw an exception:", connectionError);
        throw connectionError;
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      setTestResult({
        success: false,
        message: `حدث خطأ أثناء اختبار الاتصال: ${error.message || "خطأ غير معروف"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-right">تمت العملية بنجاح!</AlertTitle>
          <AlertDescription className="text-right">
            تم تنفيذ العملية بنجاح.
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

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "providers" | "add")}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-right">مزودي خدمات API</h2>
          <TabsList>
            <TabsTrigger value="providers">قائمة المزودين</TabsTrigger>
            <TabsTrigger value="add">
              <Plus className="h-4 w-4 mr-2" />
              إضافة مزود جديد
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="add">
          <AddServiceProviderForm
            onProviderAdded={() => {
              loadProviders();
              setActiveTab("providers");
              if (onProvidersUpdated) {
                onProvidersUpdated();
              }
            }}
            onCancel={() => setActiveTab("providers")}
          />
        </TabsContent>

        <TabsContent value="providers">
          <Card className="w-full bg-white shadow-sm">
            <CardContent className="p-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-right">خطأ</AlertTitle>
                  <AlertDescription className="text-right">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المعرف</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">عنوان API</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers.length > 0 ? (
                      providers.map((provider) => (
                        <TableRow key={provider.id}>
                          <TableCell className="font-medium">
                            {provider.id}
                          </TableCell>
                          <TableCell>{provider.name}</TableCell>
                          <TableCell>{provider.url}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                provider.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {provider.status === "active" ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="w-24">
                              <ProviderBalanceDisplay
                                providerId={provider.id}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Dialog
                                open={
                                  isEditProviderDialogOpen &&
                                  selectedProvider?.id === provider.id
                                }
                                onOpenChange={(open) => {
                                  setIsEditProviderDialogOpen(open);
                                  if (open) setSelectedProvider(provider);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md" dir="rtl">
                                  <DialogHeader>
                                    <DialogTitle className="text-right">
                                      تعديل مزود الخدمة
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      {provider.id} - {provider.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    onSubmit={handleEditProvider}
                                    className="space-y-4"
                                  >
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="edit-provider-name"
                                        className="text-right block"
                                      >
                                        اسم مزود الخدمة
                                      </Label>
                                      <Input
                                        id="edit-provider-name"
                                        defaultValue={provider.name}
                                        className="text-right"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="edit-provider-url"
                                        className="text-right block"
                                      >
                                        عنوان API
                                      </Label>
                                      <Input
                                        id="edit-provider-url"
                                        defaultValue={provider.url}
                                        dir="ltr"
                                        required
                                      />
                                      <p className="text-xs text-gray-500 mt-1">
                                        يجب أن يبدأ العنوان بـ http:// أو
                                        https://
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="edit-provider-api-key"
                                        className="text-right block"
                                      >
                                        مفتاح API
                                      </Label>
                                      <Input
                                        id="edit-provider-api-key"
                                        type="password"
                                        defaultValue={provider.apiKey}
                                        dir="ltr"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="edit-provider-api-secret"
                                        className="text-right block"
                                      >
                                        كلمة سر API (اختياري)
                                      </Label>
                                      <Input
                                        id="edit-provider-api-secret"
                                        type="password"
                                        defaultValue={provider.apiSecret || ""}
                                        dir="ltr"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="edit-provider-status"
                                        className="text-right block"
                                      >
                                        الحالة
                                      </Label>
                                      <select
                                        id="edit-provider-status"
                                        defaultValue={provider.status}
                                        className="w-full p-2 border rounded-md"
                                      >
                                        <option value="active">نشط</option>
                                        <option value="inactive">
                                          غير نشط
                                        </option>
                                      </select>
                                    </div>
                                    <DialogFooter className="mt-4">
                                      <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                      >
                                        {isSubmitting
                                          ? "جاري الحفظ..."
                                          : "حفظ التغييرات"}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              <Dialog
                                open={
                                  isDeleteProviderDialogOpen &&
                                  selectedProvider?.id === provider.id
                                }
                                onOpenChange={(open) => {
                                  setIsDeleteProviderDialogOpen(open);
                                  if (open) setSelectedProvider(provider);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md" dir="rtl">
                                  <DialogHeader>
                                    <DialogTitle className="text-right">
                                      حذف مزود الخدمة
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      هل أنت متأكد من رغبتك في حذف مزود الخدمة{" "}
                                      {provider.name}؟ هذا الإجراء لا يمكن
                                      التراجع عنه.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="mt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setIsDeleteProviderDialogOpen(false)
                                      }
                                    >
                                      إلغاء
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleDeleteProvider}
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting
                                        ? "جاري الحذف..."
                                        : "حذف مزود الخدمة"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600"
                                onClick={async () => {
                                  try {
                                    // Fetch services from this provider
                                    setIsSubmitting(true);
                                    setError("");

                                    console.log(
                                      `Syncing services from ${provider.name}...`,
                                    );

                                    // In a real app, this would fetch services from the provider
                                    const services =
                                      await serviceProviderManager.fetchServices(
                                        provider.id,
                                      );

                                    // Show success message
                                    setSuccess(true);
                                    alert(
                                      `تم مزامنة ${services.length} خدمة من ${provider.name} بنجاح`,
                                    );

                                    setTimeout(() => setSuccess(false), 3000);
                                  } catch (error) {
                                    console.error(
                                      `Error syncing services from ${provider.name}:`,
                                      error,
                                    );
                                    setError(
                                      `فشل مزامنة الخدمات: ${error.message || "خطأ غير معروف"}`,
                                    );
                                    alert(
                                      `فشل مزامنة الخدمات من ${provider.name}: ${error.message || "خطأ غير معروف"}`,
                                    );
                                  } finally {
                                    setIsSubmitting(false);
                                  }
                                }}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          لا يوجد مزودي خدمات حالياً. قم بإضافة مزود خدمة جديد.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700 text-right">
              <strong>ملاحظة:</strong> يمكنك إضافة مزودي خدمات API متعددين
              لاستيراد الخدمات منهم. تأكد من صحة بيانات API لضمان عمل النظام
              بشكل صحيح.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceProviderSettings;

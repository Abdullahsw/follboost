import React, { useState, useEffect } from "react";
import ServiceProviderSettings from "./ServiceProviderSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Trash,
  RefreshCw,
  Upload,
  Percent,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceProviderManager } from "@/lib/api/ServiceProviderManager";
import { serviceImporter } from "@/lib/api/ServiceImporter";

const ServiceManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] =
    useState(false);
  const [isImportServicesDialogOpen, setIsImportServicesDialogOpen] =
    useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [bulkProfitPercentage, setBulkProfitPercentage] = useState(20);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Sample categories data
  const [categories, setCategories] = useState([
    { id: "CAT-001", name: "متابعين", servicesCount: 12 },
    { id: "CAT-002", name: "إعجابات", servicesCount: 8 },
    { id: "CAT-003", name: "مشاهدات", servicesCount: 6 },
    { id: "CAT-004", name: "تعليقات", servicesCount: 4 },
    { id: "CAT-005", name: "إعادة نشر", servicesCount: 3 },
  ]);

  // Sample platforms data
  const platforms = [
    { id: "PLT-001", name: "انستغرام" },
    { id: "PLT-002", name: "تويتر" },
    { id: "PLT-003", name: "يوتيوب" },
    { id: "PLT-004", name: "تيك توك" },
    { id: "PLT-005", name: "فيسبوك" },
  ];

  // Get providers from ServiceProviderManager
  const [providers, setProviders] = useState(() => {
    const savedProviders = serviceProviderManager.getProviders();
    if (savedProviders.length > 0) {
      return savedProviders.map((provider) => ({
        id: provider.id,
        name: provider.name,
        servicesCount: 0, // This would be populated from actual service counts
      }));
    }
    return [
      { id: "PRV-001", name: "SocialBoost API", servicesCount: 120 },
      { id: "PRV-002", name: "MediaGrowth API", servicesCount: 85 },
      { id: "PRV-003", name: "ViralWave API", servicesCount: 0 },
    ];
  });

  // Sample services data
  const [services, setServices] = useState([
    {
      id: "SRV-001",
      name: "متابعين انستغرام عرب",
      platform: "انستغرام",
      category: "متابعين",
      price: 0.05,
      cost: 0.04,
      minOrder: 100,
      maxOrder: 10000,
      description:
        "متابعين عرب حقيقيين مع صور شخصية ومنشورات. لا يتطلب كلمة مرور، فقط حساب عام.",
      provider: "SocialBoost API",
      providerId: "PRV-001",
      providerServiceId: "1",
      status: "نشط",
      profitPercentage: 25,
    },
    {
      id: "SRV-002",
      name: "إعجابات انستغرام",
      platform: "انستغرام",
      category: "إعجابات",
      price: 0.03,
      cost: 0.025,
      minOrder: 50,
      maxOrder: 5000,
      description:
        "إعجابات عالية الجودة لمنشورات انستغرام. تبدأ خلال 30 دقيقة من تأكيد الطلب.",
      provider: "SocialBoost API",
      providerId: "PRV-001",
      providerServiceId: "2",
      status: "نشط",
      profitPercentage: 20,
    },
    {
      id: "SRV-003",
      name: "متابعين تويتر",
      platform: "تويتر",
      category: "متابعين",
      price: 0.06,
      cost: 0.05,
      minOrder: 100,
      maxOrder: 5000,
      description:
        "متابعين تويتر عالي الجودة مع صور شخصية وتغريدات. لا يتطلب كلمة مرور.",
      provider: "MediaGrowth API",
      providerId: "PRV-002",
      providerServiceId: "101",
      status: "نشط",
      profitPercentage: 20,
    },
    {
      id: "SRV-004",
      name: "مشاهدات يوتيوب",
      platform: "يوتيوب",
      category: "مشاهدات",
      price: 0.01,
      cost: 0.008,
      minOrder: 1000,
      maxOrder: 100000,
      description:
        "مشاهدات يوتيوب عالية الاحتفاظ من مصادر متنوعة. تزيد تدريجياً لتجنب الحظر.",
      provider: "MediaGrowth API",
      providerId: "PRV-002",
      providerServiceId: "102",
      status: "نشط",
      profitPercentage: 25,
    },
    {
      id: "SRV-005",
      name: "متابعين تيك توك",
      platform: "تيك توك",
      category: "متابعين",
      price: 0.07,
      cost: 0.055,
      minOrder: 100,
      maxOrder: 10000,
      description:
        "متابعين تيك توك عالي الجودة لزيادة شعبية حسابك. لا يتطلب كلمة مرور.",
      provider: "SocialBoost API",
      providerId: "PRV-001",
      providerServiceId: "3",
      status: "نشط",
      profitPercentage: 27,
    },
  ]);

  // API services for import with selection state
  const [apiServices, setApiServices] = useState<any[]>([]);

  // Load API services when provider changes
  useEffect(() => {
    // Only run this effect if selectedProvider changes
    if (!selectedProvider) {
      // Set default services when no provider is selected
      setApiServices([
        // Default services array
      ]);
      return;
    }

    // Import ServiceFetcher dynamically to avoid circular dependency issues
    import("@/lib/api/ServiceFetcher")
      .then(({ ServiceFetcher }) => {
        // Call loadApiServices with the selected provider
        loadApiServices(selectedProvider);
      })
      .catch((error) => {
        console.error("Error importing ServiceFetcher:", error);
        setError("حدث خطأ أثناء تحميل وحدة ServiceFetcher");
        // Set default services as fallback
        setApiServices([
          {
            id: "API-001",
            name: "Instagram Followers [Arab]",
            category: "Followers",
            platform: "Instagram",
            rate: 0.04,
            min: 100,
            max: 10000,
            description:
              "High quality Arab followers with profile pictures and posts.",
            provider: "SocialBoost API",
            providerId: "PRV-001",
            selected: false,
          },
          {
            id: "API-002",
            name: "Instagram Likes",
            category: "Likes",
            platform: "Instagram",
            rate: 0.025,
            min: 50,
            max: 5000,
            description:
              "High quality likes for Instagram posts. Starts within 30 minutes.",
            provider: "SocialBoost API",
            providerId: "PRV-001",
            selected: false,
          },
          {
            id: "API-003",
            name: "Instagram Comments [Custom]",
            category: "Comments",
            platform: "Instagram",
            rate: 0.15,
            min: 10,
            max: 500,
            description:
              "Custom comments from real Arab accounts. You can specify the comment text.",
            provider: "SocialBoost API",
            providerId: "PRV-001",
            selected: false,
          },
          {
            id: "API-004",
            name: "Twitter Followers",
            category: "Followers",
            platform: "Twitter",
            rate: 0.05,
            min: 100,
            max: 5000,
            description:
              "High quality Twitter followers with profile pictures and tweets.",
            provider: "MediaGrowth API",
            providerId: "PRV-002",
            selected: false,
          },
          {
            id: "API-005",
            name: "YouTube Views",
            category: "Views",
            platform: "YouTube",
            rate: 0.008,
            min: 1000,
            max: 100000,
            description:
              "High retention YouTube views from various sources. Increases gradually to avoid bans.",
            provider: "MediaGrowth API",
            providerId: "PRV-002",
            selected: false,
          },
        ]);
      });
  }, [selectedProvider]);

  const loadApiServices = async (providerId: string) => {
    // Import ServiceFetcher dynamically to avoid circular dependency issues
    const { ServiceFetcher } = await import("@/lib/api/ServiceFetcher");
    setIsLoadingServices(true);
    setError("");

    try {
      console.log(`Loading services from provider ${providerId}...`);
      const result = await ServiceFetcher.fetchServices(providerId);

      if (result.success && result.services && result.services.length > 0) {
        // Normalize and map services to the format expected by the UI
        const normalizedServices = ServiceFetcher.normalizeServices(
          result.services,
        );
        const mappedServices = normalizedServices.map((service) => ({
          id: service.id,
          name: service.name,
          category: service.category || service.type || "Other",
          platform: service.platform || "Other",
          rate: service.rate,
          min: service.min,
          max: service.max,
          description: service.description || "",
          provider: providers.find((p) => p.id === providerId)?.name || "",
          providerId: providerId,
          selected: false,
        }));

        setApiServices(mappedServices);
        console.log(`Loaded ${mappedServices.length} services from provider`);
      } else {
        console.warn(`No services found for provider ${providerId}`);
        setApiServices([]);
      }
    } catch (error) {
      console.error("Error loading API services:", error);
      setError("حدث خطأ أثناء تحميل الخدمات من المزود");
      setApiServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const name = (document.getElementById("category-name") as HTMLInputElement)
      ?.value;

    // Validate form
    if (!name) {
      setError("يرجى إدخال اسم القسم");
      setIsSubmitting(false);
      return;
    }

    // Create new category
    const newCategory = {
      id: `CAT-00${categories.length + 1}`,
      name,
      servicesCount: 0,
    };

    // Simulate API call
    setTimeout(() => {
      setCategories([...categories, newCategory]);
      setIsSubmitting(false);
      setSuccess(true);
      setIsAddCategoryDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const name = (document.getElementById("service-name") as HTMLInputElement)
      ?.value;
    const platform = (
      document.getElementById("service-platform") as HTMLSelectElement
    )?.value;
    const category = (
      document.getElementById("service-category") as HTMLSelectElement
    )?.value;
    const price = parseFloat(
      (document.getElementById("service-price") as HTMLInputElement)?.value ||
        "0",
    );
    const cost = parseFloat(
      (document.getElementById("service-cost") as HTMLInputElement)?.value ||
        "0",
    );
    const minOrder = parseInt(
      (document.getElementById("service-min-order") as HTMLInputElement)
        ?.value || "0",
    );
    const maxOrder = parseInt(
      (document.getElementById("service-max-order") as HTMLInputElement)
        ?.value || "0",
    );
    const description = (
      document.getElementById("service-description") as HTMLTextAreaElement
    )?.value;
    const provider = (
      document.getElementById("service-provider") as HTMLSelectElement
    )?.value;
    const providerServiceId = (
      document.getElementById("service-provider-id") as HTMLInputElement
    )?.value;

    // Validate form
    if (
      !name ||
      !platform ||
      !category ||
      price <= 0 ||
      cost <= 0 ||
      minOrder <= 0 ||
      maxOrder <= 0 ||
      !description ||
      !provider ||
      !providerServiceId
    ) {
      setError("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
      setIsSubmitting(false);
      return;
    }

    // Calculate profit percentage
    const profitPercentage = Math.round(((price - cost) / cost) * 100);

    // Create new service
    const newService = {
      id: `SRV-00${services.length + 1}`,
      name,
      platform,
      category,
      price,
      cost,
      minOrder,
      maxOrder,
      description,
      provider: providers.find((p) => p.id === provider)?.name || "",
      providerId: provider,
      providerServiceId,
      status: "نشط",
      profitPercentage,
    };

    // Simulate API call
    setTimeout(() => {
      setServices([...services, newService]);
      setIsSubmitting(false);
      setSuccess(true);
      setIsAddServiceDialogOpen(false);

      // Update category service count
      const updatedCategories = categories.map((cat) => {
        if (cat.name === category) {
          return { ...cat, servicesCount: cat.servicesCount + 1 };
        }
        return cat;
      });
      setCategories(updatedCategories);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleEditService = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const name = (
      document.getElementById("edit-service-name") as HTMLInputElement
    )?.value;
    const price = parseFloat(
      (document.getElementById("edit-service-price") as HTMLInputElement)
        ?.value || "0",
    );
    const cost = parseFloat(
      (document.getElementById("edit-service-cost") as HTMLInputElement)
        ?.value || "0",
    );
    const minOrder = parseInt(
      (document.getElementById("edit-service-min-order") as HTMLInputElement)
        ?.value || "0",
    );
    const maxOrder = parseInt(
      (document.getElementById("edit-service-max-order") as HTMLInputElement)
        ?.value || "0",
    );
    const description = (
      document.getElementById("edit-service-description") as HTMLTextAreaElement
    )?.value;
    const status = (
      document.getElementById("edit-service-status") as HTMLSelectElement
    )?.value;

    // Validate form
    if (
      !name ||
      price <= 0 ||
      cost <= 0 ||
      minOrder <= 0 ||
      maxOrder <= 0 ||
      !description
    ) {
      setError("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
      setIsSubmitting(false);
      return;
    }

    // Calculate profit percentage
    const profitPercentage = Math.round(((price - cost) / cost) * 100);

    // Update service
    setTimeout(() => {
      const updatedServices = services.map((service) => {
        if (service.id === selectedService.id) {
          return {
            ...service,
            name,
            price,
            cost,
            minOrder,
            maxOrder,
            description,
            status,
            profitPercentage,
          };
        }
        return service;
      });

      setServices(updatedServices);
      setIsSubmitting(false);
      setSuccess(true);
      setIsEditServiceDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleDeleteService = () => {
    setIsSubmitting(true);

    // Delete service
    setTimeout(() => {
      const updatedServices = services.filter(
        (service) => service.id !== selectedService.id,
      );

      // Update category service count
      const updatedCategories = categories.map((cat) => {
        if (cat.name === selectedService.category) {
          return { ...cat, servicesCount: Math.max(0, cat.servicesCount - 1) };
        }
        return cat;
      });

      setServices(updatedServices);
      setCategories(updatedCategories);
      setIsSubmitting(false);
      setSuccess(true);
      setIsDeleteServiceDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleImportServices = async () => {
    setIsSubmitting(true);
    setError("");
    console.log("Starting service import process...");

    // Get selected services
    const selectedApiServices = apiServices.filter(
      (service) => service.selected,
    );

    console.log(`Selected ${selectedApiServices.length} services for import`);

    if (selectedApiServices.length === 0) {
      setError("يرجى اختيار خدمة واحدة على الأقل للاستيراد");
      setIsSubmitting(false);
      return;
    }

    // Validate profit percentage
    if (bulkProfitPercentage <= 0 || bulkProfitPercentage > 1000) {
      setError("يرجى إدخال نسبة ربح صحيحة (بين 1 و 1000)");
      setIsSubmitting(false);
      return;
    }

    try {
      // If a provider is selected, try to fetch services from that provider
      let servicesToImport = [];

      if (selectedProvider) {
        try {
          // In a real implementation, this would fetch actual services from the provider
          // For demo purposes, we'll use the selected API services
          const importedServices = await serviceImporter.importServices(
            selectedProvider,
            bulkProfitPercentage,
          );

          // Filter to only include selected services
          const selectedServiceIds = selectedApiServices.map((s) => s.id);
          servicesToImport = importedServices.filter((s) =>
            selectedServiceIds.includes(s.providerServiceId),
          );
        } catch (err) {
          console.error("Error fetching services from provider:", err);
          // Fall back to manual mapping if API fetch fails
          servicesToImport = selectedApiServices.map((apiService) => {
            const category = serviceImporter.getMappedCategory(
              apiService.category,
            );
            const platform = serviceImporter.getMappedPlatform(
              apiService.platform,
            );
            const cost = apiService.rate;
            const price = serviceProviderManager.calculatePrice(
              cost,
              bulkProfitPercentage,
            );

            return {
              id: `SRV-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
              name: apiService.name,
              platform,
              category,
              price: parseFloat(price.toFixed(3)),
              cost,
              minOrder: apiService.min,
              maxOrder: apiService.max,
              description: apiService.description,
              provider: apiService.provider,
              providerId: apiService.providerId,
              providerServiceId: apiService.id,
              status: "نشط",
              profitPercentage: bulkProfitPercentage,
            };
          });
        }
      } else {
        // If no provider selected, map services manually
        servicesToImport = selectedApiServices.map((apiService) => {
          const category = serviceImporter.getMappedCategory(
            apiService.category,
          );
          const platform = serviceImporter.getMappedPlatform(
            apiService.platform,
          );
          const cost = apiService.rate;
          const price = serviceProviderManager.calculatePrice(
            cost,
            bulkProfitPercentage,
          );

          return {
            id: `SRV-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
            name: apiService.name,
            platform,
            category,
            price: parseFloat(price.toFixed(3)),
            cost,
            minOrder: apiService.min,
            maxOrder: apiService.max,
            description: apiService.description,
            provider: apiService.provider,
            providerId: apiService.providerId,
            providerServiceId: apiService.id,
            status: "نشط",
            profitPercentage: bulkProfitPercentage,
          };
        });
      }

      // Update services
      setServices([...services, ...servicesToImport]);

      // Update category service counts
      const updatedCategories = [...categories];
      servicesToImport.forEach((service) => {
        const categoryIndex = updatedCategories.findIndex(
          (cat) => cat.name === service.category,
        );
        if (categoryIndex !== -1) {
          updatedCategories[categoryIndex].servicesCount += 1;
        } else {
          // If category doesn't exist, create it
          updatedCategories.push({
            id: `CAT-00${updatedCategories.length + 1}`,
            name: service.category,
            servicesCount: 1,
          });
        }
      });
      setCategories(updatedCategories);

      // Reset selected services
      setApiServices(
        apiServices.map((service) => ({ ...service, selected: false })),
      );

      setSuccess(true);
      setIsImportServicesDialogOpen(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error importing services:", error);
      setError("حدث خطأ أثناء استيراد الخدمات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleApiServiceSelection = (id: string) => {
    const updatedApiServices = apiServices.map((service) => {
      if (service.id === id) {
        return { ...service, selected: !service.selected };
      }
      return service;
    });
    setApiServices(updatedApiServices);
    console.log("Toggled service selection:", id);
  };

  // Function to toggle selection for all services in a category
  const toggleCategorySelection = (category: string, selected: boolean) => {
    const updatedApiServices = apiServices.map((service) => {
      if (
        service.category === category &&
        service.providerId === selectedProvider
      ) {
        return { ...service, selected };
      }
      return service;
    });
    setApiServices(updatedApiServices);
    console.log(
      `${selected ? "Selected" : "Deselected"} all services in category: ${category}`,
    );
  };

  const filteredServices = searchQuery
    ? services.filter(
        (service) =>
          service.name.includes(searchQuery) ||
          service.id.includes(searchQuery) ||
          service.description.includes(searchQuery),
      )
    : services;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-right mb-6">
        إدارة الخدمات
      </h1>

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

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ابحث عن خدمة بالاسم أو الوصف أو رقم الخدمة..."
              className="pl-10 pr-4 w-full text-right"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <div className="flex gap-2">
          <Dialog
            open={isAddCategoryDialogOpen}
            onOpenChange={setIsAddCategoryDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                إضافة قسم
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">إضافة قسم جديد</DialogTitle>
                <DialogDescription className="text-right">
                  أدخل اسم القسم الجديد
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name" className="text-right block">
                    اسم القسم
                  </Label>
                  <Input
                    id="category-name"
                    placeholder="أدخل اسم القسم"
                    className="text-right"
                    required
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري الإضافة..." : "إضافة القسم"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAddServiceDialogOpen}
            onOpenChange={setIsAddServiceDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة خدمة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">
                  إضافة خدمة جديدة
                </DialogTitle>
                <DialogDescription className="text-right">
                  أدخل بيانات الخدمة الجديدة
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-name" className="text-right block">
                      اسم الخدمة
                    </Label>
                    <Input
                      id="service-name"
                      placeholder="أدخل اسم الخدمة"
                      className="text-right"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="service-platform"
                      className="text-right block"
                    >
                      المنصة
                    </Label>
                    <Select id="service-platform" required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنصة" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.id} value={platform.name}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="service-category"
                      className="text-right block"
                    >
                      القسم
                    </Label>
                    <Select id="service-category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="service-provider"
                      className="text-right block"
                    >
                      مزود الخدمة
                    </Label>
                    <Select id="service-provider" required>
                      <SelectTrigger>
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
                    <Label
                      htmlFor="service-provider-id"
                      className="text-right block"
                    >
                      معرف الخدمة لدى المزود
                    </Label>
                    <Input
                      id="service-provider-id"
                      placeholder="أدخل معرف الخدمة"
                      className="text-right"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-price" className="text-right block">
                      سعر البيع (ر.س)
                    </Label>
                    <Input
                      id="service-price"
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="أدخل سعر البيع"
                      className="text-right"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-cost" className="text-right block">
                      سعر التكلفة (ر.س)
                    </Label>
                    <Input
                      id="service-cost"
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="أدخل سعر التكلفة"
                      className="text-right"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="service-min-order"
                      className="text-right block"
                    >
                      الحد الأدنى للطلب
                    </Label>
                    <Input
                      id="service-min-order"
                      type="number"
                      min="1"
                      placeholder="أدخل الحد الأدنى"
                      className="text-right"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="service-max-order"
                      className="text-right block"
                    >
                      الحد الأقصى للطلب
                    </Label>
                    <Input
                      id="service-max-order"
                      type="number"
                      min="1"
                      placeholder="أدخل الحد الأقصى"
                      className="text-right"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="service-description"
                    className="text-right block"
                  >
                    وصف الخدمة
                  </Label>
                  <Textarea
                    id="service-description"
                    placeholder="أدخل وصف الخدمة"
                    className="text-right min-h-[100px]"
                    required
                  />
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري الإضافة..." : "إضافة الخدمة"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isImportServicesDialogOpen}
            onOpenChange={setIsImportServicesDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                استيراد خدمات
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl h-[80vh] max-h-[700px] overflow-hidden flex flex-col"
              dir="rtl"
            >
              <DialogHeader>
                <DialogTitle className="text-right">
                  استيراد خدمات من API
                </DialogTitle>
                <DialogDescription className="text-right">
                  اختر مزود الخدمة ونسبة الربح ثم حدد الخدمات التي تريد
                  استيرادها
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 flex flex-col flex-1 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="import-provider"
                      className="text-right block"
                    >
                      مزود الخدمة
                    </Label>
                    <Select
                      value={selectedProvider}
                      onValueChange={setSelectedProvider}
                    >
                      <SelectTrigger id="import-provider">
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
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      سيتم استيراد الخدمات من مزود الخدمة المحدد. إذا لم تجد
                      مزود الخدمة المطلوب، قم بإضافته في قسم "مزودي الخدمات".
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="profit-percentage"
                      className="text-right block"
                    >
                      نسبة الربح (%)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="profit-percentage"
                        type="number"
                        min="1"
                        max="100"
                        value={bulkProfitPercentage}
                        onChange={(e) =>
                          setBulkProfitPercentage(
                            parseInt(e.target.value) || 20,
                          )
                        }
                        className="text-right"
                      />
                      <Percent className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 flex-1 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        // Refresh services from the selected provider
                        if (selectedProvider) {
                          setIsSubmitting(true);
                          setError("");

                          try {
                            // Fetch services from the selected provider
                            console.log(
                              `Refreshing services from provider ${selectedProvider}...`,
                            );

                            // Get provider details
                            const provider =
                              serviceProviderManager.getProvider(
                                selectedProvider,
                              );
                            if (!provider) {
                              throw new Error("Provider not found");
                            }

                            console.log(`Provider details:`, {
                              id: provider.id,
                              name: provider.name,
                              url: provider.url,
                              status: provider.status,
                            });

                            // Test connection before fetching services
                            const connectionTest =
                              await serviceProviderManager.testConnection(
                                provider,
                              );
                            if (!connectionTest) {
                              throw new Error(
                                `Connection test failed for provider ${provider.name}. Please check API URL and key.`,
                              );
                            }
                            console.log(
                              `Connection test successful for ${provider.name}`,
                            );

                            // Fetch services
                            const services =
                              await serviceProviderManager.fetchServices(
                                selectedProvider,
                              );

                            console.log(
                              `Fetched ${services.length} services from provider ${provider.name}`,
                            );

                            // Map to API services format
                            const refreshedServices = services.map(
                              (service) => ({
                                id: service.providerServiceId,
                                name: service.name,
                                category: service.category,
                                platform: service.platform,
                                rate: service.rate,
                                min: service.min,
                                max: service.max,
                                description: service.description,
                                provider: provider.name,
                                providerId: provider.id,
                                selected: false,
                              }),
                            );

                            console.log(
                              `Mapped ${refreshedServices.length} services for display`,
                            );

                            // Update API services
                            setApiServices(refreshedServices);
                            setSuccess(true);
                            setTimeout(() => setSuccess(false), 3000);
                          } catch (error) {
                            console.error("Error refreshing services:", error);
                            setError(
                              `فشل تحديث الخدمات: ${error.message || "خطأ غير معروف"}`,
                            );
                            setTimeout(() => setError(""), 5000);
                          } finally {
                            setIsSubmitting(false);
                          }
                        } else {
                          setError("يرجى اختيار مزود خدمة أولاً");
                          setTimeout(() => setError(""), 3000);
                        }
                      }}
                      disabled={isSubmitting || !selectedProvider}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          تحديث القائمة
                        </>
                      )}
                    </Button>
                    <h3 className="font-semibold">الخدمات المتاحة للاستيراد</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Group services by category */}
                    {selectedProvider ? (
                      <div>
                        {/* Group services by category */}
                        {Object.entries(
                          apiServices
                            .filter(
                              (service) =>
                                service.providerId === selectedProvider,
                            )
                            .reduce(
                              (acc, service) => {
                                const category = service.category;
                                if (!acc[category]) acc[category] = [];
                                acc[category].push(service);
                                return acc;
                              },
                              {} as Record<string, typeof apiServices>,
                            ),
                        ).map(([category, services]) => (
                          <div
                            key={category}
                            className="mb-6 border rounded-md p-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Toggle selection for all services in this category
                                  const allSelected = services.every(
                                    (s) => s.selected,
                                  );
                                  const updatedServices = apiServices.map(
                                    (s) => {
                                      if (
                                        s.category === category &&
                                        s.providerId === selectedProvider
                                      ) {
                                        return { ...s, selected: !allSelected };
                                      }
                                      return s;
                                    },
                                  );
                                  setApiServices(updatedServices);
                                }}
                              >
                                {services.every((s) => s.selected)
                                  ? "إلغاء تحديد الكل"
                                  : "تحديد الكل"}
                              </Button>
                              <h3 className="font-semibold text-lg">
                                {category}
                              </h3>
                            </div>

                            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-center w-[50px]">
                                      اختيار
                                    </TableHead>
                                    <TableHead className="text-right">
                                      اسم الخدمة
                                    </TableHead>
                                    <TableHead className="text-right">
                                      المنصة
                                    </TableHead>
                                    <TableHead className="text-right">
                                      السعر
                                    </TableHead>
                                    <TableHead className="text-right">
                                      الحد الأدنى
                                    </TableHead>
                                    <TableHead className="text-right">
                                      الحد الأقصى
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {services.map((service) => (
                                    <TableRow
                                      key={service.id}
                                      className="cursor-pointer hover:bg-gray-50"
                                      onClick={() =>
                                        toggleApiServiceSelection(service.id)
                                      }
                                    >
                                      <TableCell className="text-center">
                                        <input
                                          type="checkbox"
                                          checked={service.selected}
                                          onChange={() =>
                                            toggleApiServiceSelection(
                                              service.id,
                                            )
                                          }
                                          className="h-4 w-4"
                                        />
                                      </TableCell>
                                      <TableCell>{service.name}</TableCell>
                                      <TableCell>{service.platform}</TableCell>
                                      <TableCell>
                                        {service.rate.toFixed(3)}
                                      </TableCell>
                                      <TableCell>{service.min}</TableCell>
                                      <TableCell>{service.max}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-md">
                        <p className="text-gray-500">
                          يرجى اختيار مزود خدمة لعرض الخدمات المتاحة
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700 text-right">
                    <strong>ملاحظة:</strong> سيتم تطبيق نسبة الربح المحددة على
                    جميع الخدمات المستوردة. يمكنك تعديل الأسعار لكل خدمة بشكل
                    منفصل بعد الاستيراد.
                  </p>
                </div>

                <DialogFooter className="mt-auto pt-4">
                  <Button
                    onClick={handleImportServices}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "جاري الاستيراد..."
                      : "استيراد الخدمات المحددة"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="services" dir="rtl" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="services">الخدمات</TabsTrigger>
          <TabsTrigger value="categories">الأقسام</TabsTrigger>
          <TabsTrigger value="providers">مزودي الخدمات</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                قائمة الخدمات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الخدمة</TableHead>
                      <TableHead className="text-right">اسم الخدمة</TableHead>
                      <TableHead className="text-right">المنصة</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">السعر (ر.س)</TableHead>
                      <TableHead className="text-right">
                        التكلفة (ر.س)
                      </TableHead>
                      <TableHead className="text-right">نسبة الربح</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">
                            {service.id}
                          </TableCell>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>{service.platform}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>{service.price.toFixed(3)}</TableCell>
                          <TableCell>{service.cost.toFixed(3)}</TableCell>
                          <TableCell>{service.profitPercentage}%</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                service.status === "نشط"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {service.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Dialog
                                open={
                                  isEditServiceDialogOpen &&
                                  selectedService?.id === service.id
                                }
                                onOpenChange={(open) => {
                                  setIsEditServiceDialogOpen(open);
                                  if (open) setSelectedService(service);
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
                                <DialogContent className="max-w-3xl" dir="rtl">
                                  <DialogHeader>
                                    <DialogTitle className="text-right">
                                      تعديل الخدمة
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      {service.id} - {service.platform} -{" "}
                                      {service.category}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    onSubmit={handleEditService}
                                    className="space-y-4"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="edit-service-name"
                                          className="text-right block"
                                        >
                                          اسم الخدمة
                                        </Label>
                                        <Input
                                          id="edit-service-name"
                                          defaultValue={service.name}
                                          className="text-right"
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="edit-service-status"
                                          className="text-right block"
                                        >
                                          الحالة
                                        </Label>
                                        <Select defaultValue={service.status}>
                                          <SelectTrigger id="edit-service-status">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="نشط">
                                              نشط
                                            </SelectItem>
                                            <SelectItem value="غير نشط">
                                              غير نشط
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="edit-service-price"
                                          className="text-right block"
                                        >
                                          سعر البيع (ر.س)
                                        </Label>
                                        <Input
                                          id="edit-service-price"
                                          type="number"
                                          step="0.001"
                                          min="0.001"
                                          defaultValue={service.price}
                                          className="text-right"
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="edit-service-cost"
                                          className="text-right block"
                                        >
                                          سعر التكلفة (ر.س)
                                        </Label>
                                        <Input
                                          id="edit-service-cost"
                                          type="number"
                                          step="0.001"
                                          min="0.001"
                                          defaultValue={service.cost}
                                          className="text-right"
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="edit-service-min-order"
                                          className="text-right block"
                                        >
                                          الحد الأدنى للطلب
                                        </Label>
                                        <Input
                                          id="edit-service-min-order"
                                          type="number"
                                          min="1"
                                          defaultValue={service.minOrder}
                                          className="text-right"
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="edit-service-max-order"
                                          className="text-right block"
                                        >
                                          الحد الأقصى للطلب
                                        </Label>
                                        <Input
                                          id="edit-service-max-order"
                                          type="number"
                                          min="1"
                                          defaultValue={service.maxOrder}
                                          className="text-right"
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="edit-service-description"
                                        className="text-right block"
                                      >
                                        وصف الخدمة
                                      </Label>
                                      <Textarea
                                        id="edit-service-description"
                                        defaultValue={service.description}
                                        className="text-right min-h-[100px]"
                                        required
                                      />
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
                                  isDeleteServiceDialogOpen &&
                                  selectedService?.id === service.id
                                }
                                onOpenChange={(open) => {
                                  setIsDeleteServiceDialogOpen(open);
                                  if (open) setSelectedService(service);
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
                                      حذف الخدمة
                                    </DialogTitle>
                                    <DialogDescription className="text-right">
                                      هل أنت متأكد من رغبتك في حذف هذه الخدمة؟
                                      هذا الإجراء لا يمكن التراجع عنه.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="mt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setIsDeleteServiceDialogOpen(false)
                                      }
                                    >
                                      إلغاء
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={handleDeleteService}
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting
                                        ? "جاري الحذف..."
                                        : "حذف الخدمة"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          لا توجد نتائج مطابقة للبحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="w-full bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-right">
                أقسام الخدمات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم القسم</TableHead>
                      <TableHead className="text-right">اسم القسم</TableHead>
                      <TableHead className="text-right">عدد الخدمات</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.id}
                        </TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.servicesCount}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            تعديل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <ServiceProviderSettings
            onProvidersUpdated={() => {
              // Refresh the providers list when updated
              console.log("Providers updated, refreshing data...");

              // Update providers list from ServiceProviderManager
              const updatedProviders = serviceProviderManager.getProviders();
              if (updatedProviders.length > 0) {
                setProviders(
                  updatedProviders.map((provider) => ({
                    id: provider.id,
                    name: provider.name,
                    servicesCount: 0, // This would be populated from actual service counts
                  })),
                );
              }

              // Also update the API services list to reflect new providers
              setApiServices((prevServices) => {
                // Keep selection state but update provider information
                return prevServices.map((service) => ({
                  ...service,
                  // Update provider info if needed
                }));
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceManagement;

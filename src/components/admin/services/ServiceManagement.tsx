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
    { id: "CAT-001", name: "Followers", servicesCount: 12 },
    { id: "CAT-002", name: "Likes", servicesCount: 8 },
    { id: "CAT-003", name: "Views", servicesCount: 6 },
    { id: "CAT-004", name: "Comments", servicesCount: 4 },
    { id: "CAT-005", name: "Shares", servicesCount: 3 },
  ]);

  // Sample platforms data
  const platforms = [
    { id: "PLT-001", name: "Instagram" },
    { id: "PLT-002", name: "Twitter" },
    { id: "PLT-003", name: "YouTube" },
    { id: "PLT-004", name: "TikTok" },
    { id: "PLT-005", name: "Facebook" },
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
      name: "Instagram Arab Followers",
      platform: "Instagram",
      category: "Followers",
      price: 0.05,
      cost: 0.04,
      minOrder: 100,
      maxOrder: 10000,
      description:
        "Real Arab followers with profile pictures and posts. No password required, just public account.",
      provider: "SocialBoost API",
      providerId: "PRV-001",
      providerServiceId: "1",
      status: "Active",
      profitPercentage: 25,
    },
    {
      id: "SRV-002",
      name: "Instagram Likes",
      platform: "Instagram",
      category: "Likes",
      price: 0.03,
      cost: 0.025,
      minOrder: 50,
      maxOrder: 5000,
      description:
        "High quality likes for Instagram posts. Starts within 30 minutes of order confirmation.",
      provider: "SocialBoost API",
      providerId: "PRV-001",
      providerServiceId: "2",
      status: "Active",
      profitPercentage: 20,
    },
    {
      id: "SRV-003",
      name: "Twitter Followers",
      platform: "Twitter",
      category: "Followers",
      price
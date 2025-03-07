/**
 * Service Importer
 * Handles importing services from providers and mapping them to the system
 */

import {
  ApiService,
  ServiceProvider,
  serviceProviderManager,
} from "./ServiceProviderManager";

export interface MappedService {
  id: string;
  name: string;
  platform: string;
  category: string;
  price: number;
  cost: number;
  minOrder: number;
  maxOrder: number;
  description: string;
  provider: string;
  providerId: string;
  providerServiceId: string;
  status: string;
  profitPercentage: number;
}

export class ServiceImporter {
  // Category mapping from API to local system
  private categoryMapping: Record<string, string> = {
    Followers: "متابعين",
    Likes: "إعجابات",
    Views: "مشاهدات",
    Comments: "تعليقات",
    Shares: "مشاركات",
    Subscribers: "مشتركين",
  };

  // Platform mapping from API to local system
  private platformMapping: Record<string, string> = {
    Instagram: "انستغرام",
    Facebook: "فيسبوك",
    Twitter: "تويتر",
    YouTube: "يوتيوب",
    TikTok: "تيك توك",
    Telegram: "تيليجرام",
    Snapchat: "سناب شات",
    LinkedIn: "لينكد إن",
  };

  /**
   * Import services from a provider
   */
  public async importServices(
    providerId: string,
    profitPercentage: number,
  ): Promise<MappedService[]> {
    try {
      console.log(
        `Starting import process for provider ${providerId} with profit margin ${profitPercentage}%`,
      );

      // Validate provider exists
      const provider = serviceProviderManager.getProvider(providerId);
      if (!provider) {
        throw new Error(`Provider with ID ${providerId} not found`);
      }

      // Validate provider is active
      if (provider.status !== "active") {
        throw new Error(`Provider ${provider.name} is not active`);
      }

      // Fetch services from the provider
      console.log(`Fetching services from provider ${provider.name}...`);
      const services = await serviceProviderManager.fetchServices(providerId);

      if (!services || services.length === 0) {
        console.warn(`No services found for provider ${provider.name}`);
        return [];
      }

      console.log(
        `Successfully fetched ${services.length} services from ${provider.name}`,
      );

      // Map services to our system format
      const mappedServices = services.map((service) =>
        this.mapService(service, provider, profitPercentage),
      );

      console.log(
        `Successfully mapped ${mappedServices.length} services with ${profitPercentage}% profit margin`,
      );
      return mappedServices;
    } catch (error) {
      console.error("Error importing services:", error);
      throw new Error(
        `Failed to import services: ${error.message || "Unknown error"}`,
      );
    }
  }

  /**
   * Map a service from API format to our system format
   */
  private mapService(
    service: ApiService,
    provider: ServiceProvider,
    profitPercentage: number,
  ): MappedService {
    // Map category and platform names
    const category = this.categoryMapping[service.category] || service.category;
    const platform = this.platformMapping[service.platform] || service.platform;

    // Calculate price with profit percentage
    const cost = service.rate;
    const price = serviceProviderManager.calculatePrice(cost, profitPercentage);

    return {
      id: `SRV-${Date.now().toString(36)}`,
      name: service.name,
      platform,
      category,
      price: parseFloat(price.toFixed(3)),
      cost,
      minOrder: service.min,
      maxOrder: service.max,
      description: service.description,
      provider: provider.name,
      providerId: provider.id,
      providerServiceId: service.providerServiceId,
      status: "نشط",
      profitPercentage,
    };
  }

  /**
   * Update prices for services based on new profit percentage
   */
  public updatePrices(
    services: MappedService[],
    newProfitPercentage: number,
  ): MappedService[] {
    return services.map((service) => {
      const newPrice = serviceProviderManager.calculatePrice(
        service.cost,
        newProfitPercentage,
      );
      return {
        ...service,
        price: parseFloat(newPrice.toFixed(3)),
        profitPercentage: newProfitPercentage,
      };
    });
  }

  /**
   * Get mapped category name
   */
  public getMappedCategory(category: string): string {
    return this.categoryMapping[category] || category;
  }

  /**
   * Get mapped platform name
   */
  public getMappedPlatform(platform: string): string {
    return this.platformMapping[platform] || platform;
  }

  /**
   * Add or update category mapping
   */
  public setCategoryMapping(apiCategory: string, localCategory: string): void {
    this.categoryMapping[apiCategory] = localCategory;
  }

  /**
   * Add or update platform mapping
   */
  public setPlatformMapping(apiPlatform: string, localPlatform: string): void {
    this.platformMapping[apiPlatform] = localPlatform;
  }
}

// Create a singleton instance
export const serviceImporter = new ServiceImporter();

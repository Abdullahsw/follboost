/**
 * Service Provider Manager
 * Handles multiple API providers for SMM services
 */

export interface ServiceProvider {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  apiSecret?: string;
  status: "active" | "inactive";
}

export interface ApiService {
  id: string;
  name: string;
  category: string;
  platform: string;
  rate: number;
  min: number;
  max: number;
  description: string;
  providerId: string;
  providerServiceId: string;
}

export class ServiceProviderManager {
  private providers: ServiceProvider[] = [];

  constructor() {
    // Load providers from localStorage or other storage
    this.loadProviders();
  }

  private loadProviders() {
    try {
      const savedProviders = localStorage.getItem("serviceProviders");
      if (savedProviders) {
        this.providers = JSON.parse(savedProviders);
      }
    } catch (error) {
      console.error("Error loading providers:", error);
    }
  }

  private saveProviders() {
    try {
      localStorage.setItem("serviceProviders", JSON.stringify(this.providers));
    } catch (error) {
      console.error("Error saving providers:", error);
    }
  }

  /**
   * Add a new service provider
   */
  public addProvider(provider: Omit<ServiceProvider, "id">): ServiceProvider {
    // Generate a unique ID with timestamp and random component
    const newProvider = {
      ...provider,
      id: `PRV-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      status: provider.status || "active",
    };

    // Ensure URL is properly formatted
    if (newProvider.url && !newProvider.url.startsWith("http")) {
      newProvider.url = `https://${newProvider.url}`;
    }

    // Add to providers array
    this.providers.push(newProvider);
    this.saveProviders();
    console.log(
      `Provider added successfully: ${newProvider.name} (${newProvider.id})`,
    );
    return newProvider;
  }

  /**
   * Update an existing service provider
   */
  public updateProvider(
    id: string,
    updates: Partial<ServiceProvider>,
  ): ServiceProvider | null {
    const index = this.providers.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.providers[index] = { ...this.providers[index], ...updates };
    this.saveProviders();
    return this.providers[index];
  }

  /**
   * Remove a service provider
   */
  public removeProvider(id: string): boolean {
    const initialLength = this.providers.length;
    this.providers = this.providers.filter((p) => p.id !== id);
    this.saveProviders();
    return this.providers.length < initialLength;
  }

  /**
   * Get all service providers
   */
  public getProviders(): ServiceProvider[] {
    return [...this.providers];
  }

  /**
   * Get a specific provider by ID
   */
  public getProvider(id: string): ServiceProvider | null {
    return this.providers.find((p) => p.id === id) || null;
  }

  /**
   * Fetch services from a provider
   */
  public static async fetchServices(providerId: string): Promise<any[]> {
    try {
      // Dynamically import ServiceFetcher to avoid circular dependencies
      const { ServiceFetcher } = await import("./ServiceFetcher");
      const result = await ServiceFetcher.fetchServices(providerId);
      if (result.success && result.services) {
        return result.services;
      }
      return [];
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  }

  /**
   * Place an order with a provider
   */
  public async placeOrder(
    providerId: string,
    serviceId: string,
    link: string,
    quantity: number,
  ): Promise<any> {
    const provider = this.getProvider(providerId);
    if (!provider) throw new Error("Provider not found");

    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we'll simulate a response
      return {
        success: true,
        orderId: `API-${Date.now().toString(36)}`,
        status: "pending",
      };
    } catch (error) {
      console.error(`Error placing order with ${provider.name}:`, error);
      throw error;
    }
  }

  /**
   * Check order status with a provider
   */
  public async checkOrderStatus(
    providerId: string,
    apiOrderId: string,
  ): Promise<any> {
    const provider = this.getProvider(providerId);
    if (!provider) throw new Error("Provider not found");

    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we'll simulate a response
      const statuses = [
        "pending",
        "in_progress",
        "completed",
        "partial",
        "canceled",
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      const randomProgress =
        randomStatus === "completed"
          ? 100
          : randomStatus === "canceled"
            ? 0
            : Math.floor(Math.random() * 100);

      return {
        success: true,
        status: randomStatus,
        remains:
          randomStatus === "completed" ? 0 : Math.floor(Math.random() * 1000),
        start_count: 0,
        current_count: randomProgress,
      };
    } catch (error) {
      console.error(
        `Error checking order status with ${provider.name}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get provider balance
   */
  public async getBalance(providerId: string): Promise<any> {
    const provider = this.getProvider(providerId);
    if (!provider) throw new Error("Provider not found");

    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we'll simulate a response
      return {
        success: true,
        balance: (Math.random() * 1000).toFixed(2),
        currency: "USD",
      };
    } catch (error) {
      console.error(`Error getting balance from ${provider.name}:`, error);
      throw error;
    }
  }

  /**
   * Test connection to a provider
   * Enhanced with better error handling and multiple connection attempts
   */
  public async testConnection(
    provider: Partial<ServiceProvider>,
  ): Promise<boolean> {
    try {
      if (!provider.url || !provider.apiKey) {
        throw new Error("URL and API key are required");
      }

      // Validate URL format
      if (
        !provider.url.startsWith("http://") &&
        !provider.url.startsWith("https://")
      ) {
        throw new Error(
          "Invalid URL format. URL must start with http:// or https://",
        );
      }

      console.log(
        `Testing connection to ${provider.url} with key ${provider.apiKey.substring(0, 5)}...`,
      );

      // Import the PHP API Adapter to handle PHP-based SMM panels
      const { PhpApiAdapter } = await import("./php-api-adapter");
      const apiClient = new PhpApiAdapter(provider.url, provider.apiKey);

      // Try to get the balance as a simple test
      console.log(`Sending balance request to test PHP API connection...`);
      const response = await apiClient.getBalance();
      console.log(`Test connection response:`, response);

      // Check for specific error patterns
      if (response && response.error) {
        console.warn(`API returned error: ${response.error}`);
        throw new Error(`API returned error: ${response.error}`);
      }

      // For SMM panel APIs, the response might be in different formats
      // Some return {balance: "100.00", currency: "USD"}
      // Others might return {status: "success", balance: "100.00"}
      // Or even just an array of services when using the services endpoint

      // Check for common response patterns
      if (
        response.balance !== undefined ||
        response.success === true ||
        Array.isArray(response) ||
        (typeof response === "object" && Object.keys(response).length > 0)
      ) {
        console.log(
          `Connection successful. Response received.`,
          response.balance
            ? `Balance: ${response.balance} ${response.currency || "USD"}`
            : "",
        );
        return true;
      }

      // If we got here, the response format is unexpected
      console.warn(`Unexpected API response format:`, response);
      throw new Error("Unexpected API response format");
    } catch (error) {
      console.error(
        `Error testing connection to ${provider.name || "provider"}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Simulate API response for services
   * In a real implementation, this would be replaced with actual API calls
   */
  private simulateApiResponse(provider: ServiceProvider): ApiService[] {
    // Generate services based on provider, organized by category
    const platforms = ["Instagram", "Facebook", "Twitter", "YouTube", "TikTok"];
    const categories = ["Followers", "Likes", "Views", "Comments", "Shares"];
    const services: ApiService[] = [];

    // Generate services for each category
    categories.forEach((category) => {
      // Generate 3-5 services per category
      const servicesPerCategory = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < servicesPerCategory; i++) {
        // For each service, pick a platform
        const platform =
          platforms[Math.floor(Math.random() * platforms.length)];

        // Create service with consistent ID format
        const serviceId = `${category.substring(0, 3)}-${platform.substring(0, 3)}-${i + 1}`;

        // Create quality variants
        const quality =
          i % 3 === 0
            ? "[Premium]"
            : i % 3 === 1
              ? "[High Quality]"
              : "[Standard]";

        services.push({
          id: serviceId,
          name: `${platform} ${category} ${quality}`,
          category,
          platform,
          rate: parseFloat((0.001 + Math.random() * 0.2).toFixed(3)),
          min: 10 * Math.floor(Math.random() * 10 + 1),
          max: 1000 * Math.floor(Math.random() * 100 + 1),
          description: `High quality ${category.toLowerCase()} for ${platform}. Fast delivery.`,
          providerId: provider.id,
          providerServiceId: serviceId,
        });
      }
    });

    return services;
  }

  /**
   * Calculate price with profit margin
   */
  public calculatePrice(rate: number, profitPercent: number): number {
    return rate * (1 + profitPercent / 100);
  }
}

// Create a singleton instance
export const serviceProviderManager = new ServiceProviderManager();

import { ServiceProviders, ServiceProvider } from "./serviceProviders";
import { ApiHandler } from "./apiHandler";

export class ServiceManager {
  private providers: ServiceProvider[] = [];

  constructor() {
    // Initialize empty providers array
  }

  /**
   * Load providers from the database
   */
  public async loadProviders(): Promise<void> {
    this.providers = await ServiceProviders.getAllProviders();
  }

  /**
   * Get all services from all providers
   */
  public async getAllServices(): Promise<Record<string, any>> {
    if (this.providers.length === 0) {
      await this.loadProviders();
    }

    const allServices: Record<string, any> = {};

    for (const provider of this.providers) {
      try {
        const api = new ApiHandler(provider.api_url, provider.api_key);
        const services = await api.request("services");
        allServices[provider.name] = services;
      } catch (error) {
        console.error(`Error fetching services from ${provider.name}:`, error);
        allServices[provider.name] = {
          error: error.message || "Unknown error",
        };
      }
    }

    return allServices;
  }

  /**
   * Get balances from all providers
   */
  public async getBalances(): Promise<Record<string, any>> {
    if (this.providers.length === 0) {
      await this.loadProviders();
    }

    const balances: Record<string, any> = {};

    for (const provider of this.providers) {
      try {
        const api = new ApiHandler(provider.api_url, provider.api_key);
        const balance = await api.request("balance");
        balances[provider.name] = balance;
      } catch (error) {
        console.error(`Error fetching balance from ${provider.name}:`, error);
        balances[provider.name] = { error: error.message || "Unknown error" };
      }
    }

    return balances;
  }

  /**
   * Add a new provider
   */
  public async addProvider(
    name: string,
    apiUrl: string,
    apiKey: string,
    apiSecret?: string,
  ): Promise<ServiceProvider | null> {
    const provider = await ServiceProviders.addProvider(
      name,
      apiUrl,
      apiKey,
      apiSecret,
    );
    if (provider) {
      this.providers.push(provider);
    }
    return provider;
  }

  /**
   * Place an order with a provider
   */
  public async placeOrder(
    providerId: string,
    service: string | number,
    link: string,
    quantity: number,
    comments?: string,
  ): Promise<any> {
    const provider =
      this.providers.find((p) => p.id === providerId) ||
      (await ServiceProviders.getProviderById(providerId));

    if (!provider) {
      throw new Error("Provider not found");
    }

    const api = new ApiHandler(provider.api_url, provider.api_key);
    const orderData = {
      service,
      link,
      quantity,
      ...(comments ? { comments } : {}),
    };

    return await api.request("add", orderData);
  }

  /**
   * Check order status
   */
  public async checkOrderStatus(
    providerId: string,
    orderId: string | number,
  ): Promise<any> {
    const provider =
      this.providers.find((p) => p.id === providerId) ||
      (await ServiceProviders.getProviderById(providerId));

    if (!provider) {
      throw new Error("Provider not found");
    }

    const api = new ApiHandler(provider.api_url, provider.api_key);
    return await api.request("status", { order: orderId });
  }
}

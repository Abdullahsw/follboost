/**
 * Order Service
 * Handles placing orders with SMM providers
 */

import { serviceProviderManager } from "./ServiceProviderManager";
import { PhpApiAdapter } from "./php-api-adapter";

export interface OrderData {
  service: string | number; // Service ID from provider
  link: string; // URL to the social media profile/post
  quantity: number; // Number of items to order
  comments?: string; // Optional custom comments
  runs?: number; // Optional number of runs for drip-feed
  interval?: number; // Optional interval for drip-feed (in minutes)
}

export interface OrderResult {
  success: boolean;
  orderId?: string | number;
  error?: string;
  details?: any;
}

export class OrderService {
  /**
   * Place a new order with a provider
   */
  public static async placeOrder(
    providerId: string,
    orderData: OrderData,
  ): Promise<OrderResult> {
    try {
      // Get the provider
      const provider = serviceProviderManager.getProvider(providerId);
      if (!provider) {
        throw new Error("Provider not found");
      }

      // Validate order data
      if (!orderData.service) {
        throw new Error("Service ID is required");
      }
      if (!orderData.link) {
        throw new Error("Link is required");
      }
      if (!orderData.quantity || orderData.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      console.log(
        `Placing order with provider ${provider.name} (${providerId})`,
      );
      console.log(`Order data:`, orderData);

      // Create API client
      const apiClient = new PhpApiAdapter(provider.url, provider.apiKey);

      // Send the order request
      const response = await apiClient.addOrder(
        orderData.service,
        orderData.link,
        orderData.quantity,
        orderData.comments,
      );

      console.log(`Order response:`, response);

      // Check for errors
      if (response.error) {
        return {
          success: false,
          error: response.error,
          details: response,
        };
      }

      // Different providers might return different response formats
      // Handle common formats
      if (response.order) {
        return {
          success: true,
          orderId: response.order,
          details: response,
        };
      } else if (response.id) {
        return {
          success: true,
          orderId: response.id,
          details: response,
        };
      } else if (typeof response === "number") {
        // Some APIs just return the order ID as a number
        return {
          success: true,
          orderId: response,
          details: { order: response },
        };
      }

      // If we can't determine the order ID but no error was returned,
      // assume success but warn about unexpected format
      console.warn("Unexpected order response format:", response);
      return {
        success: true,
        details: response,
      };
    } catch (error) {
      console.error("Error placing order:", error);
      return {
        success: false,
        error: error.message || "Unknown error occurred while placing order",
      };
    }
  }

  /**
   * Check the status of an order
   */
  public static async checkOrderStatus(
    providerId: string,
    orderId: string | number,
  ): Promise<any> {
    try {
      // Get the provider
      const provider = serviceProviderManager.getProvider(providerId);
      if (!provider) {
        throw new Error("Provider not found");
      }

      // Create API client
      const apiClient = new PhpApiAdapter(provider.url, provider.apiKey);

      // Send the status request
      const response = await apiClient.getOrderStatus(orderId);

      return response;
    } catch (error) {
      console.error("Error checking order status:", error);
      throw error;
    }
  }
}

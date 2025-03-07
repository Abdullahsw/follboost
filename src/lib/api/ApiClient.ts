/**
 * API Client for SMM Providers
 * Based on the PHP example provided
 */

import axios from "axios";

export interface ApiResponse {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

export interface OrderParams {
  service: number | string;
  link: string;
  quantity?: number;
  comments?: string;
  runs?: number;
  interval?: number;
  keywords?: string;
  hashtag?: string;
  username?: string;
  min?: number;
  max?: number;
  posts?: number;
  old_posts?: number;
  delay?: number;
  expiry?: string;
  answer_number?: string;
}

export class ApiClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Add a new order
   */
  public async order(params: OrderParams): Promise<ApiResponse> {
    const data = {
      key: this.apiKey,
      action: "add",
      ...params,
    };
    return this.connect(data);
  }

  /**
   * Get order status
   */
  public async status(orderId: string | number): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "status",
      order: orderId,
    });
  }

  /**
   * Get multiple orders status
   */
  public async multiStatus(
    orderIds: (string | number)[],
  ): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "status",
      orders: orderIds.join(","),
    });
  }

  /**
   * Get services list
   */
  public async services(): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "services",
    });
  }

  /**
   * Refill an order
   */
  public async refill(orderId: string | number): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "refill",
      order: orderId,
    });
  }

  /**
   * Refill multiple orders
   */
  public async multiRefill(
    orderIds: (string | number)[],
  ): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "refill",
      orders: orderIds.join(","),
    });
  }

  /**
   * Get refill status
   */
  public async refillStatus(refillId: string | number): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "refill_status",
      refill: refillId,
    });
  }

  /**
   * Get multiple refill statuses
   */
  public async multiRefillStatus(
    refillIds: (string | number)[],
  ): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "refill_status",
      refills: refillIds.join(","),
    });
  }

  /**
   * Cancel orders
   */
  public async cancel(orderIds: (string | number)[]): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "cancel",
      orders: orderIds.join(","),
    });
  }

  /**
   * Get account balance
   */
  public async balance(): Promise<ApiResponse> {
    return this.connect({
      key: this.apiKey,
      action: "balance",
    });
  }

  /**
   * Connect to the API
   */
  private async connect(params: Record<string, any>): Promise<ApiResponse> {
    try {
      // Log the API request for debugging
      console.log(`Making API request to ${this.apiUrl}`, params);

      // Validate URL
      if (
        !this.apiUrl.startsWith("http://") &&
        !this.apiUrl.startsWith("https://")
      ) {
        throw new Error(
          "Invalid API URL format. URL must start with http:// or https://",
        );
      }

      // Convert params to URL encoded form data format
      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Make the API request with longer timeout
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "FollBoost API Client",
        },
        timeout: 15000, // 15 seconds timeout
      });

      // Log the response for debugging
      console.log(`API response received:`, response.data);

      // Parse the response
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          return {
            success: false,
            error: `Connection refused. Please check if the API URL is correct and the server is running.`,
          };
        } else if (
          error.code === "ETIMEDOUT" ||
          error.code === "ECONNABORTED"
        ) {
          return {
            success: false,
            error: `Connection timed out. The API server is taking too long to respond.`,
          };
        } else if (error.response) {
          console.error(
            `API error details: Status ${error.response.status}`,
            error.response.data,
          );
          return {
            success: false,
            error: `API request failed with status ${error.response.status}: ${error.response.statusText}`,
          };
        }
      }
      return {
        success: false,
        error: `API request failed: ${error.message || "Unknown error"}`,
      };
    }
  }
}

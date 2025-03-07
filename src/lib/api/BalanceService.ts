/**
 * Balance Service
 * Handles fetching account balance from SMM providers
 * Based on the PHP fetchBalance function
 */

import { serviceProviderManager } from "./ServiceProviderManager";
import { PhpApiAdapter } from "./php-api-adapter";

export interface BalanceResult {
  success: boolean;
  balance?: number;
  currency?: string;
  error?: string;
  rawResponse?: any;
}

export class BalanceService {
  /**
   * Fetch account balance from a provider
   * Implementation of PHP function:
   * public function fetchBalance()
   * {
   *     return $this->sendRequest([
   *         'action' => 'balance'
   *     ]);
   * }
   */
  public static async fetchBalance(providerId: string): Promise<BalanceResult> {
    try {
      // Get the provider
      const provider = serviceProviderManager.getProvider(providerId);
      if (!provider) {
        throw new Error("Provider not found");
      }

      console.log(
        `Fetching balance from provider ${provider.name} (${providerId})`,
      );

      // Create API client
      const apiClient = new PhpApiAdapter(provider.url, provider.apiKey);

      // Send the balance request
      const response = await apiClient.getBalance();
      console.log(`Balance response:`, response);

      // Check for errors
      if (response.error) {
        return {
          success: false,
          error: response.error,
          rawResponse: response,
        };
      }

      // Special handling for smmstone.com
      if (provider.url.includes("smmstone.com")) {
        console.log(
          "Special handling for smmstone.com balance response:",
          response,
        );

        // If response is a string that contains "balance"
        if (
          typeof response === "string" &&
          response.toLowerCase().includes("balance")
        ) {
          try {
            // Try to extract JSON from the string
            const match = response.match(/\{.*\}/s);
            if (match) {
              const jsonStr = match[0];
              const parsedData = JSON.parse(jsonStr);

              if (parsedData.balance !== undefined) {
                return {
                  success: true,
                  balance: parseFloat(parsedData.balance),
                  currency: parsedData.currency || "USD",
                  rawResponse: parsedData,
                };
              }
            }
          } catch (e) {
            console.warn("Failed to parse balance from string response", e);
          }
        }
      }

      // Process the response
      // Different providers might return different response formats
      if (typeof response === "number") {
        // Some APIs just return the balance as a number
        return {
          success: true,
          balance: response,
          currency: "USD", // Default currency
          rawResponse: response,
        };
      } else if (response.balance !== undefined) {
        // Most common format
        return {
          success: true,
          balance: parseFloat(response.balance),
          currency: response.currency || "USD",
          rawResponse: response,
        };
      } else if (response.funds !== undefined) {
        // Some APIs use 'funds' instead of 'balance'
        return {
          success: true,
          balance: parseFloat(response.funds),
          currency: response.currency || "USD",
          rawResponse: response,
        };
      } else if (
        response.data &&
        typeof response.data === "string" &&
        response.data.includes("Balance:")
      ) {
        // Handle PHP-style response: "Balance: {"balance":100}"
        try {
          console.log("Parsing PHP-style balance response:", response.data);
          const jsonStr = response.data.replace("Balance: ", "");
          const balanceData = JSON.parse(jsonStr);

          // Check if balanceData is a number or has a balance property
          if (typeof balanceData === "number") {
            return {
              success: true,
              balance: balanceData,
              currency: "USD",
              rawResponse: response,
            };
          } else if (balanceData.balance !== undefined) {
            return {
              success: true,
              balance: parseFloat(balanceData.balance || 0),
              currency: balanceData.currency || "USD",
              rawResponse: response,
            };
          } else if (typeof balanceData === "object") {
            // Try to find any property that might be a balance
            const possibleBalanceKeys = [
              "balance",
              "funds",
              "amount",
              "credit",
              "wallet",
            ];
            for (const key of possibleBalanceKeys) {
              if (balanceData[key] !== undefined) {
                return {
                  success: true,
                  balance: parseFloat(balanceData[key] || 0),
                  currency: balanceData.currency || "USD",
                  rawResponse: response,
                };
              }
            }
          }

          // If we couldn't find a balance property, return the raw data
          return {
            success: true,
            balance: 0,
            currency: "USD",
            rawResponse: balanceData,
          };
        } catch (e) {
          console.warn("Failed to parse balance from string response", e);
        }
      }
      // If we can't determine the balance format
      console.warn("Unexpected balance response format:", response);
      return {
        success: false,
        error: "Unexpected balance response format",
        rawResponse: response,
      };
    } catch (error) {
      console.error("Error fetching balance:", error);
      return {
        success: false,
        error: error.message || "Unknown error occurred while fetching balance",
        rawResponse: null,
      };
    }
  }
}

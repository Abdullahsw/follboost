/**
 * Service Fetcher
 * Handles fetching and processing services from SMM providers
 */

import { serviceProviderManager } from "./ServiceProviderManager";
import { PhpApiAdapter } from "./php-api-adapter";

export interface ServiceFetchResult {
  success: boolean;
  services?: any[];
  error?: string;
  rawResponse?: any;
}

export class ServiceFetcher {
  /**
   * Fetch services from a provider
   * Implementation of PHP function:
   * public function fetchServices()
   * {
   *     return json_decode(
   *         $this->sendRequest([
   *             'action' => 'services'
   *         ])
   *     );
   * }
   */
  public static async fetchServices(
    providerId: string,
  ): Promise<ServiceFetchResult> {
    try {
      // Get the provider
      const provider = serviceProviderManager.getProvider(providerId);
      if (!provider) {
        throw new Error("Provider not found");
      }

      console.log(
        `Fetching services from provider ${provider.name} (${providerId})`,
      );

      // Create API client
      const apiClient = new PhpApiAdapter(provider.url, provider.apiKey);

      // Send the services request
      const response = await apiClient.getServices();
      console.log(`Services response:`, response);

      // Check for errors
      if (response.error) {
        return {
          success: false,
          error: response.error,
          rawResponse: response,
        };
      }

      // Process the response
      let services = [];

      // Handle different response formats
      if (Array.isArray(response)) {
        // Direct array of services
        services = response;
      } else if (response && typeof response === "object") {
        // Some APIs return an object with service IDs as keys
        if (
          Object.keys(response).length > 0 &&
          typeof Object.values(response)[0] === "object"
        ) {
          services = Object.entries(response).map(([id, service]) => ({
            service: id,
            ...(service as object),
          }));
        }
        // Some APIs might have a data property containing the services
        else if (response.data && Array.isArray(response.data)) {
          services = response.data;
        }
        // Handle PHP-style response: "Services: [{...}]"
        else if (
          response.data &&
          typeof response.data === "string" &&
          response.data.includes("Services:")
        ) {
          try {
            const jsonStr = response.data.replace("Services: ", "");
            const parsedServices = JSON.parse(jsonStr);
            if (Array.isArray(parsedServices)) {
              services = parsedServices;
            } else if (typeof parsedServices === "object") {
              // Handle object with service IDs as keys
              services = Object.entries(parsedServices).map(
                ([id, service]) => ({
                  service: id,
                  ...(service as object),
                }),
              );
            }
          } catch (e) {
            console.warn("Failed to parse services from string response", e);
          }
        }
      }

      // Special handling for smmstone.com which has a unique response format
      if (provider.url.includes("smmstone.com") && services.length === 0) {
        console.log(
          "Detected smmstone.com API, applying special response handling",
        );
        try {
          // For smmstone.com, the response might be a plain object with numeric keys
          if (response && typeof response === "object") {
            const serviceEntries = Object.entries(response);
            if (serviceEntries.length > 0) {
              services = serviceEntries.map(([id, serviceData]) => {
                // Ensure serviceData is an object
                if (typeof serviceData === "object" && serviceData !== null) {
                  return {
                    service: id,
                    id: id,
                    ...(serviceData as object),
                  };
                } else {
                  // If serviceData is not an object, create a minimal service object
                  return {
                    service: id,
                    id: id,
                    name: `Service ${id}`,
                    rate: 0,
                    min: 0,
                    max: 0,
                  };
                }
              });
              console.log(
                `Extracted ${services.length} services from smmstone.com response`,
              );
            }
          }

          // Handle string response that might contain JSON
          if (response && response.data && typeof response.data === "string") {
            try {
              // Try to extract JSON from the string response
              let jsonStr = response.data;
              if (jsonStr.includes("Services:")) {
                jsonStr = jsonStr.replace("Services: ", "");
              }

              const parsedData = JSON.parse(jsonStr);
              if (parsedData && typeof parsedData === "object") {
                if (Array.isArray(parsedData)) {
                  services = parsedData;
                } else {
                  // Handle object with service IDs as keys
                  const entries = Object.entries(parsedData);
                  if (entries.length > 0) {
                    services = entries.map(([id, serviceData]) => ({
                      service: id,
                      id: id,
                      ...(serviceData as object),
                    }));
                  }
                }
                console.log(
                  `Extracted ${services.length} services from string response`,
                );
              }
            } catch (e) {
              console.warn("Failed to parse services from string response", e);
            }
          }
        } catch (parseError) {
          console.error("Error parsing smmstone.com response:", parseError);
        }
      }

      return {
        success: true,
        services,
        rawResponse: response,
      };
    } catch (error) {
      console.error("Error fetching services:", error);
      return {
        success: false,
        error:
          error.message || "Unknown error occurred while fetching services",
        rawResponse: null,
      };
    }
  }

  /**
   * Process and normalize services from different API formats
   */
  public static normalizeServices(services: any[]): any[] {
    // Handle null, undefined, or non-array inputs
    if (!services || !Array.isArray(services)) {
      console.warn("normalizeServices received invalid input:", services);
      return [];
    }

    // Filter out any null or undefined items in the array
    return services
      .filter((service) => service != null)
      .map((service) => {
        // Handle smmstone.com specific format where service might be a string
        if (typeof service === "string") {
          try {
            service = JSON.parse(service);
          } catch (e) {
            // If parsing fails, create a minimal service object
            return {
              id: "unknown",
              name:
                service.length > 30
                  ? service.substring(0, 30) + "..."
                  : service,
              category: "Unknown",
              type: "Unknown",
              rate: 0,
              min: 0,
              max: 0,
              description: service,
              dripfeed: false,
              refill: false,
            };
          }
        }

        return {
          id: service.service || service.id || "",
          name:
            service.name || `Service ${service.service || service.id || ""}`,
          category: service.category || "",
          type: service.type || "",
          rate: parseFloat(service.rate || service.price || "0"),
          min: parseInt(service.min || service.minimum || "0", 10),
          max: parseInt(service.max || service.maximum || "0", 10),
          description: service.description || service.desc || "",
          dripfeed:
            service.dripfeed === true ||
            service.dripfeed === "true" ||
            service.dripfeed === 1,
          refill:
            service.refill === true ||
            service.refill === "true" ||
            service.refill === 1,
        };
      });
  }
}

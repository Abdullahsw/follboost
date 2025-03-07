import axios from "axios";

export class ApiHandler {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Connect to the API - TypeScript implementation of the PHP connect function
   */
  private async connect(params: Record<string, any>): Promise<any> {
    try {
      // Convert params to URL encoded form data format
      const formData = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Make the API request
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // Disable SSL verification (equivalent to CURLOPT_SSL_VERIFYPEER, 0)
        httpsAgent: new (require("https").Agent)({
          rejectUnauthorized: false,
        }),
      });

      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      return { error: error.message || "Unknown error" };
    }
  }

  /**
   * Make a request to the API - TypeScript implementation of the PHP request function
   */
  public async request(
    action: string,
    data: Record<string, any> = {},
  ): Promise<any> {
    const params = {
      key: this.apiKey,
      action,
      ...data,
    };

    const result = await this.connect(params);
    return result;
  }
}

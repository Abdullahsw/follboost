import { supabase } from "@/lib/supabase";

export interface ServiceProvider {
  id: string;
  name: string;
  api_url: string;
  api_key: string;
  api_secret?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export class ServiceProviders {
  /**
   * Get all service providers
   */
  public static async getAllProviders(): Promise<ServiceProvider[]> {
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching service providers:", error);
      return [];
    }
  }

  /**
   * Add a new service provider
   */
  public static async addProvider(
    name: string,
    api_url: string,
    api_key: string,
    api_secret?: string,
  ): Promise<ServiceProvider | null> {
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .insert([
          {
            name,
            api_url,
            api_key,
            api_secret,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding service provider:", error);
      return null;
    }
  }

  /**
   * Update a service provider
   */
  public static async updateProvider(
    id: string,
    updates: Partial<ServiceProvider>,
  ): Promise<ServiceProvider | null> {
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating service provider:", error);
      return null;
    }
  }

  /**
   * Delete a service provider
   */
  public static async deleteProvider(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("service_providers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting service provider:", error);
      return false;
    }
  }

  /**
   * Get a service provider by ID
   */
  public static async getProviderById(
    id: string,
  ): Promise<ServiceProvider | null> {
    try {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching service provider:", error);
      return null;
    }
  }
}

import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase configuration with explicit fallbacks
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://qnkfvwlxqbxnwfxjqnzs.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFua2Z2d2x4cWJ4bndmeGpxbnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2MzA0MDAsImV4cCI6MjAzMzIwNjQwMH0.Nh83ebqzv3RKwlmsCNvgRdEhKFUoJCCVjXJA7S-9PJM";

// Log the configuration to help with debugging
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key length:", supabaseAnonKey?.length || 0);
console.log("Environment variables available:", {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? "set" : "not set",
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
    ? "set"
    : "not set",
});

// Create and export the Supabase client with enhanced configuration
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "X-Client-Info": "follboost-web",
    },
  },
});

// Helper function to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("count")
      .limit(1);
    if (error) throw error;
    console.log("Supabase connection successful", data);
    return { success: true, data };
  } catch (error) {
    console.error("Supabase connection failed:", error);
    return { success: false, error };
  }
};

// Export a function to get the current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

// Export a function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

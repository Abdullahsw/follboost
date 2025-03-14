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

// Import offline fallback
import { offlineFallback } from "./offline-fallback";

// Track connection status
let isOfflineMode = false;
let connectionAttempted = false;

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
  if (connectionAttempted && isOfflineMode) {
    return { success: false, error: { message: "Running in offline mode" } };
  }

  try {
    connectionAttempted = true;
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("count")
      .limit(1);
    if (error) throw error;
    console.log("Supabase connection successful", data);
    isOfflineMode = false;
    return { success: true, data };
  } catch (error) {
    console.error("Supabase connection failed:", error);
    // If this is the first connection attempt and it failed, initialize offline mode
    if (!isOfflineMode) {
      console.warn("Initializing offline mode due to connection failure");
      isOfflineMode = true;
      offlineFallback.initOfflineMode();
    }
    return { success: false, error };
  }
};

// Export a function to get the current session
export const getCurrentSession = async () => {
  if (isOfflineMode) {
    const offlineMode = offlineFallback.initOfflineMode();
    const user = offlineMode.auth.getUser();
    return user ? { user } : null;
  }

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
  if (isOfflineMode) {
    const offlineMode = offlineFallback.initOfflineMode();
    return offlineMode.auth.getUser();
  }

  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

// Function to check if we're in offline mode
export const isInOfflineMode = () => isOfflineMode;

// Function to manually enable offline mode
export const enableOfflineMode = () => {
  isOfflineMode = true;
  offlineFallback.initOfflineMode();
  return { success: true };
};

// Function to attempt reconnection
export const attemptReconnection = async () => {
  connectionAttempted = false;
  return await checkSupabaseConnection();
};

import { createClient } from "@supabase/supabase-js";

// Use the actual values from .env file
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://qnkfvwlxqbxnwfxjqnzs.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFua2Z2d2x4cWJ4bndmeGpxbnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2MzA0MDAsImV4cCI6MjAzMzIwNjQwMH0.Nh83ebqzv3RKwlmsCNvgRdEhKFUoJCCVjXJA7S-9PJM";

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key length:", supabaseAnonKey?.length || 0);

// Create Supabase client with proper error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

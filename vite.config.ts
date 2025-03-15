import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import path from "path";

const conditionalPlugins = [];
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  base: "/", // Ensure base URL is set correctly
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL ||
        "https://qnkfvwlxqbxnwfxjqnzs.supabase.co",
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFua2Z2d2x4cWJ4bndmeGpxbnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2MzA0MDAsImV4cCI6MjAzMzIwNjQwMH0.Nh83ebqzv3RKwlmsCNvgRdEhKFUoJCCVjXJA7S-9PJM",
    ),
  },
  plugins: [
    react({
      plugins: [...conditionalPlugins],
    }),
    tempo(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // PostCSS configuration is handled by postcss.config.js
  build: {
    outDir: "dist",
    // Enable minification for production
    minify: true,
    // Disable source maps in production for better performance
    sourcemap: process.env.NODE_ENV !== "production",
    // Ensure assets are properly handled
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: "index.html",
      },
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
        // Ensure chunks are properly handled
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  // Ensure assets are properly handled
  publicDir: "public",
  assetsInclude: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif"],
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
    // Configure CORS for development
    cors: true,
    // Configure proxy for API requests if needed
    proxy: {
      // Example: '/api': 'http://localhost:3000'
    },
  },
});

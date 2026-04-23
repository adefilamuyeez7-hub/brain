import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ generatedRouteTree: "src/routeTree.gen.ts" }),
    tailwindcss(),
    react(),
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500,
    // Configure chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "@tanstack/react-router"],
          queries: ["@tanstack/react-query"],
          supabase: ["@supabase/supabase-js"],
          clerk: ["@clerk/clerk-react"],
        },
      },
    },
  },
});

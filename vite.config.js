import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Customize the dev server port if needed
  },
  build: {
    outDir: "dist", // Customize the build output folder if needed
  },
  resolve: {
    alias: {
      "@": "/src", // Alias '@' to point to the 'src' folder
    },
  },
  base: "/", // Use '/' to ensure correct routing after deployment
  server: {
    fs: {
      allow: ["."], // Allow serving files from root directory
    },
    cors: true, // Enable CORS if required for your APIs
  },
  // Add this to handle fallback for React Router (SPA support)
  preview: {
    port: 5000, // The port on which the preview server will run
  },
  define: {
    global: {}, // Ensures compatibility for some libraries requiring `global`
  },
});

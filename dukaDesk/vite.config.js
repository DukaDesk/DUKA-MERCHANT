import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    sourcemap: false,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: false,
    proxy: {
      "/api": {
        target: "https://duka-backend-production.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
  },
});

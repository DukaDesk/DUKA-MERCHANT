import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/DUKA-MERCHANT/" : "/",
  plugins: [react()],
  build: {
    outDir: "build",
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
  },
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.cjs",
  },
  build: {
    rollupOptions: {
      external: ["tailwindcss", "autoprefixer"],
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
});

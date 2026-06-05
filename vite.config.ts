import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
  build: {
    rollupOptions: {
      input: {
        root: path.resolve(__dirname, "index.html"),
        vendeur: path.resolve(__dirname, "apps/vendeur/index.html"),
        acheteur: path.resolve(__dirname, "apps/acheteur/index.html"),
        notaire: path.resolve(__dirname, "apps/notaire/index.html"),
        geometre: path.resolve(__dirname, "apps/geometre/index.html"),
        admin: path.resolve(__dirname, "apps/admin/index.html"),
      },
    },
  },
});

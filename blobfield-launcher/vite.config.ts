import { defineConfig } from 'vite';
import path from 'path';
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@modules': path.resolve(__dirname, 'src/ui/modules'),
      '@base': path.resolve(__dirname, 'src/ui/base'),
      '@data': path.resolve(__dirname, 'src/data'),
    },
  },
  esbuild: {
    target: "esnext",
  },
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
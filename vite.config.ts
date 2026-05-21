import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "127.0.0.1",
    port: 8080,
    strictPort: true,
    proxy: {
      // Local dev: forward API calls to the backend server
      // NOTE: Use '/api/' (with trailing slash) so that frontend routes like
      // '/api-registration' are NOT proxied to the backend.
      '/api/': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/uploads/': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

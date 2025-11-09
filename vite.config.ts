import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      '/api': {
        target: 'https://60s.mizhoubaobei.top',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v2'),
        secure: false
      }
    }
  }
})
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        // 更清晰的文件命名规则
        assetFileNames: (assetInfo) => {
          // 用 names[0] 代替已废弃的 name
          const base = assetInfo.names[0] ?? 'unknown';
          const ext = base.split('.').pop()?.toLowerCase() ?? '';

          let folder = 'misc';
          if (/png|jpe?g|svg|gif|tiff|bmp|webp/i.test(ext)) folder = 'img';
          else if (/woff|woff2|ttf|eot/i.test(ext)) folder = 'font';
          else if (/css/i.test(ext)) folder = 'css';
          else if (/js/i.test(ext)) folder = 'js';
          return `assets/${folder}/[name].[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name].[hash].js",
        entryFileNames: "assets/js/[name].[hash].js",
        // 减少代码分割的chunk数量，避免过多的小文件
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // 将所有node_modules中的代码打包到vendor chunk中
            return 'vendor';
          }
        },
      },
    },
    // 启用压缩
    minify: 'esbuild',
    // 生成更小的CSS
    cssMinify: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
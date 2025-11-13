import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// 根据 chunk 名称返回对应的文件名
function getChunkFileName(chunkName: string): string {
  const chunkMappings: { [key: string]: string } = {
    'react': 'assets/js/react-vendor.[hash].js',
    'radix': 'assets/js/radix-vendor.[hash].js',
    'icons': 'assets/js/icons-vendor.[hash].js',
    'ui-utils': 'assets/js/ui-utils-vendor.[hash].js',
    'a11y': 'assets/js/a11y-vendor.[hash].js',
    'validation': 'assets/js/validation-vendor.[hash].js',
    'date': 'assets/js/date-vendor.[hash].js',
    'chart': 'assets/js/chart-vendor.[hash].js',
    'carousel': 'assets/js/carousel-vendor.[hash].js',
    'resizable': 'assets/js/resizable-vendor.[hash].js',
    'utils': 'assets/js/utils.[hash].js',
    'api': 'assets/js/api.[hash].js',
  };

  // 检查是否匹配特定的 chunk 名称
  for (const [key, value] of Object.entries(chunkMappings)) {
    if (chunkName.includes(key)) {
      return value;
    }
  }

  // 如果是 vendor chunk
  if (chunkName === 'vendor') {
    return 'assets/js/vendor.[hash].js';
  }

  // 默认返回
  return 'assets/js/[name].[hash].js';
}

// 根据模块 ID 返回对应的 chunk 名称
function getManualChunkName(id: string): string | undefined {
  // 处理 node_modules 中的库
  if (id.includes('node_modules')) {
    // 定义库到 chunk 名称的映射
    const libraryChunks: { [key: string]: string } = {
      'react': 'react-vendor',
      'react-dom': 'react-vendor',
      '@radix-ui': 'radix-vendor',
      'lucide-react': 'icons-vendor',
      'class-variance-authority': 'ui-utils-vendor',
      'clsx': 'ui-utils-vendor',
      'tailwind-merge': 'ui-utils-vendor',
      'tailwindcss-animate': 'ui-utils-vendor',
      'cmdk': 'a11y-vendor',
      'vaul': 'a11y-vendor',
      'zod': 'validation-vendor',
      '@hookform': 'validation-vendor',
      'date-fns': 'date-vendor',
      'recharts': 'chart-vendor',
      'embla-carousel': 'carousel-vendor',
      'react-resizable-panels': 'resizable-vendor'
    };

    // 检查是否匹配特定的库
    for (const [library, chunkName] of Object.entries(libraryChunks)) {
      if (id.includes(library)) {
        return chunkName;
      }
    }

    // 其他第三方库打包到主 vendor chunk
    return 'vendor';
  }

  // 处理项目内部模块
  if (id.includes('src/lib/utils')) {
    return 'utils';
  }
  
  if (id.includes('src/lib/api')) {
    return 'api';
  }

  // 默认不创建新的 chunk
  return undefined;
}

export default defineConfig({
    plugins: [react(), visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    })],
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },
    build: {
        outDir: "dist",
        assetsDir: "assets",
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.names?.[0] || '';
                    if (name.endsWith('.css')) return 'assets/css/[name].[hash][extname]';
                    const ext = name.split('.').pop() || '';
                    if (/png|jpe?g|svg|gif|tiff|bmp|webp/i.test(ext)) return `assets/img/[name].[hash][extname]`;
                    if (/woff|woff2|ttf|eot/i.test(ext)) return `assets/font/[name].[hash][extname]`;
                    return `assets/other/[name].[hash][extname]`;
                },
                chunkFileNames: (chunkInfo) => {
                    return getChunkFileName(chunkInfo.name);
                },
                entryFileNames: "assets/js/[name].[hash].js",
                manualChunks(id) {
                    return getManualChunkName(id);
                },
            },
        },
        minify: 'esbuild',
        cssMinify: true,
        sourcemap: false,  // 禁用 sourcemap 以减小生产环境包大小
        // 启用代码分割
        modulePreload: {
            polyfill: true
        },
        // 避免不必要的代码压缩混淆
        terserOptions: {
            // 在生产构建中保留变量名，提高代码可读性（可选，会增加包大小）
            keep_fnames: true,
        },
        // 设置更小的chunk大小警告阈值，以便更好查看拆分效果
        chunkSizeWarningLimit: 1000
    },
    server: { host: "0.0.0.0", port: 5173 },
});
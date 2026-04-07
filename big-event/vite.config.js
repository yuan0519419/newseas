import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  // 部署路径配置：
  // - 若部署到服务器根目录（如 http://ip/），base设为 '/'
  // - 若部署到子目录（如 http://ip/vue/），base设为 '/vue/'
  base: '/', 
  build: {
    outDir: 'dist' // 打包输出目录（默认就是dist，可省略）
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  server:{
    proxy:{
      //自动检测包含‘/api’的请求
      '/api':{
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path)=> path.replace(/^\/api/,'')
      }
    }
  }
})

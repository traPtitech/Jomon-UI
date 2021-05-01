import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compress from 'vite-plugin-compress'
import path from 'path'
import https from 'https'

const keepAliveAgent = new https.Agent({ keepAlive: true });
const DEV_SERVER_PROXY_HOST = "https://jomon-dev.tokyotech.org"

export default defineConfig({
  plugins: [
    vue(),
    compress() // 現状brotli圧縮したやつしか配信しない
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  server: {
    open: true,
    proxy: {
      '/api/*': {
        target: DEV_SERVER_PROXY_HOST,
        changeOrigin: true,
        agent: keepAliveAgent
      }
    }
  },
})

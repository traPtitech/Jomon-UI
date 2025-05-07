import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import * as https from 'https'
import * as path from 'path'
import brotli from 'rollup-plugin-brotli'
import { defineConfig } from 'vite'

const keepAliveAgent = new https.Agent({ keepAlive: true })
const DEV_SERVER_PROXY_HOST = 'https://jomon-dev.trapti.tech'

export default defineConfig({
  plugins: [vue(), brotli(), tailwindcss()],
  resolve: {
    alias: {
      '/@': path.resolve(__dirname, '/src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api/*': {
        target: DEV_SERVER_PROXY_HOST,
        changeOrigin: true,
        agent: keepAliveAgent
      }
    }
  }
})

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import * as https from 'https'
import * as path from 'path'
import brotli from 'rollup-plugin-brotli'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const keepAliveAgent = new https.Agent({ keepAlive: true })

  return {
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
          target: env.DEV_SERVER_PROXY_HOST,
          changeOrigin: true,
          agent: keepAliveAgent
        }
      }
    },
    optimizeDeps: {
      include: ['axe-core']
    }
  }
})

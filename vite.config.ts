import vue from '@vitejs/plugin-vue'
import * as https from 'https'
import * as path from 'path'
import brotli from 'rollup-plugin-brotli'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

const keepAliveAgent = new https.Agent({ keepAlive: true })

export default defineConfig({
  plugins: [vue(), brotli(), WindiCSS()],
  resolve: {
    alias: {
      '/@': path.resolve(__dirname, '/src')
    }
  }
})

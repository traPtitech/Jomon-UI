import { createPinia } from 'pinia'
import { createApp } from 'vue'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { initMock } from '/@/lib/msw'

import App from './App.vue'
import router from './router'

initMock()

const app = createApp(App)

const options: PluginOptions = {
  position: POSITION.BOTTOM_LEFT,
  maxToasts: 5,
  timeout: 3000,
  closeButton: false,
  pauseOnHover: false,
  hideProgressBar: true
}

app.use(router).use(createPinia()).use(Toast, options).mount('#app')

import { createPinia } from 'pinia'
import 'virtual:windi-devtools'
import 'virtual:windi.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import { worker } from './mocks/browser'
import router from './router'

if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass'
  })
}
const app = createApp(App)

const options: PluginOptions = {
  position: POSITION.BOTTOM_LEFT,
  timeout: 3000,
  closeButton: false,
  pauseOnHover: false,
  hideProgressBar: true
}

app.use(router).use(createPinia()).use(Toast, options).mount('#app')

import App from './App.vue'
import router from './router'
import { handlers } from '@/lib/msw'
import { setupWorker } from 'msw/browser'
import { createPinia } from 'pinia'
import { Fragment, createApp, h } from 'vue'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

if (
  import.meta.env.MODE === 'development' &&
  import.meta.env.VITE_USE_MSW === 'true'
) {
  const worker = setupWorker(...handlers)
  await worker.start({
    onUnhandledRequest: 'bypass'
  })
}

const setup = async () => {
  if (import.meta.env.MODE === 'production') {
    return createApp(App)
  }

  // NOTE: 開発環境では vue-axe を読み込む
  const VueAxe = await import('vue-axe')
  const app = createApp({
    render: () => h(Fragment, [h(App), h(VueAxe.VueAxePopup)])
  })
  app.use(VueAxe.default)

  return app
}

const options: PluginOptions = {
  position: POSITION.BOTTOM_LEFT,
  maxToasts: 5,
  timeout: 3000,
  closeButton: false,
  pauseOnHover: false,
  hideProgressBar: true
}

await setup().then(app =>
  app.use(router).use(createPinia()).use(Toast, options).mount('#app')
)

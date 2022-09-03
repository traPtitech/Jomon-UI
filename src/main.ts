import { createPinia } from 'pinia'
import 'virtual:windi-devtools'
import 'virtual:windi.css'
import { createApp } from 'vue'

import App from './App.vue'
import { worker } from './mocks/browser'
import router from './router'

if (process.env.NODE_ENV === 'development') {
  worker.start()
}
const app = createApp(App)

app.use(router).use(createPinia()).mount('#app')

import 'virtual:windi-devtools'
import 'virtual:windi.css'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router).mount('#app')

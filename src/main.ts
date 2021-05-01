import { createApp } from 'vue'
import './tailwind.css'
import './styles/index.scss'
import App from './App.vue'
import { routes } from './routes'
import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(router).mount('#app')

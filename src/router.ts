import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/requests?pageIndex=1' },
  { path: '/requests', component: () => import('./pages/Requests.vue') },
  {
    path: '/transactions',
    component: () => import('./pages/Transactions.vue')
  },
  { path: '/groups', component: () => import('./pages/Groups.vue') },
  { path: '/:path(.*)', component: () => import('./pages/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

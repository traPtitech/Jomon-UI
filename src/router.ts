import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/requests' },
  { path: '/requests', component: () => import('./pages/Requests.vue') },
  {
    path: '/transactions',
    component: () => import('./pages/Transactions.vue')
  },
  { path: '/groups', component: () => import('./pages/Groups.vue') },
  { path: '/admins', component: () => import('./pages/Admin.vue') },
  { path: '/new', component: () => import('./pages/NewGroup.vue') },
  { path: '/:path(.*)', component: () => import('./pages/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

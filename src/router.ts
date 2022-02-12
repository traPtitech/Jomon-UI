import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/requests' },
  { path: '/requests', component: () => import('./pages/Requests.vue') },
  {
    path: '/requests/:id',
    component: () => import('./pages/RequestDetails.vue')
  },
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

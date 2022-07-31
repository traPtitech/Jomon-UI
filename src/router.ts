import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/requests' },
  { path: '/requests', component: () => import('./pages/RequestsPage.vue') },
  {
    path: '/transactions',
    component: () => import('./pages/TransactionsPage.vue')
  },
  { path: '/groups', component: () => import('./pages/GroupsPage.vue') },
  { path: '/groups/:id', component: () => import('./pages/GroupDetails.vue') },
  { path: '/admins', component: () => import('./pages/AdminPage.vue') },
  { path: '/groups/new', component: () => import('./pages/NewGroup.vue') },
  { path: '/:path(.*)', component: () => import('./pages/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

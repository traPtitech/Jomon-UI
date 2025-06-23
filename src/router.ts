import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/applications' },
  {
    path: '/applications',
    component: () => import('./pages/RequestsPage.vue')
  },
  {
    path: '/applications/new',
    component: () => import('./pages/NewRequestPage.vue')
  },
  {
    path: '/applications/:id',
    component: () => import('./pages/RequestDetailPage.vue')
  },
  {
    path: '/partitions',
    component: () => import('./pages/GroupsPage.vue')
  },
  {
    path: '/partitions/new',
    component: () => import('./pages/NewGroupPage.vue')
  },
  {
    path: '/partitions/:id',
    component: () => import('./pages/GroupDetailPage.vue')
  },
  { path: '/admins', component: () => import('./pages/AdminPage.vue') },
  { path: '/:path(.*)', component: () => import('./pages/NotFoundPage.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

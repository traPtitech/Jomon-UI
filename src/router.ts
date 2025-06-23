import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/applications' },
  {
    path: '/applications',
    component: () => import('./pages/ApplicationsPage.vue')
  },
  {
    path: '/applications/new',
    component: () => import('./pages/NewApplicationPage.vue')
  },
  {
    path: '/applications/:id',
    component: () => import('./pages/ApplicationDetailPage.vue')
  },
  {
    path: '/partitions',
    component: () => import('./pages/PartitionsPage.vue')
  },
  {
    path: '/partitions/new',
    component: () => import('./pages/NewPartitionPage.vue')
  },
  {
    path: '/partitions/:id',
    component: () => import('./pages/PartitionDetailPage.vue')
  },
  {
    path: '/account-managers',
    component: () => import('./pages/AccountManagerPage.vue')
  },
  { path: '/:path(.*)', component: () => import('./pages/NotFoundPage.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

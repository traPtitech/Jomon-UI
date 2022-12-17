import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import apis from '/@/lib/apis'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/requests' },
  {
    path: '/requests',
    component: () => import('./pages/RequestsPage.vue')
  },
  {
    path: '/requests/new',
    component: () => import('./pages/NewRequestPage.vue')
  },
  {
    path: '/requests/:id',
    component: () => import('./pages/RequestDetailPage.vue')
  },
  {
    path: '/transactions',
    component: () => import('./pages/TransactionsPage.vue')
  },
  {
    path: '/transactions/new',
    component: () => import('./pages/NewTransactionPage.vue')
  },
  {
    path: '/transactions/:id',
    component: () => import('./pages/TransactionDetailPage.vue')
  },
  { path: '/groups', component: () => import('./pages/GroupsPage.vue') },
  { path: '/groups/new', component: () => import('./pages/NewGroupPage.vue') },
  {
    path: '/groups/:id',
    component: () => import('./pages/GroupDetailPage.vue')
  },
  { path: '/admins', component: () => import('./pages/AdminPage.vue') },
  { path: '/:path(.*)', component: () => import('./pages/NotFoundPage.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    await apis.getMe()
  } catch {
    document.location = 'https://jomon-dev.trapti.tech/api/auth/genpkce'
  }
  next()
})

export default router

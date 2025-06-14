import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

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

export default router

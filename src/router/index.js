import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/Shop.vue')
    },
    {
      path: '/impact',
      name: 'impact',
      component: () => import('../views/Impact.vue')
    },
    {
      path: '/collection',
      name: 'collection',
      component: () => import('../views/Collection.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/Blog.vue')
    },
    {
      path: '/contact',
      name: 'contant',
      component: () => import('../views/Contact.vue')
    },
  ]
})

export default router

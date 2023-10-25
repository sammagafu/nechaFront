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
      children:[
        {
          path: '',
          name: 'shopIndex',
          component: () => import('../views/shop/Shop.vue')
        },
        {
          path: ':slug',
          name: 'shopDetail',
          component: () => import('../views/shop/Details.vue')
        },
      ]
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
    {
      path: '/account',
      // name: 'account',
      // component: () => import('@/views/accounts/MyAccount.vue.vue'),
      children : [
        {
          path: '',
          name: 'myaccount',
          component: () => import('../views/accounts/MyAccount.vue'),
        },
        {
          path:'login',
          name:'login',
          component:()=>import('../views/accounts/Login.vue')
        },
        {
          path:'register',
          name:'register',
          component:()=>import('../views/accounts/Register.vue'),
        },
        
      ]
    },
  ]
})

export default router

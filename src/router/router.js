import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/profile',
      component: BaseLayout,
      children:[
        {
          path:'',
          component: () => import('@/views/profile/ProfileView.vue'),
        },
        {
          path:'info',
          component: () => import('@/views/profile/children/InfoView.vue'),
        },
        {
          path:'setusername',
          component: () => import('@/views/profile/children/SetUsernameView.vue'),
        }
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  console.log('全局前置守卫')
  next()
})
export default router

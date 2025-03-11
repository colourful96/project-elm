import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'
import ShopDetail from '@/views/shop/children/ShopDetail.vue'
import FoodDetail from '@/views/shop/children/FoodDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home',
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
      children: [
        {
          path: '',
          component: () => import('@/views/profile/ProfileView.vue'),
        },
        {
          path: 'info',
          component: () => import('@/views/profile/children/InfoView.vue'),
        },
        {
          path: 'setusername',
          component: () => import('@/views/profile/children/SetUsernameView.vue'),
        },
        {
          path: 'address',
          component: () => import('@/views/profile/children/AddressView.vue'),
        },
        {
          path: 'forget',
          component: () => import('@/views/profile/children/ForgetView.vue'),
        },
        {
          path: 'addaddress',
          component: () => import('@/views/profile/children/AddAddressView.vue'),
        },
        {
          path: 'addaddressdetail',
          component: () => import('@/views/profile/children/AddAddressDetailView.vue'),
        },
      ],
    },
    {
      path: '/balance',
      component: BaseLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/balance/BalanceView.vue'),
        },
        {
          path: 'detail',
          component: () => import('@/views/balance/children/Detail.vue'),
        },
      ],
    },
    {
      path: '/discount',
      component: BaseLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/discount/DiscountView.vue'),
        },
        {
          path: 'hbDescription',
          component: () => import('@/views/discount/children/HbDescription.vue'),
        },
        {
          path: 'hbHistory',
          component: () => import('@/views/discount/children/HbHistory.vue'),
        },
      ],
    },
    {
      path: '/points',
      component: BaseLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/points/PointsView.vue'),
        },
        {
          path: 'detail',
          component: () => import('@/views/points/children/Detail.vue'),
        },
      ],
    },
    {
      path: '/city/:cityid',
      component: () => import('@/views/CityView.vue'),
    },
    {
      path: '/msite',
      component: () => import('@/views/MsiteView.vue'),
    },
    {
      path: '/food',
      component: () => import('@/views/FoodView.vue'),
    },
    {
      path: '/shop',
      component: BaseLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/shop/ShopView.vue'),
        },
        {
          path:'shopDetail',
          component: ShopDetail,
        },
        {
          path: 'foodDetail',
          component: FoodDetail,
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

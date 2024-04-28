import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ChooseGroup from '../views/ChooseGroup.vue'
import Bulletin from '../views/Bulletin.vue'
import Storage from '../views/Storage.vue'
import Timetable from '../views/Timetable.vue'
import Chat from '../views/Chat.vue'
import UserInfomation from '../views/UserInfomation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/group',
      name: 'choose-group',
      component: ChooseGroup
    },
    {
      path: '/',
      name: 'bulletin',
      component: Bulletin
    },
    {
      path: '/storage',
      name: 'storage',
      component: Storage
    },
    {
      path: '/timetable',
      name: 'timetable',
      component: Timetable
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
    {
      path: '/user-infomation',
      name: 'user-infomation',
      component: UserInfomation
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from './components/AuthPage.vue'
import SeatsPage from './components/SeatsPage.vue'
import MyProfile from './components/MyProfile.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/auth' },
    {
      path: '/auth',
      component: AuthPage,
    },
    {
      path: '/seats',
      component: SeatsPage,
    },
    {
      path: '/MyProfile',
      component: MyProfile,
    },
  ],

})


export default router

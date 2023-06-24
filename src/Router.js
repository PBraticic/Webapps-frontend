import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from './components/AuthPage.vue'
import SeatsPage from './components/SeatsPage.vue' 

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
  ],
})

export default router

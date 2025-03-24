import { createRouter, createWebHistory } from 'vue-router'

// import views ที่เกี่ยวข้อง
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'

// สร้าง router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // หน้าแรก (Home)
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // หน้า Login
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // หน้า Register
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    // หน้า Reset Password
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    // หน้า About
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// ส่งออก router
export default router

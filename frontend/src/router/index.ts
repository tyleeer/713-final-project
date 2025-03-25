import { createRouter, createWebHistory } from 'vue-router';

// import views ที่เกี่ยวข้อง
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import ProfileView from '../views/ProfileView.vue'; // ตัวอย่างหน้าโปรไฟล์ที่ต้องการการยืนยันตัวตน

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
    // หน้า Profile ที่ต้องมีการยืนยันตัวตน
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }, // กำหนดว่าเส้นทางนี้ต้องการการยืนยันตัวตน
    },
    // หน้า About
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

// ใช้ beforeEach ในการตรวจสอบการเข้าสู่ระบบ (Authentication)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // ตรวจสอบว่า token อยู่ใน localStorage หรือไม่

  // ถ้าเส้นทางที่กำหนดใน meta.requiresAuth ต้องการการยืนยันตัวตน
  if (to.meta.requiresAuth && !token) {
    // ถ้าไม่มี token, รีไดเรคไปที่หน้า login
    next({ name: 'login' });
  } else {
    // ถ้ามี token หรือเส้นทางนั้นไม่ต้องการการยืนยันตัวตน
    next();
  }
});

// ส่งออก router
export default router;

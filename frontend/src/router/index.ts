import { createRouter, createWebHistory } from 'vue-router';

// import views ที่เกี่ยวข้อง
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';



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
    {
      path: '/AdvisorReg',
      name: 'AdvisorReg',
      component: () => import('../views/AdvisorRegView.vue'),
    },
    {
      path: '/StudentList',
      name: 'StudentList',
      component: () => import('../views/StudentList.vue'),
    },
    {
      path: '/create-announcement',
      name: 'create-announcement',
      component: () => import('../views/CreateAnnouncementView.vue'),
    },
    {

      path: '/AdvisorList',
      name: 'AdvisorList',
      component: () => import('../views/AdvisorListView.vue'),
    },
    {
      path: '/student-comment',
      name: 'student-comment',
      component: () => import('../views/StudentCommentView.vue'),
    },
    {
      path: '/advisor-comment/:id',
      name: 'advisor-comment',
      component: () => import('../views/AdvisorCommentView.vue'),
      props: true
    },
    {
      path: '/advisor-appointment',
      name: 'advisor-appointment',
      component: () => import('../views/AdvisorAppointmentView.vue'),
    },
    {
      path: '/advisor-studentlist',
      name: 'advisor-studentlist',
      component: () => import('../views/AdvisorStudentList.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    }
  ],
});

// ใช้ beforeEach ในการตรวจสอบการเข้าสู่ระบบ (Authentication)
router.beforeEach((to, _, next) => {
  document.documentElement.setAttribute('data-theme', 'light')
  const token = localStorage.getItem('token'); // ตรวจสอบว่า token อยู่ใน localStorage หรือไม่
  // ถ้าผู้ใช้ต้องการเข้าถึงหน้าโปรไฟล์หรือหน้าอื่น ๆ ที่ต้องการการยืนยันตัวตน
  if ((to.name === 'profile' || to.name === 'home') && !token) {
    // ถ้าไม่มี token, รีไดเรคไปที่หน้า login
    next({ name: 'login' });
  } else {
    // ถ้ามี token หรือเข้าไปยังหน้าอื่น ๆ ที่ไม่ต้องการการยืนยันตัวตน
    next();
  }
});

// ส่งออก router
export default router;

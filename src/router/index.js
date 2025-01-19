import { createRouter, createWebHistory } from 'vue-router'
import flowchartManagement from '../views/flowchartManagement.vue'
import PseudocodeManagement from '../views/PseudocodeManagement.vue'
import QuizManagement from '../views/QuizManagement.vue'
import ScoreManagement from '../views/ScoreManagement.vue'
import training_phrasesManagement from '@/views/training_phrasesManagement.vue'
import AdminLogin from '@/views/Admin.vue'
import adminManagement from '@/views/AdminManagement.vue'

const routes = createRouter({
  history: createWebHistory(),
  routes : [
    {
      path: '/',
      name: '/',
      redirect: '/login',
    },
  {
    path: '/login',
    name: 'login',
    component: AdminLogin,
  },
  {
    path: '/app',
    name: 'App_main',
    meta: { requiresAuth: true },
  },
  {
    path: '/flowchart',
    name: 'flowchart',
    component: flowchartManagement,
    meta: { requiresAuth: true }, // ต้องล็อกอิน
  },
  {
    path: '/Pseudocode',
    name: 'Pseudocode',
    component: PseudocodeManagement,
    meta: { requiresAuth: true }, // ต้องล็อกอิน
  },
  {
    path: '/Quiz',
    name: 'Quiz',
    component: QuizManagement,
    meta: { requiresAuth: true }, // ต้องล็อกอิน
  },
  {
    path: '/Score',
    name: 'Score',
    component: ScoreManagement,
    meta: { requiresAuth: true }, // ต้องล็อกอิน
  },
  {
    path: '/training_phrases',
    name: 'training_phrases',
    component: training_phrasesManagement,
    meta: { requiresAuth: true }, // ต้องล็อกอิน
  },
  {
    path: '/admin',
    name: 'admin',
    component: adminManagement,
    meta: { requiresAuth: true }, // ต้องล็อกอิน
  }
]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('admin-token') !== null;

  if (!to.matched.length) {
    next('/login');
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // เปลี่ยนไปหน้า Login ถ้าไม่ได้ล็อกอิน
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // ถ้าล็อกอินแล้ว ให้เปลี่ยนไปหน้าแรก (เช่น /app)
    next('/app');
  } else {
    // อนุญาตให้เข้าถึงเส้นทางอื่น ๆ
    next();
  }
});

export default router

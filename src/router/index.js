import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import DoctorWorkstation from '../components/DoctorWorkstation.vue';
import EmergencyDoctorStation from '../components/EmergencyDoctorStation.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../components/Login.vue'),  // 指向独立登录组件
        meta: { requiresAuth: false }
    },
    {
        path: '/DoctorWorkstation',
        name: 'DoctorWorkstation',
        component: DoctorWorkstation,
        meta: { requiresAuth: true }
    },
    {
        path: '/EmergencyDoctorStation',
        name: 'EmergencyDoctorStation',
        component: EmergencyDoctorStation,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/');
    } else {
        next();
    }
});

export default router;

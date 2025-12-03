import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Video from '../views/Video.vue'
import SiteManagement from '../views/SiteManagement.vue'
import apiService from '../services/api.js'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录 - 泵房自动化系统'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '注册 - 泵房自动化系统'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: '控制台 - 泵房自动化系统',
      requiresAuth: true
    }
  }
  ,
  {
    path: '/video',
    name: 'Video',
    component: Video,
    meta: {
      title: '视频 - 泵房自动化系统',
      requiresAuth: true
    }
  },
  {
    path: '/sites',
    name: 'SiteManagement',
    component: SiteManagement,
    meta: {
      title: '站点管理 - 泵房自动化系统',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!apiService.isAuthenticated()) {
      // 清除可能存在的无效token
      apiService.clearAuth()
      next('/login')
      return
    }
  }
  
  // 如果已登录用户访问登录页或注册页，重定向到仪表板
  if ((to.path === '/login' || to.path === '/register') && apiService.isAuthenticated()) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router


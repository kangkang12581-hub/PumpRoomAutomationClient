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
  console.log('🚦 ========== 路由守卫开始 ==========')
  console.log(`🚦 路由跳转: ${from.path} -> ${to.path}`)
  console.log(`🚦 来源路由名称: ${from.name || '无'}`)
  console.log(`🚦 目标路由名称: ${to.name || '无'}`)
  console.log(`🚦 目标路由 meta:`, to.meta)
  console.log(`🚦 目标路由 requiresAuth:`, to.meta.requiresAuth)
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
    console.log(`📄 设置页面标题: ${to.meta.title}`)
  }
  
  // 暂时禁用JWT验证，允许所有路由访问
  // 检查认证状态
  const isAuth = apiService.isAuthenticated()
  const hasToken = !!localStorage.getItem('authToken')
  console.log(`🔐 认证状态检查 (仅用于日志): isAuthenticated=${isAuth}, hasToken=${hasToken}`)
  console.log(`🔐 localStorage 内容:`, {
    authToken: localStorage.getItem('authToken') ? '存在' : '不存在',
    username: localStorage.getItem('username'),
    userInfo: localStorage.getItem('userInfo') ? '存在' : '不存在'
  })
  
  // 暂时禁用认证检查，允许所有路由访问
  // if (to.meta.requiresAuth) {
  //   console.log('🔒 该路由需要认证')
  //   if (!isAuth) {
  //     console.log('❌ 未认证，重定向到登录页')
  //     // 清除可能存在的无效token
  //     apiService.clearAuth()
  //     next('/login')
  //     return
  //   }
  //   console.log('✅ 已认证，允许访问')
  // }
  
  // 暂时禁用：如果已登录用户访问登录页或注册页，重定向到仪表板
  // if ((to.path === '/login' || to.path === '/register') && isAuth) {
  //   console.log('✅ 已登录用户访问登录页，重定向到仪表板')
  //   next('/dashboard')
  //   return
  // }
  
  console.log('✅ 路由守卫通过，调用 next()')
  console.log('🚦 ========== 路由守卫结束 ==========')
  next()
})

export default router


<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo-section">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="url(#gradient)" stroke="url(#gradient)" stroke-width="2"/>
            <circle cx="12" cy="18" r="2" fill="url(#gradient)"/>
            <path d="M8 20H16" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
          <h1 class="system-title">泵房自动化系统</h1>
          <!-- 高级站点选择器 -->
          <div class="site-selector-wrapper" v-if="showSiteSwitcher && canSwitchSite">
            <div class="site-selector-container">
              <div class="site-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                    stroke="currentColor" stroke-width="2" fill="url(#site-gradient)"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                  <defs>
                    <linearGradient id="site-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.8" />
                      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="site-selector-inner">
                <label class="site-label">当前站点</label>
                <select 
                  class="site-select" 
                  v-model="currentSiteId" 
                  :disabled="!canSwitchSite" 
                  @change="onSiteChange"
                >
                  <option value="" disabled>请选择站点...</option>
                  <option v-for="s in sites" :key="s.siteCode" :value="s.siteCode">
                    {{ s.name }}
                  </option>
                </select>
                <div class="site-select-arrow">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div class="site-status-indicator" :class="{ 'site-online': currentSiteStatus }">
                <span class="status-pulse"></span>
              </div>
            </div>
          </div>
          <div class="site-count-pill" v-else>
            <span class="site-count-label">站点</span>
            <span class="site-count-badge">
              <svg class="badge-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 22s8-5.33 8-12a8 8 0 1 0-16 0c0 6.67 8 12 8 12Z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="badge-text">{{ sitesCount }}</span>
            </span>
          </div>
        </div>
        
        <div class="header-status">
          <div class="status-indicator">
            <span class="status-dot status-online"></span>
            <span class="status-text">系统在线</span>
          </div>
          <div class="current-time">{{ currentTime }}</div>
        </div>

        <!-- 本地/远程模式指示器 -->
        <div class="mode-status-indicator" :class="{ 'mode-remote': deviceMode.isRemote, 'mode-local': !deviceMode.isRemote, 'mode-unavailable': !deviceMode.available }">
          <div class="mode-icon">
            <svg v-if="deviceMode.isRemote" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="currentColor"/>
              <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="mode-info">
            <span class="mode-label">工作模式</span>
            <span class="mode-text">{{ deviceMode.isRemote ? '远程' : '本地' }}</span>
          </div>
          <div class="mode-pulse" v-if="deviceMode.available"></div>
        </div>

        <div class="user-section">
          <div class="user-info">
            <div class="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="user-details">
              <span class="username">{{ username }}</span>
              <span class="user-role">{{ roleLabel }}</span>
            </div>
          </div>
          <button @click="handleLogout" class="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="dashboard-body">
      <!-- 左侧功能导航栏 -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-section-title">系统监控</h3>
            <ul class="nav-menu">
              <li class="nav-item" :class="{ active: activeModule === 'operation' }" @click="setActiveModule('operation')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  <path d="M19.4 15A9 9 0 0 0 19.4 9M20.85 19.1A13 13 0 0 0 20.85 4.9M4.6 15A9 9 0 0 1 4.6 9M3.15 19.1A13 13 0 0 1 3.15 4.9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>操作</span>
              </li>
              <li class="nav-item" :class="{ active: activeModule === 'motor-control' }" @click="setActiveModule('motor-control')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>电机控制</span>
              </li>
              <li class="nav-item" :class="{ active: activeModule === 'data-display' }" @click="setActiveModule('data-display')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>数据展示</span>
              </li>
              <li class="nav-item" :class="{ active: activeModule === 'trends' }" @click="setActiveModule('trends')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12L9 6L13 10L21 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 21H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>趋势曲线</span>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">数据管理</h3>
            <ul class="nav-menu">
              <li class="nav-item" :class="{ active: activeModule === 'query' }" @click="setActiveModule('query')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>数据查询</span>
              </li>
              <li class="nav-item" :class="{ active: activeModule === 'alarms' }" @click="setActiveModule('alarms')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>报警信息</span>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">视频监控</h3>
            <ul class="nav-menu">
              <li class="nav-item" :class="{ active: activeModule === 'internal-video' }" @click="setActiveModule('internal-video')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>机内视频</span>
              </li>
              <li class="nav-item" :class="{ active: activeModule === 'global-video' }" @click="setActiveModule('global-video')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2" fill="none"/>
                </svg>
                <span>全局视频</span>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">系统配置</h3>
            <ul class="nav-menu">
              <li class="nav-item" :class="{ active: activeModule === 'parameters' }" @click="setActiveModule('parameters')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>参数设定</span>
              </li>
              <li v-if="isAdminOrRoot" class="nav-item" :class="{ active: activeModule === 'alarm-config' }" @click="setActiveModule('alarm-config')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.24 21H20.76A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="2"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>报警配置</span>
              </li>
              <li v-if="isAdminOrRoot" class="nav-item" :class="{ active: activeModule === 'user-management' }" @click="setActiveModule('user-management')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>用户管理</span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- 主要内容区域 -->
      <main class="main-content">
        <div class="content-header">
          <h2 class="page-title">{{ getModuleTitle() }}</h2>
          <div class="breadcrumb">
            <span>泵房自动化系统</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ getModuleTitle() }}</span>
          </div>
        </div>

        <div class="content-body">
          <!-- 动态内容区域 -->
          <component 
            :is="getActiveComponent()" 
            :title="getVideoModuleTitle()"
            :camera-type="getCameraType()"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, siteAssignmentAPI, opcuaAPI } from '@/services/api'
import { setCurrentSite, getCurrentSiteCode } from '@/utils/siteManager'
// 导入各个功能模块组件
import OperationModule from '../components/modules/OperationModule.vue'
import MotorControlModule from '../components/modules/MotorControlModule.vue'
import DataDisplayModule from '../components/modules/DataDisplayModule.vue'
import TrendsModule from '../components/modules/TrendsModule.vue'
import QueryModule from '../components/modules/QueryModule.vue'
import AlarmsModule from '../components/modules/AlarmsModule.vue'
import GlobalVideoModule from '../components/modules/GlobalVideoModule.vue'
import ParametersModule from '../components/modules/ParametersModule.vue'
import AlarmConfigModule from '../components/modules/AlarmConfigModule.vue'
import UserManagementModule from '../components/modules/UserManagementModule.vue'

export default {
  name: 'Dashboard',
  components: {
    OperationModule,
    MotorControlModule,
    DataDisplayModule,
    TrendsModule,
    QueryModule,
    AlarmsModule,
    GlobalVideoModule,
    ParametersModule,
    AlarmConfigModule,
    UserManagementModule
  },
  setup() {
    const router = useRouter()
    const username = ref('')
    const role = ref('observer') // root | admin | operator | observer
    const roleLabel = computed(() => ({ root: '超级管理员', admin: '管理员', operator: '操作员', observer: '观察员' }[role.value] || '用户'))
    // 站点切换数据
    const sites = ref([
      // 默认占位，若 userInfo.sites 存在则会被覆盖
      { siteCode: 'site-a', name: '站点A', id: null },
      { siteCode: 'site-b', name: '站点B', id: null }
    ])
    const currentSiteId = ref('site-a') // 使用siteCode作为标识
    // 角色权限：root/admin 可切换任意站点；operator 可切换但可能受限；observer 不可切换
    const canSwitchSite = computed(() => role.value === 'root' || role.value === 'admin' || role.value === 'operator')
    const isAdminOrRoot = computed(() => role.value === 'root' || role.value === 'admin')
    const showSiteSwitcher = computed(() => true)
    const sitesCount = computed(() => (Array.isArray(sites.value) ? sites.value.length : 0))
    const currentSiteStatus = computed(() => {
      const current = sites.value.find(s => s.id === currentSiteId.value)
      return current ? current.isOnline : false
    })
    const currentTime = ref('')
    const activeModule = ref('operation')
    const deviceMode = ref({
      isRemote: false,
      mode: 'local',
      available: false,
      timestamp: null
    })
    let timeInterval = null
    let modeCheckInterval = null

    // 模块标题映射
    const moduleTitles = {
      operation: '操作',
      'motor-control': '电机控制',
      'data-display': '数据展示',
      trends: '趋势曲线',
      query: '数据查询',
      alarms: '报警信息',
      'internal-video': '机内视频',
      'global-video': '全局视频',
      parameters: '参数设定',
      'alarm-config': '报警配置',
      'user-management': '用户管理'
    }

    // 更新当前时间
    const updateCurrentTime = () => {
      const now = new Date()
      currentTime.value = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    // 设置活跃模块
    const setActiveModule = (module) => {
      // 权限检查：只有 root 和 admin 可以访问报警配置和用户管理
      if ((module === 'user-management' || module === 'alarm-config') && !isAdminOrRoot.value) {
        return
      }
      // 若重复点击相同模块（尤其是参数设定），也触发一次"打开事件"以便子组件刷新
      if (module === 'parameters' && activeModule.value === 'parameters') {
        window.dispatchEvent(new CustomEvent('parameters-opened'))
        return
      }
      activeModule.value = module
      if (module === 'parameters') {
        // 首次切换到参数设定时，同样广播一次
        window.dispatchEvent(new CustomEvent('parameters-opened'))
      }
    }

    // 获取模块标题
    const getModuleTitle = () => {
      return moduleTitles[activeModule.value] || '操作'
    }

    // 获取视频模块标题
    const getVideoModuleTitle = () => {
      if (activeModule.value === 'internal-video') {
        return '机内视频监控'
      } else if (activeModule.value === 'global-video') {
        return '全局视频监控'
      }
      return '全局视频监控' // 默认值
    }

    // 获取摄像头类型
    const getCameraType = () => {
      if (activeModule.value === 'internal-video') {
        return 'internal' // 机内摄像头
      } else if (activeModule.value === 'global-video') {
        return 'global' // 全局摄像头
      }
      return 'global' // 默认值
    }

    // 获取活跃组件
    const getActiveComponent = () => {
      const componentMap = {
        operation: 'OperationModule',
        'motor-control': 'MotorControlModule',
        'data-display': 'DataDisplayModule',
        trends: 'TrendsModule',
        query: 'QueryModule',
        alarms: 'AlarmsModule',
        'internal-video': 'GlobalVideoModule',
        'global-video': 'GlobalVideoModule',
        parameters: 'ParametersModule',
        'alarm-config': 'AlarmConfigModule',
        'user-management': 'UserManagementModule'
      }
      // 权限检查：只有 root 和 admin 可以访问报警配置和用户管理
      if ((activeModule.value === 'user-management' || activeModule.value === 'alarm-config') && !isAdminOrRoot.value) {
        return 'OperationModule'
      }
      return componentMap[activeModule.value] || 'OperationModule'
    }

    // 退出登录
    const handleLogout = () => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      localStorage.removeItem('currentSiteId')
      localStorage.removeItem('rememberMe')
      router.push('/login')
    }

    // 切换站点
    const onSiteChange = () => {
      if (!canSwitchSite.value) return
      const current = sites.value.find(s => s.siteCode === currentSiteId.value) || null
      console.log('切换站点:', currentSiteId.value, current)
      // 使用站点管理器更新当前站点（会自动通知所有监听器）
      setCurrentSite(currentSiteId.value, current)
      // 保持兼容性：也发送全局事件
      window.dispatchEvent(new CustomEvent('site-changed', { detail: { siteId: currentSiteId.value, site: current } }))
    }

    // 更新设备工作模式状态
    const updateModeStatus = async () => {
      try {
        const modeData = await opcuaAPI.getModeStatus()
        deviceMode.value = {
          isRemote: modeData.isRemote || false,
          mode: modeData.mode || 'local',
          available: modeData.available || false,
          timestamp: modeData.timestamp
        }
        console.log('工作模式更新:', deviceMode.value)
      } catch (error) {
        console.error('获取工作模式失败:', error)
        deviceMode.value = {
          isRemote: false,
          mode: 'local',
          available: false,
          timestamp: null
        }
      }
    }

    // 加载用户站点
    const loadUserSites = async () => {
      try {
        const response = await siteAssignmentAPI.getMySites()
        console.log('用户站点数据:', response)
        
        const userSites = response.data?.sites || response.sites || []
        if (userSites.length > 0) {
          sites.value = userSites
            .filter(site => site.isEnabled !== false) // 只显示启用的站点
            .map(site => ({
              id: site.id,  // 数据库ID，用于API查询
              siteCode: site.siteCode || site.site_code,  // 站点编码
              name: site.siteName || site.site_name,
              code: site.siteCode || site.site_code,
              location: site.siteLocation || site.site_location,
              isOnline: site.isOnline || site.is_online
            }))
          console.log('已加载用户站点:', sites.value)
        } else {
          console.warn('用户没有分配任何站点')
          sites.value = []
        }
      } catch (error) {
        console.error('加载用户站点失败:', error)
        // 保留假数据作为后备
      }
    }

    onMounted(async () => {
      username.value = localStorage.getItem('username') || '用户'
      const userInfoRaw = localStorage.getItem('userInfo')
      const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null
      role.value = (userInfo && userInfo.role) || localStorage.getItem('role') || 'observer'

      // 从API加载用户站点
      await loadUserSites()

      // 恢复上次选择的站点
      const savedSite = getCurrentSiteCode()
      if (savedSite && sites.value.find(s => s.siteCode === savedSite)) {
        currentSiteId.value = savedSite
      } else if (sites.value.length > 0) {
        // 自动选择第一个站点
        currentSiteId.value = sites.value[0].siteCode
      }
      
      // 初始化当前站点
      if (currentSiteId.value) {
        const current = sites.value.find(s => s.siteCode === currentSiteId.value) || null
        setCurrentSite(currentSiteId.value, current)
        console.log('初始站点:', currentSiteId.value, current)
      }
      // 优先以后台为准：拉取 /auth/me，覆盖本地缓存
      try {
        const me = await authAPI.getCurrentUser()
        if (me) {
          username.value = me.username || username.value
          // 兼容后端返回字段：优先 user_group 或 UserGroup（两种命名格式）；若无则根据 is_admin / is_active 等推断
          const backendRole = (me.user_group || me.UserGroup || me.userGroup || '').toString().toLowerCase()
          if (['root','admin','operator','observer'].includes(backendRole)) {
            role.value = backendRole
          } else if (me.is_admin === true || me.IsAdmin === true || me.isAdmin === true) {
            role.value = 'admin'
          }
          // 优先通过站点分配接口获取“我的站点”
          try {
            const mySites = await siteAssignmentAPI.getMySites()
            if (mySites && Array.isArray(mySites.sites)) {
              sites.value = mySites.sites.map(s => ({ id: s.id ?? s.code ?? s.site_code ?? s.name, name: s.site_name ?? s.name ?? String(s.id) }))
            }
          } catch {}
          // 仍兼容后端直接返回的 sites 字段
          if ((!sites.value || sites.value.length === 0) && Array.isArray(me.sites) && me.sites.length > 0) {
            sites.value = me.sites.map(s => ({ id: s.id ?? s.code ?? s.name, name: s.name ?? String(s.id ?? s.code) }))
          }
          // 覆盖本地缓存，供后续使用
          const merged = { ...(userInfo || {}), username: username.value, role: role.value, sites: sites.value }
          localStorage.setItem('userInfo', JSON.stringify(merged))
          localStorage.setItem('username', username.value)
          localStorage.setItem('role', role.value)
        }
      } catch {}

      updateCurrentTime()
      timeInterval = setInterval(updateCurrentTime, 1000)

      // 初始化工作模式状态
      updateModeStatus()
      // 每5秒更新一次工作模式状态
      modeCheckInterval = setInterval(updateModeStatus, 5000)
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
      if (modeCheckInterval) {
        clearInterval(modeCheckInterval)
      }
    })

    return {
      username,
      currentTime,
      activeModule,
      setActiveModule,
      getModuleTitle,
      getVideoModuleTitle,
      getCameraType,
      getActiveComponent,
      handleLogout,
      // 站点切换
      sites,
      currentSiteId,
      canSwitchSite,
      showSiteSwitcher,
      onSiteChange,
      roleLabel,
      isAdminOrRoot,
      sitesCount,
      currentSiteStatus,
      // 工作模式状态
      deviceMode
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航栏样式 */
.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.system-title {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 高级站点选择器样式 */
.site-selector-wrapper {
  margin-left: 24px;
}

.site-selector-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.12),
    0 2px 8px rgba(118, 75, 162, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.site-selector-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 100%);
  pointer-events: none;
}

.site-selector-container:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 6px 20px rgba(102, 126, 234, 0.16),
    0 3px 10px rgba(118, 75, 162, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-color: rgba(102, 126, 234, 0.3);
}

.site-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.site-selector-container:hover .site-icon {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.site-selector-inner {
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  min-width: 160px;
}

.site-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #667eea;
  opacity: 0.8;
  line-height: 1;
}

.site-select {
  appearance: none;
  border: none;
  background: transparent;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  padding: 0;
  padding-right: 24px;
  cursor: pointer;
  outline: none;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.site-select:hover {
  color: #667eea;
}

.site-select:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.site-select option {
  background: white;
  color: #1e293b;
  padding: 8px 12px;
}

.site-select-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #667eea;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.site-selector-container:hover .site-select-arrow {
  transform: translateY(-50%) translateY(2px);
}

.site-status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #94a3b8;
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.site-status-indicator.site-online {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.site-status-indicator.site-online .status-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #10b981;
  animation: site-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes site-pulse {
  0%, 100% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2);
  }
}

/* 站点数量展示样式保持不变 */
.site-count-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.site-count-label {
  font-size: 13px;
  color: #475569;
  font-weight: 600;
}

.site-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  font-size: 13px;
  color: #0f172a;
  background: linear-gradient(180deg, #eef2ff 0%, #e0e7ff 100%);
  box-shadow: 0 4px 12px rgba(102,126,234,0.12), inset 0 1px 0 rgba(255,255,255,0.4);
}

.site-count-badge .badge-text { font-weight: 800; min-width: 22px; text-align: center; font-variant-numeric: tabular-nums; }
.site-count-badge .badge-icon { color: #5b6eea; }

/* 工作模式指示器样式 */
.mode-status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.mode-status-indicator.mode-remote {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%);
  border-color: rgba(16, 185, 129, 0.3);
}

.mode-status-indicator.mode-local {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.12) 0%, rgba(249, 115, 22, 0.08) 100%);
  border-color: rgba(251, 146, 60, 0.3);
}

.mode-status-indicator.mode-unavailable {
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(100, 116, 139, 0.08) 100%);
  border-color: rgba(148, 163, 184, 0.3);
  opacity: 0.7;
}

.mode-status-indicator:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.mode-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.mode-remote .mode-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.mode-local .mode-icon {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
}

.mode-unavailable .mode-icon {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(148, 163, 184, 0.3);
}

.mode-status-indicator:hover .mode-icon {
  transform: scale(1.05);
}

.mode-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 70px;
}

.mode-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
  line-height: 1;
}

.mode-remote .mode-label {
  color: #059669;
}

.mode-local .mode-label {
  color: #f97316;
}

.mode-unavailable .mode-label {
  color: #64748b;
}

.mode-text {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.mode-remote .mode-text {
  color: #10b981;
}

.mode-local .mode-text {
  color: #fb923c;
}

.mode-unavailable .mode-text {
  color: #94a3b8;
}

.mode-pulse {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: mode-pulse-animation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.mode-remote .mode-pulse {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.mode-local .mode-pulse {
  background: #fb923c;
  box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.2);
}

@keyframes mode-pulse-animation {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.header-status {
  display: flex;
  align-items: center;
  gap: 24px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(46, 204, 113, 0.1);
  border-radius: 20px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-online {
  background: #2ecc71;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 12px;
  color: #2ecc71;
  font-weight: 500;
}

.current-time {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  font-family: 'Monaco', 'Menlo', monospace;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.user-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.user-role {
  font-size: 12px;
  color: #666;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.logout-btn:hover {
  background: #f8f9fa;
  border-color: #ccc;
}

/* 主体布局 */
.dashboard-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 70px);
}

/* 左侧导航栏样式 */
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  height: 100%;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar-nav {
  padding: 24px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  padding: 0 24px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.05);
  color: #667eea;
}

.nav-item.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-left-color: #667eea;
}

.nav-item svg {
  flex-shrink: 0;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.breadcrumb-separator {
  margin: 0 8px;
  opacity: 0.5;
}

.breadcrumb-current {
  color: #667eea;
  font-weight: 500;
}

.content-body {
  flex: 1;
  padding: 24px;
  overflow: visible;
  background: #f8fafc;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .header-status {
    gap: 16px;
  }
  
  .current-time {
    display: none;
  }

  .mode-status-indicator {
    padding: 8px 14px;
  }
  
  .mode-label {
    font-size: 9px;
  }
  
  .mode-text {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .sidebar {
    position: fixed;
    left: -280px;
    top: 70px;
    height: calc(100vh - 70px);
    z-index: 50;
    transition: left 0.3s ease;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .main-content {
    width: 100%;
  }
  
  .content-header {
    padding: 16px;
  }
  
  .content-body {
    padding: 16px;
  }
  
  .user-details {
    display: none;
  }
  
  .header-status .status-indicator {
    display: none;
  }

  .mode-status-indicator {
    padding: 6px 12px;
  }
  
  .mode-icon {
    width: 28px;
    height: 28px;
  }
  
  .mode-icon svg {
    width: 16px;
    height: 16px;
  }
  
  .mode-info {
    min-width: 60px;
  }
}

@media (max-width: 480px) {
  .logo-section .system-title {
    display: none;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .breadcrumb {
    display: none;
  }
}
</style>

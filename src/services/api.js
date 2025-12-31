/**
 * API服务模块
 * API service module for frontend HTTP requests
 */

// API基础配置
// Use Vite environment variable if provided, otherwise default to relative '/api'
// Using a relative path allows the dev server proxy (vite.config.js) to forward requests to the backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'  // .NET后端服务
const HIKVISION_API_BASE_URL = import.meta.env.VITE_HIKVISION_API_BASE_URL || 'http://192.168.10.96:5500/api'  // HikVision FastAPI服务 (fallback)

/**
 * HTTP请求工具类
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  /**
   * 获取认证头
   */
  getAuthHeaders() {
    const token = localStorage.getItem('authToken')
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    }
  }

  /**
   * 发送HTTP请求
   */
  async request(url, options = {}, retryCount = 0) {
    // 处理查询参数
    let finalUrl = url
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString()
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      delete options.params // 从options中删除params，避免传递给fetch
    }

    // 检查token是否即将过期，如果是则先刷新
    if (this.isTokenExpiringSoon() && this.isAuthenticated() && retryCount === 0) {
      try {
        await this.refreshToken()
      } catch (error) {
        console.warn('自动刷新token失败，继续使用原token:', error)
      }
    }

    const config = {
      headers: this.getAuthHeaders(),
      ...options
    }

    try {
      const response = await fetch(`${this.baseURL}${finalUrl}`, config)
      
      // 检查响应状态
      if (!response.ok) {
        if (response.status === 401) {
          // 如果是401且是第一次尝试，尝试刷新token后重试
          if (retryCount === 0 && this.isAuthenticated()) {
            try {
              await this.refreshToken()
              // 重试请求（最多重试1次）
              return this.request(url, options, retryCount + 1)
            } catch (refreshError) {
              console.error('刷新token失败，跳转到登录页:', refreshError)
              // 刷新失败，清除本地token并跳转到登录页
              this.clearAuth()
              window.location.href = '/login'
              throw new Error('登录已过期，请重新登录')
            }
          } else {
            // 重试后仍然401，清除本地token并跳转到登录页
            this.clearAuth()
            window.location.href = '/login'
            throw new Error('登录已过期，请重新登录')
          }
        }
        
        // 尝试解析错误响应
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: `HTTP ${response.status} ${response.statusText}` }
        }
        
        // 构建详细的错误消息
        let errorMessage = errorData.detail || errorData.message || '请求失败'
        
        // 如果有验证错误，添加详细信息
        if (errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n')
          errorMessage = `${errorMessage}\n${validationErrors}`
        }
        
        console.error('API错误详情:', errorData)
        throw new Error(errorMessage)
      }

      // 解析JSON响应
      const data = await response.json()
      return data
      
    } catch (error) {
      console.error('API请求错误:', error)
      throw error
    }
  }

  /**
   * GET请求
   */
  async get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options })
  }

  /**
   * POST请求
   */
  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT请求
   */
  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE请求
   */
  async delete(url) {
    return this.request(url, { method: 'DELETE' })
  }

  /**
   * 获取认证token
   */
  getToken() {
    return localStorage.getItem('authToken')
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated() {
    return !!this.getToken()
  }

  /**
   * 清除认证信息
   */
  clearAuth() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('tokenExpirationTime')
  }

  /**
   * 保存认证信息
   */
  saveAuth(token, userInfo, expiresIn = null) {
    localStorage.setItem('authToken', token)
    localStorage.setItem('username', userInfo.username)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    // 保存token过期时间（提前5分钟刷新）
    if (expiresIn) {
      const expirationTime = Date.now() + (expiresIn - 300) * 1000 // 提前5分钟刷新
      localStorage.setItem('tokenExpirationTime', expirationTime.toString())
    }
  }
  
  /**
   * 检查token是否即将过期
   */
  isTokenExpiringSoon() {
    const expirationTime = localStorage.getItem('tokenExpirationTime')
    if (!expirationTime) return true // 如果没有过期时间，认为需要刷新
    
    return Date.now() >= parseInt(expirationTime)
  }
  
  /**
   * 刷新token
   */
  async refreshToken() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('没有token可刷新')
      }
      
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('刷新token失败')
      }
      
      const data = await response.json()
      const refreshData = data.data || data
      
      // 更新token和过期时间
      const userInfo = this.getCurrentUser()
      if (userInfo) {
        this.saveAuth(refreshData.accessToken, userInfo, refreshData.expiresIn)
      }
      
      return refreshData
    } catch (error) {
      console.error('刷新token失败:', error)
      throw error
    }
  }

  /**
   * 检查是否已登录
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser() {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  }
}

// 创建API服务实例
const apiService = new ApiService()

/**
 * 认证API
 */
export const authAPI = {
  /**
   * 用户登录
   */
  async login(username, password) {
    const response = await apiService.post('/auth/login', {
      username,
      password
    })
    
    // 后端返回格式: { success: true, message: "...", data: { accessToken, user, ... } }
    const loginData = response.data || response
    
    // 保存认证信息（包括过期时间）
    apiService.saveAuth(loginData.accessToken, loginData.user, loginData.expiresIn)
    
    return loginData
  },

  /**
   * 用户注册
   */
  async register(userData) {
    const response = await apiService.post('/auth/register', userData)
    // 后端返回格式: { success: true, message: "...", data: { ... } }
    return response.data || response
  },

  /**
   * 用户登出
   */
  async logout() {
    try {
      await apiService.post('/auth/logout')
    } catch (error) {
      console.warn('登出请求失败:', error)
    } finally {
      // 无论服务器响应如何，都清除本地认证信息
      apiService.clearAuth()
    }
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    const response = await apiService.get('/auth/me')
    return response.data || response
  },
  
  /**
   * 刷新访问令牌
   */
  async refreshToken() {
    return await apiService.refreshToken()
  },

  /**
   * 更新当前用户信息
   */
  async updateCurrentUser(userData) {
    const response = await apiService.put('/auth/me', userData)
    return response.data || response
  }
}

// Expose convenience method to check authentication via authAPI as well
authAPI.isAuthenticated = () => apiService.isAuthenticated()


/**
 * HikVision C++ 服务API
 */
class HikVisionApiService {
  constructor() {
    this.baseURL = HIKVISION_API_BASE_URL
  }

  async request(url, options = {}) {
    // 处理查询参数
    let finalUrl = url
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString()
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      delete options.params // 从options中删除params，避免传递给fetch
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    }

    try {
      const response = await fetch(`${this.baseURL}${finalUrl}`, config)
      
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: `HTTP ${response.status} ${response.statusText}` }
        }
        throw new Error(errorData.message || '请求失败')
      }

      const data = await response.json()
      return data
      
    } catch (error) {
      console.error('HikVision API请求错误:', error)
      throw error
    }
  }

  async get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options })
  }

  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// 创建HikVision API服务实例
const hikVisionApiService = new HikVisionApiService()

/**
 * 摄像头API - 集成HikVision C++服务
 */
export const cameraAPI = {
  /**
   * 获取所有摄像头状态
   */
  async getCameras() {
    try {
      // 首先尝试从HikVision C++服务获取
      const hikVisionCameras = await hikVisionApiService.get('/cameras')
      return {
        success: true,
        cameras: hikVisionCameras.cameras.map(camera => ({
          id: camera.id.toString(),
          name: camera.name,
          ip: camera.ip,
          port: camera.port,
          channel: camera.channel,
          status: camera.status,
          connected: camera.running,
          streaming: camera.status === 'streaming',
          hlsUrl: camera.hls_url
        }))
      }
    } catch (error) {
      console.warn('HikVision C++服务不可用，使用备用API:', error)
      // 如果C++服务不可用，回退到原始API
      try {
        return await apiService.get('/cameras')
      } catch (fallbackError) {
        console.error('备用API也失败:', fallbackError)
        throw new Error('摄像头服务不可用')
      }
    }
  },

  /**
   * 获取单个摄像头状态
   */
  async getCamera(cameraId) {
    try {
      // 首先尝试从HikVision C++服务获取
      const camera = await hikVisionApiService.get(`/camera/${cameraId}`)
      return {
        success: true,
        id: camera.id.toString(),
        name: camera.name,
        ip: camera.ip,
        port: camera.port,
        channel: camera.channel,
        status: camera.status,
        connected: camera.running,
        streaming: camera.status === 'streaming',
        hlsUrl: camera.hls_url
      }
    } catch (error) {
      console.warn('HikVision C++服务不可用，使用备用API:', error)
      // 如果C++服务不可用，回退到原始API
      try {
        return await apiService.get(`/camera/${cameraId}`)
      } catch (fallbackError) {
        console.error('备用API也失败:', fallbackError)
        throw new Error('摄像头服务不可用')
      }
    }
  },

  /**
   * 启动摄像头
   */
  async startCamera(cameraId) {
    try {
      // 首先尝试使用HikVision C++服务
      const result = await hikVisionApiService.post(`/camera/start/${cameraId}`)
      if (result.success) {
        return {
          success: true,
          message: '摄像头启动成功',
          hlsUrl: `http://192.168.10.96:8081/hls/camera_${cameraId}/index.m3u8`
        }
      } else {
        throw new Error(result.message || '启动失败')
      }
    } catch (error) {
      console.warn('HikVision C++服务不可用，使用备用API:', error)
      // 如果C++服务不可用，回退到原始API
      try {
        return await apiService.post(`/camera/start/${cameraId}`)
      } catch (fallbackError) {
        console.error('备用API也失败:', fallbackError)
        throw new Error('摄像头服务不可用')
      }
    }
  },

  /**
   * 停止摄像头
   */
  async stopCamera(cameraId) {
    try {
      // 首先尝试使用HikVision C++服务
      const result = await hikVisionApiService.post(`/camera/stop/${cameraId}`)
      if (result.success) {
        return {
          success: true,
          message: '摄像头停止成功'
        }
      } else {
        throw new Error(result.message || '停止失败')
      }
    } catch (error) {
      console.warn('HikVision C++服务不可用，使用备用API:', error)
      // 如果C++服务不可用，回退到原始API
      try {
        return await apiService.post(`/camera/stop/${cameraId}`)
      } catch (fallbackError) {
        console.error('备用API也失败:', fallbackError)
        throw new Error('摄像头服务不可用')
      }
    }
  },

  /**
   * 获取HLS流URL
   */
  getHLSStreamUrl(cameraId) {
    // 前端改为统一使用 Python HLS 服务
    return `/hls/cam1/index.m3u8`
  },

  /**
   * 检查HikVision C++服务状态
   */
  async checkHikVisionService() {
    // 不再检测 C++ 服务，恒返回不可用
    return { available: false, error: 'disabled' }
  }
}

/**
 * 用户管理API（管理员）
 */
export const userAPI = {
  /**
   * 获取所有用户
   */
  async getUsers() {
    return apiService.get('/users')
  },

  /**
   * 分页获取用户列表
   */
  async getUsersPaginated(page = 1, size = 20, search = '', user_group = null, status = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (user_group) params.append('userGroup', user_group)
    // 明确不传递status参数，确保返回所有用户（包括非活跃用户）
    // 只有当status明确不为null时才添加status参数
    if (status !== null && status !== undefined) {
      params.append('status', status)
    }
    
    const url = `/users?${params}`
    console.log('[API] 获取用户列表:', { page, size, search, user_group, status, url })
    return apiService.get(url)
  },

  /**
   * 创建用户
   */
  async createUser(userData) {
    return apiService.post('/users', userData)
  },

  /**
   * 更新用户
   */
  async updateUser(userId, userData) {
    return apiService.put(`/users/${userId}`, userData)
  },

  /**
   * 更新用户权限
   */
  async updateUserPermissions(userId, permissionData) {
    return apiService.put(`/users/${userId}/permissions`, permissionData)
  },

  /**
   * 更新用户状态
   */
  async updateUserStatus(userId, status, reason = '') {
    // 后端无 /users/{id}/status，改为直接走通用更新接口
    return apiService.put(`/users/${userId}`, { status })
  },

  /**
   * 变更用户组
   */
  async changeUserGroup(userId, user_group, user_level = null, reason = '') {
    return apiService.put(`/users/${userId}/group`, {
      user_group,
      user_level,
      reason
    })
  },

  /**
   * 根据用户组获取用户
   */
  async getUsersByGroup(user_group) {
    return apiService.get(`/users/by-group/${user_group}`)
  },

  /**
   * 获取活跃用户
   */
  async getActiveUsers() {
    return apiService.get('/users/active')
  },

  /**
   * 重置用户密码
   */
  async resetUserPassword(userId, newPassword) {
    return apiService.post(`/users/${userId}/reset-password`, newPassword)
  },

  /**
   * 检查用户权限
   */
  async checkUserPermission(userId, permissionKey) {
    return apiService.get(`/users/${userId}/permissions/${permissionKey}`)
  },

  /**
   * 删除用户（软删除）
   */
  async deleteUser(userId) {
    return apiService.delete(`/users/${userId}`)
  },

  /**
   * 彻底删除用户（硬删除）
   */
  async hardDeleteUser(userId) {
    // 后端仅提供 DELETE /api/users/{id}，无 /hard 终结点
    return apiService.delete(`/users/${userId}`)
  }
}

/**
 * 系统配置API
 */
export const configAPI = {
  // ========== 系统配置接口 ==========
  
  /**
   * 创建系统配置
   */
  async createSystemConfig(configData) {
    return apiService.post('/system-configs', configData)
  },

  /**
   * 获取系统配置列表
   */
  async getSystemConfigs(page = 1, size = 20, search = '', isActive = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (isActive !== null) params.append('is_active', isActive.toString())
    
    return apiService.get(`/config/system?${params}`)
  },

  /**
   * 获取系统配置详情
   */
  async getSystemConfig(configId) {
    return apiService.get(`/system-configs/${configId}`)
  },

  /**
   * 更新系统配置
   */
  async updateSystemConfig(configId, configData) {
    return apiService.put(`/system-configs/${configId}`, configData)
  },

  /**
   * 删除系统配置
   */
  async deleteSystemConfig(configId) {
    return apiService.delete(`/system-configs/${configId}`)
  },

  /**
   * 获取当前活跃系统配置
   */
  async getActiveSystemConfig() {
    return apiService.get('/system-configs/active')
  },

  // ========== 站点配置接口 ==========
  
  /**
   * 创建站点配置（使用新的站点管理API）
   */
  async createSiteConfig(configData) {
    const response = await apiService.post('/sites', configData)
    return response.data || response
  },

  /**
   * 获取站点配置列表（使用新的站点管理API）
   */
  async getSiteConfigs(page = 1, size = 20, search = '', isActive = null) {
    try {
      const response = await apiService.get('/sites')
      console.log('API原始响应:', response)
      
      // 后端返回格式: { success: true, data: [...], message: "获取成功" }
      let sites = []
      if (response.data) {
        sites = Array.isArray(response.data) ? response.data : []
      }
      
      // 前端进行过滤和分页
      let filtered = sites
      if (search) {
        const searchLower = search.toLowerCase()
        filtered = sites.filter(s => 
          s.siteName?.toLowerCase().includes(searchLower) ||
          s.siteCode?.toLowerCase().includes(searchLower) ||
          s.site_name?.toLowerCase().includes(searchLower) ||
          s.site_code?.toLowerCase().includes(searchLower) ||
          s.siteLocation?.toLowerCase().includes(searchLower) ||
          s.site_location?.toLowerCase().includes(searchLower)
        )
      }
      if (isActive !== null) {
        filtered = filtered.filter(s => 
          s.isEnabled === isActive || s.is_enabled === isActive
        )
      }
      
      const total = filtered.length
      const start = (page - 1) * size
      const paginatedSites = filtered.slice(start, start + size)
      
      return {
        success: true,
        data: {
          sites: paginatedSites,
          total: total,
          page: page,
          size: size,
          totalPages: Math.ceil(total / size)
        }
      }
    } catch (error) {
      console.error('获取站点配置失败:', error)
      throw error
    }
  },

  /**
   * 获取站点配置详情（使用站点Code）
   */
  async getSiteConfig(siteCode) {
    const response = await apiService.get(`/sites/${siteCode}`)
    return response.data || response
  },

  /**
   * 更新站点配置（使用站点Code）
   */
  async updateSiteConfig(siteCode, configData) {
    const response = await apiService.put(`/sites/${siteCode}`, configData)
    return response.data || response
  },

  /**
   * 删除站点配置（使用站点Code）
   */
  async deleteSiteConfig(siteCode) {
    const response = await apiService.delete(`/sites/${siteCode}`)
    return response.data || response
  },

  /**
   * 获取默认站点配置
   */
  async getDefaultSiteConfig() {
    return apiService.get('/config/site/default/current')
  },

  // ========== 配置测试接口 ==========
  
  /**
   * 测试邮件配置
   */
  async testEmailConfig(testEmail, testSubject = '', testContent = '') {
    return apiService.post('/config/test/email', {
      test_email: testEmail,
      test_subject: testSubject,
      test_content: testContent
    })
  },

  /**
   * 测试短信配置
   */
  async testSmsConfig(testPhone, testContent = '') {
    return apiService.post('/config/test/sms', {
      test_phone: testPhone,
      test_content: testContent
    })
  },

  /**
   * 测试电话配置
   */
  async testPhoneConfig(testPhone, testContent = '') {
    return apiService.post('/config/test/phone', {
      test_phone: testPhone,
      test_content: testContent
    })
  }
}

/**
 * 站点分配API
 */
export const siteAssignmentAPI = {
  async getMySites() {
    return apiService.get('/site-assignments/my')
  },
  async getSitesByUser(userId) {
    return apiService.get(`/site-assignments/user/${userId}`)
  },
  async assignSites(userId, siteIds, role = null) {
    // 后端期望 PascalCase 格式
    const requestData = {
      UserId: userId,
      SiteIds: siteIds,
      Role: role
    }
    console.log('分配站点请求数据:', requestData)
    return apiService.post('/site-assignments', requestData)
  },
  async unassignSites(userId, siteIds) {
    // DELETE 带 body：使用 fetch 直接发
    return apiService.request('/site-assignments', {
      method: 'DELETE',
      body: JSON.stringify({ UserId: userId, SiteIds: siteIds })
    })
  }
}

/**
 * 报警配置API
 */
export const alarmConfigAPI = {
  /**
   * 创建报警配置
   */
  async createAlarmConfig(configData) {
    return apiService.post('/alarm-configs', configData)
  },

  /**
   * 获取报警配置列表
   */
  async getAlarmConfigs(page = 1, size = 20, search = '', scope = '', isActive = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) params.append('search', search)
    if (scope) params.append('scope', scope)
    if (isActive !== null) params.append('is_active', isActive.toString())
    
    return apiService.get(`/alarm-configs?${params}`)
  },

  /**
   * 获取单个报警配置
   */
  async getAlarmConfig(configId) {
    return apiService.get(`/alarm-configs/${configId}`)
  },

  /**
   * 更新报警配置
   */
  async updateAlarmConfig(configId, configData) {
    return apiService.put(`/alarm-configs/${configId}`, configData)
  },

  /**
   * 删除报警配置
   */
  async deleteAlarmConfig(configId) {
    return apiService.delete(`/alarm-configs/${configId}`)
  },

  /**
   * 批量操作报警配置
   */
  async batchOperation(configIds, operation) {
    return apiService.post('/alarm-configs/batch', {
      config_ids: configIds,
      operation
    })
  },

  /**
   * 获取默认报警配置
   */
  async getDefaultConfig(scope = 'global') {
    return apiService.get(`/alarm-configs/default/${scope}`)
  },

  /**
   * 根据应用范围获取激活的报警配置
   */
  async getActiveConfigsByScope(scope, scopeTarget = null) {
    const params = new URLSearchParams()
    if (scopeTarget) params.append('scope_target', scopeTarget)
    
    const query = params.toString()
    return apiService.get(`/alarm-configs/scope/${scope}${query ? '?' + query : ''}`)
  }
}

/**
 * 系统API
 */
export const systemAPI = {
  /**
   * 健康检查
   */
  async healthCheck() {
    return apiService.get('/health')
  },

  /**
   * 获取系统信息
   */
  async getSystemInfo() {
    return apiService.get('/')
  }
}

/**
 * 运行参数API
 */
export const parametersAPI = {
  /**
   * 保存运行参数
   */
  async saveParameters(parametersData) {
    return apiService.post('/parameters/save', parametersData)
  },

  /**
   * 获取当前运行参数
   */
  async getCurrentParameters() {
    return apiService.get('/parameters/current')
  }
}

/**
 * OPC UA数据API
 */
export const opcuaAPI = {
  /**
   * 获取所有PLC数据
   */
  async getAllPlcData() {
    const response = await apiService.get('/plcdata')
    // 后端返回 ApiResponse<Dictionary<string, object?>> 格式
    // response 就是 ApiResponse 对象，实际数据在 response.data 中
    return response?.data || response || {}
  },

  /**
   * 批量读取所有参数设定的实时值（直接从PLC读取）
   * 用于参数设定界面的数据刷新
   * @param {string} siteCode - 站点代码，如 'site-a', 'site-b'
   */
  async readAllParameters(siteCode) {
    const params = siteCode ? { siteCode } : {}
    const response = await apiService.get('/opcua/parameters/read-all', { params })
    return response.data || response
  },

  /**
   * 获取环境数据（温度、湿度）
   */
  async getEnvironmentData() {
    try {
      const response = await apiService.get('/plcdata/environment')
      return response.data || response
    } catch (error) {
      console.warn('OPC UA API不可用，使用模拟数据:', error);
      // 返回模拟数据
      return {
        actIntTemp: 24.5,
        actIntRH: 65,
        actExtTemp: 18.2,
        actExtRH: 72
      };
    }
  },

  /**
   * 读取指定节点数据
   */
  async readNode(nodeId) {
    const response = await apiService.get(`/plcdata/read?nodeId=${encodeURIComponent(nodeId)}`)
    return response.data || response
  },

  /**
   * 写入指定节点数据
   */
  async writeNode(nodeId, value, type = 'Boolean') {
    try {
      const payload = {
        NodeId: nodeId,
        Type: type,
        Value: value
      }
      console.log('📤 OPC UA写入请求:', JSON.stringify(payload, null, 2))
      
      const response = await apiService.post('/plcdata/write', payload)
      console.log('✅ OPC UA写入响应:', response)
      return response.data || response
    } catch (error) {
      console.error('❌ OPC UA写入错误:', error, error.response?.data);
      throw error;
    }
  },

  /**
   * 批量写入多个节点
   */
  /**
   * 批量写入节点值
   * @param {Array} writes - 写入请求数组
   * @param {string} siteCode - 站点代码（可选），如 'SITE_001', 'SITE_002'
   */
  async bulkWrite(writes, siteCode) {
    try {
      const payload = {
        writes,
        siteCode // 添加站点代码
      }
      console.log('发送批量写入请求:', { siteCode, writeCount: writes.length })
      
      // 使用 apiService 发送请求，自动处理认证和错误
      const response = await apiService.post('/opcua/bulk-write', payload)
      
      // apiService 已经处理了响应解析和错误处理
      return response.data || response
    } catch (error) {
      console.error('OPC UA批量写入错误:', error)
      throw error
    }
  },

  /**
   * 报警测试写入
   */
  async triggerAlarmTest(siteCode, active, nodeKey = 'IntTempHumidityCommError') {
    if (!siteCode) {
      throw new Error('站点代码不能为空')
    }
    const payload = { siteCode, active, nodeKey }
    console.log('🚨 报警测试请求:', payload)
    const response = await apiService.post('/opcua/alarms/test', payload)
    return response.data || response
  },

  /**
   * 保存参数到数据库
   */
  async saveParametersToDatabase(parameters) {
    try {
      // 使用统一的 apiService，自动通过 Vite 代理转发到后端
      const response = await apiService.post('/operational-parameters/save-from-plc', parameters);
      return response.data || response;
    } catch (error) {
      console.error('保存参数到数据库错误:', error);
      throw error;
    }
  },

  /**
   * 获取当前用户的参数配置
   */
  async getMyParameters() {
    try {
      // 使用统一的 apiService，自动通过 Vite 代理转发到后端
      const response = await apiService.get('/operational-parameters/my');
      return response.data || response;
    } catch (error) {
      console.error('获取参数错误:', error);
      throw error;
    }
  },

  /**
   * 切换运行模式
   * @param {boolean} isAuto - true为自动模式，false为手动模式
   * PLC逻辑：TRUE=自动模式，FALSE=手动模式
   */
  async switchMode(isAuto) {
    const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_autoManual';
    // 直接写入：自动模式传true，手动模式传false
    return this.writeNode(nodeId, isAuto, 'Boolean');
  },

  /**
   * 错误复位控制
   * @param {boolean} isPressed - true为按下，false为释放
   */
  async resetError(isPressed) {
    const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_reset';
    return this.writeNode(nodeId, isPressed, 'Boolean');
  },

  /**
   * 获取当前运行模式
   * PLC逻辑：TRUE=自动模式，FALSE=手动模式
   */
  async getCurrentMode() {
    const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_autoManual';
    try {
      const result = await this.readNode(nodeId);
      // 直接读取：PLC中TRUE=自动，FALSE=手动
      return {
        isAuto: result.value === true,
        isManual: result.value === false,
        mode: result.value === true ? 'auto' : 'manual',
        status: result.status,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.warn('无法读取运行模式，使用默认值:', error);
      return {
        isAuto: true,
        isManual: false,
        mode: 'auto',
        status: 'unknown',
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * 获取设备工作模式状态（本地/远程）
   * Get Device Working Mode Status (Local/Remote)
   */
  async getModeStatus() {
    try {
      const response = await apiService.get('/plcdata/mode-status');
      return response.data || response;
    } catch (error) {
      console.warn('无法读取工作模式，使用默认值:', error);
      return {
        isRemote: false,
        mode: 'local',
        available: false,
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * 站点管理API
 */
export const siteAPI = {
  /**
   * 获取所有站点
   */
  async getAllSites() {
    const response = await apiService.get('/sites')
    return response.data || response
  },

  /**
   * 获取已启用的站点
   */
  async getEnabledSites() {
    const response = await apiService.get('/sites/enabled')
    return response.data || response
  },

  /**
   * 获取指定站点
   */
  async getSite(siteCode) {
    const response = await apiService.get(`/sites/${siteCode}`)
    return response.data || response
  },

  /**
   * 创建站点
   */
  async createSite(siteData) {
    const response = await apiService.post('/sites', siteData)
    return response.data || response
  },

  /**
   * 更新站点
   */
  async updateSite(siteCode, siteData) {
    const response = await apiService.put(`/sites/${siteCode}`, siteData)
    return response.data || response
  },

  /**
   * 删除站点
   */
  async deleteSite(siteCode) {
    const response = await apiService.delete(`/sites/${siteCode}`)
    return response.data || response
  },

  /**
   * 启用/禁用站点
   */
  async toggleSite(siteCode, enabled) {
    const response = await apiService.post(`/sites/${siteCode}/toggle`, enabled, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data || response
  },

  /**
   * 测试站点连接
   */
  async testConnection(siteCode) {
    const response = await apiService.post(`/sites/${siteCode}/test-connection`)
    return response.data || response
  },

  /**
   * 获取所有站点连接状态
   */
  async getAllConnectionStatus() {
    const response = await apiService.get('/sites/connection-status')
    return response.data || response
  },

  /**
   * 重新加载站点配置
   */
  async reloadConfigurations() {
    const response = await apiService.post('/sites/reload')
    return response.data || response
  }
}

/**
 * 多站点OPC UA API
 */
export const multiSiteOpcUaAPI = {
  /**
   * 读取指定站点的节点值
   */
  async readSiteNode(siteCode, nodeId) {
    const response = await apiService.get(`/opcua/sites/${siteCode}/read?nodeId=${encodeURIComponent(nodeId)}`)
    return response.data || response
  },

  /**
   * 写入指定站点的节点值
   */
  async writeSiteNode(siteCode, nodeId, value, type) {
    const response = await apiService.post(`/opcua/sites/${siteCode}/write`, {
      nodeId,
      value,
      type
    })
    return response.data || response
  },

  /**
   * 批量读取指定站点的节点值
   */
  async bulkReadSiteNodes(siteCode, nodeIds) {
    const response = await apiService.post(`/opcua/sites/${siteCode}/bulk-read`, nodeIds)
    return response.data || response
  },

  /**
   * 获取所有站点的实时数据
   */
  async getAllSitesRealtimeData() {
    const response = await apiService.get('/opcua/sites/all/realtime')
    return response.data || response
  },

  /**
   * 获取指定站点的连接状态
   */
  async getSiteStatus(siteCode) {
    const response = await apiService.get(`/opcua/sites/${siteCode}/status`)
    return response.data || response
  }
}

/**
 * 上游液位数据API
 */
export const upstreamWaterLevelAPI = {
  /**
   * 查询上游液位数据（支持聚合）
   * @param {number} siteId - 站点ID
   * @param {string} startTime - 开始时间 (ISO8601)
   * @param {string} endTime - 结束时间 (ISO8601)
   * @param {string} interval - 聚合间隔: minute/hour/day/month
   * @param {number} limit - 最大返回数量
   */
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = {
      siteId,
      startTime,
      endTime,
      interval,
      limit
    }
    const response = await apiService.get('/data/upstream-water-level', { params })
    console.log('上游液位数据查询响应:', response)
    return response.data || response
  },

  /**
   * 获取最新的液位数据
   * @param {number} siteId - 站点ID
   */
  async getLatest(siteId) {
    const params = { siteId }
    const response = await apiService.get('/data/upstream-water-level/latest', { params })
    return response.data || response
  }
}

/**
 * 下游液位数据API
 */
export const downstreamWaterLevelAPI = {
  /**
   * 查询下游液位数据（支持聚合）
   * @param {number} siteId - 站点ID
   * @param {string} startTime - 开始时间 (ISO8601)
   * @param {string} endTime - 结束时间 (ISO8601)
   * @param {string} interval - 聚合间隔: minute/hour/day/month
   * @param {number} limit - 最大返回数量
   */
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = {
      siteId,
      startTime,
      endTime,
      interval,
      limit
    }
    const response = await apiService.get('/data/downstream-water-level', { params })
    console.log('下游液位数据查询响应:', response)
    return response.data || response
  },

  /**
   * 获取最新的液位数据
   * @param {number} siteId - 站点ID
   */
  async getLatest(siteId) {
    const params = { siteId }
    const response = await apiService.get('/data/downstream-water-level/latest', { params })
    return response.data || response
  }
}

/**
 * 瞬时流量数据API
 */
export const instantaneousFlowAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/instantaneous-flow', { params })
    console.log('瞬时流量数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    const response = await apiService.get('/data/instantaneous-flow/latest', { params })
    return response.data || response
  }
}

/**
 * 流速数据API
 */
export const flowVelocityAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/flow-velocity', { params })
    console.log('流速数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    const response = await apiService.get('/data/flow-velocity/latest', { params })
    return response.data || response
  }
}

/**
 * 水温数据API
 */
export const waterTemperatureAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/water-temperature', { params })
    console.log('水温数据查询响应:', response)
    // 后端返回: { success, data: WaterTemperatureQueryResult, message }
    // response 是整个响应，response.data 是 WaterTemperatureQueryResult 对象
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    const response = await apiService.get('/data/water-temperature/latest', { params })
    return response.data || response
  }
}

/**
 * 净重数据API
 */
export const netWeightAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/net-weight', { params })
    console.log('净重数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    return await apiService.get('/data/net-weight/latest', { params })
  }
}

/**
 * 速度数据API
 */
export const speedAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/speed', { params })
    console.log('速度数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    return await apiService.get('/data/speed/latest', { params })
  }
}

/**
 * 电流数据API
 */
export const currentAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/current', { params })
    console.log('电流数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    return await apiService.get('/data/current/latest', { params })
  }
}

/**
 * 柜外温度数据API
 */
export const externalTempAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/external-temp', { params })
    console.log('柜外温度数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    return await apiService.get('/data/external-temp/latest', { params })
  }
}

/**
 * 柜内温度数据API
 */
export const internalTempAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/internal-temp', { params })
    console.log('柜内温度数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    return await apiService.get('/data/internal-temp/latest', { params })
  }
}

/**
 * 柜外湿度数据API
 */
export const externalHumidityAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/external-humidity', { params })
    console.log('柜外湿度数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    return await apiService.get('/data/external-humidity/latest', { params })
  }
}

/**
 * 柜内湿度数据API
 */
export const internalHumidityAPI = {
  async queryData(siteId, startTime, endTime, interval = 'hour', limit = 10000) {
    const params = { siteId, startTime, endTime, interval, limit }
    const response = await apiService.get('/data/internal-humidity', { params })
    console.log('柜内湿度数据查询响应:', response)
    return response.data || response
  },
  async getLatest(siteId) {
    const params = { siteId }
    return await apiService.get('/data/internal-humidity/latest', { params })
  }
}

/**
 * 数据统计API - 获取所有指标的统计信息（最小值、最大值、平均值）
 */
export const dataStatisticsAPI = {
  async getStatistics(metric, siteId, startTime, endTime) {
    const params = { siteId, startTime, endTime }
    const response = await apiService.get(`/datastatistics/${metric}`, { params })
    return response
  }
}

/**
 * 数据快捷查询API - 支持预定义时间范围
 * timeRange: '1h'(最近1小时), '6h'(最近6小时), '24h'(最近24小时), '7d'(最近7天), '30d'(最近30天)
 * 或使用 startDate/endDate 进行自定义日期查询
 */
export const alarmConfigsAPI = {
  /**
   * 获取所有报警配置
   */
  async getAll() {
    const response = await apiService.get('/alarm-configs')
    return response.data || response
  },

  /**
   * 分页查询报警配置
   * @param {Object} params - 查询参数
   * @param {string} params.category - 报警类别
   * @param {string} params.severity - 严重程度
   * @param {boolean} params.isActive - 是否启用
   * @param {string} params.searchKeyword - 搜索关键词
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  async getPaged(params = {}) {
    const response = await apiService.get('/alarm-configs/paged', { params })
    return response.data || response
  },

  /**
   * 根据ID获取报警配置
   */
  async getById(id) {
    const response = await apiService.get(`/alarm-configs/${id}`)
    return response.data || response
  },

  /**
   * 根据报警代码获取
   */
  async getByCode(alarmCode) {
    const response = await apiService.get(`/alarm-configs/code/${alarmCode}`)
    return response.data || response
  },

  /**
   * 根据类别获取
   */
  async getByCategory(category) {
    const response = await apiService.get(`/alarm-configs/category/${category}`)
    return response.data || response
  },

  /**
   * 根据严重程度获取
   */
  async getBySeverity(severity) {
    const response = await apiService.get(`/alarm-configs/severity/${severity}`)
    return response.data || response
  },

  /**
   * 根据站点ID获取报警配置（包含全局配置）
   * @param {number} siteId - 站点ID
   * @param {boolean} includeGlobal - 是否包含全局配置（默认true）
   */
  async getBySiteId(siteId, includeGlobal = true) {
    const params = includeGlobal !== undefined ? { includeGlobal } : {}
    const response = await apiService.get(`/alarm-configs/site/${siteId}`, { params })
    return response.data || response
  },

  /**
   * 创建报警配置
   */
  async create(data) {
    const response = await apiService.post('/alarm-configs', data)
    return response.data || response
  },

  /**
   * 更新报警配置
   */
  async update(id, data) {
    const response = await apiService.put(`/alarm-configs/${id}`, data)
    return response.data || response
  },

  /**
   * 删除报警配置
   */
  async delete(id) {
    const response = await apiService.delete(`/alarm-configs/${id}`)
    return response.data || response
  },

  /**
   * 启用/禁用报警配置
   */
  async toggleActive(id, isActive) {
    const response = await apiService.patch(`/alarm-configs/${id}/toggle`, { isActive })
    return response.data || response
  },

  /**
   * 获取统计信息
   */
  async getStatistics() {
    const response = await apiService.get('/alarm-configs/statistics')
    return response.data || response
  },

  /**
   * 获取所有类别
   */
  async getCategories() {
    const response = await apiService.get('/alarm-configs/categories')
    return response.data || response
  },

  /**
   * 获取所有严重程度级别
   */
  async getSeverities() {
    const response = await apiService.get('/alarm-configs/severities')
    return response.data || response
  }
}

export const alarmRecordsAPI = {
  /**
   * 获取所有报警记录
   */
  async getAll() {
    const response = await apiService.get('/alarm-records')
    return response.data || response
  },

  /**
   * 分页获取报警记录
   */
  async getPaged(params = {}) {
    const response = await apiService.get('/alarm-records/paged', { params })
    return response.data || response
  },

  /**
   * 根据ID获取报警记录
   */
  async getById(id) {
    const response = await apiService.get(`/alarm-records/${id}`)
    return response.data || response
  },

  /**
   * 根据站点ID获取报警记录
   */
  async getBySiteId(siteId) {
    const response = await apiService.get(`/alarm-records/site/${siteId}`)
    return response.data || response
  },

  /**
   * 确认报警
   */
  async acknowledge(id, acknowledgedBy) {
    const response = await apiService.post(`/alarm-records/${id}/acknowledge`, { acknowledgedBy })
    return response.data || response
  },

  /**
   * 清除报警
   */
  async clear(id) {
    const response = await apiService.post(`/alarm-records/${id}/clear`)
    return response.data || response
  },

  /**
   * 清除站点所有活跃报警
   */
  async clearBySiteId(siteId) {
    const response = await apiService.post(`/alarm-records/site/${siteId}/clear`)
    return response.data || response
  },

  /**
   * 获取报警统计
   */
  async getStatistics(siteId = null) {
    const params = siteId ? { siteId } : {}
    const response = await apiService.get('/alarm-records/statistics', { params })
    return response.data || response
  }
}

export const dataQueryAPI = {
  /**
   * 快捷查询 - 使用预定义时间范围
   * @param {string} metric - 指标类型
   * @param {number} siteId - 站点ID
   * @param {string} timeRange - 时间范围: 1h, 6h, 24h, 7d, 30d
   * @param {number} limit - 数据条数限制，默认1000
   */
  async quickQuery(metric, siteId, timeRange, limit = 1000) {
    const params = { siteId, timeRange, limit }
    const response = await apiService.get(`/data-query/${metric}/quick`, { params })
    return response
  },
  
  /**
   * 自定义日期查询
   * @param {string} metric - 指标类型
   * @param {number} siteId - 站点ID
   * @param {string} startDate - 开始日期 (格式: yyyy-MM-dd)
   * @param {string} endDate - 结束日期 (格式: yyyy-MM-dd)
   * @param {number} limit - 数据条数限制，默认1000
   */
  async customDateQuery(metric, siteId, startDate, endDate, limit = 1000) {
    const params = { siteId, startDate, endDate, limit }
    const response = await apiService.get(`/data-query/${metric}/quick`, { params })
    return response
  },
  
  /**
   * 批量获取所有指标的最新数据
   * @param {number} siteId - 站点ID
   */
  async getAllLatestData(siteId) {
    const params = { siteId }
    const response = await apiService.get('/data-query/latest-all', { params })
    return response
  }
}

// 导出API服务实例
export { apiService }
export default apiService

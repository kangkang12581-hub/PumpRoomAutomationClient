<template>
  <div class="alarm-config-module">
    <!-- 报警通知配置 -->
    <div class="config-sections">
      <div class="config-section card fade-in-up" v-if="isRootOrAdmin">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.24 21H20.76A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
          </svg>
          报警配置
        </h3>
        
        <!-- 报警基本配置 -->
        <div class="alarm-basic-config">
          <div class="config-header">
            <h4>基本报警配置</h4>
            <p class="config-description">新增报警配置，将根据当前站点创建</p>
              </div>
          
          <div class="config-grid">
            <!-- 报警代码 -->
            <div class="config-item">
              <div class="config-item-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9H20C21.1 9 22 9.9 22 11V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V11C2 9.9 2.9 9 4 9Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M9 9V6C9 5.46957 9.21071 4.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5V9" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>报警代码 <span style="color: red;">*</span></span>
              </div>
              <div class="config-item-content">
                <input 
                  v-model="alarmConfig.alarmCode" 
                  class="alarm-name-input" 
                  placeholder="例如: ALM_WEIGHT_001"
                  maxlength="50"
                  :disabled="!isRootOrAdmin"
                />
                <small class="input-hint">唯一标识报警的代码</small>
              </div>
            </div>

            <!-- 报警名称 -->
            <div class="config-item">
              <div class="config-item-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9H20C21.1 9 22 9.9 22 11V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V11C2 9.9 2.9 9 4 9Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>报警名称 <span style="color: red;">*</span></span>
              </div>
              <div class="config-item-content">
                <input 
                  v-model="alarmConfig.alarmName" 
                  class="alarm-name-input" 
                  placeholder="请输入报警名称"
                  maxlength="200"
                  :disabled="!isRootOrAdmin"
                />
                <small class="input-hint">报警的显示名称</small>
              </div>
            </div>

            <!-- 报警消息 -->
            <div class="config-item" style="grid-column: 1 / -1;">
              <div class="config-item-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                <span>报警消息 <span style="color: red;">*</span></span>
              </div>
              <div class="config-item-content">
                <textarea 
                  v-model="alarmConfig.alarmMessage" 
                  class="alarm-name-input" 
                  placeholder="请输入报警消息内容"
                  rows="3"
                  :disabled="!isRootOrAdmin"
                ></textarea>
                <small class="input-hint">报警的详细描述信息</small>
              </div>
              </div>

            <!-- 报警类别 -->
            <div class="config-item">
              <div class="config-item-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9Z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2"/>
          </svg>
                <span>报警类别 <span style="color: red;">*</span></span>
            </div>
              <div class="config-item-content">
                <select 
                  v-model="alarmConfig.alarmCategory" 
                  class="alarm-name-input"
                  :disabled="!isRootOrAdmin"
                >
                  <option value="">请选择类别</option>
                  <option v-for="cat in alarmCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <small class="input-hint">报警所属类别</small>
        </div>
            </div>

            <!-- 严重程度 -->
            <div class="config-item">
              <div class="config-item-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.24 21H20.76A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="2"/>
          </svg>
                <span>严重程度</span>
              </div>
              <div class="config-item-content">
                <select 
                  v-model="alarmConfig.severity" 
                  class="alarm-name-input"
                  :disabled="!isRootOrAdmin"
                >
                  <option value="info">信息</option>
                  <option value="warning">警告</option>
                  <option value="error">错误</option>
                  <option value="critical">严重</option>
                </select>
                <small class="input-hint">报警的严重程度</small>
              </div>
      </div>

            <!-- 是否启用 -->
            <div class="config-item">
              <div class="config-item-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 11.08V12C22 17.55 17.55 22 12 22S2 17.55 2 12 6.45 2 12 2C16.24 2 19.91 4.37 21.22 7.78" stroke="currentColor" stroke-width="2"/>
                  <polyline points="22,4 12,14 9,11" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>启用状态</span>
              </div>
              <div class="config-item-content">
                <div class="switch-container">
                  <label class="switch">
                    <input type="checkbox" v-model="alarmConfig.isActive" :disabled="!isRootOrAdmin" />
                    <span class="slider"></span>
                  </label>
                  <span class="switch-label">{{ alarmConfig.isActive ? '已启用' : '已禁用' }}</span>
              </div>
                <small class="input-hint">是否启用该报警配置</small>
              </div>
              </div>
            </div>

        <!-- 保存配置按钮区域 -->
        <div class="config-save-section" v-if="isRootOrAdmin">
          <div class="save-actions">
            <div class="button-group">
              <button @click="saveConfig" class="btn primary large" :disabled="loading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
                  <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ loading ? '保存中...' : '新增报警配置' }}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 已保存的配置列表 -->
    <div class="config-list-section card fade-in-up" style="animation-delay: 0.1s">
      <div class="section-header">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L15 16L22 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 10L7 24L2 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          已保存的报警配置
        </h3>
        <div class="section-actions">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              placeholder="搜索配置..." 
              class="search-input"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="search-icon">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <select v-model="categoryFilter" class="filter-select">
            <option value="">全部类别</option>
            <option v-for="cat in alarmCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="severityFilter" class="filter-select">
            <option value="">全部严重程度</option>
            <option value="critical">严重 (Critical)</option>
            <option value="error">错误 (Error)</option>
            <option value="warning">警告 (Warning)</option>
            <option value="info">信息 (Info)</option>
          </select>
          <select v-model="statusFilter" class="filter-select">
            <option value="">全部状态</option>
            <option value="true">启用</option>
            <option value="false">禁用</option>
          </select>
          
        </div>
      </div>

      <!-- 配置表格 -->
      <div class="configs-table-container">
        <div v-if="configsLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在加载配置...</p>
        </div>
        
        <div v-else-if="configs.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/>
          </svg>
          <h4>暂无配置</h4>
          <p>还没有创建任何报警配置，快来创建第一个吧！</p>
        </div>

        <table v-else class="configs-table">
          <thead>
            <tr>
              <th>序号</th>
              <th>报警代码</th>
              <th>报警名称</th>
              <th>报警内容</th>
              <th>类别</th>
              <th>严重程度</th>
              <th>状态</th>
              <th>创建时间</th>
              <th v-if="isRootOrAdmin">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(config, index) in paginatedConfigs" :key="(config.id || config.Id) + '-' + index" class="config-row">
              <td>{{ config.displayOrder || (index + 1) }}</td>
              <td>
                <span class="alarm-code">{{ config.alarmCode }}</span>
              </td>
              <td>
                <span class="name-text">{{ config.alarmName }}</span>
              </td>
              <td>
                <div class="alarm-message">{{ config.alarmMessage }}</div>
              </td>
              <td>
                <span class="category-badge" :class="getCategoryClass(config.alarmCategory)">
                  {{ config.alarmCategory }}
                </span>
              </td>
              <td>
                <span class="severity-badge" :class="config.severity">
                  {{ getSeverityText(config.severity) }}
                </span>
              </td>
              <td>
                <span class="active-badge" :class="{ active: config.isActive }">
                  {{ config.isActive ? '启用' : '禁用' }}
                </span>
              </td>
              <td>
                <span class="create-time">{{ formatDateTime(config.createdAt) }}</span>
              </td>
              <td v-if="isRootOrAdmin">
                <div class="action-buttons">
                  <button 
                    @click="deleteConfig(config)" 
                    class="action-btn delete" 
                    title="删除报警配置"
                    :disabled="loading"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页器 -->
      <div v-if="configs.length > pageSize" class="pagination">
        <button @click="currentPage = 1" :disabled="currentPage === 1" class="page-btn">首页</button>
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">上一页</button>
        <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">下一页</button>
        <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="page-btn">末页</button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { alarmConfigAPI, alarmConfigsAPI, siteAPI } from '@/services/api'
import { getCurrentSite } from '@/utils/siteManager'

export default {
  name: 'AlarmConfigModule',
  setup() {
    // 基于登录用户角色，限制模块可见性（根组件已隐藏入口，这里二次防护）
    const userInfoRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('userInfo') : null
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null
    const role = (userInfo && (userInfo.user_group || userInfo.role) || '').toString().toUpperCase()
    const isRootOrAdmin = role === 'ROOT' || role === 'ADMIN'
    const loading = ref(false)
    const configsLoading = ref(false)
    
    // 报警配置相关
    const alarmCategories = ref([])
    const categoryFilter = ref('')
    const severityFilter = ref('')
    
    // 基本报警配置（新增报警配置表单）
    const alarmConfig = ref({
      alarmCode: '',
      alarmName: '',
      alarmMessage: '',
      alarmCategory: '',
      severity: 'warning',
      triggerBit: 0,
      isActive: true
    })

    // 配置列表相关
    const configs = ref([])
    const searchQuery = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 计算属性 - 前端过滤
    const filteredConfigs = computed(() => {
      let filtered = configs.value
      
      // 类别过滤
      if (categoryFilter.value) {
        filtered = filtered.filter(config => config.alarmCategory === categoryFilter.value)
      }
      
      // 严重程度过滤
      if (severityFilter.value) {
        filtered = filtered.filter(config => config.severity === severityFilter.value)
      }
      
      // 状态过滤
      if (statusFilter.value !== '') {
        const isActive = statusFilter.value === 'true'
        filtered = filtered.filter(config => config.isActive === isActive)
      }
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(config => 
          config.alarmName.toLowerCase().includes(query) ||
          config.alarmMessage.toLowerCase().includes(query) ||
          config.alarmCode.toLowerCase().includes(query)
        )
      }
      
      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredConfigs.value.length / pageSize.value)
    })

    const paginatedConfigs = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredConfigs.value.slice(start, end)
    })

    // 监听过滤条件变化，重置页码
    watch([searchQuery, categoryFilter, severityFilter, statusFilter], () => {
      currentPage.value = 1
    })
    
    // 监听站点变化，重新加载配置
    if (typeof window !== 'undefined') {
      window.addEventListener('site-changed', () => {
        loadConfigs()
      })
    }



    const saveConfig = async () => {
      // 验证必填字段
      if (!alarmConfig.value.alarmCode || !alarmConfig.value.alarmCode.trim()) {
        alert('请输入报警代码')
        return
      }
      if (!alarmConfig.value.alarmName || !alarmConfig.value.alarmName.trim()) {
        alert('请输入报警名称')
        return
      }
      if (!alarmConfig.value.alarmMessage || !alarmConfig.value.alarmMessage.trim()) {
        alert('请输入报警消息')
        return
      }
      if (!alarmConfig.value.alarmCategory || !alarmConfig.value.alarmCategory.trim()) {
        alert('请选择报警类别')
        return
      }

      // 获取当前站点
      const currentSite = getCurrentSite()
      if (!currentSite || !currentSite.id) {
        alert('无法获取当前站点信息，请先选择站点')
        return
      }

      loading.value = true
      try {
        // 构建API请求数据（根据CreateAlarmConfigRequest）
        const configData = {
          siteId: currentSite.id, // 当前站点ID
          alarmCode: alarmConfig.value.alarmCode.trim(),
          alarmName: alarmConfig.value.alarmName.trim(),
          alarmMessage: alarmConfig.value.alarmMessage.trim(),
          alarmCategory: alarmConfig.value.alarmCategory,
          severity: alarmConfig.value.severity || 'warning',
          triggerBit: alarmConfig.value.triggerBit || 0,
          isActive: alarmConfig.value.isActive !== false,
          autoClear: false,
          requireConfirmation: true,
          displayOrder: 0
        }
        
        // 调用创建API
        const response = await alarmConfigsAPI.create(configData)
        
        // 刷新配置列表
        await loadConfigs()
        
        // 重置表单
      alarmConfig.value = {
          alarmCode: '',
          alarmName: '',
          alarmMessage: '',
          alarmCategory: '',
          severity: 'warning',
          triggerBit: 0,
          isActive: true
        }
        
        alert(`报警配置新增成功！\n报警代码: ${configData.alarmCode}\n报警名称: ${configData.alarmName}`)
      } catch (error) {
        console.error('新增报警配置失败:', error)
        const errorMsg = error.message || error.detail || '请重试！'
        alert(`新增失败：${errorMsg}`)
      } finally {
        loading.value = false
      }
    }

    // 删除报警配置
    const deleteConfig = async (config) => {
      const configId = config.id || config.Id
      if (!configId) {
        alert('无法获取报警配置ID')
        return
      }
      
      // 确认删除
      const confirmMessage = `确定要删除报警配置吗？\n\n报警代码: ${config.alarmCode}\n报警名称: ${config.alarmName}\n\n此操作不可恢复！`
      if (!confirm(confirmMessage)) {
        return
      }

      loading.value = true
      try {
        await alarmConfigsAPI.delete(configId)
        
        // 刷新配置列表
        await loadConfigs()
        
        alert(`报警配置删除成功！\n报警代码: ${config.alarmCode}`)
      } catch (error) {
        console.error('删除报警配置失败:', error)
        const errorMsg = error.message || error.detail || '请重试！'
        alert(`删除失败：${errorMsg}`)
      } finally {
        loading.value = false
      }
    }

    // 去除"测试报警配置/重置配置"逻辑

    // 加载配置列表（当前站点的报警配置）
    const loadConfigs = async () => {
      configsLoading.value = true
      try {
        // 获取当前站点
        const currentSite = getCurrentSite()
        if (!currentSite || !currentSite.id) {
          console.warn('未选择站点，无法加载报警配置')
          configs.value = []
          return
        }

        // 获取当前站点的报警配置（包含全局配置）
        const siteId = currentSite.id
        const includeGlobal = true
        const response = await alarmConfigsAPI.getBySiteId(siteId, includeGlobal)
        
        // 处理API响应格式：ApiResponse格式 { data: [...], success: true }
        // apiService.getBySiteId已经返回了response.data || response
        let alarmConfigs = []
        if (Array.isArray(response)) {
          alarmConfigs = response
        } else if (response && response.data && Array.isArray(response.data)) {
          alarmConfigs = response.data
        } else if (response && response.Data && Array.isArray(response.Data)) {
          alarmConfigs = response.Data
        }
        
        // 设置为配置列表（不在这里过滤，由computed属性处理）
        configs.value = alarmConfigs
        
        // 加载类别列表
        alarmCategories.value = await alarmConfigsAPI.getCategories()
        
        console.log('✅ 加载当前站点报警配置成功:', configs.value.length, '项，站点ID:', siteId)
      } catch (error) {
        console.error('❌ 加载配置列表失败:', error)
        configs.value = []
      } finally {
        configsLoading.value = false
      }
    }

    // 工具方法 - 获取类别样式
    const getCategoryClass = (category) => {
      const classMap = {
        '重量类': 'weight',
        '电机类': 'motor',
        '流体类': 'fluid',
        '通讯类': 'comm',
        '控制类': 'control'
      }
      return classMap[category] || 'default'
    }

    // 工具方法 - 获取严重程度文本
    const getSeverityText = (severity) => {
      const textMap = {
        'critical': '严重',
        'error': '错误',
        'warning': '警告',
        'info': '信息'
      }
      return textMap[severity] || severity
    }

    const formatDateTime = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const refreshConfigs = () => {
      loadConfigs()
    }

    // 暴露查询方法到window对象，方便在开发者控制台中测试
    if (typeof window !== 'undefined') {
      window.loadConfigs = loadConfigs
      window.alarmConfigsAPI = alarmConfigsAPI
    }



    // 组件挂载时加载配置
    onMounted(() => {
      loadConfigs()  // 加载当前站点的报警配置
      
      // 在开发环境中显示API测试提示
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 开发模式：可在控制台使用以下命令测试API:')
        console.log('  window.loadConfigs() - 重新加载当前站点报警配置')
        console.log('  window.alarmConfigsAPI - 访问报警配置API')
      }
    })

    return {
      isRootOrAdmin,
      loading,
      configsLoading,
      alarmConfig,
      configs,
      searchQuery,
      statusFilter,
      currentPage,
      pageSize,
      filteredConfigs,
      totalPages,
      paginatedConfigs,
      saveConfig,
      deleteConfig,
      loadConfigs,
      refreshConfigs,
      formatDateTime,
      // 报警配置相关
      alarmCategories,
      categoryFilter,
      severityFilter,
      getCategoryClass,
      getSeverityText
    }
  }
}
</script>

<style scoped>
.alarm-config-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  overflow: visible;
}

.config-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  overflow-x: visible;
  max-height: calc(100vh - 200px);
  padding-right: 8px;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f1f5f9;
}

.config-sections::-webkit-scrollbar {
  width: 8px;
}

.config-sections::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.config-sections::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.config-sections::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.config-section {
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
  color: #333;
}

/* 报警基本配置样式 */
.alarm-basic-config {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #e8ecf5;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.05);
}

/* 配置保存区域样式 */
.config-save-section {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 2px solid #e8ecf5;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
  border-radius: 12px;
  padding: 24px;
  margin-left: -28px;
  margin-right: -28px;
  margin-bottom: -28px;
}

.config-save-section .save-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.edit-mode-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: 8px;
  color: #92400e;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.1);
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.config-header {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e8ecf5;
  position: relative;
}

.config-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.config-header h4 {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.02em;
}

.config-header h4::before {
  content: '';
  width: 5px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.config-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  padding-left: 15px;
  position: relative;
}

.config-description::before {
  content: '💡';
  position: absolute;
  left: 0;
  font-size: 12px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.config-item {
  background: white;
  border: 2px solid #e8ecf5;
  border-radius: 14px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.config-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.config-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.config-item:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-4px);
}

.config-item:hover::before {
  transform: translateX(0);
}

.config-item:hover::after {
  opacity: 1;
}

.config-item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  font-weight: 600;
  color: #1a202c;
  font-size: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.config-item-header svg {
  color: #667eea;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
}

.config-item-header span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.config-item-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.alarm-name-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafbfc;
  color: #1a202c;
  font-family: inherit;
}

.alarm-name-input:hover {
  border-color: #cbd5e0;
  background: white;
}

.alarm-name-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 2px 8px rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.alarm-name-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.alarm-name-input:disabled {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
  opacity: 0.7;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 60px;
}

.input-hint {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin-top: 6px;
  padding-left: 4px;
  font-weight: 400;
}



/* 开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 54px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: all 0.4s ease;
  border-radius: 28px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  transition: all 0.4s ease;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background: linear-gradient(45deg, #667eea, #764ba2);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
}

input:checked + .slider:before {
  transform: translateX(26px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.slider:hover {
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.2);
}





.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn.large {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
}

.btn.primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e2e8f0;
}

.btn.warning {
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: white;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn.primary:hover:not(:disabled) {
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.btn.warning:hover:not(:disabled) {
  box-shadow: 0 6px 25px rgba(243, 156, 18, 0.4);
}

/* 动画效果 */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



/* 配置列表样式 */
.config-list-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 8px 12px 8px 36px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #999;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.configs-table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state svg {
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #999;
}

.configs-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.configs-table th {
  background: #f8fafc;
  padding: 16px 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.configs-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  vertical-align: top;
}

.config-row:hover {
  background: #f8fafc;
}

.config-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.name-text {
  font-weight: 500;
  color: #333;
}

.default-badge {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.config-description {
  display: block;
  color: #666;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 2px;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 12px;
  background: #f5f5f5;
  color: #999;
}

.status-indicator.active {
  background: #d4edda;
  color: #155724;
}

.scope-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.scope-badge.global {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.scope-badge.site {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.scope-badge.pump {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.scope-target {
  display: block;
  color: #666;
  font-size: 11px;
  margin-top: 2px;
}

.active-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #f8d7da;
  color: #721c24;
}

.active-badge.active {
  background: #d4edda;
  color: #155724;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 24px;
  background: #e9ecef;
  color: #495057;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.create-time {
  display: block;
  color: #333;
  font-size: 13px;
}

.creator {
  display: block;
  color: #666;
  font-size: 11px;
  margin-top: 2px;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 6px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.action-btn.enable:hover {
  background: #27ae60;
  color: white;
  border-color: #27ae60;
}

.action-btn.disable:hover {
  background: #f39c12;
  color: white;
  border-color: #f39c12;
}

.action-btn.delete:hover {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

/* 分页器样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.page-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
  margin: 0 16px;
}

/* 报警类型部分样式 */
.alarm-types-section {
  margin-top: 24px;
  padding: 24px;
}

.stats-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.stat-item {
  font-size: 14px;
  color: #666;
}

.stat-item strong {
  color: #333;
  font-size: 16px;
  margin-left: 4px;
}

.alarm-types-table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.alarm-types-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.alarm-types-table th {
  background: #f8fafc;
  padding: 12px 10px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.alarm-types-table td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  vertical-align: middle;
}

.alarm-type-row:hover {
  background: #f8fafc;
}

.alarm-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

.alarm-name-text {
  font-weight: 500;
  color: #333;
}

.alarm-message {
  max-width: 300px;
  line-height: 1.4;
  color: #555;
}

.category-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  white-space: nowrap;
}

.category-badge.weight {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.category-badge.motor {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.category-badge.fluid {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.category-badge.comm {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.category-badge.control {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.severity-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  white-space: nowrap;
}

.severity-badge.critical {
  background: #fce4ec;
  color: #c62828;
}

.severity-badge.error {
  background: #fff3e0;
  color: #ef6c00;
}

.severity-badge.warning {
  background: #fff9c4;
  color: #f57f17;
}

.severity-badge.info {
  background: #e3f2fd;
  color: #1565c0;
}

.trigger-var {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #666;
  max-width: 200px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trigger-bit {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #333;
  font-weight: 600;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #f8d7da;
  color: #721c24;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.site-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
  display: inline-block;
  white-space: nowrap;
}

.site-badge.global {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

/* 类别统计卡片 */
.category-stats {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.category-stats h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: white;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.weight {
  border-color: #9c27b0;
  background: rgba(156, 39, 176, 0.05);
}

.stat-card.motor {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.05);
}

.stat-card.fluid {
  border-color: #2196f3;
  background: rgba(33, 150, 243, 0.05);
}

.stat-card.comm {
  border-color: #ff9800;
  background: rgba(255, 152, 0, 0.05);
}

.stat-card.control {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card.weight .stat-icon { color: #9c27b0; }
.stat-card.motor .stat-icon { color: #f44336; }
.stat-card.fluid .stat-icon { color: #2196f3; }
.stat-card.comm .stat-icon { color: #ff9800; }
.stat-card.control .stat-icon { color: #4caf50; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-actions {
    flex-direction: column;
  }
  
  .search-input {
    min-width: auto;
    width: 100%;
  }
  
  .configs-table th,
  .configs-table td {
    padding: 8px 6px;
    font-size: 12px;
  }
  
  /* 隐藏部分列 */
  .configs-table th:nth-child(8), /* 优先级 */
  .configs-table td:nth-child(8),
  .configs-table th:nth-child(10), /* 创建时间 */
  .configs-table td:nth-child(10) {
    display: none;
  }
  
  /* 报警类型表格响应式 */
  .alarm-types-table th:nth-child(7), /* OPC UA变量 */
  .alarm-types-table td:nth-child(7),
  .alarm-types-table th:nth-child(8), /* 触发位 */
  .alarm-types-table td:nth-child(8) {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .config-sections {
    max-height: calc(100vh - 150px);
  }
  
  .config-save-section .save-actions {
    flex-direction: column;
  }
  
  .button-group {
    flex-direction: column;
    width: 100%;
  }
  
  .button-group .btn {
    width: 100%;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .config-section {
    padding: 16px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 18px;
  }
  
  .config-header h4 {
    font-size: 14px;
  }
  
  .config-item {
    padding: 16px;
  }
  
  .btn.large {
    padding: 14px 24px;
    font-size: 14px;
  }
  
  /* 在小屏幕上隐藏更多列 */
  .configs-table th:nth-child(5), /* 全局拍照 */
  .configs-table td:nth-child(5),
  .configs-table th:nth-child(6), /* 机内拍照 */
  .configs-table td:nth-child(6) {
    display: none;
  }
  
  /* 报警类型表格在小屏幕上隐藏更多列 */
  .alarm-types-table th:nth-child(4), /* 报警内容 */
  .alarm-types-table td:nth-child(4),
  .alarm-types-table th:nth-child(6), /* 严重程度 */
  .alarm-types-table td:nth-child(6) {
    display: none;
  }
}
</style>


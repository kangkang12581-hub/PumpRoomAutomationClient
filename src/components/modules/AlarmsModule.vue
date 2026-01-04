<template>
  <div class="alarms-module">
    <!-- 报警列表 -->
    <div class="alarm-list card fade-in-up">
      <h3 class="panel-title">
        报警列表 
        <span class="alarm-count">(共 {{ totalRecords }} 条)</span>
        <span v-if="loading" class="loading-text">加载中...</span>
        <div class="list-actions">
          <!-- 自动刷新开关 -->
          <label class="auto-refresh-toggle">
            <input 
              type="checkbox" 
              v-model="autoRefreshEnabled"
              @change="toggleAutoRefresh"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-label">
              自动刷新
              <span class="auto-refresh-interval" v-if="autoRefreshEnabled">({{ autoRefreshInterval / 1000 }}s)</span>
            </span>
          </label>
          
          <button @click="refreshAlarms" 
                  :disabled="loading" 
                  class="refresh-btn"
                  :class="{ 'refreshing': loading }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="refresh-icon">
              <path d="M23 4V10H17" stroke="currentColor" stroke-width="2"/>
              <path d="M20.49 15C19.2969 17.5 16.8692 19.3333 14 19.9297" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ loading ? '刷新中...' : '手动刷新' }}
          </button>
        </div>
      </h3>
      
      <div class="alarm-table-container">
        <table class="alarm-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>站点名称</th>
              <th>报警内容</th>
              <th>当前值</th>
              <th>确认状态</th>
              <th>确认者</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedAlarms.length === 0 && !loading" class="empty-row">
              <td colspan="7" class="empty-message">
                暂无报警数据
              </td>
            </tr>
            <tr v-for="alarm in paginatedAlarms" :key="alarm.id" 
                class="alarm-row" 
                :class="[getSeverityClass(alarm.severity), alarm.status.toLowerCase()]">
              <td class="alarm-time">{{ formatTime(alarm.alarmStartTime) }}</td>
              <td class="alarm-site">
                <div class="site-info">
                  <span class="site-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10C21 17 12 23 12 23S3 17 3 10A9 9 0 0 1 21 10Z" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </span>
                  {{ alarm.siteName || '未知站点' }}
                </div>
              </td>
              <td class="alarm-content-cell">
                <div class="alarm-severity">
                  <span class="severity-icon" :class="getSeverityClass(alarm.severity)">
                    <svg v-if="alarm.severity === 'Critical'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <svg v-else-if="alarm.severity === 'High'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.24 21H20.76A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </span>
                </div>
                <div class="alarm-details">
                  <div class="alarm-title">{{ alarm.alarmName }}</div>
                  <div class="alarm-description">{{ alarm.alarmDescription || '无描述' }}</div>
                </div>
              </td>
              <td class="alarm-value">
                <span v-if="alarm.currentValue" class="value-display">
                  {{ alarm.currentValue }} {{ alarm.unit || '' }}
                </span>
                <span v-else class="no-value">--</span>
              </td>
              <td class="confirm-status">
                <span class="status-badge" :class="alarm.status.toLowerCase()">
                  {{ getStatusText(alarm.status) }}
                </span>
              </td>
              <td class="confirmer">
                <span v-if="alarm.acknowledgedBy" class="confirmer-name">{{ alarm.acknowledgedBy }}</span>
                <span v-else class="no-confirmer">--</span>
              </td>
              <td class="alarm-actions">
                <button v-if="alarm.status === 'Active'" 
                        @click="confirmAlarm(alarm)" 
                        class="action-btn confirm-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  确认
                </button>
                <button @click="viewAlarmDetail(alarm)" class="action-btn detail-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    <path d="M19.4 15A9 9 0 0 0 19.4 9M20.85 19.1A13 13 0 0 0 20.85 4.9M4.6 15A9 9 0 0 1 4.6 9M3.15 19.1A13 13 0 0 1 3.15 4.9" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页控件 -->
      <div class="pagination-container" v-if="totalRecords > 0">
        <div class="pagination-info">
          <span>每页显示：</span>
          <select v-model="pageSize" @change="handlePageSizeChange" class="page-size-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="pagination-text">
            <template v-if="totalRecords > 0">
              显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalRecords) }} 条，共 {{ totalRecords }} 条
            </template>
            <template v-else>
              暂无数据
            </template>
          </span>
        </div>
        <div class="pagination-controls">
          <button 
            @click="goToPage(1)" 
            class="pagination-btn"
            :disabled="currentPage === 1 || loading"
            title="首页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 18L5 12L11 6M19 18L13 12L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            @click="goToPage(currentPage - 1)" 
            class="pagination-btn"
            :disabled="currentPage === 1 || loading"
            title="上一页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <div class="page-numbers">
            <template v-for="pageNum in getPageNumbers()" :key="pageNum">
              <button
                v-if="pageNum !== '...'"
                @click="goToPage(pageNum)"
                class="pagination-btn page-number"
                :class="{ active: pageNum === currentPage }"
                :disabled="loading"
              >
                {{ pageNum }}
              </button>
              <span v-else class="page-ellipsis">...</span>
            </template>
          </div>
          
          <button 
            @click="goToPage(currentPage + 1)" 
            class="pagination-btn"
            :disabled="currentPage >= totalPages || loading"
            title="下一页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            @click="goToPage(totalPages)" 
            class="pagination-btn"
            :disabled="currentPage >= totalPages || loading"
            title="末页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 18L19 12L13 6M5 18L11 12L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { alarmRecordsAPI, siteAPI } from '@/services/api'
import { getCurrentSite, getCurrentSiteCode, onSiteChange } from '@/utils/siteManager'

export default {
  name: 'AlarmsModule',
  setup() {
    const currentPage = ref(1)
    const pageSize = ref(20)
    const selectedAlarms = ref([])
    const loading = ref(false)
    const sites = ref([])
    
    // 自动刷新相关
    const autoRefreshEnabled = ref(true) // 默认开启自动刷新
    const autoRefreshInterval = ref(2000) // 2秒刷新一次
    let autoRefreshTimer = null
    
    // 防止循环调用的标志
    let isUpdatingSiteFilter = false
    
    const filters = ref({  
      site: 'all',
      level: 'all',
      status: 'Active', // 默认只显示未确认的报警（Active状态）
      timeRange: '24h'
    })

    const alarmStats = ref({
      byCategory: {},
      total: 0
    })

    const allAlarms = ref([])
    const totalRecords = ref(0)

    const filteredAlarms = computed(() => {
      return allAlarms.value // 后端已处理过滤，这里直接返回
    })

    const totalPages = computed(() => {
      const pages = totalRecords.value > 0 ? Math.ceil(totalRecords.value / pageSize.value) : 0
      return pages
    })

    const paginatedAlarms = computed(() => {
      return filteredAlarms.value // 后端已处理分页
    })

    // 分页相关方法
    const goToPage = (page) => {
      const total = totalPages.value || 0
      if (page < 1 || page > total || page === currentPage.value || loading.value) {
        return
      }
      currentPage.value = page
      loadAlarms()
    }

    const handlePageSizeChange = () => {
      if (loading.value) return
      currentPage.value = 1 // 改变每页数量时重置到第一页
      loadAlarms()
    }

    const getPageNumbers = () => {
      const current = currentPage.value
      const total = totalPages.value || 0
      const pages = []
      
      // 如果没有数据，返回空数组
      if (total === 0) {
        return pages
      }
      
      // 如果总页数少于等于7，显示所有页码
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // 总页数大于7，显示部分页码
        if (current <= 3) {
          // 当前页在前3页
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 2) {
          // 当前页在后3页
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          // 当前页在中间
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    }

    const allSelected = computed(() => {
      return paginatedAlarms.value.length > 0 && 
             paginatedAlarms.value.every(alarm => selectedAlarms.value.includes(alarm.id))
    })

    const formatTime = (timestamp) => {
      if (!timestamp) return '--'
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusText = (status) => {
      const statusMap = {
        'Active': '活跃',
        'Acknowledged': '已确认',
        'Cleared': '已清除',
        'Resolved': '已解决'
      }
      return statusMap[status] || status
    }

    const getSeverityClass = (severity) => {
      const severityMap = {
        'Critical': 'critical',
        'High': 'warning',
        'Medium': 'warning',
        'Low': 'info'
      }
      return severityMap[severity] || 'info'
    }

    const applyFilters = async () => {
      currentPage.value = 1
      selectedAlarms.value = []
      await loadAlarms()
    }

    const toggleSelectAll = () => {
      if (allSelected.value) {
        selectedAlarms.value = selectedAlarms.value.filter(id => 
          !paginatedAlarms.value.some(alarm => alarm.id === id)
        )
      } else {
        const pageIds = paginatedAlarms.value.map(alarm => alarm.id)
        selectedAlarms.value = [...new Set([...selectedAlarms.value, ...pageIds])]
      }
    }

    const acknowledgeSelected = async () => {
      if (selectedAlarms.value.length === 0) return
      
      const userInfoRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('userInfo') : null
      const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null
      const username = userInfo?.username || 'System'

      try {
        loading.value = true
        for (const id of selectedAlarms.value) {
          await alarmRecordsAPI.acknowledge(id, username)
        }
        selectedAlarms.value = []
        await loadAlarms()
        await loadStatistics()
      } catch (error) {
        console.error('确认报警失败:', error)
        alert('确认报警失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const clearSelected = async () => {
      if (selectedAlarms.value.length === 0) return
      
      if (!confirm('确定要清除选中的报警吗？')) return

      try {
        loading.value = true
        for (const id of selectedAlarms.value) {
          await alarmRecordsAPI.clear(id)
        }
        selectedAlarms.value = []
        await loadAlarms()
        await loadStatistics()
      } catch (error) {
        console.error('清除报警失败:', error)
        alert('清除报警失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const confirmAlarm = async (alarm) => {
      try {
        loading.value = true
        // 1) 清除报警（将状态改为已清除）
        await alarmRecordsAPI.clear(alarm.id)

        // 2) 复位OPC UA触发位（写 false）
        try {
          const site = sites.value.find(s => String(s.id) === String(alarm.siteId))
          const siteCode = site?.siteCode || site?.site_code
          const nodeId = alarm.nodeId
          if (siteCode && nodeId) {
            const { multiSiteOpcUaAPI } = await import('@/services/api')
            await multiSiteOpcUaAPI.writeSiteNode(siteCode, nodeId, false, 'Boolean')
          }
        } catch (e) {
          console.warn('复位触发位失败（忽略继续）:', e)
        }
        await loadAlarms()
        await loadStatistics()
      } catch (error) {
        console.error('确认报警失败:', error)
        alert('确认报警失败，请重试')
      } finally {
        loading.value = false
      }
    }

    const viewAlarmDetail = (alarm) => {
      const detail = `报警详情:\n名称: ${alarm.alarmName}\n描述: ${alarm.alarmDescription || '无'}\n站点: ${alarm.siteName || '未知'}\n节点: ${alarm.nodeName}\n严重程度: ${alarm.severity}\n状态: ${getStatusText(alarm.status)}\n时间: ${formatTime(alarm.alarmStartTime)}\n当前值: ${alarm.currentValue || '--'} ${alarm.unit || ''}`
      alert(detail)
    }

    const loadSites = async () => {
      try {
        const response = await siteAPI.getAll()
        const siteList = Array.isArray(response) ? response : (response.data || response.Data || [])
        sites.value = siteList
      } catch (error) {
        console.error('加载站点列表失败:', error)
      }
    }

    const loadAlarms = async (skipLoading = false) => {
      try {
        if (!skipLoading) {
          loading.value = true
        }
        
        // 每次加载时都获取当前站点，并确保过滤器使用当前站点
        const currentSite = getCurrentSite()
        const currentSiteId = currentSite && currentSite.id ? currentSite.id.toString() : null
        
        // 如果当前站点存在且与过滤器不一致，更新过滤器
        if (currentSiteId && filters.value.site !== currentSiteId && !isUpdatingSiteFilter) {
          console.log('🏢 [AlarmsModule] 检测到站点变化，更新过滤器为当前站点:', currentSiteId)
          isUpdatingSiteFilter = true
          filters.value.site = currentSiteId
          // 注意：这里更新 filters.value.site 会触发 watch，watch 会调用 loadAlarms
          // 但我们在 watch 中会检查 isUpdatingSiteFilter，避免无限循环
          isUpdatingSiteFilter = false
          return // 让 watch 来处理重新加载
        }
        
        // 计算时间范围
        const now = new Date()
        let startTime = null
        switch (filters.value.timeRange) {
          case '1h':
            startTime = new Date(now.getTime() - 60 * 60 * 1000)
            break
          case '24h':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            break
          case '7d':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '30d':
            startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
        }

        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
          siteId: filters.value.site !== 'all' ? parseInt(filters.value.site) : null,
          status: filters.value.status !== 'all' ? filters.value.status : null,
          severity: filters.value.level !== 'all' ? filters.value.level : null,
          startTime: startTime ? startTime.toISOString() : null
        }

        console.log('🔍 [AlarmsModule] 加载报警记录，参数:', params)
        
        const response = await alarmRecordsAPI.getPaged(params)
        
        console.log('📥 [AlarmsModule] 后端返回的原始响应:', response)
        
        // 解析后端返回的数据结构: ApiResponse<PagedAlarmRecordsResponse>
        // 后端返回格式: { success: true, data: { items: [...], total: ..., page: ..., pageSize: ..., totalPages: ... }, message: "..." }
        const api = response.data || response
        const payload = api.data || api
        
        console.log('📦 [AlarmsModule] 解析后的数据:', { api, payload })
        
        // 兼容大小写：后端返回 Items（大写），前端可能期望 items（小写）
        const list = payload.items || payload.Items || payload.data?.items || payload.data?.Items || []
        allAlarms.value = list
        
        // 兼容大小写：后端返回 Total（大写），前端可能期望 total（小写）
        totalRecords.value = payload.total || payload.Total || 0
        
        console.log(`✅ [AlarmsModule] 加载完成: 共 ${totalRecords.value} 条记录，当前页 ${list.length} 条`)
        
        // 如果后端返回了总页数，确保当前页码不超过总页数
        const totalPagesFromApi = payload.totalPages || payload.TotalPages || 0
        if (totalPagesFromApi > 0 && currentPage.value > totalPagesFromApi) {
          currentPage.value = totalPagesFromApi
          // 如果页码被调整，需要重新加载
          await loadAlarms(skipLoading)
          return
        }
      } catch (error) {
        console.error('加载报警记录失败:', error)
        allAlarms.value = []
        totalRecords.value = 0
      } finally {
        if (!skipLoading) {
          loading.value = false
        }
      }
    }

    const loadStatistics = async () => {
      try {
        const siteId = filters.value.site !== 'all' ? parseInt(filters.value.site) : null
        const response = await alarmRecordsAPI.getStatistics(siteId)
        const stats = response.data || response
        
        if (stats.byCategory) {
          alarmStats.value = {
            byCategory: stats.byCategory || {},
            total: stats.total || 0
          }
        }
      } catch (error) {
        console.error('加载报警统计失败:', error)
      }
    }

    const refreshAlarms = async () => {
      try {
        loading.value = true
        await loadAlarms(true) // 跳过 loadAlarms 内部的 loading 设置
        // 不再加载统计信息
        console.log('✅ 报警列表刷新成功')
      } catch (error) {
        console.error('刷新报警列表失败:', error)
        alert('刷新失败，请重试')
      } finally {
        loading.value = false
      }
    }

    // 启动自动刷新
    const startAutoRefresh = () => {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer)
      }
      
      if (autoRefreshEnabled.value) {
        console.log(`🔄 启动自动刷新，间隔 ${autoRefreshInterval.value / 1000} 秒`)
        autoRefreshTimer = setInterval(async () => {
          console.log('🔄 自动刷新报警列表...')
          await loadAlarms(true) // 静默刷新，不显示 loading
        }, autoRefreshInterval.value)
      }
    }

    // 停止自动刷新
    const stopAutoRefresh = () => {
      if (autoRefreshTimer) {
        console.log('⏸️ 停止自动刷新')
        clearInterval(autoRefreshTimer)
        autoRefreshTimer = null
      }
    }

    // 切换自动刷新
    const toggleAutoRefresh = () => {
      if (autoRefreshEnabled.value) {
        startAutoRefresh()
      } else {
        stopAutoRefresh()
      }
    }

    // 获取类别样式类
    const getCategoryClass = (category) => {
      const categoryMap = {
        '重量类': 'weight',
        '电机类': 'motor',
        '流体类': 'fluid',
        '控制类': 'control',
        '通信类': 'comm',
        '通讯类': 'comm'
      }
      return categoryMap[category] || 'default'
    }

    watch([currentPage, filters], () => {
      // 如果正在更新站点过滤器，跳过这次加载（避免循环调用）
      if (isUpdatingSiteFilter) {
        return
      }
      loadAlarms(false) // 正常加载，显示 loading
    }, { deep: true })
    
    // 监听pageSize变化，但通过handlePageSizeChange处理（避免重复触发）

    // 监听站点切换事件
    const handleSiteChange = (siteCode, site) => {
      console.log('🔄 [AlarmsModule] 站点已切换:', { siteCode, site })
      
      if (site && site.id) {
        // 更新站点过滤器，watch 会自动触发 loadAlarms
        filters.value.site = site.id.toString()
        // 重置到第一页
        currentPage.value = 1
        console.log('🏢 [AlarmsModule] 站点切换后更新过滤器:', filters.value.site)
      } else {
        // 如果没有站点信息，显示所有站点的报警
        filters.value.site = 'all'
        console.log('🏢 [AlarmsModule] 站点切换后没有站点信息，显示所有站点')
      }
    }

    // 存储取消监听的函数
    let unsubscribeSiteChange = null

    onMounted(async () => {
      await loadSites()
      
      // 初始化时设置当前站点
      const currentSite = getCurrentSite()
      if (currentSite && currentSite.id) {
        filters.value.site = currentSite.id.toString()
        console.log('🏢 [AlarmsModule] 初始化时设置站点过滤器:', filters.value.site)
      } else {
        // 如果没有当前站点，显示所有站点的报警
        filters.value.site = 'all'
        console.log('🏢 [AlarmsModule] 没有当前站点，显示所有站点的报警')
      }
      
      await loadAlarms()
      
      // 启动自动刷新
      if (autoRefreshEnabled.value) {
        startAutoRefresh()
      }
      
      // 使用站点管理器的 onSiteChange 监听站点切换
      unsubscribeSiteChange = onSiteChange(handleSiteChange)
      console.log('👂 [AlarmsModule] 已注册站点切换监听器')
    })

    onUnmounted(() => {
      // 停止自动刷新
      stopAutoRefresh()
      
      // 取消站点切换监听
      if (unsubscribeSiteChange) {
        unsubscribeSiteChange()
        console.log('🔇 [AlarmsModule] 已取消站点切换监听器')
      }
    })

    return {
      currentPage,
      pageSize,
      totalRecords,
      selectedAlarms,
      filters,
      alarmStats,
      filteredAlarms,
      totalPages,
      paginatedAlarms,
      allSelected,
      loading,
      sites,
      formatTime,
      getStatusText,
      getSeverityClass,
      getCategoryClass,
      applyFilters,
      toggleSelectAll,
      acknowledgeSelected,
      clearSelected,
      confirmAlarm,
      viewAlarmDetail,
      refreshAlarms,
      // 分页相关
      goToPage,
      handlePageSizeChange,
      getPageNumbers,
      // 自动刷新
      autoRefreshEnabled,
      autoRefreshInterval,
      toggleAutoRefresh
    }
  }
}
</script>

<style scoped>
.alarms-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: visible;
  height: auto;
}

.alarm-stats {
  padding: 24px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.alarm-count {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.list-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 自动刷新开关样式 */
.auto-refresh-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.auto-refresh-toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: #ccc;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.auto-refresh-toggle input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auto-refresh-toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.auto-refresh-toggle:hover .toggle-slider {
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.toggle-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.auto-refresh-interval {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #666;
}

.refresh-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #667eea;
  color: #667eea;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn.refreshing {
  border-color: #667eea;
  color: #667eea;
}

.refresh-icon {
  transition: transform 0.3s ease;
}

.refresh-btn.refreshing .refresh-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid;
}

.stat-card.weight {
  background: rgba(156, 39, 176, 0.05);
  border-left-color: #9c27b0;
}

.stat-card.motor {
  background: rgba(244, 67, 54, 0.05);
  border-left-color: #f44336;
}

.stat-card.fluid {
  background: rgba(33, 150, 243, 0.05);
  border-left-color: #2196f3;
}

.stat-card.control {
  background: rgba(76, 175, 80, 0.05);
  border-left-color: #4caf50;
}

.stat-card.comm {
  background: rgba(255, 152, 0, 0.05);
  border-left-color: #ff9800;
}

.stat-card.default {
  background: rgba(158, 158, 158, 0.05);
  border-left-color: #9e9e9e;
}

.stat-card.total {
  background: rgba(102, 126, 234, 0.05);
  border-left-color: #667eea;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-card.weight .stat-icon {
  color: #9c27b0;
}

.stat-card.motor .stat-icon {
  color: #f44336;
}

.stat-card.fluid .stat-icon {
  color: #2196f3;
}

.stat-card.control .stat-icon {
  color: #4caf50;
}

.stat-card.comm .stat-icon {
  color: #ff9800;
}

.stat-card.default .stat-icon {
  color: #9e9e9e;
}

.stat-card.total .stat-icon {
  color: #667eea;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.alarm-controls {
  padding: 24px;
}

.controls-content {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
}

.filter-section {
  display: flex;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.input-field {
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.action-section {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.primary {
  background: #27ae60;
  color: white;
}

.btn.secondary {
  background: #95a5a6;
  color: white;
}

.btn.info {
  background: #3498db;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.alarm-list {
  padding: 24px;
  overflow: visible;
  height: auto;
}

.alarm-table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 350px);
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  position: relative;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f1f5f9;
}

.alarm-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.alarm-table-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.alarm-table-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.alarm-table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.alarm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.alarm-table th,
.alarm-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.alarm-table th {
  background: #f8fafc;
  color: #333;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

.alarm-row {
  transition: all 0.3s ease;
}

.alarm-row:hover {
  background: #f8fafc;
}

.alarm-row.critical {
  border-left: 4px solid #e74c3c;
}

.alarm-row.warning {
  border-left: 4px solid #f39c12;
}

.alarm-row.info {
  border-left: 4px solid #3498db;
}

.alarm-row.active {
  /* 活跃报警：红色竖线，优先于按严重程度的颜色 */
  border-left-color: #e74c3c;
}

.alarm-row.acknowledged,
.alarm-row.cleared,
.alarm-row.resolved {
  /* 已确认/已清除/已解决：绿色竖线 */
  border-left-color: #2ecc71;
}

.alarm-row.confirmed {
  opacity: 0.7;
}

.alarm-time {
  color: #666;
  font-size: 13px;
  white-space: nowrap;
}

.alarm-site {
  min-width: 120px;
}

.site-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.site-icon {
  color: #667eea;
  flex-shrink: 0;
}

.alarm-content-cell {
  min-width: 250px;
}

.alarm-severity {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.severity-icon {
  margin-right: 8px;
}

.severity-icon.critical {
  color: #e74c3c;
}

.severity-icon.warning {
  color: #f39c12;
}

.severity-icon.info {
  color: #3498db;
}

.alarm-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.alarm-description {
  color: #666;
  font-size: 12px;
  line-height: 1.4;
}

.alarm-value {
  text-align: center;
  min-width: 100px;
}

.value-display {
  font-weight: 500;
  color: #333;
}

.no-value {
  color: #999;
}

.confirm-status {
  text-align: center;
  min-width: 80px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.confirmed {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.status-badge.unconfirmed {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.confirmer {
  text-align: center;
  min-width: 100px;
}

.confirmer-name {
  color: #333;
  font-weight: 500;
}

.no-confirmer {
  color: #999;
}

.alarm-actions {
  text-align: center;
  min-width: 120px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  margin: 2px;
  font-size: 11px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.confirm-btn:hover {
  background: #27ae60;
  color: white;
  border-color: #27ae60;
  transform: translateY(-1px);
}

.detail-btn:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
  transform: translateY(-1px);
}

.loading-text {
  font-size: 14px;
  color: #007bff;
  font-weight: 400;
  margin-left: 12px;
}

.empty-row {
  background: #fafafa;
}

.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

/* 分页控件样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.page-size-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.page-size-select:hover {
  border-color: #667eea;
}

.page-size-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.pagination-text {
  margin-left: 8px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.pagination-btn.page-number {
  font-weight: 500;
}

.pagination-btn.page-number.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
  font-weight: 600;
}

.pagination-btn.page-number.active:hover {
  background: linear-gradient(45deg, #5568d3, #653a91);
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-ellipsis {
  padding: 0 8px;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .controls-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section {
    flex-wrap: wrap;
  }
  
  .alarm-table-container {
    font-size: 12px;
    max-height: calc(100vh - 280px);
  }
  
  .alarm-table th,
  .alarm-table td {
    padding: 8px 4px;
  }
  
  .alarm-content-cell {
    min-width: 200px;
  }
  
  .alarm-actions {
    min-width: 100px;
  }
  
  .action-btn {
    padding: 4px 6px;
    font-size: 10px;
  }
  
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination-info {
    justify-content: center;
    width: 100%;
  }
  
  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>


<template>
  <div class="query-module">
    <!-- 查询条件面板 -->
    <div class="query-panel card fade-in-up">
      <h3 class="panel-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
        </svg>
        数据查询条件
      </h3>
      <div class="query-form">
        <div class="form-row">
          <div class="form-group">
            <label>数据类型</label>
            <select v-model="queryParams.dataType" class="input-field">
              <option value="all">全部数据</option>
              <option value="upstream_level">上游液位</option>
              <option value="downstream_level">下游液位</option>
              <option value="instant_flow">瞬时流量</option>
              <option value="flow_velocity">流速</option>
              <option value="water_temperature">水温</option>
              <option value="net_weight">净重</option>
              <option value="speed">速度</option>
              <option value="current">电流</option>
              <option value="winding_temperature">绕组温度</option>
              <option value="cabinet_out_temperature">柜外温度</option>
              <option value="cabinet_in_temperature">柜内温度</option>
              <option value="cabinet_out_humidity">柜外湿度</option>
            </select>
          </div>
          <div class="form-group">
            <label>时间范围</label>
            <select v-model="queryParams.timeRange" class="input-field">
              <option value="1h">最近1小时</option>
              <option value="6h">最近6小时</option>
              <option value="24h">最近24小时</option>
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="custom_days">自定义时间（按天）</option>
            </select>
          </div>
        </div>
        <div v-if="queryParams.timeRange === 'custom_days'" class="form-row">
          <div class="form-group">
            <label>开始日期</label>
            <input v-model="queryParams.startDate" type="date" class="input-field">
          </div>
          <div class="form-group">
            <label>结束日期</label>
            <input v-model="queryParams.endDate" type="date" class="input-field">
          </div>
        </div>
        <div class="form-actions">
          <button @click="executeQuery" class="btn primary" :disabled="loading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            查询数据
          </button>
        </div>
      </div>
    </div>

    <!-- 查询结果 -->
    <div v-if="queryResults.length" class="results-panel card fade-in-up">
      <h3 class="panel-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z" stroke="currentColor" stroke-width="2"/>
          <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/>
          <line x1="8" y1="16" x2="16" y2="16" stroke="currentColor" stroke-width="2"/>
          <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="2"/>
        </svg>
        查询结果 ({{ queryResults.length }} 条记录)
      </h3>
      <div class="results-content">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>数据类型</th>
                <th>数值</th>
                <th>单位</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in paginatedResults" :key="record.id">
                <td>{{ formatDateTime(record.timestamp) }}</td>
                <td>{{ getDataTypeName(record.type) }}</td>
                <td>{{ record.value }}</td>
                <td>{{ record.unit }}</td>
                <td>
                  <span class="status-badge" :class="record.status">
                    {{ getStatusName(record.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            上一页
          </button>
          <span class="pagination-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && queryExecuted" class="empty-state card fade-in-up">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#ccc" stroke-width="2"/>
        <path d="M21 21L16.65 16.65" stroke="#ccc" stroke-width="2"/>
      </svg>
      <h3>暂无数据</h3>
      <p>请调整查询条件后重试</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'QueryModule',
  setup() {
    const loading = ref(false)
    const queryExecuted = ref(false)
    const currentPage = ref(1)
    const pageSize = 20

    const queryParams = ref({
      dataType: 'all',
      timeRange: '24h',
      startDate: '',
      endDate: ''
    })

    const queryResults = ref([])

    // 模拟数据
    const generateMockData = () => {
      const dataTypes = [
        { type: 'upstream_level', unit: 'm', min: 1.0, max: 10.0 },
        { type: 'downstream_level', unit: 'm', min: 0.5, max: 8.0 },
        { type: 'instant_flow', unit: 'm³/h', min: 50, max: 500 },
        { type: 'flow_velocity', unit: 'm/s', min: 0.1, max: 3.5 },
        { type: 'water_temperature', unit: '°C', min: 5, max: 35 },
        { type: 'net_weight', unit: 'kg', min: 100, max: 10000 },
        { type: 'speed', unit: 'm/min', min: 10, max: 300 },
        { type: 'current', unit: 'A', min: 0, max: 200 },
        { type: 'winding_temperature', unit: '°C', min: 20, max: 120 },
        { type: 'cabinet_out_temperature', unit: '°C', min: -10, max: 45 },
        { type: 'cabinet_in_temperature', unit: '°C', min: 0, max: 50 },
        { type: 'cabinet_out_humidity', unit: '%', min: 10, max: 100 }
      ]

      const data = []
      const now = new Date()
      
      for (let i = 0; i < 100; i++) {
        const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000) // 每30分钟一条记录
        const typeConfig = dataTypes[Math.floor(Math.random() * dataTypes.length)]
        const value = (Math.random() * (typeConfig.max - typeConfig.min) + typeConfig.min).toFixed(1)
        
        data.push({
          id: i + 1,
          timestamp,
          type: typeConfig.type,
          value: parseFloat(value),
          unit: typeConfig.unit,
          status: Math.random() > 0.1 ? 'normal' : 'warning'
        })
      }
      
      return data.sort((a, b) => b.timestamp - a.timestamp)
    }

    const totalPages = computed(() => {
      return Math.ceil(queryResults.value.length / pageSize)
    })

    const paginatedResults = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return queryResults.value.slice(start, end)
    })

    const getDataTypeName = (type) => {
      const typeNames = {
        upstream_level: '上游液位',
        downstream_level: '下游液位',
        instant_flow: '瞬时流量',
        flow_velocity: '流速',
        water_temperature: '水温',
        net_weight: '净重',
        speed: '速度',
        current: '电流',
        winding_temperature: '绕组温度',
        cabinet_out_temperature: '柜外温度',
        cabinet_in_temperature: '柜内温度',
        cabinet_out_humidity: '柜外湿度'
      }
      return typeNames[type] || type
    }

    const getStatusName = (status) => {
      const statusNames = {
        normal: '正常',
        warning: '警告',
        error: '错误'
      }
      return statusNames[status] || status
    }

    const formatDateTime = (timestamp) => {
      return timestamp.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const executeQuery = async () => {
      loading.value = true
      queryExecuted.value = true
      currentPage.value = 1
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 生成模拟数据
        let data = generateMockData()
        
        // 根据查询条件过滤数据
        if (queryParams.value.dataType !== 'all') {
          data = data.filter(item => item.type === queryParams.value.dataType)
        }
        
        // 时间范围过滤
        const now = new Date()
        let startTime
        
        switch (queryParams.value.timeRange) {
          case '1h':
            startTime = new Date(now.getTime() - 60 * 60 * 1000)
            break
          case '6h':
            startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000)
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
          case 'custom_days':
            if (queryParams.value.startDate && queryParams.value.endDate) {
              const startOfDay = new Date(queryParams.value.startDate)
              startOfDay.setHours(0, 0, 0, 0)
              const endOfDay = new Date(queryParams.value.endDate)
              endOfDay.setHours(23, 59, 59, 999)
              const from = startOfDay <= endOfDay ? startOfDay : endOfDay
              const to = startOfDay <= endOfDay ? endOfDay : startOfDay
              data = data.filter(item => 
                item.timestamp >= from && item.timestamp <= to
              )
            }
            break
        }
        
        if (queryParams.value.timeRange !== 'custom_days' && startTime) {
          data = data.filter(item => item.timestamp >= startTime)
        }
        
        queryResults.value = data
        
      } finally {
        loading.value = false
      }
    }

    // 已移除 导出数据 逻辑

    return {
      loading,
      queryExecuted,
      queryParams,
      queryResults,
      currentPage,
      totalPages,
      paginatedResults,
      getDataTypeName,
      getStatusName,
      formatDateTime,
      executeQuery,
      
    }
  }
}
</script>

<style scoped>
.query-module {
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

.query-module::-webkit-scrollbar {
  width: 8px;
}

.query-module::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.query-module::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.query-module::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.query-panel {
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

.query-form {
  color: #666;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.input-field {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-panel {
  padding: 24px;
}

.results-content {
  color: #666;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #f8fafc;
  padding: 16px 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.data-table tr:hover {
  background: #f8fafc;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.normal {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.status-badge.warning {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

.status-badge.error {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #666;
}

.empty-state {
  padding: 60px 24px;
  text-align: center;
  color: #999;
}

.empty-state h3 {
  font-size: 20px;
  margin: 16px 0 8px;
  color: #666;
}

.empty-state p {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .query-module {
    max-height: calc(100vh - 150px);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px;
  }
}
</style>


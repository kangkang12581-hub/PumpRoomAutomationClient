<template>
  <div class="logs-module">
    <div class="logs-panel card fade-in-up">
      <h3 class="panel-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" stroke-width="2"/>
          <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" stroke-width="2"/>
        </svg>
        系统日志
      </h3>
      
      <div class="logs-filters">
        <div class="filter-group">
          <label>日志级别</label>
          <select v-model="selectedLevel" class="input-field">
            <option value="all">全部</option>
            <option value="info">信息</option>
            <option value="warning">警告</option>
            <option value="error">错误</option>
          </select>
        </div>
        <div class="filter-group">
          <label>时间范围</label>
          <select v-model="timeRange" class="input-field">
            <option value="1h">最近1小时</option>
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
          </select>
        </div>
        <button @click="refreshLogs" class="btn primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M23 4V10H17" stroke="currentColor" stroke-width="2"/>
            <path d="M20.49 15C19.2969 17.5 16.8692 19.3333 14 19.9297C11.1308 20.5261 8.13622 20.2001 5.64 18.92C3.14378 17.6399 1.26204 15.4982 0.370062 12.9414C-0.521916 10.3846 -0.0799855 7.59074 1.50001 5.41" stroke="currentColor" stroke-width="2"/>
          </svg>
          刷新
        </button>
      </div>

      <div class="logs-container">
        <div class="logs-list">
          <div v-for="log in filteredLogs" :key="log.id" class="log-entry" :class="log.level">
            <div class="log-time">{{ formatTime(log.timestamp) }}</div>
            <div class="log-level" :class="log.level">{{ getLevelName(log.level) }}</div>
            <div class="log-message">{{ log.message }}</div>
            <div class="log-source">{{ log.source }}</div>
          </div>
        </div>
      </div>

      <div class="logs-actions">
        <button @click="exportLogs" class="btn secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          导出日志
        </button>
        <button @click="clearLogs" class="btn warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2"/>
          </svg>
          清空日志
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'LogsModule',
  setup() {
    const selectedLevel = ref('all')
    const timeRange = ref('24h')
    
    const systemLogs = ref([
      {
        id: 1,
        timestamp: new Date(),
        level: 'info',
        message: '系统启动完成',
        source: 'System'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 300000),
        level: 'info',
        message: '主泵 #1 启动成功',
        source: 'PumpController'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 600000),
        level: 'warning',
        message: '水位接近高位阈值',
        source: 'WaterLevelSensor'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 900000),
        level: 'info',
        message: '数据采集任务开始',
        source: 'DataCollector'
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 1200000),
        level: 'error',
        message: '传感器连接超时',
        source: 'SensorManager'
      }
    ])

    const filteredLogs = computed(() => {
      let logs = systemLogs.value

      // 按级别过滤
      if (selectedLevel.value !== 'all') {
        logs = logs.filter(log => log.level === selectedLevel.value)
      }

      // 按时间过滤
      const now = new Date()
      let cutoffTime
      
      switch (timeRange.value) {
        case '1h':
          cutoffTime = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case '24h':
          cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        default:
          cutoffTime = new Date(0)
      }

      logs = logs.filter(log => log.timestamp >= cutoffTime)

      return logs.sort((a, b) => b.timestamp - a.timestamp)
    })

    const formatTime = (timestamp) => {
      return timestamp.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const getLevelName = (level) => {
      const levelNames = {
        info: '信息',
        warning: '警告',
        error: '错误'
      }
      return levelNames[level] || level
    }

    const refreshLogs = () => {
      // 模拟添加新日志
      const newLog = {
        id: Date.now(),
        timestamp: new Date(),
        level: 'info',
        message: '日志刷新完成',
        source: 'LogManager'
      }
      systemLogs.value.unshift(newLog)
    }

    const exportLogs = () => {
      const csvContent = [
        '时间,级别,消息,来源',
        ...filteredLogs.value.map(log => 
          `${formatTime(log.timestamp)},${getLevelName(log.level)},${log.message},${log.source}`
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `系统日志_${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const clearLogs = () => {
      if (confirm('确定要清空所有日志吗？此操作不可恢复。')) {
        systemLogs.value = []
      }
    }

    return {
      selectedLevel,
      timeRange,
      filteredLogs,
      formatTime,
      getLevelName,
      refreshLogs,
      exportLogs,
      clearLogs
    }
  }
}
</script>

<style scoped>
.logs-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logs-panel {
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

.logs-filters {
  display: flex;
  gap: 16px;
  align-items: end;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
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
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn.warning {
  background: #f39c12;
  color: white;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logs-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.logs-list {
  display: flex;
  flex-direction: column;
}

.log-entry {
  display: grid;
  grid-template-columns: 140px 80px 1fr 120px;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  align-items: center;
}

.log-entry:hover {
  background: #f8fafc;
}

.log-entry.error {
  border-left: 4px solid #e74c3c;
  background: rgba(231, 76, 60, 0.02);
}

.log-entry.warning {
  border-left: 4px solid #f39c12;
  background: rgba(243, 156, 18, 0.02);
}

.log-entry.info {
  border-left: 4px solid #3498db;
  background: rgba(52, 152, 219, 0.02);
}

.log-time {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #666;
}

.log-level {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.log-level.info {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.log-level.warning {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

.log-level.error {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.log-message {
  color: #333;
  line-height: 1.4;
}

.log-source {
  font-size: 12px;
  color: #999;
  text-align: right;
}

.logs-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logs-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .log-entry {
    grid-template-columns: 1fr;
    gap: 4px;
    text-align: left;
  }
  
  .logs-actions {
    flex-direction: column;
  }
}
</style>


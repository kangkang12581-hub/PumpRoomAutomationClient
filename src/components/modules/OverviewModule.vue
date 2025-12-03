<template>
  <div class="overview-module">
    <!-- 状态卡片 -->
    <div class="status-cards">
      <div class="status-card card fade-in-up" style="animation-delay: 0.1s">
        <div class="card-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#27ae60" stroke-width="2" fill="none"/>
            <path d="M9 12L11 14L15 10" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>系统状态</h3>
          <p class="status-value status-online">{{ systemStatus.status }}</p>
          <span class="status-detail">{{ systemStatus.detail }}</span>
        </div>
      </div>

      <div class="status-card card fade-in-up" style="animation-delay: 0.2s">
        <div class="card-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#f39c12"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>泵机状态</h3>
          <p class="status-value status-active">{{ pumpStatus.status }}</p>
          <span class="status-detail">{{ pumpStatus.detail }}</span>
        </div>
      </div>

      <div class="status-card card fade-in-up" style="animation-delay: 0.3s">
        <div class="card-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M7 16.5C7 14.0147 9.01472 12 11.5 12C13.9853 12 16 14.0147 16 16.5M7 16.5C7 18.9853 9.01472 21 11.5 21C13.9853 21 16 18.9853 16 16.5M7 16.5H16M11.5 3V7M6.5 8L10 11.5M16.5 8L13 11.5" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>水位监控</h3>
          <p class="status-value status-normal">{{ waterLevel.level }}%</p>
          <span class="status-detail">{{ waterLevel.detail }}</span>
        </div>
      </div>

      <div class="status-card card fade-in-up" style="animation-delay: 0.4s">
        <div class="card-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#e74c3c" stroke-width="2"/>
            <path d="M19.4 15A9 9 0 0 0 19.4 9M20.85 19.1A13 13 0 0 0 20.85 4.9M4.6 15A9 9 0 0 1 4.6 9M3.15 19.1A13 13 0 0 1 3.15 4.9" stroke="#e74c3c" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>告警信息</h3>
          <p class="status-value status-warning">{{ alertCount }}条</p>
          <span class="status-detail">需要关注的提醒</span>
        </div>
      </div>
    </div>

    <!-- 仪表板面板 -->
    <div class="dashboard-panels">
      <div class="panel-row">
        <div class="dashboard-panel card fade-in-up" style="animation-delay: 0.5s">
          <h3 class="panel-title">实时监控数据</h3>
          <div class="panel-content">
            <div class="monitoring-grid">
              <div class="monitor-item">
                <span class="monitor-label">流量</span>
                <span class="monitor-value">{{ monitoringData.flowRate }} L/min</span>
              </div>
              <div class="monitor-item">
                <span class="monitor-label">压力</span>
                <span class="monitor-value">{{ monitoringData.pressure }} MPa</span>
              </div>
              <div class="monitor-item">
                <span class="monitor-label">温度</span>
                <span class="monitor-value">{{ monitoringData.temperature }}°C</span>
              </div>
              <div class="monitor-item">
                <span class="monitor-label">功率</span>
                <span class="monitor-value">{{ monitoringData.power }} kW</span>
              </div>
            </div>
            <div class="chart-placeholder">
              <div class="chart-title">数据趋势图</div>
              <div class="placeholder-chart">
                <div class="chart-line" style="height: 60%"></div>
                <div class="chart-line" style="height: 80%"></div>
                <div class="chart-line" style="height: 45%"></div>
                <div class="chart-line" style="height: 75%"></div>
                <div class="chart-line" style="height: 90%"></div>
                <div class="chart-line" style="height: 65%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-panel card fade-in-up" style="animation-delay: 0.6s">
          <h3 class="panel-title">设备状态</h3>
          <div class="panel-content">
            <div class="equipment-list">
              <div v-for="equipment in equipmentStatus" :key="equipment.id" class="equipment-item">
                <div class="equipment-info">
                  <div class="equipment-name">{{ equipment.name }}</div>
                  <div class="equipment-type">{{ equipment.type }}</div>
                </div>
                <div class="equipment-status" :class="equipment.status">
                  <span class="status-dot" :class="equipment.status"></span>
                  <span class="status-text">{{ getStatusText(equipment.status) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-row">
        <div class="dashboard-panel card fade-in-up" style="animation-delay: 0.7s">
          <h3 class="panel-title">最近活动</h3>
          <div class="panel-content">
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-time">{{ formatTime(activity.time) }}</div>
                <div class="activity-content">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-description">{{ activity.description }}</div>
                </div>
                <div class="activity-type" :class="activity.type">{{ activity.type }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-panel card fade-in-up" style="animation-delay: 0.8s">
          <h3 class="panel-title">快速操作</h3>
          <div class="panel-content">
            <div class="quick-actions">
              <button class="action-btn btn primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                </svg>
                启动系统
              </button>
              <button class="action-btn btn secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                </svg>
                暂停运行
              </button>
              <button class="action-btn btn warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12L16 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                紧急停止
              </button>
              <button class="action-btn btn info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'OverviewModule',
  setup() {
    const systemStatus = ref({
      status: '在线',
      detail: '所有设备正常运行'
    })

    const pumpStatus = ref({
      status: '运行中',
      detail: '3台泵机正常工作'
    })

    const waterLevel = ref({
      level: 75,
      detail: '水位正常范围'
    })

    const alertCount = ref(2)

    const monitoringData = ref({
      flowRate: 120.5,
      pressure: 0.8,
      temperature: 25.3,
      power: 15.2
    })

    const equipmentStatus = ref([
      {
        id: 1,
        name: '主泵 #1',
        type: '离心泵',
        status: 'running'
      },
      {
        id: 2,
        name: '主泵 #2',
        type: '离心泵',
        status: 'standby'
      },
      {
        id: 3,
        name: '备用泵 #3',
        type: '离心泵',
        status: 'stopped'
      },
      {
        id: 4,
        name: '水位传感器',
        type: '传感器',
        status: 'running'
      }
    ])

    const recentActivities = ref([
      {
        id: 1,
        time: new Date(Date.now() - 300000), // 5分钟前
        title: '泵机状态变更',
        description: '主泵 #1 启动成功',
        type: 'success'
      },
      {
        id: 2,
        time: new Date(Date.now() - 900000), // 15分钟前
        title: '水位告警',
        description: '水位达到预警阈值',
        type: 'warning'
      },
      {
        id: 3,
        time: new Date(Date.now() - 1800000), // 30分钟前
        title: '系统维护',
        description: '定期自检完成',
        type: 'info'
      }
    ])

    let dataUpdateInterval = null

    const getStatusText = (status) => {
      const statusMap = {
        running: '运行中',
        standby: '待机',
        stopped: '已停止',
        maintenance: '维护中'
      }
      return statusMap[status] || '未知'
    }

    const formatTime = (time) => {
      return time.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 模拟数据更新
    const updateMonitoringData = () => {
      monitoringData.value.flowRate = (120 + Math.random() * 10).toFixed(1)
      monitoringData.value.pressure = (0.8 + Math.random() * 0.2 - 0.1).toFixed(2)
      monitoringData.value.temperature = (25 + Math.random() * 2 - 1).toFixed(1)
      monitoringData.value.power = (15 + Math.random() * 2 - 1).toFixed(1)
    }

    onMounted(() => {
      dataUpdateInterval = setInterval(updateMonitoringData, 5000) // 每5秒更新数据
    })

    onUnmounted(() => {
      if (dataUpdateInterval) {
        clearInterval(dataUpdateInterval)
      }
    })

    return {
      systemStatus,
      pumpStatus,
      waterLevel,
      alertCount,
      monitoringData,
      equipmentStatus,
      recentActivities,
      getStatusText,
      formatTime
    }
  }
}
</script>

<style scoped>
.overview-module {
  space-y: 24px;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.status-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-4px);
}

.card-icon {
  flex-shrink: 0;
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.status-value {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.status-online { color: #27ae60; }
.status-active { color: #f39c12; }
.status-normal { color: #3498db; }
.status-warning { color: #e74c3c; }

.status-detail {
  font-size: 12px;
  color: #666;
}

.dashboard-panels {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.panel-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.dashboard-panel {
  padding: 24px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.panel-content {
  color: #666;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.monitor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.monitor-label {
  font-size: 14px;
  color: #666;
}

.monitor-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.chart-placeholder {
  text-align: center;
}

.chart-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.placeholder-chart {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 120px;
  justify-content: center;
}

.chart-line {
  width: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.chart-line:hover {
  opacity: 1;
}

.equipment-list {
  space-y: 12px;
}

.equipment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.equipment-info {
  flex: 1;
}

.equipment-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.equipment-type {
  font-size: 12px;
  color: #666;
}

.equipment-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.running {
  background: #27ae60;
}

.status-dot.standby {
  background: #f39c12;
}

.status-dot.stopped {
  background: #95a5a6;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
}

.activity-list {
  space-y: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  min-width: 60px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.activity-description {
  font-size: 12px;
  color: #666;
}

.activity-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.activity-type.success {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.activity-type.warning {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

.activity-type.info {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #27ae60;
  color: white;
  border: none;
}

.action-btn.secondary {
  background: #95a5a6;
  color: white;
  border: none;
}

.action-btn.warning {
  background: #e74c3c;
  color: white;
  border: none;
}

.action-btn.info {
  background: #3498db;
  color: white;
  border: none;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-cards {
    grid-template-columns: 1fr;
  }
  
  .panel-row {
    grid-template-columns: 1fr;
  }
  
  .monitoring-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>


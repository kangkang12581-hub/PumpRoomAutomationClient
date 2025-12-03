<template>
  <div class="realtime-module">
    <!-- 实时数据面板 -->
    <div class="realtime-panels">
      <div class="data-panel card fade-in-up">
        <h3 class="panel-title">实时监控数据</h3>
        <div class="monitoring-grid">
          <div class="monitor-item">
            <div class="monitor-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 16.5C7 14.0147 9.01472 12 11.5 12C13.9853 12 16 14.0147 16 16.5" stroke="#3498db" stroke-width="2"/>
              </svg>
            </div>
            <div class="monitor-info">
              <div class="monitor-label">水位</div>
              <div class="monitor-value">{{ realtimeData.waterLevel }}%</div>
            </div>
          </div>
          
          <div class="monitor-item">
            <div class="monitor-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L9 6L13 10L21 2" stroke="#27ae60" stroke-width="2"/>
              </svg>
            </div>
            <div class="monitor-info">
              <div class="monitor-label">流量</div>
              <div class="monitor-value">{{ realtimeData.flowRate }} L/min</div>
            </div>
          </div>
          
          <div class="monitor-item">
            <div class="monitor-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#e74c3c" stroke-width="2"/>
              </svg>
            </div>
            <div class="monitor-info">
              <div class="monitor-label">压力</div>
              <div class="monitor-value">{{ realtimeData.pressure }} MPa</div>
            </div>
          </div>
          
          <div class="monitor-item">
            <div class="monitor-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14 14.76V3.5C14 2.11929 12.8807 1 11.5 1C10.1193 1 9 2.11929 9 3.5V14.76" stroke="#f39c12" stroke-width="2"/>
              </svg>
            </div>
            <div class="monitor-info">
              <div class="monitor-label">温度</div>
              <div class="monitor-value">{{ realtimeData.temperature }}°C</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-panel card fade-in-up" style="animation-delay: 0.1s">
        <h3 class="panel-title">数据趋势图</h3>
        <div class="chart-container">
          <div class="chart-placeholder">
            <div class="chart-lines">
              <div v-for="(point, index) in chartData" :key="index" 
                   class="chart-point" 
                   :style="{ left: (index / (chartData.length - 1)) * 100 + '%', bottom: point + '%' }">
              </div>
            </div>
            <div class="chart-labels">
              <span>过去30分钟数据趋势</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { dataQueryAPI } from '@/services/api'
import { getCurrentSite } from '@/utils/siteManager'

export default {
  name: 'RealtimeModule',
  setup() {
    const realtimeData = ref({
      waterLevel: 75.2,
      flowRate: 120.5,
      pressure: 0.85,
      temperature: 25.3
    })

    const chartData = ref(Array.from({ length: 30 }, () => Math.random() * 40 + 30))
    
    let dataUpdateInterval = null

    const updateChartWithValue = (value) => {
      chartData.value.shift()
      const num = typeof value === 'number' ? value : parseFloat(value) || Math.random() * 40 + 30
      const norm = Math.max(0, Math.min(100, num))
      chartData.value.push(norm)
    }

    const loadRealtimeData = async () => {
      try {
        const current = getCurrentSite()
        if (!current || !current.id) {
          return
        }
        const resp = await dataQueryAPI.getAllLatestData(current.id)
        const data = resp.data || resp
        // 根据后端返回字段名进行映射（容错处理）
        const latest = data || {}
        const wl = latest.waterLevel?.value ?? latest.upstreamWaterLevel?.value ?? realtimeData.value.waterLevel
        const fr = latest.flowRate?.value ?? latest.instantaneousFlow?.value ?? realtimeData.value.flowRate
        const pr = latest.pressure?.value ?? latest.current?.value ?? realtimeData.value.pressure
        const tp = latest.temperature?.value ?? latest.waterTemperature?.value ?? realtimeData.value.temperature

        realtimeData.value.waterLevel = Number(wl).toFixed(1)
        realtimeData.value.flowRate = Number(fr).toFixed(1)
        realtimeData.value.pressure = Number(pr).toFixed(2)
        realtimeData.value.temperature = Number(tp).toFixed(1)

        updateChartWithValue(fr)
      } catch (e) {
        // 静默失败，保留现有数据
        updateChartWithValue(realtimeData.value.flowRate)
      }
    }

    const handleSiteChange = () => {
      // 站点切换时，立即加载当前站点的实时数据
      loadRealtimeData()
    }

    onMounted(() => {
      // 初次加载
      loadRealtimeData()
      // 周期更新（可选）
      dataUpdateInterval = setInterval(loadRealtimeData, 5000)
      if (typeof window !== 'undefined') {
        window.addEventListener('site-changed', handleSiteChange)
      }
    })

    onUnmounted(() => {
      if (dataUpdateInterval) {
        clearInterval(dataUpdateInterval)
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('site-changed', handleSiteChange)
      }
    })

    return {
      realtimeData,
      chartData
    }
  }
}
</script>

<style scoped>
.realtime-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.realtime-panels {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

.data-panel,
.chart-panel {
  padding: 24px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.monitor-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.monitor-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.monitor-info {
  flex: 1;
}

.monitor-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.monitor-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  background: #f8fafc;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.chart-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chart-point {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #667eea;
  border-radius: 50%;
  transition: all 0.5s ease;
}

.chart-labels {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .realtime-panels {
    grid-template-columns: 1fr;
  }
}
</style>


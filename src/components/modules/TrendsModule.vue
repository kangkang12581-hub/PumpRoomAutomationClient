<template>
  <div class="trends-echarts">
    <div class="toolbar card">
      <div class="range-buttons">
        <button
          class="btn"
          :class="{ active: currentRange === 'hourly24' }"
          @click="setRange('hourly24')"
        >
          小时间隔（今天至今）
        </button>
        <button
          class="btn"
          :class="{ active: currentRange === 'dailyThisMonth' }"
          @click="setRange('dailyThisMonth')"
        >
          日间隔（本月至今）
        </button>
        <button
          class="btn"
          :class="{ active: currentRange === 'monthlyThisYear' }"
          @click="setRange('monthlyThisYear')"
        >
          月间隔（今年至今）
        </button>
      </div>
      <div class="actions">
        <select class="select" v-model="currentMetric">
          <option v-for="m in metrics" :key="m" :value="m">{{ m }}</option>
        </select>
        <div class="stats">
          <span>最小值：<b>{{ stats.min }}</b></span>
          <span>最大值：<b>{{ stats.max }}</b></span>
          <span>平均值：<b>{{ stats.avg }}</b></span>
        </div>
      </div>
    </div>
    <div ref="chartEl" class="chart"></div>
  </div>
  
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { 
  upstreamWaterLevelAPI, 
  downstreamWaterLevelAPI, 
  instantaneousFlowAPI, 
  flowVelocityAPI, 
  waterTemperatureAPI,
  netWeightAPI,
  speedAPI,
  currentAPI,
  externalTempAPI,
  internalTempAPI,
  externalHumidityAPI,
  internalHumidityAPI,
  dataStatisticsAPI
} from '@/services/api'
import { getCurrentSite, addSiteChangeListener, removeSiteChangeListener } from '@/utils/siteManager'

export default {
  name: 'TrendsModule',
  setup() {
    const chartEl = ref(null)
    let chart = null
    
    // 当前站点
    const currentSite = ref(null)
    const loading = ref(false)
    
    // 当前选择的时间区间
    const currentRange = ref('hourly24') // 'hourly24' | 'dailyThisMonth' | 'monthlyThisYear'
    // 趋势指标
    const metrics = [
      '上游液位','下游液位','瞬时流量','流速','水温','净重','速度','电流','柜内湿度','柜外温度','柜内温度','柜外湿度'
    ]
    const currentMetric = ref(metrics[0])
    const stats = ref({ min: '-', max: '-', avg: '-' })

    // 初始化图表
    const initChart = () => {
      if (!chartEl.value) return
      chart = echarts.init(chartEl.value)
      chart.setOption({
        grid: { left: 24, right: 16, top: 16, bottom: 0 },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          valueFormatter: v => `${v?.toFixed?.(2) ?? v}`
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          position: 'bottom',
          axisLabel: { color: '#666', margin: 10 },
          axisLine: { lineStyle: { color: '#ccc' } },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#666' },
          splitLine: { lineStyle: { color: '#eee' } }
        },
        series: [
          {
            name: currentMetric.value,
            type: 'line',
            showSymbol: false,
            smooth: true,
            areaStyle: { opacity: 0.15 },
            lineStyle: { width: 2 },
            data: []
          }
        ]
      })
      updateChartData()
      window.addEventListener('resize', resize)
    }

    const resize = () => {
      if (chart) chart.resize()
    }

    // 生成区间数据
    const generateData = (range) => {
      const now = new Date()
      const values = []
      const rand = (i, base = 50) => base + Math.sin(i / 3) * 5 + (Math.random() - 0.5) * 2

      if (range === 'hourly24') {
        // 当天00:00:00至今，1分钟颗粒度，1440个数据点
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        const end = new Date(now)
        end.setSeconds(0, 0) // 取整到当前分钟
        for (let t = new Date(start), i = 0; t <= end; t.setMinutes(t.getMinutes() + 1), i++) {
          values.push({ value: [new Date(t), rand(i)] })
        }
      } else if (range === 'dailyThisMonth') {
        // 本月1日至今，1小时一次，720个数据点（30天*24小时）
        const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
        const end = new Date(now)
        end.setMinutes(0, 0, 0) // 取整到当前小时
        for (let t = new Date(start), i = 0; t <= end; t.setHours(t.getHours() + 1), i++) {
          values.push({ value: [new Date(t), rand(i, 55)] })
        }
      } else if (range === 'monthlyThisYear') {
        // 今年1月1日至今，1天一次，365个数据点
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
        const end = new Date(now)
        end.setHours(0, 0, 0, 0) // 取整到当前天
        for (let t = new Date(start), i = 0; t <= end; t.setDate(t.getDate() + 1), i++) {
          values.push({ value: [new Date(t), rand(i, 60)] })
        }
      }
      return values
    }

    const getXAxisOptions = (range) => {
      if (range === 'hourly24') {
        // 当天00:00:00至今，1分钟颗粒度
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        const end = new Date(now)
        return {
          type: 'time',
          min: start,
          max: end,
          minInterval: 60 * 1000, // 1分钟
          splitNumber: 24, // 显示24个刻度（每小时一个）
          axisLabel: {
            color: '#666',
            margin: 10,
            formatter: (value) => {
              const d = new Date(value)
              const hh = String(d.getHours()).padStart(2, '0')
              const mm = String(d.getMinutes()).padStart(2, '0')
              return `${hh}:${mm}`
            }
          }
        }
      }
      if (range === 'dailyThisMonth') {
        // 本月1日至今，1小时一次
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
        const end = new Date(now)
        const daysDiff = Math.ceil((end - start) / (24 * 3600 * 1000))
        return {
          type: 'time',
          min: start,
          max: end,
          minInterval: 3600 * 1000, // 1小时
          splitNumber: Math.min(daysDiff, 15), // 根据天数动态调整，最多15个刻度
          axisLabel: {
            color: '#666',
            margin: 12,
            rotate: 45, // 旋转45度，避免重叠
            interval: 0, // 自动计算间隔，避免重叠
            formatter: (value) => {
              const d = new Date(value)
              const mm = String(d.getMonth() + 1).padStart(2, '0')
              const dd = String(d.getDate()).padStart(2, '0')
              const hh = String(d.getHours()).padStart(2, '0')
              // 如果是00:00，显示日期，否则显示时间
              if (d.getHours() === 0) {
                return `${mm}-${dd}`
              } else {
                return `${hh}:00`
              }
            }
          }
        }
      }
      // monthlyThisYear（今年1月1日至今，1天一次）
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
      const end = new Date(now)
      return {
        type: 'time',
        min: start,
        max: end,
        minInterval: 24 * 3600 * 1000, // 1天
        splitNumber: 12, // 显示12个刻度（每月一个）
        axisLabel: {
          color: '#666',
          margin: 10,
          formatter: (value) => {
            const d = new Date(value)
            const mm = String(d.getMonth() + 1).padStart(2, '0')
            const dd = String(d.getDate()).padStart(2, '0')
            return `${mm}-${dd}`
          }
        }
      }
    }

    // 指标名称映射表 (中文 -> API参数)
    const metricNameMap = {
      '上游液位': 'upstream-water-level',
      '下游液位': 'downstream-water-level',
      '瞬时流量': 'instantaneous-flow',
      '流速': 'flow-velocity',
      '水温': 'water-temperature',
      '净重': 'net-weight',
      '速度': 'speed',
      '电流': 'current',
      '柜外温度': 'external-temp',
      '柜内温度': 'internal-temp',
      '柜外湿度': 'external-humidity',
      '柜内湿度': 'internal-humidity'
    }

    const updateStats = (data) => {
      if (!data || data.length === 0) {
        stats.value = { min: '-', max: '-', avg: '-' }
        return
      }
      const nums = data.map(p => Array.isArray(p.value) ? Number(p.value[1]) : Number(p[1] ?? p.value))
      const min = Math.min(...nums)
      const max = Math.max(...nums)
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length
      stats.value = {
        min: min.toFixed(2),
        max: max.toFixed(2),
        avg: avg.toFixed(2)
      }
    }

    // 从API加载真实统计数据（基于当天所有数据）
    const loadStatistics = async (range) => {
      if (!currentSite.value?.id || !currentMetric.value) return
      
      const metricKey = metricNameMap[currentMetric.value]
      if (!metricKey) {
        console.warn('未找到指标映射:', currentMetric.value)
        return
      }

      try {
        const { startTime, endTime } = getTimeRange(range)
        const response = await dataStatisticsAPI.getStatistics(
          metricKey, 
          currentSite.value.id, 
          startTime.toISOString(), 
          endTime.toISOString()
        )
        
        if (response && response.minValue !== undefined) {
          stats.value = {
            min: response.minValue.toFixed(2),
            max: response.maxValue.toFixed(2),
            avg: response.avgValue.toFixed(2)
          }
          console.log(`${currentMetric.value} 统计数据:`, stats.value)
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    }

    // 从API加载上游液位真实数据
    const loadUpstreamWaterLevelData = async (range) => {
      console.log('loadUpstreamWaterLevelData 被调用:', { range, currentSite: currentSite.value })
      
      if (!currentSite.value) {
        console.warn('没有选择站点')
        return []
      }
      
      if (!currentSite.value.id) {
        console.error('站点ID无效:', currentSite.value)
        return []
      }
      
      console.log('站点ID类型:', typeof currentSite.value.id, '值:', currentSite.value.id)

      loading.value = true
      try {
        const now = new Date()
        let startTime, endTime, interval

        if (range === 'hourly24') {
          // 当天00:00:00至今，1分钟颗粒度，1440个数据点
          startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
          endTime = new Date(now)
          interval = 'minute'
        } else if (range === 'dailyThisMonth') {
          // 本月1日00:00:00至今，1小时一次，720个数据点
          startTime = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
          endTime = new Date(now)
          interval = 'hour'
        } else if (range === 'monthlyThisYear') {
          // 今年1月1日00:00:00至今，1天一次，365个数据点
          startTime = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
          endTime = new Date(now)
          interval = 'day'
        }

        console.log('查询时间范围:', {
          siteId: currentSite.value.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          interval,
          startTimeMs: startTime.getTime(),
          endTimeMs: endTime.getTime(),
          diff: endTime.getTime() - startTime.getTime()
        })

        const response = await upstreamWaterLevelAPI.queryData(
          currentSite.value.id,
          startTime.toISOString(),
          endTime.toISOString(),
          interval
        )

        console.log('上游液位数据:', response)

        // 转换数据格式为ECharts需要的格式
        // 后端返回: { success, data: { siteId, data: [...], totalCount }, ... }
        // API层处理后可能返回: { siteId, data: [...], totalCount } 或完整响应
        const dataPoints = response.data?.data || response.data || []
        console.log('数据点数量:', dataPoints.length, '数据点:', dataPoints)
        
        return dataPoints.map(item => ({
          value: [new Date(item.timeBucket), item.avgLevel]
        }))
      } catch (error) {
        console.error('加载上游液位数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载下游液位真实数据
    const loadDownstreamWaterLevelData = async (range) => {
      console.log('loadDownstreamWaterLevelData 被调用:', { range, currentSite: currentSite.value })
      
      if (!currentSite.value || !currentSite.value.id) {
        console.warn('没有选择站点或站点ID无效')
        return []
      }

      loading.value = true
      try {
        const now = new Date()
        let startTime, endTime, interval

        if (range === 'hourly24') {
          // 1分钟颗粒度，1440个数据点
          startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
          endTime = new Date(now)
          interval = 'minute'
        } else if (range === 'dailyThisMonth') {
          // 1小时一次，720个数据点
          startTime = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
          endTime = new Date(now)
          interval = 'hour'
        } else if (range === 'monthlyThisYear') {
          // 1天一次，365个数据点
          startTime = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
          endTime = new Date(now)
          interval = 'day'
        }

        const response = await downstreamWaterLevelAPI.queryData(
          currentSite.value.id,
          startTime.toISOString(),
          endTime.toISOString(),
          interval
        )

        console.log('下游液位数据:', response)

        // 后端返回: { success, data: { siteId, data: [...], totalCount }, ... }
        // API层处理后可能返回: { siteId, data: [...], totalCount } 或完整响应
        const dataPoints = response.data?.data || response.data || []
        console.log('下游液位数据点数量:', dataPoints.length)
        
        return dataPoints.map(item => ({
          value: [new Date(item.timeBucket), item.avgLevel]
        }))
      } catch (error) {
        console.error('加载下游液位数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载瞬时流量真实数据
    const loadInstantaneousFlowData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await instantaneousFlowAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        // 后端返回: { success, data: { siteId, data: [...], totalCount }, ... }
        // API层处理后可能返回: { siteId, data: [...], totalCount } 或完整响应
        const dataPoints = response.data?.data || response.data || []
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgFlow] }))
      } catch (error) {
        console.error('加载瞬时流量数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载流速真实数据
    const loadFlowVelocityData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await flowVelocityAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        // 后端返回: { success, data: { siteId, data: [...], totalCount }, ... }
        // API层处理后可能返回: { siteId, data: [...], totalCount } 或完整响应
        const dataPoints = response.data?.data || response.data || []
        console.log('流速数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgVelocity] }))
      } catch (error) {
        console.error('加载流速数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载水温真实数据
    const loadWaterTemperatureData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await waterTemperatureAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        console.log('水温完整响应:', response)
        console.log('水温 response.data:', response.data)
        console.log('水温 response.data?.data:', response.data?.data)
        
        // 后端返回: { success, data: WaterTemperatureQueryResult, message }
        // API层返回: response.data (即 WaterTemperatureQueryResult)
        // WaterTemperatureQueryResult 结构: { siteId, siteName, data: [...], totalCount }
        const dataPoints = response.data?.data || response.data || []
        console.log('水温数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgTemperature] }))
      } catch (error) {
        console.error('加载水温数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载净重真实数据
    const loadNetWeightData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await netWeightAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        const dataPoints = response.data?.data || response.data || []
        console.log('净重数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgValue] }))
      } catch (error) {
        console.error('加载净重数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载速度真实数据
    const loadSpeedData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await speedAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        const dataPoints = response.data?.data || response.data || []
        console.log('速度数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgSpeed] }))
      } catch (error) {
        console.error('加载速度数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载电流真实数据
    const loadCurrentData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await currentAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        const dataPoints = response.data?.data || response.data || []
        console.log('电流数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgValue] }))
      } catch (error) {
        console.error('加载电流数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载柜外温度真实数据
    const loadExternalTempData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await externalTempAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        const dataPoints = response.data?.data || response.data || []
        console.log('柜外温度数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgValue] }))
      } catch (error) {
        console.error('加载柜外温度数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载柜内温度真实数据
    const loadInternalTempData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await internalTempAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        const dataPoints = response.data?.data || response.data || []
        console.log('柜内温度数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgValue] }))
      } catch (error) {
        console.error('加载柜内温度数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载柜外湿度真实数据
    const loadExternalHumidityData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await externalHumidityAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        const dataPoints = response.data?.data || response.data || []
        console.log('柜外湿度数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgValue] }))
      } catch (error) {
        console.error('加载柜外湿度数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 从API加载柜内湿度真实数据
    const loadInternalHumidityData = async (range) => {
      if (!currentSite.value?.id) return []
      loading.value = true
      try {
        const { startTime, endTime, interval } = getTimeRange(range)
        const response = await internalHumidityAPI.queryData(currentSite.value.id, startTime.toISOString(), endTime.toISOString(), interval)
        const dataPoints = response.data?.data || response.data || []
        console.log('柜内湿度数据点数量:', dataPoints.length)
        return dataPoints.map(item => ({ value: [new Date(item.timeBucket), item.avgValue] }))
      } catch (error) {
        console.error('加载柜内湿度数据失败:', error)
        return []
      } finally {
        loading.value = false
      }
    }

    // 辅助函数：获取时间范围
    const getTimeRange = (range) => {
      const now = new Date()
      let startTime, interval
      if (range === 'hourly24') {
        // 1分钟颗粒度，1440个数据点
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        interval = 'minute'
      } else if (range === 'dailyThisMonth') {
        // 1小时一次，720个数据点（30天*24小时）
        startTime = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
        interval = 'hour'
      } else {
        // 1天一次，365个数据点
        startTime = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
        interval = 'day'
      }
      return { startTime, endTime: now, interval }
    }

    const updateChartData = async () => {
      if (!chart) return
      
      let data = []
      
      // 根据指标类型加载真实数据或模拟数据
      if (currentSite.value) {
        if (currentMetric.value === '上游液位') {
          data = await loadUpstreamWaterLevelData(currentRange.value)
        } else if (currentMetric.value === '下游液位') {
          data = await loadDownstreamWaterLevelData(currentRange.value)
        } else if (currentMetric.value === '瞬时流量') {
          data = await loadInstantaneousFlowData(currentRange.value)
        } else if (currentMetric.value === '流速') {
          data = await loadFlowVelocityData(currentRange.value)
        } else if (currentMetric.value === '水温') {
          data = await loadWaterTemperatureData(currentRange.value)
        } else if (currentMetric.value === '净重') {
          data = await loadNetWeightData(currentRange.value)
        } else if (currentMetric.value === '速度') {
          data = await loadSpeedData(currentRange.value)
        } else if (currentMetric.value === '电流') {
          data = await loadCurrentData(currentRange.value)
        } else if (currentMetric.value === '柜外温度') {
          data = await loadExternalTempData(currentRange.value)
        } else if (currentMetric.value === '柜内温度') {
          data = await loadInternalTempData(currentRange.value)
        } else if (currentMetric.value === '柜外湿度') {
          data = await loadExternalHumidityData(currentRange.value)
        } else if (currentMetric.value === '柜内湿度') {
          data = await loadInternalHumidityData(currentRange.value)
        } else {
          data = generateData(currentRange.value)
        }
        if (data.length === 0) {
          console.warn(`没有找到${currentMetric.value}数据，显示空图表`)
        }
      } else {
        data = generateData(currentRange.value)
      }
      
      const xAxis = getXAxisOptions(currentRange.value)
      chart.setOption({ xAxis, series: [{ name: currentMetric.value, data }] }, false)
      
      // 加载基于时间范围内所有数据的真实统计信息
      await loadStatistics(currentRange.value)
    }

    const setRange = (range) => {
      currentRange.value = range
    }

    // 站点切换处理
    const handleSiteChange = (siteCode, siteDetails) => {
      console.log('趋势曲线 - 站点切换:', siteCode, siteDetails)
      currentSite.value = siteDetails
      updateChartData()
    }

    watch(currentRange, () => updateChartData())
    watch(currentMetric, () => updateChartData())

    onMounted(() => {
      // 初始化当前站点
      currentSite.value = getCurrentSite()
      console.log('趋势曲线 - 初始站点:', currentSite.value)
      
      initChart()
      
      // 监听站点切换事件
      addSiteChangeListener(handleSiteChange)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resize)
      removeSiteChangeListener(handleSiteChange)
      
      if (chart) {
        chart.dispose()
        chart = null
      }
    })

    return { chartEl, currentRange, setRange, stats, metrics, currentMetric, loading }
  }
}
</script>

<style scoped>
.trends-echarts {
  width: 100%;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 12px;
}
.range-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.btn {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  cursor: pointer;
}
.btn.active { color: #fff; background: #667eea; border-color: #667eea; }
.btn.outline { background: transparent; color: #667eea; }
.actions { display: flex; align-items: center; gap: 12px; }
.stats { display: flex; gap: 12px; color: #666; font-size: 12px; }
.stats b { color: #111; font-weight: 600; }
.select {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
}
.chart {
  width: 100%;
  height: 72vh;
  min-height: 420px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
</style>



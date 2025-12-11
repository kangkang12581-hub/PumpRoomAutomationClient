<template>
  <div class="data-display-module">
    <!-- 环境数据模块 -->
    <div class="environment-section">
      <div class="environment-panel card fade-in-up">
        <h3 class="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
          </svg>
          环境数据
        </h3>
        <div class="panel-content">
          <div class="environment-grid">
            <div class="env-item">
              <div class="env-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 14.76V3.5A2.5 2.5 0 0 0 11.5 1A2.5 2.5 0 0 0 9 3.5V14.76A4.5 4.5 0 1 0 14 14.76Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 18A1.5 1.5 0 1 0 12 15A1.5 1.5 0 0 0 12 18Z" fill="currentColor"/>
                </svg>
                </div>
              <div class="env-info">
                <div class="env-label">柜内温度</div>
                <div class="env-value">{{ environmentData.insideTemp }}°C</div>
                <div class="env-status" :class="getTempStatus(environmentData.insideTemp)">
                  {{ getTempStatusText(environmentData.insideTemp) }}
              </div>
              </div>
            </div>

            <div class="env-item">
              <div class="env-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16.2 3.8A2.5 2.5 0 0 1 19 6.3V17.7A2.5 2.5 0 0 1 16.2 20.2L7.8 20.2A2.5 2.5 0 0 1 5 17.7V6.3A2.5 2.5 0 0 1 7.8 3.8Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 12H16M8 9H16M8 15H13" stroke="currentColor" stroke-width="2"/>
                  <circle cx="17" cy="8" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
              </div>
              <div class="env-info">
                <div class="env-label">柜内湿度</div>
                <div class="env-value">{{ environmentData.insideHumidity }}%RH</div>
                <div class="env-status" :class="getInsideHumidityStatus(environmentData.insideHumidity)">
                  {{ getInsideHumidityStatusText(environmentData.insideHumidity) }}
                </div>
              </div>
            </div>

            <div class="env-item">
              <div class="env-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
                  </svg>
              </div>
              <div class="env-info">
                <div class="env-label">柜外温度</div>
                <div class="env-value">{{ environmentData.outsideTemp }}°C</div>
                <div class="env-status" :class="getTempStatus(environmentData.outsideTemp)">
                  {{ getTempStatusText(environmentData.outsideTemp) }}
                </div>
              </div>
            </div>

            <div class="env-item">
              <div class="env-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 15L9 9L13 13L21 5" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 5H16V10" stroke="currentColor" stroke-width="2"/>
                  <circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="19" cy="19" r="2" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="env-info">
                <div class="env-label">柜外湿度</div>
                <div class="env-value">{{ environmentData.outsideHumidity }}%RH</div>
                <div class="env-status" :class="getOutsideHumidityStatus(environmentData.outsideHumidity)">
                  {{ getOutsideHumidityStatusText(environmentData.outsideHumidity) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 设备控制模块 -->
    <div class="device-section">
      <div class="device-panel card fade-in-up" style="animation-delay: 0.1s">
        <h3 class="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 16.5C7 14.0147 9.01472 12 11.5 12C13.9853 12 16 14.0147 16 16.5M7 16.5C7 18.9853 9.01472 21 11.5 21C13.9853 21 16 18.9853 16 16.5M7 16.5H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          水流数据
        </h3>
        <div class="panel-content">
          <div class="water-flow-grid">
            <div class="flow-item">
              <div class="flow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16.5C7 14.0147 9.01472 12 11.5 12C13.9853 12 16 14.0147 16 16.5M7 16.5C7 18.9853 9.01472 21 11.5 21C13.9853 21 16 18.9853 16 16.5M7 16.5H16" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 7V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                </div>
              <div class="flow-info">
                <div class="flow-label">上流液位</div>
                <div class="flow-value">{{ waterFlowData.upstreamLevel }} cm</div>
                <div class="flow-status" :class="getLevelStatus(waterFlowData.upstreamLevel)">
                  {{ getLevelStatusText(waterFlowData.upstreamLevel) }}
                </div>
              </div>
              </div>

            <div class="flow-item">
              <div class="flow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16.5C7 14.0147 9.01472 12 11.5 12C13.9853 12 16 14.0147 16 16.5M7 16.5C7 18.9853 9.01472 21 11.5 21C13.9853 21 16 18.9853 16 16.5M7 16.5H16" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 17V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
              <div class="flow-info">
                <div class="flow-label">下流液位</div>
                <div class="flow-value">{{ waterFlowData.downstreamLevel }} cm</div>
                <div class="flow-status" :class="getLevelStatus(waterFlowData.downstreamLevel)">
                  {{ getLevelStatusText(waterFlowData.downstreamLevel) }}
                </div>
              </div>
            </div>

            <div class="flow-item">
              <div class="flow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 15L9 9L13 13L21 5" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 5H16V10" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="flow-info">
                <div class="flow-label">液位差</div>
                <div class="flow-value">{{ waterFlowData.levelDifference }} cm</div>
                <div class="flow-status" :class="getDifferenceStatus(waterFlowData.levelDifference)">
                  {{ getDifferenceStatusText(waterFlowData.levelDifference) }}
                </div>
              </div>
            </div>

            <div class="flow-item">
              <div class="flow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M23 12L17 6V9H7V15H17V18L23 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="4" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="flow-info">
                <div class="flow-label">流速</div>
                <div class="flow-value">{{ formatTwoDecimals(waterFlowData.velocity) }} m/s</div>
                <div class="flow-status" :class="getVelocityStatus(waterFlowData.velocity)">
                  {{ getVelocityStatusText(waterFlowData.velocity) }}
                </div>
              </div>
            </div>

            <div class="flow-item">
              <div class="flow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="flow-info">
                <div class="flow-label">瞬时流量</div>
                <div class="flow-value">{{ formatTwoDecimals(waterFlowData.instantFlow) }} m³/h</div>
                <div class="flow-status" :class="getInstantFlowStatus(waterFlowData.instantFlow)">
                  {{ getInstantFlowStatusText(waterFlowData.instantFlow) }}
                </div>
              </div>
            </div>

            <div class="flow-item">
              <div class="flow-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M14 14.76V3.5A2.5 2.5 0 0 0 11.5 1A2.5 2.5 0 0 0 9 3.5V14.76A4.5 4.5 0 1 0 14 14.76Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 18A1.5 1.5 0 1 0 12 15A1.5 1.5 0 0 0 12 18Z" fill="currentColor"/>
                </svg>
              </div>
              <div class="flow-info">
                <div class="flow-label">水温</div>
                <div class="flow-value">{{ formatTwoDecimals(waterFlowData.temperature) }}°C</div>
                <div class="flow-status" :class="getWaterTempStatus(waterFlowData.temperature)">
                  {{ getWaterTempStatusText(waterFlowData.temperature) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 运行参数模块 -->
    <div class="motor-section">
      <div class="motor-panel card fade-in-up" style="animation-delay: 0.2s">
        <h3 class="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15A9 9 0 0 0 19.4 9M20.85 19.1A13 13 0 0 0 20.85 4.9M4.6 15A9 9 0 0 1 4.6 9M3.15 19.1A13 13 0 0 1 3.15 4.9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          运行参数
        </h3>
        <div class="panel-content">
          <div class="motor-params-grid">
            <div class="param-item">
              <span class="param-label">实时速度</span>
              <span class="param-value">{{ gratingMotorData.speed }} m/min</span>
              <span class="param-status" :class="getSpeedStatus(gratingMotorData.speed)">
                {{ getSpeedStatusText(gratingMotorData.speed) }}
              </span>
            </div>
            <div class="param-item">
              <span class="param-label">设定频率</span>
              <span class="param-value">{{ gratingMotorData.setFrequency || gratingMotorData.frequency }} Hz</span>
              <span class="param-status normal">设定值</span>
            </div>
            <div class="param-item">
              <span class="param-label">实时电流</span>
              <span class="param-value">{{ gratingMotorData.current }} A</span>
              <span class="param-status" :class="getCurrentStatus(gratingMotorData.current)">
                {{ getCurrentStatusText(gratingMotorData.current) }}
              </span>
            </div>
            <div class="param-item">
              <span class="param-label">实时功率</span>
              <span class="param-value">{{ gratingMotorData.power }} Kw</span>
              <span class="param-status" :class="getPowerStatus(gratingMotorData.power)">
                {{ getPowerStatusText(gratingMotorData.power) }}
              </span>
            </div>
            <div class="param-item">
              <span class="param-label">实时转矩</span>
              <span class="param-value">{{ gratingMotorData.torque }}%</span>
              <span class="param-status" :class="getTorqueStatus(gratingMotorData.torque)">
                {{ getTorqueStatusText(gratingMotorData.torque) }}
              </span>
            </div>
            <div class="param-item">
              <span class="param-label">绕组温度</span>
              <span class="param-value">{{ gratingMotorData.windingTemp }}°C</span>
              <span class="param-status" :class="getWindingTempStatus(gratingMotorData.windingTemp)">
                {{ getWindingTempStatusText(gratingMotorData.windingTemp) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 称台模块 -->
    <div class="scale-section">
      <div class="motor-panel card fade-in-up" style="animation-delay: 0.5s">
        <h3 class="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="18" width="18" height="3" stroke="currentColor" stroke-width="2" rx="1"/>
            <rect x="6" y="14" width="12" height="4" stroke="currentColor" stroke-width="2" rx="1"/>
            <path d="M12 14V8" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="2"/>
            <path d="M8 8h8" stroke="currentColor" stroke-width="2"/>
          </svg>
          称台监控
        </h3>
        <div class="panel-content">
          <div class="scale-module">
            <!-- 称台状态指示 -->
            <div class="scale-status-section">
              <div class="scale-status-indicator">
                <div class="status-dot" :class="scaleData.status"></div>
                <span class="status-text">{{ getScaleStatusLabel(scaleData.status) }}</span>
                <div class="stable-indicator" :class="{ active: scaleData.isStable }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{ scaleData.isStable ? '稳定' : '不稳定' }}</span>
                </div>
              </div>
              <div class="last-update">
                最后更新: {{ scaleData.lastUpdate }}
              </div>
            </div>

            <!-- 重量数据网格 -->
            <div class="scale-data-grid">
              <div class="weight-item">
                <div class="weight-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="18" width="18" height="3" stroke="currentColor" stroke-width="2" rx="1"/>
                    <rect x="6" y="14" width="12" height="4" stroke="currentColor" stroke-width="2" rx="1"/>
                    <path d="M12 14V8" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="weight-info">
                  <div class="weight-label">毛重</div>
                  <div class="weight-value">{{ scaleData.grossWeight }} kg</div>
                  <div class="weight-status" :class="getScaleStatus(scaleData.grossWeight)">
                    {{ getScaleStatusText(scaleData.grossWeight) }}
                  </div>
                </div>
              </div>

              <div class="weight-item">
                <div class="weight-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="18" width="18" height="3" stroke="currentColor" stroke-width="2" rx="1"/>
                    <path d="M8 18V12" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 18V10" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 18V14" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="6" r="2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="weight-info">
                  <div class="weight-label">净重</div>
                  <div class="weight-value">{{ scaleData.netWeight }} kg</div>
                  <div class="weight-status" :class="getScaleStatus(scaleData.netWeight)">
                    {{ getScaleStatusText(scaleData.netWeight) }}
                  </div>
                </div>
              </div>

              <div class="weight-item">
                <div class="weight-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="18" width="18" height="3" stroke="currentColor" stroke-width="2" rx="1"/>
                    <path d="M7 18V6" stroke="currentColor" stroke-width="2"/>
                    <path d="M17 18V6" stroke="currentColor" stroke-width="2"/>
                    <path d="M7 6H17" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 10H14" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="weight-info">
                  <div class="weight-label">日总重</div>
                  <div class="weight-value">{{ scaleData.dailyTotalWeight }} kg</div>
                  <div class="weight-status normal">
                    日累计
                  </div>
                </div>
              </div>

              <div class="weight-item">
                <div class="weight-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="18" width="18" height="3" stroke="currentColor" stroke-width="2" rx="1"/>
                    <path d="M12 18V6" stroke="currentColor" stroke-width="2"/>
                    <path d="M6 12L18 12" stroke="currentColor" stroke-width="2"/>
                    <path d="M6 8L18 8" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="4" r="2" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                  </svg>
                </div>
                <div class="weight-info">
                  <div class="weight-label">总重</div>
                  <div class="weight-value">{{ scaleData.totalWeight }} kg</div>
                  <div class="weight-status normal">
                    总累计
                  </div>
                </div>
              </div>
            </div>

            <!-- 称台控制按钮（已移除） -->
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { opcuaAPI, alarmRecordsAPI } from '../../services/api.js'
import { getCurrentSiteCode, getCurrentSite } from '@/utils/siteManager'

export default {
  name: 'DataDisplayModule',
  setup() {
    const loading = ref(false)
    const isResetPressed = ref(false)

    // 环境数据
    const environmentData = ref({
      insideTemp: 0,
      insideHumidity: 0,
      outsideTemp: 0,
      outsideHumidity: 0
    })

    // 水流数据
    const waterFlowData = ref({
      upstreamLevel: 125.6,    // 上流液位 cm
      downstreamLevel: 118.3,  // 下流液位 cm
      levelDifference: 7.3,    // 液位差 cm
      velocity: 1.25,          // 流速 m/s
      instantFlow: 32.8,       // 瞬时流量 m³/h
      temperature: 15.6,       // 水温 °C
      velocityTrend: 'stable',
      instantFlowTrend: 'up'
    })

    // 格栅电机数据（运行参数）
    const gratingMotorData = ref({
      status: 'running',
      speed: 25.6,           // 实时速度 m/min
      frequency: 50,         // 设定频率 Hz
      current: 12.5,         // 实时电流 A
      power: 7.8,            // 实时功率 Kw
      torque: 85,            // 实时转矩 %
      windingTemp: 68        // 绕组温度 °C
    })

    // 称台数据
    const scaleData = ref({
      grossWeight: 1248.5,    // 毛重 kg
      dailyTotalWeight: 8756.2, // 日总重 kg
      netWeight: 1186.3,      // 净重 kg
      totalWeight: 42851.7,   // 总重 kg
      status: 'normal',       // 称台状态
      isStable: true,         // 是否稳定
      lastUpdate: new Date().toLocaleTimeString() // 最后更新时间
    })

    // 系统控制数据
    const systemMode = ref('auto') // 'auto' | 'manual'
    const deviceMode = ref({
      isRemote: false,
      mode: 'local',
      available: false
    })
    const hasErrors = ref(false)
    const errorCount = ref(0)
    const gratingErrors = ref(false)
    const brushErrors = ref(false)
    const userSettings = ref({})
    const confirmingAlarms = ref(false)
    
    // 按钮按住状态跟踪
    const buttonPressed = ref({
      gratingStart: false,
      gratingStop: false,
      brushStart: false,
      brushStop: false,
      vibrationStart: false,
      vibrationStop: false,
      autoStart: false,
      autoStop: false
    })
    
    // 振动暂停按钮状态
    const vibratHaltActive = ref(false)
    
    // 参数设定数据（用于状态判断）
    const parameterThresholds = ref({
      alarmLevel: 200,        // 报警液位 (cm)
      alarmLevelDiff: 50,     // 报警液位差 (cm)
      alarmVelocity: 5.0,     // 报警流速 (m/s) - 默认值，如果参数设定中没有则使用此值
      alarmFlow: 100,         // 报警流量 (m³/h)
      tempMax: 45             // 环境温度上限 (°C) - 用于水温判断
    })
    
    // 计算属性：是否可以进行手动操作
    // 只需要满足：手动模式即可
    const canManualOperate = computed(() => {
      return systemMode.value === 'manual'
    })

    // 加载用户设置
    const loadUserSettings = async () => {
      try {
        // 假设token存储在localStorage中
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('未找到认证令牌');
          return;
        }

        const response = await fetch('/api/user-settings/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const settings = await response.json();
          userSettings.value = settings;
          console.log('用户设置加载成功:', settings);
        } else {
          console.error('加载用户设置失败:', response.statusText);
        }
      } catch (error) {
        console.error('加载用户设置时发生错误:', error);
      }
    };

    // 获取环境数据
    const loadEnvironmentData = async () => {
      try {
        const data = await opcuaAPI.getEnvironmentData();
        console.log('环境数据:', data);
        
        // 更新环境数据 - 修复0值被当作falsy的问题
        environmentData.value = {
          insideTemp: data.actIntTemp !== null && data.actIntTemp !== undefined ? data.actIntTemp : 24.5,
          insideHumidity: data.actIntRH !== null && data.actIntRH !== undefined ? data.actIntRH : 65,
          outsideTemp: data.actExtTemp !== null && data.actExtTemp !== undefined ? data.actExtTemp : 18.2,
          outsideHumidity: data.actExtRH !== null && data.actExtRH !== undefined ? data.actExtRH : 72
        };
      } catch (error) {
        console.error('获取环境数据失败:', error);
        // 使用模拟数据
        environmentData.value = {
          insideTemp: 24.5,
          insideHumidity: 65,
          outsideTemp: 18.2,
          outsideHumidity: 72
        };
      }
    };

    // 获取当前运行模式
    const loadCurrentMode = async () => {
      try {
        const modeData = await opcuaAPI.getCurrentMode();
        console.log('当前运行模式:', modeData);
        
        // 更新系统模式
        systemMode.value = modeData.mode;
      } catch (error) {
        console.warn('获取运行模式失败，使用默认值:', error);
        // 使用默认值
        systemMode.value = 'auto';
      }
    }
    
    // 更新设备模式（本地/远程）
    const updateDeviceMode = async () => {
      try {
        const modeData = await opcuaAPI.getModeStatus()
        deviceMode.value = {
          isRemote: modeData.isRemote || false,
          mode: modeData.mode || 'local',
          available: modeData.available || false
        }
      } catch (error) {
        console.error('获取设备模式失败:', error)
        deviceMode.value = {
          isRemote: false,
          mode: 'local',
          available: false
        }
      }
    };


    // 温度状态判断（柜内温度和柜外温度：过高>55，过低<5）
    const getTempStatus = (temp) => {
      if (temp > 55) return 'high'
      if (temp < 5) return 'low'
      return 'normal'
    }

    const getTempStatusText = (temp) => {
      if (temp > 55) return '过高'
      if (temp < 5) return '过低'
      return '正常'
    }

    // 柜内湿度状态判断（过高>80，过低<30）
    const getInsideHumidityStatus = (humidity) => {
      if (humidity > 80) return 'high'
      if (humidity < 30) return 'low'
      return 'normal'
    }

    const getInsideHumidityStatusText = (humidity) => {
      if (humidity > 80) return '过高'
      if (humidity < 30) return '过低'
      return '正常'
    }

    // 柜外湿度状态判断（过高>95，过低<30）
    const getOutsideHumidityStatus = (humidity) => {
      if (humidity > 95) return 'high'
      if (humidity < 30) return 'low'
      return 'normal'
    }

    const getOutsideHumidityStatusText = (humidity) => {
      if (humidity > 95) return '过高'
      if (humidity < 30) return '过低'
      return '正常'
    }

    // 加载参数设定数据（用于状态判断）
    const loadParameterThresholds = async () => {
      try {
        const siteCode = getCurrentSiteCode()
        if (!siteCode) {
          console.warn('未选择站点，使用默认阈值')
          return
        }
        
        const response = await opcuaAPI.readAllParameters(siteCode)
        const data = response?.data?.data || response?.data || response
        
        if (data) {
          // 更新报警阈值
          if (data.almLevelDopplerHigh !== undefined && data.almLevelDopplerHigh !== null) {
            parameterThresholds.value.alarmLevel = Number(data.almLevelDopplerHigh)
          }
          if (data.almLevelDiff !== undefined && data.almLevelDiff !== null) {
            parameterThresholds.value.alarmLevelDiff = Number(data.almLevelDiff)
          }
          // 注意：alarmVelocity 在参数设定页面中有，但没有对应的OPC UA节点保存
          // 如果需要从PLC读取，可能需要添加新的节点
          // 目前使用默认值 5.0
          if (data.almFlowLow !== undefined && data.almFlowLow !== null) {
            parameterThresholds.value.alarmFlow = Number(data.almFlowLow)
          }
          // 环境温度上限用于水温判断
          // 注意：参数设定中可能没有直接的水温上限，可以使用环境温度上限
          // 如果需要单独的水温上限，可能需要添加新的参数
        }
        console.log('✅ 参数阈值已加载:', parameterThresholds.value)
      } catch (error) {
        console.warn('加载参数阈值失败，使用默认值:', error)
      }
    }

    // 液位状态判断（使用参数设定中的报警液位阈值）
    const getLevelStatus = (level) => {
      const threshold = parameterThresholds.value.alarmLevel || 200
      if (level > threshold) return 'high'
      return 'normal'
    }

    const getLevelStatusText = (level) => {
      const threshold = parameterThresholds.value.alarmLevel || 200
      if (level > threshold) return '过高'
      return '正常'
    }

    // 液位差状态判断（使用参数设定中的报警液位差阈值）
    const getDifferenceStatus = (difference) => {
      const threshold = parameterThresholds.value.alarmLevelDiff || 50
      if (difference > threshold) return 'high'
      return 'normal'
    }

    const getDifferenceStatusText = (difference) => {
      const threshold = parameterThresholds.value.alarmLevelDiff || 50
      if (difference > threshold) return '过大'
      return '正常'
    }

    // 水温状态判断（使用参数设定中的环境温度上限）
    const getWaterTempStatus = (temp) => {
      const threshold = parameterThresholds.value.tempMax || 45
      if (temp > threshold) return 'high'
      return 'normal'
    }

    const getWaterTempStatusText = (temp) => {
      const threshold = parameterThresholds.value.tempMax || 45
      if (temp > threshold) return '过高'
      return '正常'
    }
    
    // 流速状态判断（使用参数设定中的报警流速阈值）
    const getVelocityStatus = (velocity) => {
      const threshold = parameterThresholds.value.alarmVelocity || 5.0
      if (velocity > threshold) return 'high'
      return 'normal'
    }

    const getVelocityStatusText = (velocity) => {
      const threshold = parameterThresholds.value.alarmVelocity || 5.0
      if (velocity > threshold) return '过高'
      return '正常'
    }
    
    // 瞬时流量状态判断（使用参数设定中的报警流量阈值）
    const getInstantFlowStatus = (flow) => {
      const threshold = parameterThresholds.value.alarmFlow || 100
      if (flow > threshold) return 'high'
      return 'normal'
    }

    const getInstantFlowStatusText = (flow) => {
      const threshold = parameterThresholds.value.alarmFlow || 100
      if (flow > threshold) return '过高'
      return '正常'
    }

    // 格式化数字为两位小数
    const formatTwoDecimals = (value) => {
      if (value === null || value === undefined || isNaN(value)) return '0.00'
      return Number(value).toFixed(2)
    }

    // 格栅电机状态判断函数
    const getSpeedStatus = (speed) => {
      if (speed > 30) return 'high'
      if (speed < 5) return 'low'
      return 'normal'
    }

    const getSpeedStatusText = (speed) => {
      if (speed > 30) return '过快'
      if (speed < 5) return '过慢'
      return '正常'
    }

    const getCurrentStatus = (current) => {
      if (current > 15) return 'high'
      if (current < 2) return 'low'
      return 'normal'
    }

    const getCurrentStatusText = (current) => {
      if (current > 15) return '过高'
      if (current < 2) return '过低'
      return '正常'
    }

    const getPowerStatus = (power) => {
      if (power > 10) return 'high'
      if (power < 1) return 'low'
      return 'normal'
    }

    const getPowerStatusText = (power) => {
      if (power > 10) return '过高'
      if (power < 1) return '过低'
      return '正常'
    }

    const getTorqueStatus = (torque) => {
      if (torque > 95) return 'high'
      if (torque < 20) return 'low'
      return 'normal'
    }

    const getTorqueStatusText = (torque) => {
      if (torque > 95) return '过高'
      if (torque < 20) return '过低'
      return '正常'
    }

    const getWindingTempStatus = (temp) => {
      if (temp > 80) return 'high'
      if (temp < 30) return 'low'
      return 'normal'
    }

    const getWindingTempStatusText = (temp) => {
      if (temp > 80) return '过热'
      if (temp < 30) return '过冷'
      return '正常'
    }

    // 毛刷电机状态判断函数
    const getBrushSpeedStatus = (speed) => {
      if (speed > 1400) return 'high'
      if (speed < 200 && speed > 0) return 'low'
      return 'normal'
    }

    const getBrushSpeedStatusText = (speed) => {
      if (speed > 1400) return '过快'
      if (speed < 200 && speed > 0) return '过慢'
      if (speed === 0) return '停止'
      return '正常'
    }

    const getBrushCurrentStatus = (current) => {
      if (current > 12) return 'high'
      if (current < 1 && current > 0) return 'low'
      return 'normal'
    }

    const getBrushCurrentStatusText = (current) => {
      if (current > 12) return '过高'
      if (current < 1 && current > 0) return '过低'
      if (current === 0) return '无电流'
      return '正常'
    }

    const getBrushTempStatus = (temp) => {
      if (temp > 70) return 'high'
      if (temp < 20) return 'low'
      return 'normal'
    }

    const getBrushTempStatusText = (temp) => {
      if (temp > 70) return '过热'
      if (temp < 20) return '过冷'
      return '正常'
    }

    const getBrushPowerStatus = (power) => {
      if (power > 8) return 'high'
      if (power < 0.5 && power > 0) return 'low'
      return 'normal'
    }

    const getBrushPowerStatusText = (power) => {
      if (power > 8) return '过高'
      if (power < 0.5 && power > 0) return '过低'
      if (power === 0) return '无功率'
      return '正常'
    }

    const getBrushMotorStatusText = (status) => {
      const statusMap = {
        running: '运行中',
        stopped: '已停止',
        maintenance: '维护中',
        fault: '故障',
        trip: '跳闸'
      }
      return statusMap[status] || '未知'
    }

    // 称台状态判断函数
    const getScaleStatus = (weight) => {
      if (weight > 2000) return 'high'
      if (weight < 100) return 'low'
      return 'normal'
    }

    const getScaleStatusText = (weight) => {
      if (weight > 2000) return '超重'
      if (weight < 100) return '轻载'
      return '正常'
    }

    const getScaleStatusLabel = (status) => {
      const statusMap = {
        normal: '正常',
        warning: '警告',
        error: '故障',
        maintenance: '维护'
      }
      return statusMap[status] || '未知'
    }

    // 电机状态文本
    const getMotorStatusText = (status) => {
      const statusMap = {
        running: '运行中',
        stopped: '已停止',
        maintenance: '维护中',
        fault: '故障'
      }
      return statusMap[status] || '未知'
    }

    // 格栅电机控制 - 保持数据不变
    const toggleGratingMotor = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 只切换状态，数据保持不变
        if (gratingMotorData.value.status === 'running') {
          gratingMotorData.value.status = 'stopped'
        } else {
          gratingMotorData.value.status = 'running'
        }
      } finally {
        loading.value = false
      }
    }

    const resetGratingMotor = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        // 复位操作，不改变数据
        console.log('格栅电机复位操作完成')
      } finally {
        loading.value = false
      }
    }

    // 毛刷电机控制 - 保持数据不变
    const toggleBrushMotor = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 只切换状态，数据保持不变
        if (brushMotorData.value.running) {
          brushMotorData.value.running = false
          brushMotorData.value.status = 'stopped'
        } else if (!brushMotorData.value.trip) {
          brushMotorData.value.running = true
          brushMotorData.value.status = 'running'
        }
      } finally {
        loading.value = false
      }
    }

    const resetBrushMotor = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        // 复位操作，不改变数据
        console.log('毛刷电机复位操作完成')
      } finally {
        loading.value = false
      }
    }

    // 其他电机控制 - 保持数据不变
    const toggleMotor = async (motorType) => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const motor = motorData.value[motorType]
        // 只切换状态，数据保持不变
        if (motor.status === 'running') {
          motor.status = 'stopped'
        } else {
          motor.status = 'running'
        }
      } finally {
        loading.value = false
      }
    }

    // 称台控制函数
    const resetScale = async (type) => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // 模拟清零操作，不实际改变数据
        console.log(`称台${type === 'daily' ? '日累计' : '总累计'}清零操作完成`)
      } finally {
        loading.value = false
      }
    }

    const calibrateScale = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        // 模拟校准操作
        console.log('称台校准操作完成')
      } finally {
        loading.value = false
      }
    }


    // 系统模式切换
    const switchToAutoMode = async () => {
      if (systemMode.value === 'auto') return // 如果已经是自动模式，不需要切换
      
      loading.value = true
      try {
        // 写入OPC UA变量：true表示自动模式
        await opcuaAPI.switchMode(true)
        console.log('✅ 已写入自动模式（true）到PLC')
        
        // 等待一小段时间让PLC处理
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 重新读取确认
        await loadCurrentMode()
        console.log('系统已切换到自动模式，当前模式:', systemMode.value)
      } catch (error) {
        console.error('切换到自动模式失败:', error)
        // 可以在这里添加错误提示
      } finally {
        loading.value = false
      }
    }

    const switchToManualMode = async () => {
      if (systemMode.value === 'manual') return // 如果已经是手动模式，不需要切换
      
      loading.value = true
      try {
        // 写入OPC UA变量：false表示手动模式
        await opcuaAPI.switchMode(false)
        console.log('✅ 已写入手动模式（false）到PLC')
        
        // 等待一小段时间让PLC处理
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 重新读取确认
        await loadCurrentMode()
        console.log('系统已切换到手动模式，当前模式:', systemMode.value)
      } catch (error) {
        console.error('切换到手动模式失败:', error)
        // 可以在这里添加错误提示
      } finally {
        loading.value = false
      }
    }

    // 手动操作控制 - 按住触发模式
    const manualGratingStart = async (value) => {
      if (systemMode.value !== 'manual') {
        if (value) ElMessage.warning('请先切换到手动模式')
        return
      }
      try {
        // 写入 OPC UA 节点: Gob_rotaryGrilleFor
        // value = true: 按下时写入 True
        // value = false: 松开时写入 False
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_rotaryGrilleFor'
        await opcuaAPI.writeNode(nodeId, value, 'Boolean')
        
        if (value) {
          gratingMotorData.value.status = 'running'
          console.log('✅ 格栅系统启动: Gob_rotaryGrilleFor = True (按住)')
        } else {
          gratingMotorData.value.status = 'stopped'
          console.log('✅ 格栅系统停止: Gob_rotaryGrilleFor = False (松开)')
        }
      } catch (error) {
        console.error('❌ 格栅系统操作失败:', error)
        if (value) {
          ElMessage.error('格栅系统启动失败：' + (error.message || '未知错误'))
        }
      }
    }

    const manualGratingStop = async (value) => {
      if (systemMode.value !== 'manual') {
        if (value) ElMessage.warning('请先切换到手动模式')
        return
      }
      try {
        // 写入 OPC UA 节点: Gob_rotaryGrilleFor
        // value = true: 按下时写入 False (停止信号)
        // value = false: 松开时写入 True (恢复)
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_rotaryGrilleFor'
        await opcuaAPI.writeNode(nodeId, !value, 'Boolean')
        
        if (value) {
          gratingMotorData.value.status = 'stopped'
          console.log('✅ 格栅系统停止: Gob_rotaryGrilleFor = False (按住)')
        } else {
          console.log('✅ 格栅系统停止信号释放: Gob_rotaryGrilleFor = True (松开)')
        }
      } catch (error) {
        console.error('❌ 格栅系统停止操作失败:', error)
        if (value) {
          ElMessage.error('格栅系统停止失败：' + (error.message || '未知错误'))
        }
      }
    }

    const manualBrushStart = async (value) => {
      if (systemMode.value !== 'manual') {
        if (value) ElMessage.warning('请先切换到手动模式')
        return
      }
      try {
        // 写入 OPC UA 节点: Gob_BrushMotor
        // value = true: 按下时写入 True
        // value = false: 松开时写入 False
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_BrushMotor'
        await opcuaAPI.writeNode(nodeId, value, 'Boolean')
        
        if (value) {
          brushMotorData.value.running = true
          brushMotorData.value.status = 'running'
          console.log('✅ 毛刷系统启动: Gob_BrushMotor = True (按住)')
        } else {
          brushMotorData.value.running = false
          brushMotorData.value.status = 'stopped'
          console.log('✅ 毛刷系统停止: Gob_BrushMotor = False (松开)')
        }
      } catch (error) {
        console.error('❌ 毛刷系统操作失败:', error)
        if (value) {
          ElMessage.error('毛刷系统启动失败：' + (error.message || '未知错误'))
        }
      }
    }

    const manualBrushStop = async (value) => {
      if (systemMode.value !== 'manual') {
        if (value) ElMessage.warning('请先切换到手动模式')
        return
      }
      try {
        // 写入 OPC UA 节点: Gob_BrushMotor
        // value = true: 按下时写入 False (停止信号)
        // value = false: 松开时写入 True (恢复)
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_BrushMotor'
        await opcuaAPI.writeNode(nodeId, !value, 'Boolean')
        
        if (value) {
          brushMotorData.value.running = false
          brushMotorData.value.status = 'stopped'
          console.log('✅ 毛刷系统停止: Gob_BrushMotor = False (按住)')
        } else {
          console.log('✅ 毛刷系统停止信号释放: Gob_BrushMotor = True (松开)')
        }
      } catch (error) {
        console.error('❌ 毛刷系统停止操作失败:', error)
        if (value) {
          ElMessage.error('毛刷系统停止失败：' + (error.message || '未知错误'))
        }
      }
    }

    const manualVibrationStart = async (value) => {
      if (systemMode.value !== 'manual') {
        if (value) ElMessage.warning('请先切换到手动模式')
        return
      }
      try {
        // 写入 OPC UA 节点: Gob_VibratMotor
        // value = true: 按下时写入 True
        // value = false: 松开时写入 False
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_VibratMotor'
        await opcuaAPI.writeNode(nodeId, value, 'Boolean')
        
        if (value) {
          motorData.value.vibration.status = 'running'
          console.log('✅ 振动系统启动: Gob_VibratMotor = True (按住)')
        } else {
          motorData.value.vibration.status = 'stopped'
          console.log('✅ 振动系统停止: Gob_VibratMotor = False (松开)')
        }
      } catch (error) {
        console.error('❌ 振动系统操作失败:', error)
        if (value) {
          ElMessage.error('振动系统启动失败：' + (error.message || '未知错误'))
        }
      }
    }

    const manualVibrationStop = async (value) => {
      if (systemMode.value !== 'manual') {
        if (value) ElMessage.warning('请先切换到手动模式')
        return
      }
      try {
        // 写入 OPC UA 节点: Gob_VibratMotor
        // value = true: 按下时写入 False (停止信号)
        // value = false: 松开时写入 True (恢复)
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_VibratMotor'
        await opcuaAPI.writeNode(nodeId, !value, 'Boolean')
        
        if (value) {
          motorData.value.vibration.status = 'stopped'
          console.log('✅ 振动系统停止: Gob_VibratMotor = False (按住)')
        } else {
          console.log('✅ 振动系统停止信号释放: Gob_VibratMotor = True (松开)')
        }
      } catch (error) {
        console.error('❌ 振动系统停止操作失败:', error)
        if (value) {
          ElMessage.error('振动系统停止失败：' + (error.message || '未知错误'))
        }
      }
    }

    // 排水泵控制函数
    const manualPumpStart = async () => {
      if (systemMode.value !== 'manual') {
        ElMessage.warning('请先切换到手动模式')
        return
      }
      loading.value = true
      try {
        // 写入 OPC UA 节点: Gob_pump = True
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_pump'
        await opcuaAPI.writeNode(nodeId, true, 'Boolean')
        
        ElMessage.success('排水泵启动成功')
        console.log('✅ 排水泵启动: Gob_pump = True')
      } catch (error) {
        console.error('❌ 排水泵启动失败:', error)
        ElMessage.error('排水泵启动失败：' + (error.message || '未知错误'))
      } finally {
        loading.value = false
      }
    }

    const manualPumpStop = async () => {
      if (systemMode.value !== 'manual') {
        ElMessage.warning('请先切换到手动模式')
        return
      }
      loading.value = true
      try {
        // 写入 OPC UA 节点: Gob_pump = False
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_IO.Gob_pump'
        await opcuaAPI.writeNode(nodeId, false, 'Boolean')
        
        ElMessage.success('排水泵停止成功')
        console.log('✅ 排水泵停止: Gob_pump = False')
      } catch (error) {
        console.error('❌ 排水泵停止失败:', error)
        ElMessage.error('排水泵停止失败：' + (error.message || '未知错误'))
      } finally {
        loading.value = false
      }
    }

    // 自动模式控制函数
    const handleAutoStart = async (value) => {
      if (systemMode.value !== 'auto' && !deviceMode.value.isRemote) {
        if (value) ElMessage.warning('仅在自动模式或远程模式下可用')
        return
      }
      try {
        // 写入 OPC UA 节点: GHb_startButton
        // value = true: 按下时写入 True
        // value = false: 松开时写入 False
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_startButton'
        await opcuaAPI.writeNode(nodeId, value, 'Boolean')
        
        if (value) {
          console.log('✅ 自动模式启动: GHb_startButton = True (按住)')
        } else {
          console.log('✅ 自动模式启动信号释放: GHb_startButton = False (松开)')
        }
      } catch (error) {
        console.error('❌ 自动模式启动操作失败:', error)
        if (value) {
          ElMessage.error('启动操作失败：' + (error.message || '未知错误'))
        }
      }
    }

    const handleAutoStop = async (value) => {
      if (systemMode.value !== 'auto' && !deviceMode.value.isRemote) {
        if (value) ElMessage.warning('仅在自动模式或远程模式下可用')
        return
      }
      try {
        // 写入 OPC UA 节点: GHb_stopLocal
        // value = true: 按下时写入 True
        // value = false: 松开时写入 False
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_stopLocal'
        await opcuaAPI.writeNode(nodeId, value, 'Boolean')
        
        if (value) {
          console.log('✅ 自动模式停止: GHb_stopLocal = True (按住)')
        } else {
          console.log('✅ 自动模式停止信号释放: GHb_stopLocal = False (松开)')
        }
      } catch (error) {
        console.error('❌ 自动模式停止操作失败:', error)
        if (value) {
          ElMessage.error('停止操作失败：' + (error.message || '未知错误'))
        }
      }
    }

    const handleVibratHalt = async () => {
      if (systemMode.value !== 'auto' && !deviceMode.value.isRemote) {
        ElMessage.warning('仅在自动模式或远程模式下可用')
        return
      }
      try {
        // 写入 OPC UA 节点: GHb_vibratHalt
        // 切换状态：如果当前是暂停状态(true)，则写入false；如果当前是未暂停状态(false)，则写入true
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_vibratHalt'
        const newValue = !vibratHaltActive.value
        await opcuaAPI.writeNode(nodeId, newValue, 'Boolean')
        
        // 立即更新本地状态
        vibratHaltActive.value = newValue
        
        if (newValue) {
          console.log('✅ 振动暂停: GHb_vibratHalt = True')
          ElMessage.success('振动已暂停')
        } else {
          console.log('✅ 振动恢复: GHb_vibratHalt = False')
          ElMessage.success('振动已恢复')
        }
        
        // 写入后立即读取状态确认（可选，用于同步PLC实际状态）
        await loadVibratHaltStatus()
      } catch (error) {
        console.error('❌ 振动暂停操作失败:', error)
        ElMessage.error('振动暂停操作失败：' + (error.message || '未知错误'))
      }
    }

    // 读取振动暂停状态
    const loadVibratHaltStatus = async () => {
      try {
        const nodeId = 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_vibratHalt'
        const dataValue = await opcuaAPI.readNode(nodeId)
        // readNode返回格式: { data: { value: ..., status: ..., ... } } 或直接 { value: ... }
        if (dataValue) {
          const value = dataValue.data?.value ?? dataValue.value
          if (value !== undefined) {
            vibratHaltActive.value = Boolean(value)
          }
        }
      } catch (error) {
        console.warn('读取振动暂停状态失败:', error)
      }
    }

    // 错误复位操作
    const resetAllErrors = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        hasErrors.value = false
        errorCount.value = 0
        gratingErrors.value = false
        brushErrors.value = false
        console.log('所有系统错误已复位')
      } finally {
        loading.value = false
      }
    }

    // 错误复位按钮按下
    const resetErrorPress = async () => {
      if (loading.value) return
      
      isResetPressed.value = true
      try {
        await opcuaAPI.resetError(true)
        console.log('错误复位按钮按下 - GHb_reset = TRUE')
      } catch (error) {
        console.error('写入GHb_reset失败:', error)
      }
    }

    // 错误复位按钮释放
    const resetErrorRelease = async () => {
      if (!isResetPressed.value) return
      
      isResetPressed.value = false
      try {
        await opcuaAPI.resetError(false)
        console.log('错误复位按钮释放 - GHb_reset = false')
      } catch (error) {
        console.error('写入GHb_reset失败:', error)
      }
    }

    // 确认所有报警
    const confirmAllAlarms = async () => {
      if (confirmingAlarms.value || loading.value) return
      
      const currentSite = getCurrentSite()
      if (!currentSite || !currentSite.id) {
        alert('当前未选择站点，无法确认报警')
        return
      }

      if (!confirm('确定要确认并清除当前站点的所有活跃报警吗？')) {
        return
      }

      confirmingAlarms.value = true
      loading.value = true
      
      try {
        // 调用清除站点所有活跃报警的接口
        await alarmRecordsAPI.clearBySiteId(currentSite.id)
        console.log(`✅ 已确认并清除站点 ${currentSite.id} 的所有活跃报警`)
        alert('报警确认成功！已清除的报警将不再显示在报警列表中。')
      } catch (error) {
        console.error('确认报警失败:', error)
        const errorMsg = error.response?.data?.message || error.message || '未知错误'
        alert(`确认报警失败：${errorMsg}`)
      } finally {
        confirmingAlarms.value = false
        loading.value = false
      }
    }


    // 模拟错误检测
    const checkSystemErrors = () => {
      // 模拟随机错误
      if (Math.random() < 0.1) { // 10% 概率出现错误
        hasErrors.value = true
        if (Math.random() < 0.5) {
          gratingErrors.value = true
        }
        if (Math.random() < 0.5) {
          brushErrors.value = true
        }
        errorCount.value = [gratingErrors.value, brushErrors.value].filter(Boolean).length
      }
    }

    onMounted(() => {

      // 加载环境数据
      loadEnvironmentData()
      
      // 加载当前运行模式
      loadCurrentMode()
      
      // 加载设备模式（本地/远程）
      updateDeviceMode()
      
      // 加载参数阈值（用于状态判断）
      loadParameterThresholds()
      
      // 加载水流数据
      loadWaterFlowData()
      
      // 加载电机运行参数数据
      loadMotorData()
      
      // 加载报警状态数据
      loadAlarmStatus()
      
      // 加载称重数据
      loadScaleData()
      
      // 加载振动暂停状态
      loadVibratHaltStatus()
      
      // 启动环境数据定时更新（每5秒）
      const environmentInterval = setInterval(loadEnvironmentData, 5000)
      
      // 启动运行模式定时更新（每10秒）
      const modeInterval = setInterval(loadCurrentMode, 10000)
      
      // 启动设备模式定时更新（每5秒）
      const deviceModeInterval = setInterval(updateDeviceMode, 5000)
      
      // 启动水流数据定时更新（每3秒）
      const waterFlowInterval = setInterval(loadWaterFlowData, 3000)
      
      // 启动电机数据定时更新（每2秒）
      const motorDataInterval = setInterval(loadMotorData, 2000)
      
      // 启动报警状态定时更新（每1秒，确保实时响应）
      const alarmStatusInterval = setInterval(loadAlarmStatus, 1000)
      
      // 启动称重数据定时更新（每2秒）
      const scaleDataInterval = setInterval(loadScaleData, 2000)

      // 启动振动暂停状态定时更新（每3秒）
      const vibratHaltInterval = setInterval(loadVibratHaltStatus, 3000)

      // 启动错误检测定时器
      const errorCheckInterval = setInterval(checkSystemErrors, 10000) // 每10秒检查一次
      
      // 启动参数阈值定时更新（每30秒，因为参数设定不经常变化）
      const parameterThresholdsInterval = setInterval(loadParameterThresholds, 30000)
      
      // 保存定时器ID用于清理
      onUnmounted(() => {
        clearInterval(environmentInterval)
        clearInterval(modeInterval)
        clearInterval(deviceModeInterval)
        clearInterval(waterFlowInterval)
        clearInterval(motorDataInterval)
        clearInterval(alarmStatusInterval)
        clearInterval(scaleDataInterval)
        clearInterval(errorCheckInterval)
        clearInterval(parameterThresholdsInterval)
      })
    })

    // 移除数据更新逻辑，保持数据静态显示
    // 初始化时不进行任何数据变化

    // 加载水流相关数据（尊重0值）
    const loadWaterFlowData = async () => {
      try {
        const all = await opcuaAPI.getAllPlcData();
        // 期望字段：actLevel, actLevelDoppler, actLiquidLevelDiff, actFlowVelocity, actFlow, actTemp, actNetWeight(若作为累计量)
        const next = { ...waterFlowData.value };
        if (all) {
          if (all.actLevel !== undefined && all.actLevel !== null) next.upstreamLevel = all.actLevel;
          if (all.actLevelDoppler !== undefined && all.actLevelDoppler !== null) next.downstreamLevel = all.actLevelDoppler;
          // levelDifference 直接从PLC读取
          if (all.actLiquidLevelDiff !== undefined && all.actLiquidLevelDiff !== null) {
            next.levelDifference = Number(Number(all.actLiquidLevelDiff).toFixed(1));
          }
          if (all.actFlowVelocity !== undefined && all.actFlowVelocity !== null) next.velocity = Number(Number(all.actFlowVelocity).toFixed(2));
          if (all.actFlow !== undefined && all.actFlow !== null) next.instantFlow = Number(Number(all.actFlow).toFixed(2));
          if (all.actTemp !== undefined && all.actTemp !== null) next.temperature = Number(Number(all.actTemp).toFixed(2));
        }
        waterFlowData.value = next;
      } catch (e) {
        console.warn('获取水流数据失败，保留现有显示:', e);
      }
    };

    // 加载电机运行参数数据
    const loadMotorData = async () => {
      try {
        const all = await opcuaAPI.getAllPlcData();
        const next = { ...gratingMotorData.value };
        if (all) {
          // 映射PLC数据到电机运行参数
          // 实时速度：直接使用 GHr_actFreq 的值
          if (all.actFreq !== undefined && all.actFreq !== null) {
            next.frequency = Number(all.actFreq.toFixed(1));
            next.speed = Number(all.actFreq.toFixed(1)); // 实时速度直接使用 actFreq 的值
          }
          if (all.getFreq !== undefined && all.getFreq !== null) next.setFrequency = Number(all.getFreq.toFixed(1));
          if (all.actCurrent !== undefined && all.actCurrent !== null) next.current = Number(all.actCurrent.toFixed(1));
          if (all.actPower !== undefined && all.actPower !== null) next.power = Number(all.actPower.toFixed(1));
          if (all.actTorqor !== undefined && all.actTorqor !== null) next.torque = Number(all.actTorqor.toFixed(1));
          if (all.actMotorColiTemp !== undefined && all.actMotorColiTemp !== null) next.windingTemp = Number(all.actMotorColiTemp.toFixed(1));
        }
        gratingMotorData.value = next;
      } catch (e) {
        console.warn('获取电机数据失败，保留现有显示:', e);
      }
    };

    // 加载报警状态数据（已简化，仅保留运行参数需要的状态）
    const loadAlarmStatus = async () => {
      try {
        const all = await opcuaAPI.getAllPlcData();
        if (all) {
          // 更新格栅电机运行状态
          if (all.rotaryGrilleFor !== undefined) {
            const runningStatus = Boolean(all.rotaryGrilleFor);
            gratingMotorData.value.status = runningStatus ? 'running' : 'stopped';
          }
        }
      } catch (e) {
        console.warn('获取报警状态失败:', e);
      }
    };

    // 加载称重数据
    const loadScaleData = async () => {
      try {
        const all = await opcuaAPI.getAllPlcData();
        const next = { ...scaleData.value };
        if (all) {
          // 映射PLC数据到称重数据
          // 毛重：使用 Ghr_actTareWeight
          if (all.actTareWeight !== undefined && all.actTareWeight !== null) {
            next.grossWeight = Number(all.actTareWeight.toFixed(1));
            console.log('✅ 毛重更新:', next.grossWeight, 'kg (来自 actTareWeight)');
          }
          // 净重
          if (all.actNetWeight !== undefined && all.actNetWeight !== null) {
            next.netWeight = Number(all.actNetWeight.toFixed(1));
          }
          // 日总重：使用 GHr_totalWeightDay
          if (all.totalWeightDay !== undefined && all.totalWeightDay !== null) {
            next.dailyTotalWeight = Number(all.totalWeightDay.toFixed(1));
            console.log('✅ 日总重更新:', next.dailyTotalWeight, 'kg (来自 totalWeightDay)');
          }
          // 总重：使用 GHr_totalWeight
          if (all.totalWeight !== undefined && all.totalWeight !== null) {
            next.totalWeight = Number(all.totalWeight.toFixed(1));
            console.log('✅ 总重更新:', next.totalWeight, 'kg (来自 totalWeight)');
          }
          
          // 更新最后更新时间
          next.lastUpdate = new Date().toLocaleTimeString();
        }
        scaleData.value = next;
      } catch (e) {
        console.warn('获取称重数据失败，保留现有显示:', e);
      }
    };

    return {
      loading,
      environmentData,
      waterFlowData,
      gratingMotorData,
      scaleData,
      getTempStatus,
      getTempStatusText,
      getInsideHumidityStatus,
      getInsideHumidityStatusText,
      getOutsideHumidityStatus,
      getOutsideHumidityStatusText,
      getLevelStatus,
      getLevelStatusText,
      getDifferenceStatus,
      getDifferenceStatusText,
      getWaterTempStatus,
      getWaterTempStatusText,
      getVelocityStatus,
      getVelocityStatusText,
      getInstantFlowStatus,
      getInstantFlowStatusText,
      formatTwoDecimals,
      getSpeedStatus,
      getSpeedStatusText,
      getCurrentStatus,
      getCurrentStatusText,
      getPowerStatus,
      getPowerStatusText,
      getTorqueStatus,
      getTorqueStatusText,
      getWindingTempStatus,
      getWindingTempStatusText,
      getScaleStatus,
      getScaleStatusText,
      getScaleStatusLabel,
      manualVibrationStop,
      resetAllErrors,
      resetErrorPress,
      resetErrorRelease,
      isResetPressed,
      confirmAllAlarms,
      confirmingAlarms,
      loadWaterFlowData,
      loadMotorData,
      loadScaleData,
      handleAutoStart,
      handleAutoStop,
      handleVibratHalt,
      loadVibratHaltStatus,
      vibratHaltActive
    }
  }
}
</script>

<style scoped>
.data-display-module {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 6px;
  padding: 6px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.environment-section {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.environment-panel,
.device-panel,
.motor-panel,
.chart-panel {
  padding: 6px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.environment-panel::before,
.device-panel::before,
.motor-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0.8;
}

.environment-panel:hover,
.device-panel:hover,
.motor-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
  justify-content: space-between;
  flex-shrink: 0;
}

.panel-title svg {
  width: 14px;
  height: 14px;
}

.panel-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.panel-title .title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}


.panel-content {
  color: #666;
  flex: 1;
  min-height: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
}

/* 环境数据样式 */
.environment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  flex: 1;
}

.env-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 5px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.env-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.env-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
  border-color: rgba(102, 126, 234, 0.2);
}

.env-item:hover::before {
  opacity: 1;
}

.env-icon {
  flex-shrink: 0;
  color: #667eea;
}

.env-info {
  flex: 1;
}

.env-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.env-value {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 2px;
}

.env-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.env-status.normal {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.env-status.high {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.env-status.low {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

/* 设备控制区域 */
.device-section {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 水流数据样式 */
.water-flow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  flex: 1;
}

.flow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 6px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 5px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.flow-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.flow-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
  border-color: rgba(102, 126, 234, 0.2);
}

.flow-item:hover::before {
  opacity: 1;
}

.flow-icon {
  color: #3498db;
}

.flow-info {
  text-align: center;
}

.flow-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.flow-value {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 3px;
}

.flow-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.flow-trend.up {
  color: #27ae60;
}

.flow-trend.down {
  color: #e74c3c;
}

.flow-trend.stable {
  color: #95a5a6;
}

.flow-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.flow-status.normal {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.flow-status.high {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.flow-status.low {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

/* 电机控制区域 - 已在上面定义 */

.motor-control {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.motor-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.running {
  background: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2);
}

.status-dot.stopped {
  background: #95a5a6;
}

.status-dot.fault {
  background: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

.status-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.motor-params {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.param-item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.param-label {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.param-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.motor-controls {
  display: flex;
  justify-content: center;
}

/* 运行参数样式 */
.motor-params-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  flex: 1;
}

.motor-params-grid .param-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.motor-params-grid .param-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.motor-params-grid .param-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.motor-params-grid .param-item:hover::before {
  opacity: 1;
}

.motor-params-grid .param-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 3px;
}

.motor-params-grid .param-value {
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 3px;
  letter-spacing: -0.2px;
}

.motor-params-grid .param-status {
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: 600;
  align-self: flex-start;
  letter-spacing: 0.2px;
  margin-top: auto;
}

/* 状态标签颜色样式 */
.motor-params-grid .param-status.normal {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.15), rgba(39, 174, 96, 0.15));
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.motor-params-grid .param-status.high {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.15), rgba(192, 57, 43, 0.15));
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.motor-params-grid .param-status.low {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(41, 128, 185, 0.15));
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

/* 状态指示灯样式 */
.status-lights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.status-light {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  min-height: 60px;
}

.status-light.active {
  background: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

.status-light.alert {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  animation: pulse-alert 2s infinite;
}

.light-indicator {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #666;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.light-dot::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 20%;
  width: 30%;
  height: 30%;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.status-light.active .light-dot::before {
  opacity: 1;
}

/* 不同类型指示灯的颜色和效果 */
.status-light.active .light-indicator.breathing .light-dot {
  background: #27ae60;
  color: #27ae60;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2);
}

.status-light.active .light-indicator.moisture .light-dot {
  background: #27ae60;
  color: #27ae60;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2);
}

.status-light.active .light-indicator.cooling .light-dot {
  background: #27ae60;
  color: #27ae60;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2);
}

.status-light.active .light-indicator.trip .light-dot {
  background: #e74c3c;
  color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
}

.status-light.active .light-indicator.overload .light-dot {
  background: #e74c3c;
  color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
}

.status-light.active .light-indicator.overtemp .light-dot {
  background: #e74c3c;
  color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.4);
}

.status-light.active .light-indicator.overspeed .light-dot {
  background: #e74c3c;
  color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.3);
}

.light-label {
  font-size: 11px;
  color: #333;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

.motor-status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* 动画效果 */
@keyframes breathing {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 8px currentColor;
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
    box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
  }
}

@keyframes breathing-fast {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 8px currentColor;
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

@keyframes breathing-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
    box-shadow: 0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor;
  }
}

@keyframes pulse-alert {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* 毛刷电机简化样式 */
.brush-motor-simple {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-section {
  flex: 1;
}

.brush-controls-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.status-indicators {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.status-item.active {
  background: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

.status-item.alert {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  animation: pulse-alert 2s infinite;
}

.status-light {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-item.active .status-light.running .light-dot {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #2ecc71;
  animation: breathing 2.5s ease-in-out infinite;
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
}

.status-item.active .status-light.trip .light-dot {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: #e74c3c;
  animation: breathing-glow 1s ease-in-out infinite;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.4);
}

.status-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}



.motor-status-display {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.control-buttons {
  display: flex;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #229954 0%, #27ae60 100%);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.control-btn.secondary {
  background: #95a5a6;
  color: white;
}

.control-btn.warning {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
}

.control-btn.warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.control-btn.disabled-red {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  opacity: 0.8;
  cursor: not-allowed;
}

.control-btn.disabled-red:hover {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  transform: none;
  box-shadow: none;
}

.control-btn.info {
  background: #3498db;
  color: white;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 按钮按住状态样式 - 更明显的视觉效果 */
.control-btn.pressed {
  transform: scale(0.92) translateY(2px);
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.4), 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 0 16px rgba(0, 0, 0, 0.3),
              0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0.85;
  border: 2px solid rgba(255, 255, 255, 0.3);
  filter: brightness(0.9);
}

.control-btn.pressed.primary {
  background: linear-gradient(135deg, #1e8449 0%, #229954 100%);
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.4), 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(39, 174, 96, 0.8),
              0 0 40px rgba(39, 174, 96, 0.4),
              0 4px 12px rgba(39, 174, 96, 0.5);
  border: 2px solid rgba(39, 174, 96, 0.6);
  filter: brightness(0.85);
}

.control-btn.pressed.warning {
  background: linear-gradient(135deg, #d35400 0%, #c0392b 100%);
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.4), 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(243, 156, 18, 0.8),
              0 0 40px rgba(243, 156, 18, 0.4),
              0 4px 12px rgba(243, 156, 18, 0.5);
  border: 2px solid rgba(243, 156, 18, 0.6);
  filter: brightness(0.85);
}

/* 自动模式控制按钮样式 */
.auto-control-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 振动暂停按钮激活状态 */
.control-btn.info.active {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.8),
              0 0 40px rgba(52, 152, 219, 0.4),
              0 4px 12px rgba(52, 152, 219, 0.5);
  border: 2px solid rgba(52, 152, 219, 0.8);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(52, 152, 219, 0.8),
                0 0 40px rgba(52, 152, 219, 0.4),
                0 4px 12px rgba(52, 152, 219, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(52, 152, 219, 1),
                0 0 60px rgba(52, 152, 219, 0.6),
                0 4px 16px rgba(52, 152, 219, 0.7);
  }
}

.water-level-control {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.water-level-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.level-gauge {
  position: relative;
  width: 40px;
  height: 200px;
  background: #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
}

.level-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: #f0f0f0;
}

.level-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #3498db, #2ecc71);
  transition: height 0.5s ease;
  border-radius: 0 0 20px 20px;
}

.level-markers {
  position: absolute;
  right: -80px;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
}

.marker {
  font-size: 12px;
  color: #666;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.level-info {
  flex: 1;
  text-align: center;
}

.level-value {
  font-size: 36px;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 8px;
}

.level-status {
  font-size: 16px;
  color: #666;
}

.level-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.system-controls {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.system-panel {
  padding: 24px;
}

.system-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.system-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.system-btn.large {
  min-height: 80px;
}

.system-btn.primary {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
}

.system-btn.warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.system-btn.danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.system-btn.secondary {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  color: white;
}

.system-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.system-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-content {
  flex: 1;
}

.btn-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.btn-desc {
  font-size: 12px;
  opacity: 0.9;
}

.operation-log {
  padding: 24px;
}

.log-list {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  font-size: 12px;
  color: #999;
  min-width: 80px;
}

.log-content {
  flex: 1;
}

.log-action {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.log-result {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.log-result.success {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.log-result.warning {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

.log-result.error {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.log-operator {
  font-size: 12px;
  color: #666;
  min-width: 60px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .data-display-module {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr;
  }
  
  .environment-section {
    grid-column: 1;
    grid-row: 1;
  }
  
  .device-section {
    grid-column: 1;
    grid-row: 2;
  }
  
  .motor-section {
    grid-column: 1;
    grid-row: 3;
  }
  
  .scale-section {
    grid-column: 1;
    grid-row: 4;
  }
  
  .chart-section {
    grid-column: 1;
    grid-row: 5;
  }
}

@media (max-width: 768px) {
  .data-display-module {
    height: calc(100vh - 100px);
    gap: 8px;
    padding: 8px;
  }
  
  .environment-grid {
    grid-template-columns: 1fr;
  }
  
  .water-flow-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .motor-section {
    grid-template-columns: 1fr;
  }
  
  .motor-section .motor-panel:first-child {
    grid-column: 1;
  }
  
  .motor-section .motor-panel:last-child {
    grid-column: 1;
  }
  
  .motor-section {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "grating"
      "scale";
  }
  
  .motor-params {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .env-value {
    font-size: 20px;
  }
  
  .flow-value {
    font-size: 18px;
  }
}

@media (max-width: 900px) {
  .status-lights-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  
  .status-light {
    min-height: 65px;
  }
}

@media (max-width: 768px) {
  .motor-params-grid {
    grid-template-columns: 1fr;
  }
}

.compact-status-row .status-item.active .status-light.trip .light-dot {
  background: #95a5a6;
  color: #95a5a6;
  box-shadow: 0 0 0 1px rgba(149, 165, 166, 0.4);
  animation: none;
}

/* 默认信号灯为灰色，运行时为绿色，跳闸也用灰色显示 */
.compact-status-row .status-light .light-dot {
  background: #95a5a6;
  color: #95a5a6;
  box-shadow: 0 0 0 1px rgba(149, 165, 166, 0.3);
  animation: none;
}

.compact-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.control-btn.compact {
  padding: 6px 12px;
  font-size: 13px;
  min-width: auto;
}


/* 称台模块样式 */
.scale-module {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-height: 0;
  overflow: visible;
  height: 100%;
}

.scale-status-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.scale-status-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stable-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(149, 165, 166, 0.1);
  color: #95a5a6;
}

.stable-indicator.active {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.last-update {
  font-size: 12px;
  color: #666;
}

.scale-data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  flex: 1;
  min-height: 0;
  overflow: visible;
}

@media (min-width: 1200px) {
  .scale-data-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .scale-data-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 5px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 60px;
}

@media (max-width: 768px) {
  .weight-item {
    padding: 5px;
    gap: 5px;
  }
}

.weight-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.weight-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
  border-color: rgba(102, 126, 234, 0.2);
}

.weight-item:hover::before {
  opacity: 1;
}

.weight-icon {
  flex-shrink: 0;
  color: #9b59b6;
}

.weight-info {
  flex: 1;
}

.weight-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 3px;
}

.weight-value {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 2px;
  word-break: break-word;
}

@media (max-width: 768px) {
  .weight-value {
    font-size: 12px;
  }
}

.weight-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.weight-status.normal {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.weight-status.high {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.weight-status.low {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.scale-controls-section {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.scale-controls-section .control-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 480px) {
  .water-flow-grid {
    grid-template-columns: 1fr;
  }
  
  .motor-params {
    grid-template-columns: 1fr;
  }
  
  .scale-data-grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  
  .scale-controls-section .control-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .scale-controls-section .control-btn {
    width: 100%;
  }
}

/* 图表模块样式 */
.chart-section {
  grid-column: 2 / 4;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: visible;
}

.chart-container {
  flex: 0 0 auto;
  height: 140px;
  margin-bottom: 5px;
}

.weight-chart {
  width: 100%;
  height: 100%;
  background: #f8fafc;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  padding-top: 5px;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
  min-height: 60px;
  overflow: visible;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px;
  background: #f8fafc;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  min-height: 45px;
}

.summary-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.summary-label {
  font-size: 11px;
  color: #666;
  font-weight: 500;
}

.summary-value {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

/* 响应式图表样式 */
@media (max-width: 768px) {
  .weight-chart {
    min-height: 150px;
  }
  
  .chart-summary {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .summary-item {
    padding: 12px;
  }
  
  .summary-value {
    font-size: 18px;
  }
}

/* 系统操作控制模块样式 */
.system-control-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.system-control-panel {
  padding: 24px;
}

.control-modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.control-module {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

/* 模式切换样式 */
.mode-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.mode-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mode-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mode-option.clickable {
  cursor: pointer;
  user-select: none;
}

.mode-option.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.mode-option.clickable:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.mode-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.mode-icon {
  color: #667eea;
}

.mode-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.mode-status {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.mode-status.active {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.mode-status.inactive {
  background: rgba(149, 165, 166, 0.1);
  color: #95a5a6;
}


/* 手动操作样式 */
.manual-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.system-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.system-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.system-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.system-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.grating-system .system-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.brush-system .system-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.vibration-system .system-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.pump-system .system-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.system-info {
  flex: 1;
}

.system-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.system-desc {
  font-size: 14px;
  color: #718096;
  margin: 0;
  line-height: 1.4;
}

.control-buttons {
  display: flex;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  min-height: 44px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 错误复位样式 */
.error-reset-controls,
.alarm-confirm-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reset-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.reset-info:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
}

.info-text {
  flex: 1;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.info-desc {
  font-size: 14px;
  color: #718096;
  margin: 0;
  line-height: 1.4;
}

.error-status {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.error-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2ecc71;
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
}

.error-indicator.active .error-dot {
  background: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
  animation: pulse-alert 2s infinite;
}

.error-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.error-count {
  font-size: 12px;
  color: #e74c3c;
  font-weight: 500;
}

.reset-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.15s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-height: 48px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reset-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn.pressed {
  transform: scale(0.92) translateY(2px);
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.4), 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 0 20px rgba(231, 76, 60, 0.8),
              0 0 40px rgba(231, 76, 60, 0.4),
              0 4px 12px rgba(231, 76, 60, 0.5);
  background: linear-gradient(135deg, #a93226 0%, #922b21 100%);
  border: 2px solid rgba(231, 76, 60, 0.6);
  filter: brightness(0.85);
  opacity: 0.9;
}

.btn.danger {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.btn.danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .control-modules {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .mode-switch {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .mode-option {
    padding: 16px;
  }
  
  .control-buttons {
    flex-direction: column;
  }
  
  .reset-buttons {
    flex-direction: column;
  }
  
}
</style>
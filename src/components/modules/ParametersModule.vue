<template>
  <div class="parameters-module">
    <div class="parameter-sections">
      <!-- 速度参数 -->
      <div class="parameter-section card fade-in-up">
        <h3 class="section-title">速度参数设定</h3>
        <div class="parameter-form">
          <div class="form-row">
            <div class="form-group">
              <label>速度上限 (m/min)</label>
              <input v-model.number="speedParams.maxSpeed" :disabled="!canEdit('maxSpeed')" type="number" step="0.1" class="input-field" />
            </div>
            <div class="form-group">
              <label>速度下限 (m/min)</label>
              <input v-model.number="speedParams.minSpeed" :disabled="!canEdit('minSpeed')" type="number" step="0.1" class="input-field" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>手动速度 (m/min)</label>
              <input v-model.number="speedParams.manualSpeed" :disabled="!canEdit('manualSpeed')" type="number" step="0.1" class="input-field" />
            </div>
            <div class="form-group">
              <label>报警速度 (m/min)</label>
              <input v-model.number="speedParams.alarmSpeed" :disabled="!canEdit('alarmSpeed')" type="number" step="0.1" class="input-field" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>液位差 (cm)</label>
              <input v-model.number="speedParams.levelDifference" :disabled="!canEdit('levelDifference')" type="number" step="0.1" class="input-field" />
            </div>
            <div class="form-group">
              <label>液位上限 (cm)</label>
              <input v-model.number="speedParams.levelMax" :disabled="!canEdit('levelMax')" type="number" step="0.1" class="input-field" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>调速P</label>
              <input v-model.number="speedParams.controlP" :disabled="!canEdit('controlP')" type="number" step="0.01" class="input-field" />
            </div>
            <div class="form-group">
              <label>调速I</label>
              <input v-model.number="speedParams.controlI" :disabled="!canEdit('controlI')" type="number" step="0.01" class="input-field" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>调速D</label>
              <input v-model.number="speedParams.controlD" :disabled="!canEdit('controlD')" type="number" step="0.01" class="input-field" />
            </div>
            <div class="form-group">
              <!-- 空占位 -->
            </div>
          </div>
        </div>
      </div>

                  <!-- 绕组加热参数 -->
      <div class="parameter-section card fade-in-up" style="animation-delay: 0.1s">
        <h3 class="section-title">绕组加热参数设定</h3>
        <div class="parameter-form">
          <div class="form-row">
            <div class="form-group">
              <label>开始加热温度 (°C)</label>
              <input v-model.number="heatingParams.startTemp" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="5" />
            </div>
            <div class="form-group">
              <label>停止加热温度 (°C)</label>
              <input v-model.number="heatingParams.stopTemp" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="15" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>报警温度 (°C)</label>
              <input v-model.number="heatingParams.alarmTemp" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="80" />
            </div>
            <div class="form-group">
              <label>绕组加热状态</label>
              <button 
                class="status-button" 
                :class="heatingParams.isRunning ? 'status-running' : 'status-stopped'"
                :disabled="!isRootOrAdmin"
                @click="isRootOrAdmin && toggleHeatingStatus()"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle v-if="heatingParams.isRunning" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                  <circle v-else cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ heatingParams.isRunning ? '已启动' : '未启动' }}
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- 延时参数 -->
      <div class="parameter-section card fade-in-up" style="animation-delay: 0.2s">
        <h3 class="section-title">延时参数设定</h3>
        <div class="parameter-form">
          <div class="form-row">
            <div class="form-group">
              <label>运行延时 (s)</label>
              <input v-model.number="delayParams.startDelay" :disabled="!isRootOrAdmin" type="number" class="input-field" placeholder="30" />
            </div>
            <div class="form-group">
              <label>停止延时 (min)</label>
              <input v-model.number="delayParams.stopDelay" :disabled="!isRootOrAdmin" type="number" class="input-field" placeholder="1" />
            </div>
          </div>
        </div>
      </div>

      <!-- 电机散热参数 -->
      <div class="parameter-section card fade-in-up" style="animation-delay: 0.3s">
        <h3 class="section-title">电机散热参数设定</h3>
        <div class="parameter-form">
          <div class="form-row">
            <div class="form-group">
              <label>开始散热温度 (°C)</label>
              <input v-model.number="coolingParams.startTemp" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="80" />
            </div>
            <div class="form-group">
              <label>停止散热温度 (°C)</label>
              <input v-model.number="coolingParams.stopTemp" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="70" />
            </div>
          </div>
        </div>
      </div>

      <!-- 流体参数 -->
      <div class="parameter-section card fade-in-up" style="animation-delay: 0.4s">
        <h3 class="section-title">流体参数设定</h3>
        <div class="parameter-form">
          <div class="form-row">
            <div class="form-group">
              <label>报警液位差 (cm)</label>
              <input v-model.number="fluidParams.alarmLevelDiff" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="50" />
            </div>
            <div class="form-group">
              <label>报警液位 (cm)</label>
              <input v-model.number="fluidParams.alarmLevel" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="200" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>报警流量 (m³/h)</label>
              <input v-model.number="fluidParams.alarmFlow" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="100" />
            </div>
          </div>
        </div>
      </div>

      <!-- 环境参数 -->
      <div class="parameter-section card fade-in-up" style="animation-delay: 0.5s">
        <h3 class="section-title">环境参数设定</h3>
        <div class="parameter-form">
          <div class="form-row">
            <div class="form-group">
              <label>环境温度上限 (°C)</label>
              <input v-model.number="environmentParams.tempMax" type="number" step="0.1" class="input-field" />
            </div>
            <div class="form-group">
              <label>环境温度下限 (°C)</label>
              <input v-model.number="environmentParams.tempMin" type="number" step="0.1" class="input-field" />
            </div>
          </div>
            <div class="form-row">
              <div class="form-group">
              <label>湿度上限 (%)</label>
              <input v-model.number="environmentParams.humidityMax" type="number" class="input-field" />
              </div>
              <div class="form-group">
              <label>湿度下限 (%)</label>
              <input v-model.number="environmentParams.humidityMin" type="number" class="input-field" />
            </div>
          </div>
        </div>
      </div>

      <!-- 容器重量参数 -->
      <div class="parameter-section card fade-in-up" style="animation-delay: 0.6s">
        <h3 class="section-title">容器重量参数设定</h3>
        <div class="parameter-form">
          <div class="form-row">
            <div class="form-group">
              <label>容器重量 (kg)</label>
              <input v-model.number="containerParams.weight" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="1000" />
            </div>
            <div class="form-group">
              <label>警示重量 (kg)</label>
              <input v-model.number="containerParams.warningWeight" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="800" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>报警重量 (kg)</label>
              <input v-model.number="containerParams.alarmWeight" :disabled="!isRootOrAdmin" type="number" step="0.1" class="input-field" placeholder="500" />
            </div>
            <div class="form-group">
              <!-- 空占位 -->
            </div>
          </div>
        </div>
      </div>

      <!-- 报警测试 -->
      <div class="parameter-section card fade-in-up" style="animation-delay: 0.7s">
        <h3 class="section-title">报警测试</h3>
        <div class="alarm-test-panel">
          <p class="alarm-test-desc">
            按住下方按钮，会向当前站点的 <code>IntTempHumidityCommError</code> 节点写入 True，松开写入 False，用于快速验证报警链路。
          </p>
          <button
            class="alarm-test-button"
            :class="{ active: alarmTestActive }"
            :disabled="!currentSiteCode || alarmTestSending"
            @mousedown.prevent="handleAlarmTestPress"
            @mouseup.prevent="handleAlarmTestRelease"
            @mouseleave="handleAlarmTestCancel"
            @touchstart.prevent="handleAlarmTestPress"
            @touchend.prevent="handleAlarmTestRelease"
            @touchcancel.prevent="handleAlarmTestCancel"
          >
            {{ alarmTestActive ? '测试进行中...' : '按住触发报警测试' }}
          </button>
          <p class="alarm-test-hint">
            当前站点：{{ currentSiteCode || '未选择' }} · 状态：{{ alarmTestActive ? '已触发' : '未触发' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 保存操作 -->
    <div class="save-section card fade-in-up" style="animation-delay: 0.8s">
      <div class="save-actions">
        <button @click="saveParameters" class="btn primary large" :disabled="loading || isObserver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ loading ? '保存中...' : '保存所有参数' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onActivated, onUnmounted, computed } from 'vue'
import { opcuaAPI } from '../../services/api.js'
import { getCurrentSiteCode, onSiteChange } from '@/utils/siteManager'

export default {
  name: 'ParametersModule',
  setup() {
    const loading = ref(false)
    const currentSiteCode = ref(getCurrentSiteCode()) // 获取当前站点代码
    const role = ref((() => {
      const toRole = (val) => {
        if (!val) return null
        const s = val.toString()
        const low = s.toLowerCase()
        if (["root","admin","operator","observer"].includes(low)) return low
        const up = s.toUpperCase()
        const map = { ROOT: 'root', ADMIN: 'admin', OPERATOR: 'operator', OBSERVER: 'observer' }
        return map[up] || null
      }
      try {
        const ui = JSON.parse(localStorage.getItem('userInfo') || 'null')
        const r = toRole(ui && (ui.role || ui.user_group)) || toRole(localStorage.getItem('role'))
        return r || 'observer'
      } catch { return 'observer' }
    })())
    const isRootOrAdmin = computed(() => role.value === 'root' || role.value === 'admin')
    const isOperator = computed(() => role.value === 'operator')
    const isObserver = computed(() => role.value === 'observer')
    const canEdit = (fieldKey) => {
      if (isRootOrAdmin.value) return true
      if (isObserver.value) return false
      return fieldKey === 'manualSpeed'
    }
    
    const speedParams = ref({
      maxSpeed: 300,
      minSpeed: 10,
      manualSpeed: 150,
      alarmSpeed: 280,
      levelDifference: 50,
      levelMax: 200,
      controlP: 1.0,
      controlI: 0.1,
      controlD: 0.01
    })

    const heatingParams = ref({
      startTemp: 5,
      stopTemp: 15,
      alarmTemp: 80,
      isRunning: false
    })

    const delayParams = ref({
      startDelay: 30,  // 秒
      stopDelay: 1     // 分钟
    })

    const coolingParams = ref({
      startTemp: 80,
      stopTemp: 70
    })

    const fluidParams = ref({
      alarmLevelDiff: 50,
      alarmLevel: 200,
      alarmFlow: 100
    })

    const environmentParams = ref({
      tempMax: 45,
      tempMin: -10,
      humidityMax: 80,
      humidityMin: 30
    })

    const containerParams = ref({
      weight: 1000,
      warningWeight: 800,
      alarmWeight: 500
    })

    const alarmTestActive = ref(false)
    const alarmTestSending = ref(false)
    const alarmTestPendingState = ref(null)

    // OPC UA 节点映射（与 OpcuaClient/nodes.json 保持一致）
    const opcNodes = {
      setVelocityHighLimit: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setVelocityHighLimit',
      setMVelocity: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setMVelocity',
      setVelocityAlm: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setVelocityAlm',
      setVelocityLowLimit: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setVelocityLowLimit',
      setLiquidLevelDiff: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setLiquidLevelDiff',
      setP: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setP',
      setI: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setI',
      setD: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_setD',
      motorColiHeatTemp: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_MotorColiHeatTemp',
      motorColiStopTemp: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_MotorColiStopTemp',
      motorColiAlmTemp: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_MotorColiAlmTemp',
      motorColiCoolStartTemp: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_MotorColiCoolStartTemp',
      motorColiCoolStopTemp: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_MotorColiCoolStopTemp',
      almLevelDiff: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_almLevelDiff',
      almLevelDopplerHigh: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_almLevelDopplerHigh',
      almFlowLow: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_almFlowLow',
      pumpRunTime: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_pumpRunTime',
      pumpStopTime: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHr_pumpStopTime',
      setMaxTareWeight: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.Ghr_setMaxTareWeight',
      setWarnWeight: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.Ghr_setWarnWeight',
      setAlarmNetWeight: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.Ghr_setAlarmNetWeight',
      hartEn: 'ns=4;s=|var|Inovance-ARM-Linux.Application.GVL_HMI.GHb_hartEn'
    }

    const toggleHeatingStatus = () => {
      heatingParams.value.isRunning = !heatingParams.value.isRunning
      const status = heatingParams.value.isRunning ? '启动' : '停止'
      alert(`绕组加热已${status}！`)
    }

    const saveParameters = async () => {
      loading.value = true
      const siteCode = currentSiteCode.value
      console.log('💾 保存参数到站点:', siteCode)
      
      try {
        // 构造写入任务（与后端批量写入接口匹配字段）
        let writes = [
          // 速度与液位
          { nodeId: opcNodes.setVelocityHighLimit, value: speedParams.value.maxSpeed, type: 'Float' },
          { nodeId: opcNodes.setVelocityLowLimit, value: speedParams.value.minSpeed, type: 'Float' },
          { nodeId: opcNodes.setMVelocity, value: speedParams.value.manualSpeed, type: 'Float' },
          { nodeId: opcNodes.setVelocityAlm, value: speedParams.value.alarmSpeed, type: 'Float' },
          { nodeId: opcNodes.setLiquidLevelDiff, value: speedParams.value.levelDifference, type: 'Float' },
          { nodeId: opcNodes.almLevelDopplerHigh, value: speedParams.value.levelMax, type: 'Float' },
          { nodeId: opcNodes.setP, value: speedParams.value.controlP, type: 'Float' },
          { nodeId: opcNodes.setI, value: speedParams.value.controlI, type: 'Float' },
          { nodeId: opcNodes.setD, value: speedParams.value.controlD, type: 'Float' },

          // 绕组加热与散热
          { nodeId: opcNodes.motorColiHeatTemp, value: heatingParams.value.startTemp, type: 'Float' },
          { nodeId: opcNodes.motorColiStopTemp, value: heatingParams.value.stopTemp, type: 'Float' },
          { nodeId: opcNodes.motorColiAlmTemp, value: heatingParams.value.alarmTemp, type: 'Float' },
          { nodeId: opcNodes.motorColiCoolStartTemp, value: coolingParams.value.startTemp, type: 'Float' },
          { nodeId: opcNodes.motorColiCoolStopTemp, value: coolingParams.value.stopTemp, type: 'Float' },

          // 延时（运行延时：秒*1000，停止延时：分钟*60000）
          // 注意：使用Float类型以兼容不同PLC版本（SITE_002可能需要Float）
          { nodeId: opcNodes.pumpRunTime, value: delayParams.value.startDelay * 1000, type: 'Float' },
          { nodeId: opcNodes.pumpStopTime, value: delayParams.value.stopDelay * 60000, type: 'Float' },

          // 流体报警
          { nodeId: opcNodes.almLevelDiff, value: fluidParams.value.alarmLevelDiff, type: 'Float' },
          { nodeId: opcNodes.almLevelDopplerHigh, value: fluidParams.value.alarmLevel, type: 'Float' },
          { nodeId: opcNodes.almFlowLow, value: fluidParams.value.alarmFlow, type: 'Float' },

          // 容器重量
          { nodeId: opcNodes.setMaxTareWeight, value: containerParams.value.weight, type: 'Float' },
          { nodeId: opcNodes.setWarnWeight, value: containerParams.value.warningWeight, type: 'Float' },
          { nodeId: opcNodes.setAlarmNetWeight, value: containerParams.value.alarmWeight, type: 'Float' }
        ]

        // 基于角色过滤允许写入的字段
        if (isOperator.value) {
          writes = writes.filter(w => w.nodeId === opcNodes.setMVelocity)
        } else if (isObserver.value) {
          writes = []
        }
        // 过滤无效值
        const payload = writes.filter(item => item.value !== undefined && item.value !== null)
        
        console.log('📤 发送批量写入请求:', { siteCode, writeCount: payload.length })
        console.log('📋 写入数据详情:', payload)
        
        // 传递站点代码
        const bulkResult = await opcuaAPI.bulkWrite(payload, siteCode)
        console.log('✅ 批量写入PLC成功:', bulkResult)
        
        // 检查写入结果中是否有失败的项
        const results = bulkResult.data?.results || []
        const failedWrites = results.filter(r => r.status !== 'Good' && !r.status?.includes('Good'))
        
        if (failedWrites.length > 0) {
          console.error('❌ 部分写入失败:', failedWrites)
          alert(`⚠️ 部分参数写入失败！\n站点: ${siteCode}\n成功: ${results.length - failedWrites.length} 个\n失败: ${failedWrites.length} 个\n\n失败详情:\n${failedWrites.map(f => `${f.nodeId}: ${f.error || f.status}`).join('\n')}`)
          return
        }

        // 注意：参数已成功写入PLC
        // 数据库保存功能为可选功能，暂未实现
        // PLC是参数的主要存储位置，参数已安全保存

        alert(`✅ 参数保存成功！\n站点: ${siteCode}\n已成功写入PLC\n\n写入结果: ${bulkResult.data?.count || 0} 个节点`)
        
        // 保存成功后重新加载参数以确认
        setTimeout(() => {
          loadParametersFromPLC()
        }, 1000)
      } catch (error) {
        console.error('参数保存失败:', error)
        const errorMsg = error.response?.data?.message || error.message || '未知错误'
        
        // 特殊处理登录过期
        if (errorMsg.includes('登录已过期') || errorMsg.includes('未登录')) {
          alert('登录已过期，请重新登录')
          // 跳转到登录页
          window.location.href = '/login'
          return
        }
        
        alert(`保存失败（站点：${siteCode}）\n错误信息: ${errorMsg}\n请检查：\n1. 站点是否已初始化\n2. OPC UA连接是否正常\n3. 站点代码是否正确`)
      } finally {
        loading.value = false
      }
    }

    const performAlarmTestWrite = async (active) => {
      const siteCode = currentSiteCode.value
      if (!siteCode) {
        alert('当前未选择站点，无法执行报警测试')
        alarmTestPendingState.value = null
        return
      }
      alarmTestSending.value = true
      console.log('🚨 报警测试写入 ->', { siteCode, active })
      try {
        await opcuaAPI.triggerAlarmTest(siteCode, active)
        alarmTestActive.value = active
      } catch (error) {
        console.error('报警测试写入失败:', error)
        const errorMsg = error.response?.data?.message || error.message || '未知错误'
        alert(`报警测试失败（站点：${siteCode}）\n${errorMsg}`)
      } finally {
        alarmTestSending.value = false
        const nextState = alarmTestPendingState.value
        alarmTestPendingState.value = null
        if (nextState !== null && nextState !== alarmTestActive.value) {
          await performAlarmTestWrite(nextState)
        }
      }
    }

    const requestAlarmTest = (active) => {
      if (alarmTestSending.value) {
        alarmTestPendingState.value = active
        return
      }
      return performAlarmTestWrite(active)
    }

    const handleAlarmTestPress = () => {
      requestAlarmTest(true)
    }

    const handleAlarmTestRelease = () => {
      if (!alarmTestActive.value && alarmTestPendingState.value === null) return
      requestAlarmTest(false)
    }

    const handleAlarmTestCancel = () => {
      if (alarmTestActive.value || alarmTestPendingState.value !== null) {
        requestAlarmTest(false)
      }
    }

    const resetParameters = () => {
      if (confirm('确定要重置所有参数为默认值吗？')) {
        speedParams.value = {
          maxSpeed: 300,
          minSpeed: 10,
          manualSpeed: 150,
          alarmSpeed: 280,
          levelDifference: 50,
          levelMax: 200,
          controlP: 1.0,
          controlI: 0.1,
          controlD: 0.01
        }
        
        heatingParams.value = {
          startTemp: 5,
          stopTemp: 15,
          alarmTemp: 80,
          isRunning: false
        }
        
        delayParams.value = {
          startDelay: 30,  // 秒
          stopDelay: 1     // 分钟
        }
        
        coolingParams.value = {
          startTemp: 80,
          stopTemp: 70
        }
        
        fluidParams.value = {
          alarmLevelDiff: 50,
          alarmLevel: 200,
          alarmFlow: 100
        }
        
        environmentParams.value = {
          tempMax: 45,
          tempMin: -10,
          humidityMax: 80,
          humidityMin: 30
        }
        
        containerParams.value = {
          weight: 1000,
          warningWeight: 800,
          alarmWeight: 500
        }
        
        alert('所有参数已重置为默认值！')
      }
    }

    const exportConfig = () => {
      const config = {
        speed: speedParams.value,
        heating: heatingParams.value,
        delay: delayParams.value,
        cooling: coolingParams.value,
        fluid: fluidParams.value,
        environment: environmentParams.value,
        container: containerParams.value
      }
      
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `参数配置_${new Date().toISOString().slice(0, 10)}.json`
      link.click()
    }

    // 从OPC UA实时读取参数并填充到界面（使用新的批量读取API）
    const loadParametersFromPLC = async () => {
      try {
        loading.value = true
        const siteCode = currentSiteCode.value
        console.log('🔄 正在从PLC批量读取参数...站点:', siteCode)
        
        if (!siteCode) {
          console.error('❌ 当前站点代码为空')
          alert('当前站点未选择，请先选择站点')
          return
        }
        
        // 使用新的批量读取API，一次性从PLC读取所有参数
        const response = await opcuaAPI.readAllParameters(siteCode)
        console.log('📥 API响应:', response)
        
        // 提取数据，支持多种响应格式
        const data = response?.data?.data || response?.data || response
        
        if (!data) {
          console.warn('⚠️ 批量读取返回空数据')
          alert('未能从PLC读取到参数数据，请检查OPC UA连接')
          return
        }
        
        console.log('✅ 批量读取完成，收到数据:', data)
        
        // 速度与液位参数
        if (data.setVelocityHighLimit !== undefined) speedParams.value.maxSpeed = Number(data.setVelocityHighLimit)
        if (data.setVelocityLowLimit !== undefined) speedParams.value.minSpeed = Number(data.setVelocityLowLimit)
        if (data.setMVelocity !== undefined) speedParams.value.manualSpeed = Number(data.setMVelocity)
        if (data.setVelocityAlm !== undefined) speedParams.value.alarmSpeed = Number(data.setVelocityAlm)
        if (data.setLiquidLevelDiff !== undefined) speedParams.value.levelDifference = Number(data.setLiquidLevelDiff)
        if (data.almLevelDopplerHigh !== undefined) speedParams.value.levelMax = Number(data.almLevelDopplerHigh)
        if (data.setP !== undefined) speedParams.value.controlP = Number(data.setP)
        if (data.setI !== undefined) speedParams.value.controlI = Number(data.setI)
        if (data.setD !== undefined) speedParams.value.controlD = Number(data.setD)

        // 绕组加热与散热参数
        if (data.motorColiHeatTemp !== undefined) heatingParams.value.startTemp = Number(data.motorColiHeatTemp)
        if (data.motorColiStopTemp !== undefined) heatingParams.value.stopTemp = Number(data.motorColiStopTemp)
        if (data.motorColiAlmTemp !== undefined) heatingParams.value.alarmTemp = Number(data.motorColiAlmTemp)
        if (data.motorColiCoolStartTemp !== undefined) coolingParams.value.startTemp = Number(data.motorColiCoolStartTemp)
        if (data.motorColiCoolStopTemp !== undefined) coolingParams.value.stopTemp = Number(data.motorColiCoolStopTemp)

        // 延时参数（从PLC读取时除以相应的倍数）
        if (data.pumpRunTime !== undefined) delayParams.value.startDelay = Number(data.pumpRunTime) / 1000  // 毫秒转秒
        if (data.pumpStopTime !== undefined) delayParams.value.stopDelay = Number(data.pumpStopTime) / 60000  // 毫秒转分钟

        // 流体报警参数
        if (data.almLevelDiff !== undefined) fluidParams.value.alarmLevelDiff = Number(data.almLevelDiff)
        if (data.almLevelDopplerHigh !== undefined) fluidParams.value.alarmLevel = Number(data.almLevelDopplerHigh)
        if (data.almFlowLow !== undefined) fluidParams.value.alarmFlow = Number(data.almFlowLow)

        // 容器重量参数
        if (data.setMaxTareWeight !== undefined) containerParams.value.weight = Number(data.setMaxTareWeight)
        if (data.setWarnWeight !== undefined) containerParams.value.warningWeight = Number(data.setWarnWeight)
        if (data.setAlarmNetWeight !== undefined) containerParams.value.alarmWeight = Number(data.setAlarmNetWeight)
        
        // HART通信状态
        if (data.hartEn !== undefined) {
          console.log('HART通信状态:', data.hartEn)
          // environmentParams.value.hartEn = data.hartEn
        }
        
        console.log('📝 参数已更新到界面')
      } catch (e) {
        console.error('❌ 从PLC读取参数失败:', e)
        
        // 提取详细的错误信息
        let errorMsg = '未知错误'
        if (e.response?.data?.message) {
          errorMsg = e.response.data.message
        } else if (e.message) {
          errorMsg = e.message
        }
        
        const siteCode = currentSiteCode.value || '未知'
        alert(`从PLC读取参数失败\n站点: ${siteCode}\n错误: ${errorMsg}\n\n请检查：\n1. 站点是否已在后台配置\n2. OPC UA服务是否已启动\n3. 站点PLC连接是否正常`)
      } finally {
        loading.value = false
      }
    }

    // 监听站点切换
    let unsubscribeSiteChange = null
    
    onMounted(() => {
      // 首次挂载读取PLC实时参数
      loadParametersFromPLC()
      // 监听来自父级（Dashboard）的"参数设定打开"事件
      window.addEventListener('parameters-opened', loadParametersFromPLC)
      
      // 监听站点切换事件，当站点切换时自动刷新参数
      unsubscribeSiteChange = onSiteChange((siteCode, site) => {
        console.log('📡 站点已切换到:', siteCode, site)
        currentSiteCode.value = siteCode
        // 站点切换后自动重新加载参数
        loadParametersFromPLC()
      })
    })

    onActivated(() => {
      // 组件被激活（从 keep-alive 恢复或每次进入路由）时强制重新读取
      currentSiteCode.value = getCurrentSiteCode()
      loadParametersFromPLC()
    })
    
    onUnmounted(() => {
      // 清理事件监听
      window.removeEventListener('parameters-opened', loadParametersFromPLC)
      if (unsubscribeSiteChange) {
        unsubscribeSiteChange()
      }
    })

    return {
      loading,
      role,
      isRootOrAdmin,
      isOperator,
      isObserver,
      canEdit,
      speedParams,
      heatingParams,
      delayParams,
      coolingParams,
      fluidParams,
      environmentParams,
      containerParams,
      currentSiteCode,
      alarmTestActive,
      alarmTestSending,
      handleAlarmTestPress,
      handleAlarmTestRelease,
      handleAlarmTestCancel,
      toggleHeatingStatus,
      saveParameters,
      resetParameters: undefined,
      exportConfig: undefined
    }
  }
}
</script>

<style scoped>
.parameters-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  overflow: visible;
}

.parameter-sections {
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

.parameter-sections::-webkit-scrollbar {
  width: 8px;
}

.parameter-sections::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.parameter-sections::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.parameter-sections::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.parameter-section {
  padding: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.parameter-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.input-field {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.alarm-test-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px dashed #d5dbe3;
  border-radius: 12px;
  background: #f9fbff;
}

.alarm-test-desc {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
}

.alarm-test-desc code {
  padding: 2px 6px;
  border-radius: 4px;
  background: #edf2ff;
  color: #5a67d8;
}

.alarm-test-button {
  padding: 16px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(45deg, #f56565, #ed64a6);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 6px 18px rgba(237, 100, 166, 0.35);
}

.alarm-test-button.active {
  background: linear-gradient(45deg, #f97316, #f43f5e);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35);
}

.alarm-test-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.alarm-test-hint {
  font-size: 13px;
  color: #718096;
}


.save-section {
  padding: 24px;
  text-align: center;
}

.save-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.large {
  padding: 16px 32px;
  font-size: 16px;
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

.btn.info {
  background: #3498db;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  padding: 12px 0;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  transform: scale(1.2);
  cursor: pointer;
}

.checkbox-label:hover {
  color: #667eea;
}

/* 状态按钮样式 */
.status-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.status-button.status-running {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  border-color: #28a745;
}

.status-button.status-running:hover {
  background: linear-gradient(45deg, #218838, #1ea085);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.status-button.status-stopped {
  background: #f8f9fa;
  color: #6c757d;
  border-color: #dee2e6;
}

.status-button.status-stopped:hover {
  background: #e9ecef;
  color: #495057;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-button svg {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .save-actions {
    flex-direction: column;
  }
  
  .parameter-sections {
    max-height: calc(100vh - 150px);
  }
}
</style>


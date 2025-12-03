<template>
  <div class="settings-module">
    <div class="settings-sections">
      <!-- 水位参数设置 -->
      <div class="settings-section card fade-in-up">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M7 16.5C7 14.0147 9.01472 12 11.5 12C13.9853 12 16 14.0147 16 16.5M7 16.5C7 18.9853 9.01472 21 11.5 21C13.9853 21 16 18.9853 16 16.5M7 16.5H16" stroke="currentColor" stroke-width="2"/>
          </svg>
          水位参数设置
        </h3>
        <div class="section-content">
          <div class="form-row">
            <div class="form-group">
              <label for="highLevel">高水位阈值 (%)</label>
              <input
                id="highLevel"
                v-model.number="waterSettings.highLevel"
                type="number"
                class="input-field"
                min="0"
                max="100"
                step="1"
              />
              <small class="form-help">超过此水位将触发高水位告警</small>
            </div>
            <div class="form-group">
              <label for="lowLevel">低水位阈值 (%)</label>
              <input
                id="lowLevel"
                v-model.number="waterSettings.lowLevel"
                type="number"
                class="input-field"
                min="0"
                max="100"
                step="1"
              />
              <small class="form-help">低于此水位将触发低水位告警</small>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="autoStart">自动启动水位 (%)</label>
              <input
                id="autoStart"
                v-model.number="waterSettings.autoStartLevel"
                type="number"
                class="input-field"
                min="0"
                max="100"
                step="1"
              />
              <small class="form-help">达到此水位自动启动泵机</small>
            </div>
            <div class="form-group">
              <label for="autoStop">自动停止水位 (%)</label>
              <input
                id="autoStop"
                v-model.number="waterSettings.autoStopLevel"
                type="number"
                class="input-field"
                min="0"
                max="100"
                step="1"
              />
              <small class="form-help">达到此水位自动停止泵机</small>
            </div>
          </div>
          <div class="form-actions">
            <button @click="saveWaterSettings" class="btn primary" :disabled="loading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
                <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
              </svg>
              保存设置
            </button>
            <button @click="resetWaterSettings" class="btn secondary">重置默认</button>
          </div>
        </div>
      </div>

      <!-- 泵机参数设置 -->
      <div class="settings-section card fade-in-up" style="animation-delay: 0.1s">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15A9 9 0 0 0 19.4 9M20.85 19.1A13 13 0 0 0 20.85 4.9M4.6 15A9 9 0 0 1 4.6 9M3.15 19.1A13 13 0 0 1 3.15 4.9" stroke="currentColor" stroke-width="2"/>
          </svg>
          泵机参数设置
        </h3>
        <div class="section-content">
          <div class="pump-settings">
            <div v-for="pump in pumpSettings" :key="pump.id" class="pump-setting-item">
              <h4 class="pump-name">{{ pump.name }}</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>最大功率 (kW)</label>
                  <input
                    v-model.number="pump.maxPower"
                    type="number"
                    class="input-field"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div class="form-group">
                  <label>额定流量 (L/min)</label>
                  <input
                    v-model.number="pump.ratedFlow"
                    type="number"
                    class="input-field"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>启动延时 (秒)</label>
                  <input
                    v-model.number="pump.startDelay"
                    type="number"
                    class="input-field"
                    min="0"
                    step="1"
                  />
                </div>
                <div class="form-group">
                  <label>停止延时 (秒)</label>
                  <input
                    v-model.number="pump.stopDelay"
                    type="number"
                    class="input-field"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div class="checkbox-group">
                <label class="checkbox-wrapper">
                  <input v-model="pump.autoMode" type="checkbox" />
                  <span class="checkmark"></span>
                  启用自动模式
                </label>
                <label class="checkbox-wrapper">
                  <input v-model="pump.enabled" type="checkbox" />
                  <span class="checkmark"></span>
                  设备启用
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click="savePumpSettings" class="btn primary" :disabled="loading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
                <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
              </svg>
              保存设置
            </button>
            <button @click="resetPumpSettings" class="btn secondary">重置默认</button>
          </div>
        </div>
      </div>

      <!-- 系统参数设置 -->
      <div class="settings-section card fade-in-up" style="animation-delay: 0.2s">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
          </svg>
          系统参数设置
        </h3>
        <div class="section-content">
          <div class="form-row">
            <div class="form-group">
              <label for="scanInterval">数据扫描间隔 (秒)</label>
              <input
                id="scanInterval"
                v-model.number="systemSettings.scanInterval"
                type="number"
                class="input-field"
                min="1"
                max="60"
                step="1"
              />
              <small class="form-help">系统数据采集的时间间隔</small>
            </div>
            <div class="form-group">
              <label for="alarmDelay">告警延时 (秒)</label>
              <input
                id="alarmDelay"
                v-model.number="systemSettings.alarmDelay"
                type="number"
                class="input-field"
                min="0"
                max="300"
                step="1"
              />
              <small class="form-help">告警触发前的延时时间</small>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="dataRetention">数据保留天数</label>
              <input
                id="dataRetention"
                v-model.number="systemSettings.dataRetentionDays"
                type="number"
                class="input-field"
                min="1"
                max="365"
                step="1"
              />
              <small class="form-help">历史数据保留的天数</small>
            </div>
            <div class="form-group">
              <label for="logLevel">日志级别</label>
              <select
                id="logLevel"
                v-model="systemSettings.logLevel"
                class="input-field"
              >
                <option value="debug">调试</option>
                <option value="info">信息</option>
                <option value="warning">警告</option>
                <option value="error">错误</option>
              </select>
              <small class="form-help">系统日志记录级别</small>
            </div>
          </div>
          <div class="checkbox-group">
            <label class="checkbox-wrapper">
              <input v-model="systemSettings.autoBackup" type="checkbox" />
              <span class="checkmark"></span>
              启用自动备份
            </label>
            <label class="checkbox-wrapper">
              <input v-model="systemSettings.emailNotification" type="checkbox" />
              <span class="checkmark"></span>
              启用邮件通知
            </label>
            <label class="checkbox-wrapper">
              <input v-model="systemSettings.smsNotification" type="checkbox" />
              <span class="checkmark"></span>
              启用短信通知
            </label>
          </div>
          <div class="form-actions">
            <button @click="saveSystemSettings" class="btn primary" :disabled="loading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2"/>
                <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
                <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
              </svg>
              保存设置
            </button>
            <button @click="resetSystemSettings" class="btn secondary">重置默认</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置操作记录 -->
    <div class="settings-history card fade-in-up" style="animation-delay: 0.3s">
      <h3 class="section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>
        </svg>
        设置更改记录
      </h3>
      <div class="section-content">
        <div class="history-list">
          <div v-for="record in settingsHistory" :key="record.id" class="history-item">
            <div class="history-time">{{ formatTime(record.time) }}</div>
            <div class="history-content">
              <div class="history-action">{{ record.action }}</div>
              <div class="history-details">{{ record.details }}</div>
            </div>
            <div class="history-user">{{ record.user }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SettingsModule',
  setup() {
    const loading = ref(false)

    // 水位设置
    const waterSettings = ref({
      highLevel: 85,
      lowLevel: 20,
      autoStartLevel: 75,
      autoStopLevel: 30
    })

    // 泵机设置
    const pumpSettings = ref([
      {
        id: 1,
        name: '主泵 #1',
        maxPower: 15.0,
        ratedFlow: 120,
        startDelay: 3,
        stopDelay: 5,
        autoMode: true,
        enabled: true
      },
      {
        id: 2,
        name: '主泵 #2',
        maxPower: 15.0,
        ratedFlow: 120,
        startDelay: 3,
        stopDelay: 5,
        autoMode: true,
        enabled: true
      },
      {
        id: 3,
        name: '备用泵 #3',
        maxPower: 12.0,
        ratedFlow: 100,
        startDelay: 2,
        stopDelay: 3,
        autoMode: false,
        enabled: true
      }
    ])

    // 系统设置
    const systemSettings = ref({
      scanInterval: 5,
      alarmDelay: 10,
      dataRetentionDays: 30,
      logLevel: 'info',
      autoBackup: true,
      emailNotification: true,
      smsNotification: false
    })

    // 设置历史记录
    const settingsHistory = ref([
      {
        id: 1,
        time: new Date(),
        action: '更新水位参数',
        details: '高水位阈值: 85% → 90%',
        user: 'admin'
      },
      {
        id: 2,
        time: new Date(Date.now() - 3600000),
        action: '修改泵机设置',
        details: '主泵 #1 最大功率: 12kW → 15kW',
        user: 'admin'
      },
      {
        id: 3,
        time: new Date(Date.now() - 7200000),
        action: '调整系统参数',
        details: '数据扫描间隔: 10秒 → 5秒',
        user: 'admin'
      }
    ])

    const formatTime = (time) => {
      return time.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const addHistoryRecord = (action, details) => {
      const newRecord = {
        id: Date.now(),
        time: new Date(),
        action,
        details,
        user: 'admin'
      }
      settingsHistory.value.unshift(newRecord)
      if (settingsHistory.value.length > 20) {
        settingsHistory.value.pop()
      }
    }

    // 保存水位设置
    const saveWaterSettings = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        addHistoryRecord('更新水位参数', `高水位: ${waterSettings.value.highLevel}%, 低水位: ${waterSettings.value.lowLevel}%`)
        // 这里应该调用API保存设置
        console.log('Water settings saved:', waterSettings.value)
      } finally {
        loading.value = false
      }
    }

    // 重置水位设置
    const resetWaterSettings = () => {
      waterSettings.value = {
        highLevel: 85,
        lowLevel: 20,
        autoStartLevel: 75,
        autoStopLevel: 30
      }
      addHistoryRecord('重置水位参数', '恢复到默认设置')
    }

    // 保存泵机设置
    const savePumpSettings = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        addHistoryRecord('更新泵机参数', '所有泵机参数已更新')
        // 这里应该调用API保存设置
        console.log('Pump settings saved:', pumpSettings.value)
      } finally {
        loading.value = false
      }
    }

    // 重置泵机设置
    const resetPumpSettings = () => {
      pumpSettings.value = [
        {
          id: 1,
          name: '主泵 #1',
          maxPower: 15.0,
          ratedFlow: 120,
          startDelay: 3,
          stopDelay: 5,
          autoMode: true,
          enabled: true
        },
        {
          id: 2,
          name: '主泵 #2',
          maxPower: 15.0,
          ratedFlow: 120,
          startDelay: 3,
          stopDelay: 5,
          autoMode: true,
          enabled: true
        },
        {
          id: 3,
          name: '备用泵 #3',
          maxPower: 12.0,
          ratedFlow: 100,
          startDelay: 2,
          stopDelay: 3,
          autoMode: false,
          enabled: true
        }
      ]
      addHistoryRecord('重置泵机参数', '恢复到默认设置')
    }

    // 保存系统设置
    const saveSystemSettings = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        addHistoryRecord('更新系统参数', `扫描间隔: ${systemSettings.value.scanInterval}秒, 日志级别: ${systemSettings.value.logLevel}`)
        // 这里应该调用API保存设置
        console.log('System settings saved:', systemSettings.value)
      } finally {
        loading.value = false
      }
    }

    // 重置系统设置
    const resetSystemSettings = () => {
      systemSettings.value = {
        scanInterval: 5,
        alarmDelay: 10,
        dataRetentionDays: 30,
        logLevel: 'info',
        autoBackup: true,
        emailNotification: true,
        smsNotification: false
      }
      addHistoryRecord('重置系统参数', '恢复到默认设置')
    }

    return {
      loading,
      waterSettings,
      pumpSettings,
      systemSettings,
      settingsHistory,
      formatTime,
      saveWaterSettings,
      resetWaterSettings,
      savePumpSettings,
      resetPumpSettings,
      saveSystemSettings,
      resetSystemSettings
    }
  }
}
</script>

<style scoped>
.settings-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  padding: 24px;
}

.section-title {
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

.section-content {
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

.form-help {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-wrapper input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-color: #667eea;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
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

.pump-settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pump-setting-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.pump-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.settings-history {
  padding: 24px;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-time {
  font-size: 12px;
  color: #999;
  min-width: 80px;
  margin-top: 2px;
}

.history-content {
  flex: 1;
}

.history-action {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.history-details {
  font-size: 12px;
  color: #666;
}

.history-user {
  font-size: 12px;
  color: #999;
  min-width: 60px;
  margin-top: 2px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .checkbox-group {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .settings-section {
    padding: 16px;
  }
  
  .history-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .history-time,
  .history-user {
    min-width: auto;
  }
}
</style>


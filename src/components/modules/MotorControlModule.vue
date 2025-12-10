<template>
  <div class="operation-module">
    <!-- 电机控制模块 -->
    <div class="motor-section">
      <div class="motor-panel card fade-in-up" style="animation-delay: 0.2s">
        <h3 class="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15A9 9 0 0 0 19.4 9M20.85 19.1A13 13 0 0 0 20.85 4.9M4.6 15A9 9 0 0 1 4.6 9M3.15 19.1A13 13 0 0 1 3.15 4.9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          电机控制
        </h3>
        <div class="panel-content">
          <div class="motors-container">
            <!-- 格栅电机 -->
            <div class="motor-item grating-motor">
              <div class="motor-item-header">
                <div class="motor-item-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    <path d="M19.4 15A9 9 0 0 0 19.4 9M20.85 19.1A13 13 0 0 0 20.85 4.9M4.6 15A9 9 0 0 1 4.6 9M3.15 19.1A13 13 0 0 1 3.15 4.9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <h4 class="motor-item-title">格栅电机</h4>
                <div class="motor-status-indicator">
                  <div class="status-dot" :class="gratingMotorData.status"></div>
                  <span class="status-text">{{ getMotorStatusText(gratingMotorData.status) }}</span>
                </div>
              </div>
              <div class="motor-item-content">
                <div class="motor-status-badges">
                  <div class="status-badge running" :class="{ active: gratingMotorData.statusLights.breathing }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                    </svg>
                    <span>电机</span>
                  </div>
                  <div class="status-badge moisture" :class="{ active: gratingMotorData.statusLights.moisture }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3C12 3 6 9 6 13C6 16.3137 8.68629 19 12 19C15.3137 19 18 16.3137 18 13C18 9 12 3 12 3Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>防潮</span>
                  </div>
                  <div class="status-badge cooling" :class="{ active: gratingMotorData.statusLights.cooling }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2V22M2 12H22M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>散热</span>
                  </div>
                  <div class="status-badge trip" :class="{ active: gratingMotorData.statusLights.trip }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="8" x2="12" y2="14" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="18" r="1.6" fill="currentColor"/>
                    </svg>
                    <span>跳闸</span>
                  </div>
                  <div class="status-badge overload" :class="{ active: gratingMotorData.statusLights.overload }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L13.5 9H20L14.5 13L16 20L12 15L8 20L9.5 13L4 9H10.5L12 2Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>过载</span>
                  </div>
                  <div class="status-badge overtemp" :class="{ active: gratingMotorData.statusLights.overtemp }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M14 14.5V6A2 2 0 0 0 10 6V14.5A4 4 0 1 0 14 14.5Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>超温</span>
                  </div>
                  <div class="status-badge overspeed" :class="{ active: gratingMotorData.statusLights.overspeed }">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                      <path d="M12 12L18 9" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>超速</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分隔线 -->
            <div class="motor-divider"></div>

            <!-- 毛刷电机 -->
            <div class="motor-item brush-motor">
              <div class="motor-item-header">
                <div class="motor-item-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12L12 8L16 12L12 16L8 12Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <h4 class="motor-item-title">毛刷电机</h4>
                <div class="motor-status-indicator">
                  <div class="status-dot" :class="brushMotorData.status"></div>
                  <span class="status-text">{{ getBrushMotorStatusText(brushMotorData.status) }}</span>
                </div>
              </div>
              <div class="motor-item-content">
                <div class="motor-status-badges">
            <div class="status-badge running" :class="{ active: brushMotorData.running }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                    </svg>
                    <span>运行</span>
                  </div>
            <div class="status-badge trip" :class="{ active: brushMotorData.trip }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="8" x2="12" y2="14" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="18" r="1.6" fill="currentColor"/>
                    </svg>
                    <span>跳闸</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分隔线 -->
            <div class="motor-divider"></div>

            <!-- 振动电机 -->
            <div class="motor-item vibration-motor">
              <div class="motor-item-header">
                <div class="motor-item-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <h4 class="motor-item-title">振动电机</h4>
                <div class="motor-status-indicator">
                  <div class="status-dot" :class="motorData.vibration.status"></div>
                  <span class="status-text">{{ getMotorStatusText(motorData.vibration.status) }}</span>
                </div>
              </div>
              <div class="motor-item-content">
                <div class="motor-status-badges">
              <div class="status-badge running" :class="{ active: motorData.vibration.status === 'running' }">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                    </svg>
                    <span>运行</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统操作控制模块 -->
    <div class="system-control-section">
      <div class="system-control-panel card fade-in-up" style="animation-delay: 0.7s">
        <h3 class="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div class="title-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>系统操作控制</span>
          </div>
        </h3>
        <div class="panel-content">
          <div class="control-modules">
            <!-- 模式切换模块 -->
            <div class="control-module">
              <h4 class="module-title">运行模式</h4>
              <div class="mode-switch">
                <div class="mode-option clickable" :class="{ active: systemMode === 'auto' }" @click="switchToAutoMode()">
                  <div class="mode-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <span class="mode-label">自动模式</span>
                  <div class="mode-status" :class="systemMode === 'auto' ? 'active' : 'inactive'">
                    {{ systemMode === 'auto' ? '运行中' : '待机' }}
                  </div>
                </div>
                <!-- 自动模式控制按钮 - 仅在自动模式或远程模式下显示，手动模式下不显示 -->
                <div class="auto-control-buttons" v-if="systemMode !== 'manual' && (systemMode === 'auto' || deviceMode.isRemote)">
                  <button 
                    @mousedown="buttonPressed.autoStart = true; handleAutoStart(true)"
                    @mouseup="buttonPressed.autoStart = false; handleAutoStart(false)"
                    @mouseleave="buttonPressed.autoStart = false; handleAutoStart(false)"
                    @touchstart="buttonPressed.autoStart = true; handleAutoStart(true)"
                    @touchend="buttonPressed.autoStart = false; handleAutoStart(false)"
                    @touchcancel="buttonPressed.autoStart = false; handleAutoStart(false)"
                    :class="['control-btn', 'btn', 'primary', { 'pressed': buttonPressed.autoStart }]"
                    :disabled="loading"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                    </svg>
                    启动
                  </button>
                  <button 
                    @mousedown="buttonPressed.autoStop = true; handleAutoStop(true)"
                    @mouseup="buttonPressed.autoStop = false; handleAutoStop(false)"
                    @mouseleave="buttonPressed.autoStop = false; handleAutoStop(false)"
                    @touchstart="buttonPressed.autoStop = true; handleAutoStop(true)"
                    @touchend="buttonPressed.autoStop = false; handleAutoStop(false)"
                    @touchcancel="buttonPressed.autoStop = false; handleAutoStop(false)"
                    :class="['control-btn', 'btn', 'warning', { 'pressed': buttonPressed.autoStop }]"
                    :disabled="loading"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="6" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      <rect x="14" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                    </svg>
                    停止
                  </button>
                  <button 
                    @click="handleVibratHalt()"
                    :class="['control-btn', 'btn', 'info', { 'active': vibratHaltActive }]"
                    :disabled="loading"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12L7 8L11 12L15 8L19 12L21 10" stroke="currentColor" stroke-width="2"/>
                      <path d="M3 16L7 12L11 16L15 12L19 16L21 14" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    振动已暂停
                  </button>
                </div>
                <div class="mode-option clickable" :class="{ active: systemMode === 'manual' }" @click="switchToManualMode()">
                  <div class="mode-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <span class="mode-label">手动模式</span>
                  <div class="mode-status" :class="systemMode === 'manual' ? 'active' : 'inactive'">
                    {{ systemMode === 'manual' ? '运行中' : '待机' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 手动操作模块 -->
            <div class="control-module">
              <h4 class="module-title">手动操作</h4>
              <div class="manual-controls">
                <!-- 格栅系统 -->
                <div class="system-card grating-system">
                  <div class="system-header">
                    <div class="system-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3H21V21H3V3Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M9 3V21" stroke="currentColor" stroke-width="2"/>
                        <path d="M15 3V21" stroke="currentColor" stroke-width="2"/>
                        <path d="M3 9H21" stroke="currentColor" stroke-width="2"/>
                        <path d="M3 15H21" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="system-info">
                      <h5 class="system-name">格栅系统</h5>
                      <p class="system-desc">污水过滤处理</p>
                    </div>
                  </div>
                  <div class="control-buttons">
                    <button 
                      @mousedown="buttonPressed.gratingStart = true; manualGratingStart(true)"
                      @mouseup="buttonPressed.gratingStart = false; manualGratingStart(false)"
                      @mouseleave="buttonPressed.gratingStart = false; manualGratingStart(false)"
                      @touchstart="buttonPressed.gratingStart = true; manualGratingStart(true)"
                      @touchend="buttonPressed.gratingStart = false; manualGratingStart(false)"
                      @touchcancel="buttonPressed.gratingStart = false; manualGratingStart(false)"
                      :class="['control-btn', 'btn', canManualOperate ? 'primary' : 'disabled-red', { 'pressed': buttonPressed.gratingStart }]"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      启动
                    </button>
                    <button 
                      @mousedown="buttonPressed.gratingStop = true; manualGratingStop(true)"
                      @mouseup="buttonPressed.gratingStop = false; manualGratingStop(false)"
                      @mouseleave="buttonPressed.gratingStop = false; manualGratingStop(false)"
                      @touchstart="buttonPressed.gratingStop = true; manualGratingStop(true)"
                      @touchend="buttonPressed.gratingStop = false; manualGratingStop(false)"
                      @touchcancel="buttonPressed.gratingStop = false; manualGratingStop(false)"
                      :class="['control-btn', 'btn', canManualOperate ? 'warning' : 'disabled-red', { 'pressed': buttonPressed.gratingStop }]"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                        <rect x="14" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      停止
                    </button>
                  </div>
                </div>

                <!-- 毛刷系统 -->
                <div class="system-card brush-system">
                  <div class="system-header">
                    <div class="system-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12L16 12" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 16L16 16" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="system-info">
                      <h5 class="system-name">毛刷系统</h5>
                      <p class="system-desc">设备清洁维护</p>
                    </div>
                  </div>
                  <div class="control-buttons">
                    <button 
                      @mousedown="buttonPressed.brushStart = true; manualBrushStart(true)"
                      @mouseup="buttonPressed.brushStart = false; manualBrushStart(false)"
                      @mouseleave="buttonPressed.brushStart = false; manualBrushStart(false)"
                      @touchstart="buttonPressed.brushStart = true; manualBrushStart(true)"
                      @touchend="buttonPressed.brushStart = false; manualBrushStart(false)"
                      @touchcancel="buttonPressed.brushStart = false; manualBrushStart(false)"
                      :class="['control-btn', 'btn', canManualOperate ? 'primary' : 'disabled-red', { 'pressed': buttonPressed.brushStart }]"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      启动
                    </button>
                    <button 
                      @mousedown="buttonPressed.brushStop = true; manualBrushStop(true)"
                      @mouseup="buttonPressed.brushStop = false; manualBrushStop(false)"
                      @mouseleave="buttonPressed.brushStop = false; manualBrushStop(false)"
                      @touchstart="buttonPressed.brushStop = true; manualBrushStop(true)"
                      @touchend="buttonPressed.brushStop = false; manualBrushStop(false)"
                      @touchcancel="buttonPressed.brushStop = false; manualBrushStop(false)"
                      :class="['control-btn', 'btn', canManualOperate ? 'warning' : 'disabled-red', { 'pressed': buttonPressed.brushStop }]"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                        <rect x="14" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      停止
                    </button>
                  </div>
                </div>

                <!-- 振动系统 -->
                <div class="system-card vibration-system">
                  <div class="system-header">
                    <div class="system-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12L7 8L11 12L15 8L19 12L21 10" stroke="currentColor" stroke-width="2"/>
                        <path d="M3 16L7 12L11 16L15 12L19 16L21 14" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                    <div class="system-info">
                      <h5 class="system-name">振动系统</h5>
                      <p class="system-desc">振动分离处理</p>
                    </div>
                  </div>
                  <div class="control-buttons">
                    <button 
                      @mousedown="buttonPressed.vibrationStart = true; manualVibrationStart(true)"
                      @mouseup="buttonPressed.vibrationStart = false; manualVibrationStart(false)"
                      @mouseleave="buttonPressed.vibrationStart = false; manualVibrationStart(false)"
                      @touchstart="buttonPressed.vibrationStart = true; manualVibrationStart(true)"
                      @touchend="buttonPressed.vibrationStart = false; manualVibrationStart(false)"
                      @touchcancel="buttonPressed.vibrationStart = false; manualVibrationStart(false)"
                      :class="['control-btn', 'btn', canManualOperate ? 'primary' : 'disabled-red', { 'pressed': buttonPressed.vibrationStart }]"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      启动
                    </button>
                    <button 
                      @mousedown="buttonPressed.vibrationStop = true; manualVibrationStop(true)"
                      @mouseup="buttonPressed.vibrationStop = false; manualVibrationStop(false)"
                      @mouseleave="buttonPressed.vibrationStop = false; manualVibrationStop(false)"
                      @touchstart="buttonPressed.vibrationStop = true; manualVibrationStop(true)"
                      @touchend="buttonPressed.vibrationStop = false; manualVibrationStop(false)"
                      @touchcancel="buttonPressed.vibrationStop = false; manualVibrationStop(false)"
                      :class="['control-btn', 'btn', canManualOperate ? 'warning' : 'disabled-red', { 'pressed': buttonPressed.vibrationStop }]"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                        <rect x="14" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      停止
                    </button>
                  </div>
                </div>

                <!-- 排水泵系统 -->
                <div class="system-card pump-system">
                  <div class="system-header">
                    <div class="system-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 4V20" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 8L12 4L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 16L12 20L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="system-info">
                      <h5 class="system-name">排水泵</h5>
                      <p class="system-desc">排水处理</p>
                    </div>
                  </div>
                  <div class="control-buttons">
                    <button 
                      @click="manualPumpStart()"
                      :class="['control-btn', 'btn', canManualOperate ? 'primary' : 'disabled-red']"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polygon points="5,3 19,12 5,21" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      启动
                    </button>
                    <button 
                      @click="manualPumpStop()"
                      :class="['control-btn', 'btn', canManualOperate ? 'warning' : 'disabled-red']"
                      :disabled="loading || !canManualOperate"
                    >
                      <svg v-if="!canManualOperate" width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="6" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                        <rect x="14" y="4" width="4" height="16" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                      </svg>
                      停止
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 错误复位模块 -->
            <div class="control-module">
              <h4 class="module-title">错误复位</h4>
              <div class="error-reset-controls">
                <div class="reset-info">
                  <div class="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <div class="info-text">
                    <p class="info-title">系统状态监控</p>
                    <p class="info-desc">检测并清除系统错误</p>
                  </div>
                </div>
                <div class="reset-buttons">
                  <button 
                    @mousedown="resetErrorPress()"
                    @mouseup="resetErrorRelease()"
                    @mouseleave="resetErrorRelease()"
                    @touchstart="resetErrorPress()"
                    @touchend="resetErrorRelease()"
                    @touchcancel="resetErrorRelease()"
                    class="reset-btn btn danger"
                    :class="{ 'pressed': isResetPressed }"
                    :disabled="loading"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M23 4V10H17" stroke="currentColor" stroke-width="2"/>
                  <path d="M20.49 15C19.2969 17.5 16.8692 19.3333 14 19.9297" stroke="currentColor" stroke-width="2"/>
                </svg>
                错误复位
              </button>
                </div>
              </div>
            </div>
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
  name: 'MotorControlModule',
  setup() {
    const loading = ref(false)
    const isResetPressed = ref(false)

    // 格栅电机数据
    const gratingMotorData = ref({
      status: 'running',
      speed: 25.6,           // 实时速度 m/min
      frequency: 50,         // 设定频率 Hz
      current: 12.5,         // 实时电流 A
      power: 7.8,            // 实时功率 Kw
      torque: 85,            // 实时转矩 %
      windingTemp: 68,       // 绕组温度 °C
      statusLights: {
        breathing: true,     // 电机呼吸灯
        moisture: false,     // 防潮呼吸灯
        cooling: true,       // 散热呼吸灯
        trip: false,         // 跳闸呼吸灯
        overload: false,     // 过载呼吸灯
        overtemp: false,     // 超温呼吸灯
        overspeed: false     // 超速呼吸灯
      }
    })

    // 毛刷电机数据
    const brushMotorData = ref({
      status: 'stopped',
      running: false,        // 运行状态
      trip: false           // 跳闸状态
    })

    // 其他电机数据
    const motorData = ref({
      vibration: {
        status: 'running',
        frequency: 50,
        current: 8.2,
        temperature: 45
      }
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
      // 加载当前运行模式
      loadCurrentMode()
      
      // 加载设备模式（本地/远程）
      updateDeviceMode()
      
      // 加载参数阈值（用于状态判断）
      loadParameterThresholds()
      
      // 加载电机运行参数数据
      loadMotorData()
      
      // 加载报警状态数据
      loadAlarmStatus()
      
      // 加载振动暂停状态
      loadVibratHaltStatus()
      
      // 启动运行模式定时更新（每10秒）
      const modeInterval = setInterval(loadCurrentMode, 10000)
      
      // 启动设备模式定时更新（每5秒）
      const deviceModeInterval = setInterval(updateDeviceMode, 5000)
      
      // 启动电机数据定时更新（每2秒）
      const motorDataInterval = setInterval(loadMotorData, 2000)
      
      // 启动报警状态定时更新（每1秒，确保实时响应）
      const alarmStatusInterval = setInterval(loadAlarmStatus, 1000)

      // 启动振动暂停状态定时更新（每3秒）
      const vibratHaltInterval = setInterval(loadVibratHaltStatus, 3000)

      // 启动错误检测定时器
      const errorCheckInterval = setInterval(checkSystemErrors, 10000) // 每10秒检查一次
      
      // 启动参数阈值定时更新（每30秒，因为参数设定不经常变化）
      const parameterThresholdsInterval = setInterval(loadParameterThresholds, 30000)
      
      // 保存定时器ID用于清理
      onUnmounted(() => {
        clearInterval(modeInterval)
        clearInterval(deviceModeInterval)
        clearInterval(motorDataInterval)
        clearInterval(alarmStatusInterval)
        clearInterval(vibratHaltInterval)
        clearInterval(errorCheckInterval)
        clearInterval(parameterThresholdsInterval)
      })
    })

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

    // 加载报警状态数据（实时读取）
    const loadAlarmStatus = async () => {
      try {
        const all = await opcuaAPI.getAllPlcData();
        if (all) {
          // 更新格栅电机运行状态（电机灯）
          if (all.rotaryGrilleFor !== undefined) {
            const runningStatus = Boolean(all.rotaryGrilleFor);
            if (gratingMotorData.value.statusLights.breathing !== runningStatus) {
              gratingMotorData.value.statusLights.breathing = runningStatus;
              gratingMotorData.value.status = runningStatus ? 'running' : 'stopped';
              console.log('🟢 格栅电机运行状态更新:', runningStatus ? '运行' : '停止');
            }
          }
          
          // 更新格栅电机防潮状态
          if (all.coilHeating !== undefined) {
            const moistureStatus = Boolean(all.coilHeating);
            if (gratingMotorData.value.statusLights.moisture !== moistureStatus) {
              gratingMotorData.value.statusLights.moisture = moistureStatus;
              console.log('💧 格栅电机防潮状态更新:', moistureStatus ? '开启' : '关闭');
            }
          }
          
          // 更新格栅电机散热状态
          if (all.coolFan !== undefined) {
            const coolingStatus = Boolean(all.coolFan);
            if (gratingMotorData.value.statusLights.cooling !== coolingStatus) {
              gratingMotorData.value.statusLights.cooling = coolingStatus;
              console.log('❄️ 格栅电机散热状态更新:', coolingStatus ? '开启' : '关闭');
            }
          }
          
          // 更新格栅电机报警状态（实时更新状态灯）
          if (all.rotaryGrilleMotorTrip !== undefined) {
            const tripStatus = Boolean(all.rotaryGrilleMotorTrip);
            if (gratingMotorData.value.statusLights.trip !== tripStatus) {
              gratingMotorData.value.statusLights.trip = tripStatus;
              console.log('🔴 格栅电机跳闸状态更新:', tripStatus ? '跳闸' : '正常');
            }
          }
          if (all.rotaryGrilleMotorOverLoad !== undefined) {
            const overloadStatus = Boolean(all.rotaryGrilleMotorOverLoad);
            if (gratingMotorData.value.statusLights.overload !== overloadStatus) {
              gratingMotorData.value.statusLights.overload = overloadStatus;
              console.log('⚠️ 格栅电机过载状态更新:', overloadStatus ? '过载' : '正常');
            }
          }
          if (all.rotaryGrilleMotorOverTemp !== undefined) {
            const overtempStatus = Boolean(all.rotaryGrilleMotorOverTemp);
            if (gratingMotorData.value.statusLights.overtemp !== overtempStatus) {
              gratingMotorData.value.statusLights.overtemp = overtempStatus;
              console.log('🌡️ 格栅电机超温状态更新:', overtempStatus ? '超温' : '正常');
            }
          }
          if (all.rotaryGrilleOverSpeed !== undefined) {
            const overspeedStatus = Boolean(all.rotaryGrilleOverSpeed);
            if (gratingMotorData.value.statusLights.overspeed !== overspeedStatus) {
              gratingMotorData.value.statusLights.overspeed = overspeedStatus;
              console.log('⚡ 格栅电机超速状态更新:', overspeedStatus ? '超速' : '正常');
            }
          }
          
          // 更新毛刷电机运行状态
          if (all.brushMotor !== undefined) {
            const brushRunningStatus = Boolean(all.brushMotor);
            if (brushMotorData.value.running !== brushRunningStatus) {
              brushMotorData.value.running = brushRunningStatus;
              brushMotorData.value.status = brushRunningStatus ? 'running' : 'stopped';
              console.log('🟢 毛刷电机运行状态更新:', brushRunningStatus ? '运行' : '停止');
            }
          }
          
          // 更新毛刷电机跳闸状态
          if (all.brushMotorTrip !== undefined) {
            const brushTripStatus = Boolean(all.brushMotorTrip);
            if (brushMotorData.value.trip !== brushTripStatus) {
              brushMotorData.value.trip = brushTripStatus;
              console.log('🔴 毛刷电机跳闸状态更新:', brushTripStatus ? '跳闸' : '正常');
            }
          }
          
          // 更新振动电机运行状态
          if (all.vibratMotor !== undefined) {
            const vibratRunningStatus = Boolean(all.vibratMotor);
            const vibratStatus = vibratRunningStatus ? 'running' : 'stopped';
            if (motorData.value.vibration.status !== vibratStatus) {
              motorData.value.vibration.status = vibratStatus;
              console.log('🟢 振动电机运行状态更新:', vibratRunningStatus ? '运行' : '停止');
            }
          }
        }
      } catch (e) {
        console.warn('获取报警状态失败，保留现有显示:', e);
      }
    };

    return {
      loading,
      gratingMotorData,
      brushMotorData,
      motorData,
      systemMode,
      deviceMode,
      canManualOperate,
      hasErrors,
      errorCount,
      gratingErrors,
      brushErrors,
      buttonPressed,
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
      getBrushMotorStatusText,
      getMotorStatusText,
      toggleGratingMotor,
      resetGratingMotor,
      switchToAutoMode,
      switchToManualMode,
      manualGratingStart,
      manualGratingStop,
      manualBrushStart,
      manualBrushStop,
      manualVibrationStart,
      manualVibrationStop,
      resetAllErrors,
      resetErrorPress,
      resetErrorRelease,
      isResetPressed,
      confirmAllAlarms,
      confirmingAlarms,
      loadMotorData,
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
.operation-module {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  grid-template-rows: 1fr;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  height: calc(100vh - 80px);
  overflow: hidden;
  box-sizing: border-box;
}


.device-panel,
.motor-panel,
.system-control-panel {
  padding: 14px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08), 
              0 2px 6px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(102, 126, 234, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}

.device-panel::before,
.motor-panel::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  height: 5px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 1;
  border-radius: 12px 12px 0 0;
}

.device-panel:hover,
.motor-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12),
              0 4px 16px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.system-control-panel {
  border-color: rgba(118, 75, 162, 0.2);
}

.system-control-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12),
              0 4px 16px rgba(118, 75, 162, 0.3);
  border-color: rgba(118, 75, 162, 0.5);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
  justify-content: space-between;
  flex-shrink: 0;
  letter-spacing: -0.3px;
}

.panel-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.panel-title svg {
  width: 18px;
  height: 18px;
  color: #667eea;
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 电机控制区域 */
.motor-section {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}


/* 电机容器 */
.motors-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 电机项 */
.motor-item {
  padding: 12px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: linear-gradient(135deg, #fdfbfb 0%, #f7f9fc 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.motor-item:hover {
  transform: translateX(3px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(102, 126, 234, 0.2);
}

.motor-item:not(:last-child) {
  margin-bottom: 0;
}

/* 电机分隔线 */
.motor-divider {
  display: none;
}

/* 电机项头部 */
.motor-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.motor-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.motor-item:hover .motor-item-icon {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.grating-motor .motor-item-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.brush-motor .motor-item-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.vibration-motor .motor-item-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.motor-item-icon svg {
  width: 18px;
  height: 18px;
}

.motor-item-title {
  font-size: 14px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  flex: 1;
  letter-spacing: -0.3px;
}

.motor-item-content {
  padding-left: 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}


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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-dot.running {
  background: #27ae60;
  box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.25),
              0 0 12px rgba(39, 174, 96, 0.4);
  animation: pulse-running 2s infinite;
}

@keyframes pulse-running {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.status-dot.stopped {
  background: #95a5a6;
  box-shadow: 0 0 0 2px rgba(149, 165, 166, 0.2);
}

.status-dot.fault {
  background: #e74c3c;
  box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.3),
              0 0 12px rgba(231, 76, 60, 0.5);
  animation: pulse-error 1s infinite;
}

@keyframes pulse-error {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
}

.status-text {
  font-size: 12px;
  font-weight: 600;
  color: #2d3748;
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

/* 电机项头部状态指示器 */
.motor-item-header .motor-status-indicator {
  margin-left: auto;
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 3px solid #667eea;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
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
  gap: 4px;
  margin-bottom: 0;
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
  gap: 6px;
  justify-content: stretch;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 0;
  padding: 8px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(102, 126, 234, 0.2);
}

.auto-control-buttons .control-btn {
  flex: 1 1 auto;
  min-width: 95px;
  padding: 8px 12px;
  font-size: 11px;
  min-height: 34px;
  white-space: nowrap;
  overflow: visible;
  justify-content: center;
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
@media (max-width: 1400px) {
  .operation-module {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 16px;
    padding: 16px;
  }
  
  .motor-section {
    grid-column: 1;
    grid-row: 1;
  }
  
  .system-control-section {
    grid-column: 1;
    grid-row: 2;
  }
}

@media (max-width: 1200px) {
  .operation-module {
    gap: 12px;
    padding: 12px;
  }
  
  .device-panel,
  .motor-panel,
  .system-control-panel {
    padding: 16px;
  }
  
  .motors-container {
    gap: 12px;
  }
  
  .motor-item {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .operation-module {
    height: calc(100vh - 100px);
    gap: 12px;
    padding: 12px;
  }
  
  .device-panel,
  .motor-panel,
  .system-control-panel {
    padding: 16px;
    border-radius: 12px;
  }
  
  .panel-title {
    font-size: 16px;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .panel-title svg {
    width: 20px;
    height: 20px;
  }
  
  .motor-section {
    grid-column: 1;
    grid-row: 1;
  }
  
  .system-control-section {
    grid-column: 1;
    grid-row: 2;
  }
  
  .motor-item {
    padding: 12px;
  }
  
  .motor-item-icon {
    width: 40px;
    height: 40px;
  }
  
  .motor-item-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .motor-item-title {
    font-size: 16px;
  }
  
  .motor-status-badges {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 8px;
    padding: 12px;
  }
  
  .status-badge {
    min-height: 60px;
    padding: 8px 6px;
    gap: 6px;
  }
  
  .status-badge svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 900px) {
  .motor-status-badges {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
}

@media (max-width: 768px) {
  .motor-item {
    padding: 12px;
  }
  
  .motor-item-header {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .motor-item-content {
    padding-left: 0;
    margin-top: 8px;
  }
  
  .motor-status-badges {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  .motor-item-header .motor-status-indicator {
    margin-left: 0;
    width: 100%;
    margin-top: 4px;
  }
}

/* 紧凑型电机模块样式 */
.compact-motor {
  max-width: 280px;
  min-height: auto;
}

.compact-motor .panel-content {
  padding: 8px 12px;
}

.compact-motor .panel-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.compact-motor-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}

.compact-status-row {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.compact-labels-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 6px;
}

.label-item {
  font-size: 12px;
  color: #333;
}

.compact-status-row.single-status {
  justify-content: center;
}

.compact-status-row .status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  font-size: 13px;
}

.compact-status-row .status-item.active {
  background: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

.compact-status-row .status-item.alert {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  animation: pulse-alert 2s infinite;
}

.compact-status-row .status-light {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.compact-status-row .status-item.active .status-light.running .light-dot {
  background: #27ae60;
  color: #27ae60;
  box-shadow: 0 0 0 1px rgba(46, 204, 113, 0.3);
  animation: none;
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

.status-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  border-radius: 6px;
  border: 1.5px solid #e2e8f0;
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 50px;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.status-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.status-badge:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.status-badge:hover::before {
  opacity: 1;
}

.status-badge svg {
  color: currentColor;
  width: 16px;
  height: 16px;
}

.status-badge.running.active {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: #fff;
  border-color: #27ae60;
  box-shadow: 0 4px 16px rgba(39, 174, 96, 0.4),
              0 0 24px rgba(39, 174, 96, 0.2);
  transform: scale(1.05);
}

.status-badge.running.active::before {
  opacity: 0;
}

.status-badge.trip.active {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: #fff;
  border-color: #c0392b;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4),
              0 0 24px rgba(231, 76, 60, 0.2);
  transform: scale(1.05);
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: scale(1.05) translateX(0); }
  25% { transform: scale(1.05) translateX(-2px); }
  75% { transform: scale(1.05) translateX(2px); }
}

.status-badge.trip.active::before {
  opacity: 0;
}

/* 通用：电机状态徽章容器（振动电机等可复用） */
.motor-status-badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 8px;
  padding: 10px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1.5px solid rgba(226, 232, 240, 0.6);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
  flex: 1;
  min-height: 0;
  align-content: start;
}

/* 其他状态的激活配色，保持统一风格 */
.status-badge.moisture.active {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  color: #fff;
  border-color: #17a2b8;
  box-shadow: 0 4px 16px rgba(23, 162, 184, 0.4),
              0 0 24px rgba(23, 162, 184, 0.2);
  transform: scale(1.05);
}

.status-badge.moisture.active::before {
  opacity: 0;
}

.status-badge.cooling.active {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: #fff;
  border-color: #2980b9;
  box-shadow: 0 4px 16px rgba(41, 128, 185, 0.4),
              0 0 24px rgba(41, 128, 185, 0.2);
  transform: scale(1.05);
}

.status-badge.cooling.active::before {
  opacity: 0;
}

.status-badge.overload.active {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: #fff;
  border-color: #e67e22;
  box-shadow: 0 4px 16px rgba(243, 156, 18, 0.4),
              0 0 24px rgba(243, 156, 18, 0.2);
  transform: scale(1.05);
  animation: shake 0.5s infinite;
}

.status-badge.overload.active::before {
  opacity: 0;
}

.status-badge.overtemp.active {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: #fff;
  border-color: #c0392b;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4),
              0 0 24px rgba(231, 76, 60, 0.2);
  transform: scale(1.05);
  animation: shake 0.5s infinite;
}

.status-badge.overtemp.active::before {
  opacity: 0;
}

.status-badge.overspeed.active {
  background: linear-gradient(135deg, #8e44ad 0%, #6c5ce7 100%);
  color: #fff;
  border-color: #6c5ce7;
  box-shadow: 0 4px 16px rgba(108, 92, 231, 0.4),
              0 0 24px rgba(108, 92, 231, 0.2);
  transform: scale(1.05);
  animation: shake 0.5s infinite;
}

.status-badge.overspeed.active::before {
  opacity: 0;
}

/* 系统操作控制模块样式 */
.system-control-section {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.system-control-panel {
  padding: 24px;
}

.control-modules {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 4px 0 0;
  /* 在滚动内容后添加额外空间，确保最后的内容完全可见 */
}

.control-modules::after {
  content: '';
  display: block;
  height: 60px;
  flex-shrink: 0;
}

/* 美化滚动条 */
.control-modules::-webkit-scrollbar {
  width: 5px;
}

.control-modules::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
}

.control-modules::-webkit-scrollbar-thumb {
  background: rgba(118, 75, 162, 0.3);
  border-radius: 10px;
}

.control-modules::-webkit-scrollbar-thumb:hover {
  background: rgba(118, 75, 162, 0.5);
}

.control-module {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #fdfbfb 0%, #f7f9fc 100%);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.control-module:hover {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.module-title {
  font-size: 13px;
  font-weight: 700;
  color: #2d3748;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #e2e8f0;
  margin-bottom: 0;
  position: relative;
  letter-spacing: -0.3px;
  flex-shrink: 0;
}

.module-title::after {
  content: '';
  position: absolute;
  bottom: -1.5px;
  left: 0;
  width: 35px;
  height: 2.5px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

/* 模式切换样式 */
.mode-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  grid-auto-flow: dense;
}

/* 自动控制按钮跨越两列 */
.mode-switch .auto-control-buttons {
  grid-column: 1 / -1;
}

.mode-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  min-height: 100px;
}

.mode-option:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.mode-option.clickable {
  cursor: pointer;
  user-select: none;
}

.mode-option.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.mode-option.clickable:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mode-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25),
              inset 0 1px 2px rgba(102, 126, 234, 0.1);
}

.mode-icon {
  color: #667eea;
  width: 24px;
  height: 24px;
}

.mode-label {
  font-size: 13px;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: -0.3px;
}

.mode-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 16px;
  font-weight: 600;
}

.mode-status.active {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: #fff;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
}

.mode-status.inactive {
  background: rgba(149, 165, 166, 0.15);
  color: #64748b;
}


/* 手动操作样式 */
.manual-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
}

.system-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.system-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.system-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.system-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.system-card:hover .system-icon {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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

.system-icon svg {
  width: 16px;
  height: 16px;
}

.system-info {
  flex: 1;
}

.system-name {
  font-size: 12px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 2px 0;
  letter-spacing: -0.3px;
}

.system-desc {
  font-size: 10px;
  color: #718096;
  margin: 0;
  line-height: 1.3;
}

.control-buttons {
  display: flex;
  gap: 6px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  min-height: 32px;
  min-width: 60px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.control-btn svg {
  width: 14px;
  height: 14px;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.3);
}

/* 错误复位样式 */
.error-reset-controls,
.alarm-confirm-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.reset-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.reset-info:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.info-icon svg {
  width: 16px;
  height: 16px;
}

.info-text {
  flex: 1;
}

.info-title {
  font-size: 12px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 2px 0;
  letter-spacing: -0.3px;
}

.info-desc {
  font-size: 11px;
  color: #718096;
  margin: 0;
  line-height: 1.3;
}

.error-status {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
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
  gap: 6px;
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 6px;
  transition: all 0.15s ease;
  border: 1.5px solid transparent;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-height: 36px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  letter-spacing: 0.2px;
}

.reset-btn svg {
  width: 16px;
  height: 16px;
}

.reset-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.reset-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.3);
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

/* 响应式设计 - 控制模块 */
@media (max-width: 1200px) {
  .control-modules {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .control-module {
    padding: 16px;
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
  
  .mode-icon {
    width: 28px;
    height: 28px;
  }
  
  .mode-label {
    font-size: 14px;
  }
  
  .manual-controls {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .system-card {
    padding: 12px;
  }
  
  .system-icon {
    width: 40px;
    height: 40px;
  }
  
  .system-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .system-name {
    font-size: 14px;
  }
  
  .system-desc {
    font-size: 11px;
  }
  
  .control-buttons {
    gap: 6px;
  }
  
  .control-btn {
    padding: 10px 12px;
    font-size: 12px;
    min-height: 38px;
  }
  
  .control-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .reset-buttons {
    gap: 8px;
  }
  
  .reset-btn {
    padding: 12px 16px;
    font-size: 13px;
    min-height: 42px;
  }
  
  .reset-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .motor-item-header {
    gap: 8px;
  }
  
  .motor-item-content {
    padding-left: 0;
  }
  
  .module-title {
    font-size: 14px;
    padding-bottom: 10px;
  }
  
  .info-icon {
    width: 40px;
    height: 40px;
  }
  
  .info-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .info-title {
    font-size: 14px;
  }
  
  .info-desc {
    font-size: 12px;
  }
}
</style>


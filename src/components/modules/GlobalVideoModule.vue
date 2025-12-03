<template>
  <div class="global-video-module">
    <div class="video-grid card fade-in-up">
      <h3 class="panel-title">
        {{ title }}
        <div class="video-controls">
          <button 
            v-if="!isStreaming" 
            @click="startStream" 
            class="btn btn-primary btn-sm"
            :disabled="loading"
          >
            {{ loading ? '连接中...' : '启动监控' }}
          </button>
          <button 
            v-else 
            @click="stopStream" 
            class="btn btn-secondary btn-sm"
          >
            停止监控
          </button>
          
        </div>
      </h3>
      
      
      
      <!-- 错误消息 -->
      <div v-if="errorMessage" class="error-message">
        <span>⚠️ {{ errorMessage }}</span>
        <button @click="clearError" class="btn-close">×</button>
      </div>
      
      <div class="main-video">
        <!-- 视频流显示：MJPEG直拉 -->
        <div v-if="isStreaming" class="video-container">
          <img
            :src="mjpegUrl"
            alt="实时视频"
            class="video-stream"
            ref="videoEl"
            crossorigin="anonymous"
            @error="handleStreamError"
            @load="handleStreamLoad"
          />
          <div class="video-overlay">
            <div class="video-info">
              <span>海康威视摄像头</span>
              <span>{{ currentTime }}</span>
            </div>
          </div>
        </div>
        
        <!-- 占位符 -->
        <div v-else class="video-placeholder large">
          <div v-if="loading" class="loading-spinner">
            <div class="spinner"></div>
            <p>正在连接摄像头...</p>
          </div>
          <div v-else>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" stroke="#999" stroke-width="2"/>
            <circle cx="12" cy="12" r="10" stroke="#999" stroke-width="1" stroke-dasharray="2,2" fill="none"/>
          </svg>
            <p>点击"启动监控"开始视频流</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { getCurrentSiteCode, getCurrentSite } from '@/utils/siteManager'
import { configAPI } from '@/services/api'
// 移除 HLS，改为 WebRTC

export default {
  name: 'GlobalVideoModule',
  props: {
    title: {
      type: String,
      default: '全局视频监控'
    },
    // 摄像头类型：'internal' (机内) 或 'global' (全局)
    cameraType: {
      type: String,
      default: 'global',
      validator: (value) => ['internal', 'global'].includes(value)
    }
  },
  setup(props) {
    // 后端服务基础地址：
    // 1) 优先使用 VITE_BACKEND_BASE
    // 2) 开发模式（端口3000）使用相对路径，通过 Vite 代理访问
    // 3) 其他情况使用当前站点 origin（生产经 Nginx 反代）
    const BACKEND_BASE = (import.meta?.env?.VITE_BACKEND_BASE)
      ? import.meta.env.VITE_BACKEND_BASE
      : (window.location.port === '3000' ? '' : `${window.location.origin}`)

    // 响应式数据
    const isStreaming = ref(false)
    const loading = ref(false)
    const errorMessage = ref('')
    const cameraInfo = ref(null)
    const videoEl = ref(null)
    // MJPEG 直拉地址
    const mjpegUrl = ref('')
    const currentTime = ref('')
    
    // 定时器
    let timeInterval = null
    
    // 更新当前时间
    const updateTime = () => {
      currentTime.value = new Date().toLocaleTimeString()
    }
    
    // 清除错误消息
    const clearError = () => {
      errorMessage.value = ''
    }
    
    // 页面无垂直滚动条（进入时隐藏，离开恢复）
    let prevOverflowY = ''
    onMounted(() => {
      prevOverflowY = document.documentElement.style.overflowY
      document.documentElement.style.overflowY = 'hidden'
    })
    onUnmounted(() => {
      document.documentElement.style.overflowY = prevOverflowY || ''
    })
    
    // 启动视频流（MJPEG直拉）
    const startStream = async () => {
      loading.value = true
      errorMessage.value = ''
      try {
        // 1) 读取当前站点摄像头IP，并同步到流服务
        try {
          // 优先从内存中的当前站点对象读取
          let siteObj = getCurrentSite() || null
          let siteCode = null
          let cameraIp = null
          let cameraUsername = null
          let cameraPassword = null

          // 根据摄像头类型选择对应的配置字段
          const isInternal = props.cameraType === 'internal'
          const cameraTypeLabel = isInternal ? '机内摄像头' : '全局摄像头'
          
          console.log(`启动${cameraTypeLabel}，类型: ${props.cameraType}`)

          if (siteObj) {
            siteCode = siteObj.siteCode || siteObj.site_code || null
            
            if (isInternal) {
              // 机内摄像头配置
              cameraIp = siteObj.internalCameraIp || siteObj.internal_camera_ip || null
              cameraUsername = siteObj.internalCameraUsername || siteObj.internal_camera_username || null
              cameraPassword = siteObj.internalCameraPassword || siteObj.internal_camera_password || null
            } else {
              // 全局摄像头配置
              cameraIp = siteObj.globalCameraIp || siteObj.global_camera_ip || null
              cameraUsername = siteObj.globalCameraUsername || siteObj.global_camera_username || null
              cameraPassword = siteObj.globalCameraPassword || siteObj.global_camera_password || null
            }
          }

          // 如果内存没有或字段缺失，尝试用存储的"当前站点标识"解析
          if (!siteObj || !cameraIp) {
            const stored = getCurrentSiteCode() // 注意：此处可能存的是站点ID而非Code
            // 若有明确的站点Code，直接按Code取配置
            if (stored && typeof stored === 'string' && /[A-Za-z_\-]/.test(stored)) {
              siteCode = stored
              const siteResp = await configAPI.getSiteConfig(siteCode)
              const siteData = siteResp?.data || siteResp
              
              if (isInternal) {
                // 机内摄像头配置
                cameraIp = siteData?.internalCameraIp || siteData?.internal_camera_ip || cameraIp
                cameraUsername = siteData?.internalCameraUsername || siteData?.internal_camera_username || cameraUsername
                cameraPassword = siteData?.internalCameraPassword || siteData?.internal_camera_password || cameraPassword
              } else {
                // 全局摄像头配置
                cameraIp = siteData?.globalCameraIp || siteData?.global_camera_ip || cameraIp
                cameraUsername = siteData?.globalCameraUsername || siteData?.global_camera_username || cameraUsername
                cameraPassword = siteData?.globalCameraPassword || siteData?.global_camera_password || cameraPassword
              }
            } else if (stored) {
              // 可能是数字ID：拉取站点列表并按ID匹配
              try {
                const listResp = await configAPI.getSiteConfigs(1, 1000)
                const list = listResp?.data?.sites || []
                const match = list.find(s => String(s.id) === String(stored))
                if (match) {
                  siteObj = match
                  siteCode = match.siteCode || match.site_code || siteCode
                  
                  if (isInternal) {
                    // 机内摄像头配置
                    cameraIp = match.internalCameraIp || match.internal_camera_ip || cameraIp
                    cameraUsername = match.internalCameraUsername || match.internal_camera_username || cameraUsername
                    cameraPassword = match.internalCameraPassword || match.internal_camera_password || cameraPassword
                  } else {
                    // 全局摄像头配置
                    cameraIp = match.globalCameraIp || match.global_camera_ip || cameraIp
                    cameraUsername = match.globalCameraUsername || match.global_camera_username || cameraUsername
                    cameraPassword = match.globalCameraPassword || match.global_camera_password || cameraPassword
                  }
                }
              } catch (_) {}
            }
          }
          
          console.log(`${cameraTypeLabel}配置:`, {
            ip: cameraIp,
            username: cameraUsername,
            hasPassword: !!cameraPassword
          })

          // 必须有摄像头IP；否则阻止启动并提示
          if (!cameraIp) {
            throw new Error(`当前站点未配置${cameraTypeLabel}IP，请在站点管理中填写后再试`)
          }
          if (!cameraUsername) {
            throw new Error(`当前站点未配置${cameraTypeLabel}用户名，请在站点管理中填写后再试`)
          }

          // 同步配置到流服务，必须成功才能继续
          const configUrl = BACKEND_BASE ? `${BACKEND_BASE}/api/stream/config` : '/api/stream/config'
          console.log('发送配置请求到:', configUrl, { ip: cameraIp, username: cameraUsername })
          
          const configResp = await fetch(configUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip: cameraIp, username: cameraUsername, password: cameraPassword || '' })
          })
          
          // 先检查响应状态
          if (!configResp.ok) {
            // 尝试读取响应文本
            let errorText = ''
            try {
              const contentType = configResp.headers.get('content-type') || ''
              if (contentType.includes('application/json')) {
                const errorData = await configResp.json()
                errorText = errorData.message || errorData.error || JSON.stringify(errorData)
              } else {
                errorText = await configResp.text() || configResp.statusText
              }
            } catch (e) {
              errorText = configResp.statusText || '未知错误'
            }
            console.error('配置接口返回错误:', configResp.status, errorText)
            throw new Error(`配置摄像头参数失败 (${configResp.status}): ${errorText}`)
          }
          
          // 响应成功，尝试解析 JSON
          let configData = {}
          try {
            const contentType = configResp.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
              configData = await configResp.json()
            } else {
              const text = await configResp.text()
              throw new Error(`响应不是 JSON 格式: ${text.substring(0, 100)}`)
            }
          } catch (e) {
            console.error('解析配置响应失败:', e)
            throw new Error(`无法解析服务器响应: ${e.message}`)
          }
          
          // 验证配置是否成功应用
          if (!configData.applied || !configData.applied.ip) {
            console.error('配置验证失败:', configData)
            throw new Error('摄像头IP配置失败，请重试')
          }
          
          console.log('摄像头配置成功:', configData.applied)
        } catch (e) {
          // 配置失败时直接抛出错误，不继续启动
          console.error('配置摄像头参数失败:', e)
          throw e
        }

        // 配置成功后，告知后端启动
        const startUrl = BACKEND_BASE ? `${BACKEND_BASE}/api/stream/start` : '/api/stream/start'
        const startResp = await fetch(startUrl, { method: 'POST' })
        
        let startData = {}
        try {
          startData = await startResp.json()
        } catch (e) {
          console.error('解析启动响应失败:', e)
          const text = await startResp.text().catch(() => '')
          throw new Error(`启动接口返回异常: ${startResp.status} ${startResp.statusText} - ${text}`)
        }
        
        if (!startResp.ok) {
          console.error('启动接口返回错误:', startResp.status, startData)
          throw new Error(startData.message || startData.error || `启动失败 (${startResp.status})`)
        }
        
        console.log('流服务启动成功:', startData)
        // 直接设置 MJPEG 源地址，加入时间戳避免缓存并强制新连接
        const mjpegPath = BACKEND_BASE ? `${BACKEND_BASE}/api/stream/mjpeg` : '/api/stream/mjpeg'
        mjpegUrl.value = `${mjpegPath}?ts=${Date.now()}`
        isStreaming.value = true
        // 从 BACKEND_BASE 解析 host:port 展示
        let backendHost = 'backend:5500'
        if (BACKEND_BASE) {
          try { 
            backendHost = new URL(BACKEND_BASE).host 
          } catch (_) {
            // 如果解析失败，使用默认值
          }
        } else {
          // 开发模式，使用当前窗口的 host
          backendHost = window.location.host
        }
        const parts = backendHost.split(':')
        cameraInfo.value = { connected: true, ip: parts[0] || backendHost, port: Number(parts[1] || 5500), service: 'Python' }
        timeInterval = setInterval(updateTime, 1000)
        updateTime()
      } catch (error) {
        console.error('启动视频流失败:', error)
        errorMessage.value = String(error?.message || '无法启动播放，请检查摄像头配置与服务状态')
      } finally {
        loading.value = false
      }
    }
    
    // 停止视频流
    const stopStream = async () => {
      try {
        isStreaming.value = false
        // 强制断开 MJPEG 连接
        mjpegUrl.value = 'about:blank'
        // 通知后端立即停止
        try { await fetch(`${BACKEND_BASE}/api/stream/stop`, { method: 'POST' }) } catch (_) {}
        if (timeInterval) { clearInterval(timeInterval); timeInterval = null }
      } catch (error) {
        console.error('停止视频流失败:', error)
        errorMessage.value = '停止播放失败'
      }
    }
    
    
    // 处理流加载错误
    const handleStreamError = (event) => {
      console.error('视频流加载错误:', event)
      errorMessage.value = '视频流连接中断，正在尝试重连...'
      setTimeout(() => { if (isStreaming.value) { startStream() } }, 3000)
    }
    
    // 处理流加载成功
    const handleStreamLoad = () => {
      if (errorMessage.value.includes('视频流连接中断')) errorMessage.value = ''
    }
    
    onMounted(() => {})
    onUnmounted(() => { if (isStreaming.value) { stopStream() } })

    return {
      isStreaming,
      loading,
      errorMessage,
      cameraInfo,
      currentTime,
      clearError,
      startStream,
      stopStream,
      handleStreamError,
      handleStreamLoad,
      videoEl,
      mjpegUrl,
      BACKEND_BASE
    }
  }
}
</script>

<style scoped>
.global-video-module {
  padding: 16px;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.video-grid {
  padding: 16px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  flex-shrink: 0;
}

.video-controls {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  border-color: #6b7280;
}

.btn-secondary:hover:not(:disabled) {
  background: #5b6370;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border-color: #667eea;
}

.btn-outline:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 11px;
}

.camera-status {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc2626;
}

.status-item.online .status-dot {
  background: #10b981;
}

.error-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 12px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-video {
  background: #f8fafc;
  border-radius: 8px;
  border: 2px dashed #ddd;
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
  color: white;
  padding: 8px 12px;
  font-size: 12px;
}

.video-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
}

.video-placeholder.large {
  padding: 40px;
}

.video-placeholder p {
  margin-top: 8px;
  font-size: 14px;
}

.video-placeholder small {
  margin-top: 4px;
  font-size: 10px;
  color: #999;
}

@media (max-width: 768px) {
  .panel-title {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .video-controls {
    justify-content: center;
  }
  
  .global-video-module { 
    padding: 12px;
  }
  
  .video-grid {
    padding: 12px;
  }
  
  .camera-status {
    flex-direction: column;
    gap: 8px;
  }
}
</style>


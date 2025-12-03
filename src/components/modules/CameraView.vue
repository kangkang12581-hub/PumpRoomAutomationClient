<template>
  <div class="camera-view">
    <div class="camera-header">
      <h3>{{ cameraName }}</h3>
      <div class="camera-controls">
        <button 
          @click="toggleCamera" 
          :disabled="loading"
          :class="['control-btn', streaming ? 'stop' : 'start']"
        >
          {{ streaming ? '停止' : '启动' }}
        </button>
        <div class="status-indicator" :class="statusClass">
          {{ statusText }}
        </div>
      </div>
    </div>
    
    <div class="camera-content">
      <div v-if="streaming" class="video-container">
        <img
          :src="mjpegUrl"
          alt="实时视频"
          class="video-stream"
          ref="videoEl"
          crossorigin="anonymous"
          @error="onVideoError"
          @load="onVideoLoad"
        />
      </div>
      
      <div v-else class="no-stream">
        <div v-if="loading" class="loading-spinner">
          <div class="spinner"></div>
          <p>正在连接摄像头...</p>
        </div>
        <div v-else>
          <div class="no-stream-icon">📹</div>
          <p>摄像头未启动</p>
          <p class="no-stream-hint">点击"启动"按钮开始视频流</p>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { getCurrentSiteCode, getCurrentSite } from '@/utils/siteManager'
import { configAPI } from '@/services/api'

export default {
  name: 'CameraView',
  props: {
    cameraId: {
      type: String,
      required: true
    },
    cameraName: {
      type: String,
      default: '摄像头'
    },
    // 摄像头类型：'internal' (机内) 或 'global' (全局)
    cameraType: {
      type: String,
      default: 'internal',
      validator: (value) => ['internal', 'global'].includes(value)
    }
  },
  data() {
    return {
      streaming: false,
      connected: false,
      loading: false,
      error: '',
      mjpegUrl: '',
      statusCheckInterval: null,
      // 后端服务基础地址
      // 开发模式（端口3000）使用相对路径，通过 Vite 代理访问
      backendBase: (import.meta?.env?.VITE_BACKEND_BASE)
        ? import.meta.env.VITE_BACKEND_BASE
        : (window.location.port === '3000' ? '' : `${window.location.origin}`)
    }
  },
  computed: {
    statusClass() {
      if (this.loading) return 'loading'
      if (this.connected && this.streaming) return 'streaming'
      if (this.connected) return 'connected'
      return 'disconnected'
    },
    statusText() {
      if (this.loading) return '处理中...'
      if (this.connected && this.streaming) return '正在播放'
      if (this.connected) return '已连接'
      return '未连接'
    }
  },
  mounted() {
    this.initializeCamera()
    this.startStatusCheck()
  },
  beforeUnmount() {
    this.stopStatusCheck()
    if (this.streaming) {
      this.stopStream().catch(() => {})
    }
  },
  methods: {
    async initializeCamera() {
      try {
        this.loading = true
        this.error = ''
        
        // 检查流服务状态
        try {
          const infoResp = await fetch(`${this.backendBase}/api/stream/info`)
          if (infoResp.ok) {
            const info = await infoResp.json()
            this.connected = info.streaming_service?.service_stats?.running || false
            this.streaming = this.connected
            if (this.streaming) {
              this.mjpegUrl = `${this.backendBase}/api/stream/mjpeg?ts=${Date.now()}`
            }
          }
        } catch (err) {
          console.warn('检查流服务状态失败:', err)
        }
      } catch (err) {
        console.error('初始化摄像头失败:', err)
        this.error = '初始化摄像头失败: ' + err.message
      } finally {
        this.loading = false
      }
    },
    
    async toggleCamera() {
      try {
        this.loading = true
        this.error = ''
        
        if (this.streaming) {
          // 停止摄像头
          await this.stopStream()
        } else {
          // 启动摄像头
          await this.startStream()
        }
      } catch (err) {
        console.error('切换摄像头状态失败:', err)
        this.error = '操作失败: ' + err.message
      } finally {
        this.loading = false
      }
    },
    
    async startStream() {
      try {
        // 读取当前站点摄像头配置
        let siteObj = getCurrentSite() || null
        let cameraIp = null
        let cameraUsername = null
        let cameraPassword = null

        // 根据摄像头类型选择对应的配置字段
        const isInternal = this.cameraType === 'internal'
        const cameraTypeLabel = isInternal ? '机内摄像头' : '全局摄像头'
        
        console.log(`启动${cameraTypeLabel}，类型: ${this.cameraType}`)

        if (siteObj) {
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
          const stored = getCurrentSiteCode()
          if (stored && typeof stored === 'string' && /[A-Za-z_\-]/.test(stored)) {
            const siteResp = await configAPI.getSiteConfig(stored)
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
            try {
              const listResp = await configAPI.getSiteConfigs(1, 1000)
              const list = listResp?.data?.sites || []
              const match = list.find(s => String(s.id) === String(stored))
              if (match) {
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

        // 必须有摄像头IP和用户名
        if (!cameraIp) {
          throw new Error(`当前站点未配置${cameraTypeLabel}IP，请在站点管理中填写后再试`)
        }
        if (!cameraUsername) {
          throw new Error(`当前站点未配置${cameraTypeLabel}用户名，请在站点管理中填写后再试`)
        }
        
        console.log(`${cameraTypeLabel}配置:`, {
          ip: cameraIp,
          username: cameraUsername,
          hasPassword: !!cameraPassword
        })

        // 同步配置到流服务
        const configResp = await fetch(`${this.backendBase}/api/stream/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: cameraIp, username: cameraUsername, password: cameraPassword || '' })
        })
        
        const configData = await configResp.json().catch(() => ({}))
        
        if (!configResp.ok) {
          throw new Error(configData.message || '配置摄像头参数失败，请检查服务状态')
        }
        
        // 验证配置是否成功应用
        if (!configData.applied || !configData.applied.ip) {
          throw new Error('摄像头IP配置失败，请重试')
        }

        // 配置成功后，告知后端启动
        const startResp = await fetch(`${this.backendBase}/api/stream/start`, { method: 'POST' })
        if (!startResp.ok) {
          const msg = (await startResp.json().catch(() => ({}))).message || '启动失败'
          throw new Error(msg)
        }
        
        // 设置 MJPEG 源地址
        this.mjpegUrl = `${this.backendBase}/api/stream/mjpeg?ts=${Date.now()}`
        this.streaming = true
        this.connected = true
        console.log('摄像头启动成功')
      } catch (error) {
        console.error('启动视频流失败:', error)
        throw error
      }
    },
    
    async stopStream() {
      try {
        this.streaming = false
        this.connected = false
        // 强制断开 MJPEG 连接
        this.mjpegUrl = 'about:blank'
        // 通知后端立即停止
        try {
          await fetch(`${this.backendBase}/api/stream/stop`, { method: 'POST' })
        } catch (err) {
          console.warn('停止流服务失败:', err)
        }
        console.log('摄像头停止成功')
      } catch (error) {
        console.error('停止视频流失败:', error)
        throw error
      }
    },
    
    startStatusCheck() {
      // 每5秒检查一次状态
      this.statusCheckInterval = setInterval(async () => {
        try {
          const infoResp = await fetch(`${this.backendBase}/api/stream/info`)
          if (infoResp.ok) {
            const info = await infoResp.json()
            const running = info.streaming_service?.service_stats?.running || false
            this.connected = running
            this.streaming = running
            
            // 如果状态变化，更新视频源
            if (this.streaming && !this.mjpegUrl.includes('/api/stream/mjpeg')) {
              this.mjpegUrl = `${this.backendBase}/api/stream/mjpeg?ts=${Date.now()}`
            } else if (!this.streaming && this.mjpegUrl.includes('/api/stream/mjpeg')) {
              this.mjpegUrl = 'about:blank'
            }
          }
        } catch (err) {
          console.warn('状态检查失败:', err)
        }
      }, 5000)
    },
    
    stopStatusCheck() {
      if (this.statusCheckInterval) {
        clearInterval(this.statusCheckInterval)
        this.statusCheckInterval = null
      }
    },
    
    onVideoLoad() {
      console.log('视频流加载成功')
      if (this.error && this.error.includes('视频流连接中断')) {
        this.error = ''
      }
    },
    
    onVideoError(event) {
      console.error('视频流加载错误:', event)
      if (this.streaming) {
        this.error = '视频流连接中断，正在尝试重连...'
        setTimeout(() => {
          if (this.streaming) {
            this.startStream().catch(err => {
              console.error('重连失败:', err)
            })
          }
        }, 3000)
      }
    }
  }
}
</script>

<style scoped>
.camera-view {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.camera-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.camera-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.control-btn.start {
  background: #28a745;
  color: white;
}

.control-btn.start:hover:not(:disabled) {
  background: #218838;
}

.control-btn.stop {
  background: #dc3545;
  color: white;
}

.control-btn.stop:hover:not(:disabled) {
  background: #c82333;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-indicator.loading {
  background: #ffc107;
  color: #856404;
}

.status-indicator.streaming {
  background: #28a745;
  color: white;
}

.status-indicator.connected {
  background: #17a2b8;
  color: white;
}

.status-indicator.disconnected {
  background: #6c757d;
  color: white;
}

.camera-content {
  position: relative;
  min-height: 300px;
}

.video-container {
  width: 100%;
  height: 400px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-container .video-stream {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-stream {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6c757d;
}

.no-stream-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-stream p {
  margin: 4px 0;
  font-size: 16px;
}

.no-stream-hint {
  font-size: 14px;
  color: #adb5bd;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px 20px;
  border-top: 1px solid #f5c6cb;
  font-size: 14px;
}
</style>

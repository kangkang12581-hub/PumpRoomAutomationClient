<template>
  <div class="site-management">
    <div class="page-header">
      <h1>站点管理</h1>
      <button class="btn-primary" @click="showCreateDialog">
        <span>➕</span> 添加站点
      </button>
    </div>

    <!-- 站点列表 -->
    <div class="site-grid">
      <div 
        v-for="site in sites" 
        :key="site.id" 
        class="site-card"
        :class="{ 'offline': !site.isOnline, 'disabled': !site.isEnabled }"
      >
        <div class="card-header">
          <div class="site-info">
            <h3>{{ site.siteName }}</h3>
            <span class="site-code">{{ site.siteCode }}</span>
          </div>
          <div class="status-badge" :class="site.isOnline ? 'online' : 'offline'">
            {{ site.isOnline ? '在线' : '离线' }}
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">位置:</span>
            <span class="value">{{ site.siteLocation || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">IP地址:</span>
            <span class="value">{{ site.ipAddress || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">OPC UA:</span>
            <span class="value endpoint">{{ site.opcuaEndpoint || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">状态:</span>
            <span class="value" :style="{ color: site.isEnabled ? '#67C23A' : '#909399' }">
              {{ site.isEnabled ? '已启用' : '已禁用' }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">泵数量:</span>
            <span class="value">{{ site.pumpCount }}</span>
          </div>
          <div class="info-row">
            <span class="label">📹 机内摄像头:</span>
            <span 
              class="value camera-status" 
              :style="{ color: site.internalCameraIp ? '#67C23A' : '#909399' }"
              :title="site.internalCameraIp ? `IP: ${site.internalCameraIp}` : '未配置'"
            >
              {{ site.internalCameraIp ? '✓ 已配置' : '✗ 未配置' }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">🌐 全局摄像头:</span>
            <span 
              class="value camera-status" 
              :style="{ color: site.globalCameraIp ? '#67C23A' : '#909399' }"
              :title="site.globalCameraIp ? `IP: ${site.globalCameraIp}` : '未配置'"
            >
              {{ site.globalCameraIp ? '✓ 已配置' : '✗ 未配置' }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <button class="btn-icon" @click="testConnection(site)" title="测试连接">
            🔍
          </button>
          <button 
            class="btn-icon" 
            @click="toggleSite(site)" 
            :title="site.isEnabled ? '禁用' : '启用'"
          >
            {{ site.isEnabled ? '🔴' : '🟢' }}
          </button>
          <button class="btn-icon" @click="editSite(site)" title="编辑">
            ✏️
          </button>
          <button class="btn-icon btn-danger" @click="confirmDelete(site)" title="删除">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑站点对话框 -->
    <div v-if="dialogVisible" class="dialog-overlay" @click.self="dialogVisible = false">
      <div class="dialog">
        <div class="dialog-header">
          <h2>{{ isEdit ? '编辑站点' : '创建站点' }}</h2>
          <button class="close-btn" @click="dialogVisible = false">✕</button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label>站点编码 *</label>
            <input 
              v-model="formData.siteCode" 
              :disabled="isEdit"
              placeholder="例如: SITE_001"
            />
          </div>

          <div class="form-group">
            <label>站点名称 *</label>
            <input v-model="formData.siteName" placeholder="例如: 一号泵房" />
          </div>

          <div class="form-group">
            <label>站点位置</label>
            <input v-model="formData.siteLocation" placeholder="例如: 北京市朝阳区" />
          </div>

          <div class="form-group">
            <label>站点描述</label>
            <textarea v-model="formData.siteDescription" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>IP地址</label>
              <input v-model="formData.ipAddress" placeholder="例如: 192.168.10.88" />
            </div>

            <div class="form-group">
              <label>端口</label>
              <input v-model.number="formData.port" type="number" placeholder="4840" />
            </div>
          </div>

          <div class="form-group">
            <label>OPC UA 端点</label>
            <input 
              v-model="formData.opcuaEndpoint" 
              placeholder="例如: opc.tcp://192.168.10.88:4840"
            />
            <small>留空则根据IP和端口自动生成</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>安全策略</label>
              <select v-model="formData.opcuaSecurityPolicy">
                <option value="None">None</option>
                <option value="Basic256Sha256">Basic256Sha256</option>
                <option value="Aes128_Sha256_RsaOaep">Aes128_Sha256_RsaOaep</option>
              </select>
            </div>

            <div class="form-group">
              <label>安全模式</label>
              <select v-model="formData.opcuaSecurityMode">
                <option value="None">None</option>
                <option value="Sign">Sign</option>
                <option value="SignAndEncrypt">SignAndEncrypt</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="formData.opcuaAnonymous" />
              匿名连接
            </label>
          </div>

          <div v-if="!formData.opcuaAnonymous" class="form-row">
            <div class="form-group">
              <label>用户名</label>
              <input v-model="formData.opcuaUsername" />
            </div>

            <div class="form-group">
              <label>密码</label>
              <input v-model="formData.opcuaPassword" type="password" />
            </div>
          </div>

          <div class="form-group">
            <label>泵数量</label>
            <input v-model.number="formData.pumpCount" type="number" min="0" />
          </div>

          <!-- 机内摄像头配置 -->
          <div class="form-section-title">📹 机内摄像头配置</div>
          
          <div class="form-group">
            <label>机内摄像头IP地址 *</label>
            <input 
              v-model="formData.internalCameraIp" 
              placeholder="例如: 192.168.1.64" 
            />
            <small>用于监控泵房内部设备的摄像头</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>机内摄像头用户名</label>
              <input 
                v-model="formData.internalCameraUsername" 
                placeholder="admin" 
              />
            </div>

            <div class="form-group">
              <label>机内摄像头密码</label>
              <input 
                v-model="formData.internalCameraPassword" 
                type="password" 
                placeholder="请输入摄像头密码" 
              />
            </div>
          </div>

          <!-- 全局摄像头配置 -->
          <div class="form-section-title">🌐 全局摄像头配置</div>
          
          <div class="form-group">
            <label>全局摄像头IP地址 *</label>
            <input 
              v-model="formData.globalCameraIp" 
              placeholder="例如: 192.168.1.65" 
            />
            <small>用于监控泵房全局环境的摄像头</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>全局摄像头用户名</label>
              <input 
                v-model="formData.globalCameraUsername" 
                placeholder="admin" 
              />
            </div>

            <div class="form-group">
              <label>全局摄像头密码</label>
              <input 
                v-model="formData.globalCameraPassword" 
                type="password" 
                placeholder="请输入摄像头密码" 
              />
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="formData.alarmEnabled" />
              启用报警
            </label>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn-secondary" @click="dialogVisible = false">取消</button>
          <button class="btn-primary" @click="saveSite" :disabled="!canSave">
            {{ isEdit ? '更新' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { siteAPI } from '@/services/api'

export default {
  name: 'SiteManagement',
  
  data() {
    return {
      sites: [],
      dialogVisible: false,
      isEdit: false,
      formData: this.getEmptyFormData(),
      loading: false
    }
  },
  
  computed: {
    canSave() {
      return this.formData.siteCode && this.formData.siteName
    }
  },
  
  async mounted() {
    await this.loadSites()
  },
  
  methods: {
    getEmptyFormData() {
      return {
        siteCode: '',
        siteName: '',
        siteLocation: '',
        siteDescription: '',
        ipAddress: '',
        port: 4840,
        protocol: 'OPC.UA',
        opcuaEndpoint: '',
        opcuaSecurityPolicy: 'None',
        opcuaSecurityMode: 'None',
        opcuaAnonymous: true,
        opcuaUsername: '',
        opcuaPassword: '',
        opcuaSessionTimeout: 30000,
        opcuaRequestTimeout: 10000,
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        pumpCount: 0,
        internalCameraIp: '',
        internalCameraUsername: '',
        internalCameraPassword: '',
        globalCameraIp: '',
        globalCameraUsername: '',
        globalCameraPassword: '',
        alarmEnabled: true,
        alarmPhoneNumbers: '',
        alarmEmailAddresses: ''
      }
    },
    
    async loadSites() {
      this.loading = true
      try {
        this.sites = await siteAPI.getAllSites()
      } catch (error) {
        console.error('加载站点失败:', error)
        alert('加载站点失败')
      } finally {
        this.loading = false
      }
    },
    
    showCreateDialog() {
      this.isEdit = false
      this.formData = this.getEmptyFormData()
      this.dialogVisible = true
    },
    
    editSite(site) {
      this.isEdit = true
      this.formData = { ...site }
      this.dialogVisible = true
    },
    
    async saveSite() {
      this.loading = true
      try {
        if (this.isEdit) {
          // 编辑时，排除 isEnabled 和 isOnline，这些字段应该通过专门的接口修改
          // 避免意外重置这些状态字段
          const { isEnabled, isOnline, ...updateData } = this.formData
          await siteAPI.updateSite(this.formData.siteCode, updateData)
          alert('站点更新成功')
        } else {
          await siteAPI.createSite(this.formData)
          alert('站点创建成功')
        }
        this.dialogVisible = false
        await this.loadSites()
      } catch (error) {
        console.error('保存站点失败:', error)
        alert(`保存站点失败: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    
    async toggleSite(site) {
      const action = site.isEnabled ? '禁用' : '启用'
      if (!confirm(`确定要${action}站点 ${site.siteName} 吗？`)) return
      
      try {
        await siteAPI.toggleSite(site.siteCode, !site.isEnabled)
        alert(`${action}成功`)
        await this.loadSites()
      } catch (error) {
        console.error(`${action}站点失败:`, error)
        alert(`${action}失败`)
      }
    },
    
    async testConnection(site) {
      this.loading = true
      try {
        const result = await siteAPI.testConnection(site.siteCode)
        const message = result.isConnected 
          ? `✅ 连接成功\n站点: ${result.siteName}\n端点: ${result.endpoint}`
          : `❌ 连接失败\n站点: ${result.siteName}`
        alert(message)
      } catch (error) {
        console.error('测试连接失败:', error)
        alert('测试连接失败')
      } finally {
        this.loading = false
      }
    },
    
    async confirmDelete(site) {
      if (!confirm(`确定要删除站点 ${site.siteName} 吗？此操作不可恢复！`)) return
      
      try {
        await siteAPI.deleteSite(site.siteCode)
        alert('删除成功')
        await this.loadSites()
      } catch (error) {
        console.error('删除站点失败:', error)
        alert('删除失败')
      }
    }
  }
}
</script>

<style scoped>
.site-management {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  color: #fff;
  font-size: 28px;
  margin: 0;
}

.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.site-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.site-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.site-card.offline {
  opacity: 0.8;
}

.site-card.disabled {
  opacity: 0.6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.site-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #333;
}

.site-code {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.online {
  background: #67C23A;
  color: #fff;
}

.status-badge.offline {
  background: #F56C6C;
  color: #fff;
}

.card-body {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row .label {
  color: #666;
  font-weight: 500;
}

.info-row .value {
  color: #333;
  text-align: right;
  max-width: 60%;
}

.info-row .value.endpoint {
  font-size: 12px;
  font-family: monospace;
  word-break: break-all;
}

.info-row .value.camera-status {
  font-weight: 500;
  cursor: help;
}

.card-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-icon {
  padding: 8px 12px;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #e0e0e0;
  transform: scale(1.1);
}

.btn-icon.btn-danger:hover {
  background: #F56C6C;
}

.btn-primary {
  padding: 10px 20px;
  background: #409EFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 10px 20px;
  background: #909399;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #a6a9ad;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #fff;
  border-radius: 12px;
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.dialog-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.form-group small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

input[type="checkbox"] {
  width: auto !important;
  margin-right: 8px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
  margin: 24px 0 16px 0;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left: 4px solid #409EFF;
  border-radius: 4px;
}
</style>


<template>
  <div class="site-selector">
    <div class="selector-label">当前站点:</div>
    <select 
      v-model="selectedSiteCode" 
      @change="handleSiteChange" 
      class="site-select"
      :disabled="loading"
    >
      <option value="">请选择站点...</option>
      <option 
        v-for="site in enabledSites" 
        :key="site.siteCode" 
        :value="site.siteCode"
      >
        {{ site.siteName }} ({{ site.siteCode }})
        <span v-if="!site.isOnline" class="offline-indicator">●</span>
      </option>
    </select>
    
    <div class="connection-status" v-if="currentSite">
      <span 
        class="status-dot" 
        :class="currentSite.isOnline ? 'online' : 'offline'"
      ></span>
      <span class="status-text">
        {{ currentSite.isOnline ? '已连接' : '未连接' }}
      </span>
    </div>
    
    <button 
      class="refresh-btn" 
      @click="refreshSites" 
      :disabled="loading"
      title="刷新站点列表"
    >
      <span v-if="!loading">🔄</span>
      <span v-else>⏳</span>
    </button>
  </div>
</template>

<script>
import { siteAssignmentAPI } from '@/services/api'

export default {
  name: 'SiteSelector',
  
  data() {
    return {
      enabledSites: [],
      selectedSiteCode: '',
      loading: false
    }
  },
  
  computed: {
    currentSite() {
      return this.enabledSites.find(s => s.siteCode === this.selectedSiteCode)
    }
  },
  
  async mounted() {
    await this.loadSites()
    
    // 从localStorage恢复上次选择的站点
    const savedSiteCode = localStorage.getItem('selectedSiteCode')
    if (savedSiteCode) {
      const siteExists = this.enabledSites.some(s => s.siteCode === savedSiteCode)
      if (siteExists) {
        this.selectedSiteCode = savedSiteCode
        this.$emit('site-changed', savedSiteCode)
      }
    }
    
    // 如果没有选择站点，自动选择第一个
    if (!this.selectedSiteCode && this.enabledSites.length > 0) {
      this.selectedSiteCode = this.enabledSites[0].siteCode
      this.$emit('site-changed', this.selectedSiteCode)
    }
  },
  
  methods: {
    async loadSites() {
      this.loading = true
      try {
        // 获取当前用户被分配的站点
        const response = await siteAssignmentAPI.getMySites()
        console.log('用户站点响应:', response)
        // 处理响应数据，只显示启用的站点
        const sites = response.data?.sites || response.sites || []
        this.enabledSites = sites
          .filter(site => site.isEnabled !== false) // 只显示启用的站点
          .map(site => ({
            siteCode: site.siteCode || site.site_code,
            siteName: site.siteName || site.site_name,
            siteLocation: site.siteLocation || site.site_location,
            isOnline: site.isOnline || site.is_online || false,
            isEnabled: site.isEnabled !== undefined ? site.isEnabled : site.is_enabled
          }))
        console.log('用户可用站点:', this.enabledSites)
      } catch (error) {
        console.error('加载用户站点失败:', error)
        this.$emit('error', '加载站点列表失败')
        this.enabledSites = []
      } finally {
        this.loading = false
      }
    },
    
    handleSiteChange() {
      localStorage.setItem('selectedSiteCode', this.selectedSiteCode)
      this.$emit('site-changed', this.selectedSiteCode)
    },
    
    async refreshSites() {
      await this.loadSites()
      
      // 检查当前选择的站点是否还存在
      if (this.selectedSiteCode) {
        const siteExists = this.enabledSites.some(s => s.siteCode === this.selectedSiteCode)
        if (!siteExists) {
          this.selectedSiteCode = this.enabledSites.length > 0 ? this.enabledSites[0].siteCode : ''
          this.handleSiteChange()
        }
      }
    }
  }
}
</script>

<style scoped>
.site-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.selector-label {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}

.site-select {
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  background: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  min-width: 200px;
  transition: all 0.3s ease;
}

.site-select:hover:not(:disabled) {
  border-color: #409EFF;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
}

.site-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.offline-indicator {
  color: #F56C6C;
  font-size: 10px;
  margin-left: 4px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.online {
  background: #67C23A;
  box-shadow: 0 0 6px #67C23A;
}

.status-dot.offline {
  background: #F56C6C;
  box-shadow: 0 0 6px #F56C6C;
  animation: none;
}

.status-text {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
}

.refresh-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>


<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import apiService from './services/api.js'

export default {
  name: 'App',
  setup() {
    let tokenRefreshInterval = null
    
    // 检查并刷新token
    const checkAndRefreshToken = async () => {
      if (!apiService.isAuthenticated()) {
        return
      }
      
      if (apiService.isTokenExpiringSoon()) {
        try {
          console.log('Token即将过期，自动刷新...')
          await apiService.refreshToken()
          console.log('Token自动刷新成功')
        } catch (error) {
          console.error('Token自动刷新失败:', error)
          // 如果刷新失败，清除认证信息
          apiService.clearAuth()
        }
      }
    }
    
    onMounted(() => {
      // 每5分钟检查一次token是否即将过期
      tokenRefreshInterval = setInterval(checkAndRefreshToken, 5 * 60 * 1000)
      
      // 立即检查一次
      checkAndRefreshToken()
    })
    
    onUnmounted(() => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval)
      }
    })
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  width: 100%;
}
</style>


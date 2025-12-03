<template>
  <div class="history-module">
    <div class="history-panel card fade-in-up">
      <h3 class="panel-title">历史记录</h3>
      <div class="history-list">
        <div v-for="record in historyRecords" :key="record.id" class="history-item">
          <div class="history-time">{{ formatTime(record.time) }}</div>
          <div class="history-content">
            <div class="history-title">{{ record.title }}</div>
            <div class="history-description">{{ record.description }}</div>
          </div>
          <div class="history-type" :class="record.type">{{ record.type }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HistoryModule',
  setup() {
    const historyRecords = ref([
      { id: 1, time: new Date(), title: '系统启动', description: '系统正常启动', type: 'info' },
      { id: 2, time: new Date(Date.now() - 3600000), title: '泵机维护', description: '主泵#1完成维护', type: 'success' }
    ])

    const formatTime = (time) => {
      return time.toLocaleString('zh-CN')
    }

    return { historyRecords, formatTime }
  }
}
</script>

<style scoped>
.history-module { padding: 24px; }
.history-panel { padding: 24px; }
.panel-title { font-size: 18px; font-weight: 600; margin-bottom: 20px; }
.history-list { display: flex; flex-direction: column; gap: 16px; }
.history-item { display: flex; gap: 12px; padding: 16px; background: #f8fafc; border-radius: 8px; }
.history-time { font-size: 12px; color: #666; min-width: 120px; }
.history-content { flex: 1; }
.history-title { font-weight: 600; margin-bottom: 4px; }
.history-description { font-size: 14px; color: #666; }
.history-type { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.history-type.info { background: #e3f2fd; color: #1976d2; }
.history-type.success { background: #e8f5e8; color: #2e7d32; }
</style>


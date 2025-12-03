<template>
  <div class="maintenance-module">
    <div class="maintenance-panel card fade-in-up">
      <h3 class="panel-title">系统维护</h3>
      <div class="maintenance-actions">
        <button @click="runDiagnostic" class="action-btn btn primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
          </svg>
          运行诊断
        </button>
        <button @click="cleanCache" class="action-btn btn secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="2"/>
          </svg>
          清理缓存
        </button>
        <button @click="backupData" class="action-btn btn info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
          </svg>
          备份数据
        </button>
      </div>
      <div class="maintenance-status">
        <h4>系统状态</h4>
        <div class="status-list">
          <div class="status-item">
            <span class="status-label">磁盘使用率</span>
            <span class="status-value">65%</span>
          </div>
          <div class="status-item">
            <span class="status-label">内存使用率</span>
            <span class="status-value">42%</span>
          </div>
          <div class="status-item">
            <span class="status-label">CPU使用率</span>
            <span class="status-value">18%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaintenanceModule',
  setup() {
    const runDiagnostic = () => {
      console.log('运行系统诊断')
    }

    const cleanCache = () => {
      console.log('清理系统缓存')
    }

    const backupData = () => {
      console.log('备份系统数据')
    }

    return {
      runDiagnostic,
      cleanCache,
      backupData
    }
  }
}
</script>

<style scoped>
.maintenance-module { padding: 24px; }
.maintenance-panel { padding: 24px; }
.panel-title { font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
.maintenance-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; }
.action-btn { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.3s ease; }
.action-btn.primary { background: #27ae60; color: white; }
.action-btn.secondary { background: #95a5a6; color: white; }
.action-btn.info { background: #3498db; color: white; }
.action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.maintenance-status h4 { margin-bottom: 16px; color: #333; }
.status-list { display: flex; flex-direction: column; gap: 12px; }
.status-item { display: flex; justify-content: space-between; padding: 12px; background: #f8fafc; border-radius: 6px; }
.status-label { color: #666; }
.status-value { font-weight: 600; color: #333; }
</style>
<template>
  <div class="reports-module">
    <div class="reports-panel card fade-in-up">
      <h3 class="panel-title">报表生成</h3>
      <div class="report-options">
        <div class="form-group">
          <label>报表类型</label>
          <select v-model="reportType" class="input-field">
            <option value="daily">日报表</option>
            <option value="weekly">周报表</option>
            <option value="monthly">月报表</option>
          </select>
        </div>
        <button @click="generateReport" class="btn primary">生成报表</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ReportsModule',
  setup() {
    const reportType = ref('daily')
    
    const generateReport = () => {
      console.log('生成报表:', reportType.value)
    }

    return { reportType, generateReport }
  }
}
</script>

<style scoped>
.reports-module { padding: 24px; }
.reports-panel { padding: 24px; }
.panel-title { font-size: 18px; font-weight: 600; margin-bottom: 20px; }
.report-options { display: flex; gap: 16px; align-items: end; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 8px; font-weight: 500; }
.input-field { padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; }
.btn { padding: 12px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
</style>


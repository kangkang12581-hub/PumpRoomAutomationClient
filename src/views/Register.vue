<template>
  <div class="register-container">
    <div class="register-card card fade-in-up">
      <!-- 系统标题和Logo区域 -->
      <div class="register-header">
        <div class="logo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="url(#gradient)" stroke="url(#gradient)" stroke-width="2"/>
            <circle cx="12" cy="18" r="2" fill="url(#gradient)"/>
            <path d="M8 20H16" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="system-title">用户注册</h1>
        <p class="system-subtitle">创建您的泵房自动化系统账户</p>
      </div>

      <!-- 注册表单 -->
      <div class="register-form">
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username" class="form-label">用户名 *</label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              class="input-field"
              placeholder="请输入用户名（3-50个字符）"
              required
              :disabled="loading"
              minlength="3"
              maxlength="50"
            />
          </div>

          <div class="form-group">
            <label for="full_name" class="form-label">姓名</label>
            <input
              id="full_name"
              v-model="registerForm.full_name"
              type="text"
              class="input-field"
              placeholder="请输入您的真实姓名"
              :disabled="loading"
              maxlength="100"
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">邮箱</label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              class="input-field"
              placeholder="请输入邮箱地址"
              :disabled="loading"
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">密码 *</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field"
                placeholder="请输入密码（至少6个字符）"
                required
                :disabled="loading"
                minlength="6"
                maxlength="100"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3L21 21M10.584 10.587C10.2319 10.9391 10.0303 11.4304 10.0303 11.9435C10.0303 12.4566 10.2319 12.9479 10.584 13.3L10.584 13.3C10.9361 13.6521 11.4274 13.8537 11.9405 13.8537C12.4536 13.8537 12.9449 13.6521 13.297 13.3M10.584 10.587L13.297 13.3M10.584 10.587L8 8.003M13.297 13.3L16 16M8 8.003C6.14903 9.85297 5.31445 12.0242 6.07 14.12C7.36952 17.7279 10.8979 20 15 20C16.9421 20 18.7514 19.4407 20.262 18.474M8 8.003L9.262 6.741C10.7726 5.77524 12.5819 5.21595 14.524 5.216C18.6261 5.216 22.1545 7.48805 23.454 11.096C23.1192 11.9735 22.7071 12.8142 22.223 13.604" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#666" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm_password" class="form-label">确认密码 *</label>
            <div class="password-input-wrapper">
              <input
                id="confirm_password"
                v-model="registerForm.confirm_password"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="input-field"
                placeholder="请再次输入密码"
                required
                :disabled="loading"
                minlength="6"
                maxlength="100"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="loading"
              >
                <svg v-if="showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3L21 21M10.584 10.587C10.2319 10.9391 10.0303 11.4304 10.0303 11.9435C10.0303 12.4566 10.2319 12.9479 10.584 13.3L10.584 13.3C10.9361 13.6521 11.4274 13.8537 11.9405 13.8537C12.4536 13.8537 12.9449 13.6521 13.297 13.3M10.584 10.587L13.297 13.3M10.584 10.587L8 8.003M13.297 13.3L16 16M8 8.003C6.14903 9.85297 5.31445 12.0242 6.07 14.12C7.36952 17.7279 10.8979 20 15 20C16.9421 20 18.7514 19.4407 20.262 18.474M8 8.003L9.262 6.741C10.7726 5.77524 12.5819 5.21595 14.524 5.216C18.6261 5.216 22.1545 7.48805 23.454 11.096C23.1192 11.9735 22.7071 12.8142 22.223 13.604" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#666" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="#666" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 成功消息 -->
          <div v-if="successMessage" class="success-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#27ae60" stroke-width="2"/>
              <path d="m9 12 2 2 4-4" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ successMessage }}
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e74c3c" stroke-width="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="#e74c3c" stroke-width="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="#e74c3c" stroke-width="2"/>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            class="register-button btn"
            :disabled="loading || !isFormValid"
          >
            <svg v-if="loading" class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="60" stroke-dashoffset="60" stroke-linecap="round">
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/>
              </circle>
            </svg>
            <span v-if="loading">注册中...</span>
            <span v-else>注册账户</span>
          </button>

          <!-- 登录链接 -->
          <div class="login-link">
            <p>已有账户？ 
              <router-link to="/login" class="link">立即登录</router-link>
            </p>
          </div>
        </form>
      </div>

      <!-- 底部信息 -->
      <div class="register-footer">
        <p class="copyright">© 2024 泵房自动化系统. 保留所有权利.</p>
        <p class="version">版本 v1.0.0</p>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api.js'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const registerForm = ref({
      username: '',
      password: '',
      confirm_password: '',
      email: '',
      full_name: ''
    })

    const isFormValid = computed(() => {
      return registerForm.value.username.trim().length >= 3 && 
             registerForm.value.password.length >= 6 &&
             registerForm.value.password === registerForm.value.confirm_password
    })

    const handleRegister = async () => {
      if (!isFormValid.value) return

      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        // 验证密码是否一致
        if (registerForm.value.password !== registerForm.value.confirm_password) {
          errorMessage.value = '密码和确认密码不一致'
          return
        }

        // 调用注册API
        const response = await authAPI.register({
          username: registerForm.value.username,
          password: registerForm.value.password,
          confirm_password: registerForm.value.confirm_password,
          email: registerForm.value.email || null,
          full_name: registerForm.value.full_name || null
        })

        // 注册成功
        successMessage.value = response.message || '注册成功！'
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        
      } catch (error) {
        console.error('注册错误:', error)
        
        // 根据错误类型显示不同的错误信息
        if (error.message.includes('用户名已存在')) {
          errorMessage.value = '用户名已存在，请选择其他用户名'
        } else if (error.message.includes('密码')) {
          errorMessage.value = '密码格式不正确，请确保密码至少6个字符'
        } else if (error.message.includes('网络') || error.message.includes('fetch')) {
          errorMessage.value = '网络连接失败，请检查网络设置'
        } else {
          errorMessage.value = error.message || '注册失败，请稍后重试'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      registerForm,
      loading,
      showPassword,
      showConfirmPassword,
      errorMessage,
      successMessage,
      isFormValid,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.register-card {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  position: relative;
  z-index: 10;
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  margin-bottom: 20px;
}

.system-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.system-subtitle {
  color: #666;
  font-size: 14px;
  font-weight: 400;
}

.register-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid rgba(39, 174, 96, 0.3);
  border-radius: 8px;
  color: #27ae60;
  font-size: 14px;
  margin-bottom: 20px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 8px;
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 20px;
}

.register-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link p {
  color: #666;
  font-size: 14px;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.register-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.copyright {
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
}

.version {
  color: #999;
  font-size: 11px;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-card {
    padding: 24px;
    margin: 10px;
  }
  
  .system-title {
    font-size: 24px;
  }
}
</style>





<template>
  <div class="user-management-module">
    <!-- 用户操作面板 -->
    <div class="user-controls card fade-in-up">
      <h3 class="panel-title">用户管理</h3>
      <div class="controls-content">
        <div class="search-section">
          <div class="search-group">
            <input 
              v-model="searchQuery" 
              placeholder="搜索用户..." 
              class="search-input"
            />
            <select v-model="roleFilter" class="filter-select">
              <option value="all">全部角色</option>
              <option value="admin">管理员</option>
              <option value="operator">操作员</option>
              <option value="observer">观察员</option>
            </select>
          </div>
        </div>
        
        <div class="action-section">
          <button @click="showAddUserDialog = true" class="btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
            </svg>
            添加用户
          </button>
          <button @click="openSystemConfigDialog" class="btn config">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 1V3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 21V23" stroke="currentColor" stroke-width="2"/>
              <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" stroke-width="2"/>
              <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" stroke-width="2"/>
              <path d="M1 12H3" stroke="currentColor" stroke-width="2"/>
              <path d="M21 12H23" stroke="currentColor" stroke-width="2"/>
              <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" stroke-width="2"/>
              <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
            </svg>
            系统配置
          </button>
          <button @click="showSiteConfigDialog = true" class="btn config">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 10C21 17 12 23 12 23S3 17 3 10A9 9 0 0 1 21 10Z" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            站点配置
          </button>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message card fade-in-up" style="animation-delay: 0.05s">
      <p>{{ error }}</p>
      <button @click="loadUsers" class="btn secondary">重试</button>
    </div>

    <!-- 用户列表 -->
    <div class="user-list card fade-in-up" style="animation-delay: 0.1s">
      <h3 class="panel-title">
        用户列表 
        <span class="user-count">(共 {{ pagination.total }} 个用户)</span>
        <span v-if="loading" class="loading-text">加载中...</span>
      </h3>
      
      <div class="table-container">
        <table class="user-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>用户名称</th>
              <th>用户组</th>
              <th>用户级别</th>
              <th>邮箱</th>
              <th>电话</th>
              <th>状态</th>
              <th>站点</th>
              <th>操作权限</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0 && !loading" class="empty-row">
              <td colspan="10" class="empty-message">
                暂无用户数据
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ (user.display_name || user.full_name || user.username).charAt(0).toUpperCase() }}
                  </div>
                  <span class="username">{{ user.username }}</span>
                </div>
              </td>
              <td>{{ user.display_name || user.full_name || '' }}</td>
              <td>
                <span class="role-badge" :class="user.user_group">
                  {{ getRoleName(user) }}
                </span>
              </td>
              <td>
                <span class="level-badge" :class="user.user_level">
                  {{ getLevelName(user) }}
                </span>
              </td>
              <td>{{ user.email || '' }}</td>
              <td>{{ user.phone || '' }}</td>
              <td>
                <span class="status-badge" :class="user.status">
                  {{ getStatusName(user) }}
                </span>
              </td>
              <td>
                <div class="sites-info">
                  <span class="site-count-badge" :title="getUserSitesTooltip(user)">
                    <svg class="badge-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 22s8-5.33 8-12a8 8 0 1 0-16 0c0 6.67 8 12 8 12Z" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span class="badge-text">{{ userSitesMap[user.id]?.length || 0 }}</span>
                  </span>
                </div>
              </td>
              <td>
                <div class="permissions-info">
                  <span class="status-badge" :class="hasOperatePermission(user) ? 'ACTIVE' : 'INACTIVE'">
                    {{ hasOperatePermission(user) ? '有权限' : '无权限' }}
                  </span>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="editUser(user)" class="action-btn edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2"/>
                      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button @click="toggleUserStatus(user)" class="action-btn" :class="user.status === 'ACTIVE' ? 'disable' : 'enable'">
                    <svg v-if="user.status === 'ACTIVE'" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button @click="openAssignDialogForUser(user)" class="action-btn" title="分配站点">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M10 13a5 5 0 0 1 7.07 0l2.12 2.12a3 3 0 0 1-4.24 4.24L12.83 17.2" stroke="currentColor" stroke-width="2"/>
                      <path d="M14 11a5 5 0 0 1-7.07 0L4.81 8.88a3 3 0 0 1 4.24-4.24L11.17 6.8" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <div v-if="!isProtectedUser(user)" class="delete-dropdown" @mouseleave="hideDeleteOptions(user.id)">
                    <button 
                      @click="showDeleteOptions(user)" 
                      @mouseenter="showDeleteDropdown(user.id)"
                      class="action-btn delete" 
                      :disabled="user.username === 'admin'"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="margin-left: 2px;">
                        <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                    
                    <div 
                      v-if="deleteDropdown === user.id" 
                      class="delete-options"
                      @mouseenter="keepDeleteDropdown(user.id)"
                    >
                      <button @click="deleteUser(user, false)" class="delete-option soft">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        禁用用户
                      </button>
                      <button @click="deleteUser(user, true)" class="delete-option hard">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H5H21" stroke="currentColor" stroke-width="2"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        彻底删除
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页控件 -->
      <div class="pagination-container" v-if="pagination.total > 0">
        <div class="pagination-info">
          <span>每页显示：</span>
          <select v-model="pagination.size" @change="handlePageSizeChange" class="page-size-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="pagination-text">
            <template v-if="pagination.total > 0">
              显示第 {{ (pagination.page - 1) * pagination.size + 1 }} - {{ Math.min(pagination.page * pagination.size, pagination.total) }} 条，共 {{ pagination.total }} 条
            </template>
            <template v-else>
              暂无数据
            </template>
          </span>
        </div>
        <div class="pagination-controls">
          <button 
            @click="goToPage(1)" 
            class="pagination-btn"
            :disabled="pagination.page === 1 || loading"
            title="首页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 18L5 12L11 6M19 18L13 12L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            @click="goToPage(pagination.page - 1)" 
            class="pagination-btn"
            :disabled="pagination.page === 1 || loading"
            title="上一页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <div class="page-numbers">
            <template v-for="pageNum in getPageNumbers()" :key="pageNum">
              <button
                v-if="pageNum !== '...'"
                @click="goToPage(pageNum)"
                class="pagination-btn page-number"
                :class="{ active: pageNum === pagination.page }"
                :disabled="loading"
              >
                {{ pageNum }}
              </button>
              <span v-else class="page-ellipsis">...</span>
            </template>
          </div>
          
          <button 
            @click="goToPage(pagination.page + 1)" 
            class="pagination-btn"
            :disabled="pagination.page >= pagination.pages || loading"
            title="下一页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            @click="goToPage(pagination.pages)" 
            class="pagination-btn"
            :disabled="pagination.page >= pagination.pages || loading"
            title="末页"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 18L19 12L13 6M5 18L11 12L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑用户对话框 -->
    <div v-if="showAddUserDialog || editingUser" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-content" @click.stop>
        <h3 class="dialog-title">{{ editingUser ? '编辑用户' : '添加用户' }}</h3>
        
        <div class="dialog-form">
          <div class="form-row">
            <div class="form-group">
              <label>用户名</label>
              <input 
                v-model="userForm.username" 
                :disabled="editingUser"
                class="input-field" 
                placeholder="用户名"
              />
            </div>
            <div class="form-group">
              <label>姓名</label>
              <input v-model="userForm.name" class="input-field" placeholder="真实姓名" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>邮箱</label>
              <input v-model="userForm.email" type="email" class="input-field" placeholder="邮箱地址" />
            </div>
            <div class="form-group">
              <label>手机号</label>
              <input v-model="userForm.phone" type="tel" class="input-field" placeholder="手机号码" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>角色</label>
              <select v-model="userForm.role" class="input-field">
                <option v-if="isRoot" value="ADMIN">管理员</option>
                <option value="OPERATOR">操作员</option>
                <option value="OBSERVER">观察员</option>
              </select>
            </div>
          </div>
          
          <div class="form-row" v-if="!editingUser">
            <div class="form-group">
              <label>密码</label>
              <input v-model="userForm.password" type="password" class="input-field" placeholder="密码" />
            </div>
            <div class="form-group">
              <label>确认密码</label>
              <input v-model="userForm.confirmPassword" type="password" class="input-field" placeholder="确认密码" />
            </div>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button @click="saveUser" class="btn primary" :disabled="!isFormValid">
            {{ editingUser ? '更新' : '添加' }}
          </button>
          <button @click="closeDialog" class="btn secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 系统配置对话框 -->
    <div v-if="showSystemConfigDialog" class="dialog-overlay" @click="closeSystemConfigDialog">
      <div class="dialog-content config-dialog" @click.stop>
        <h3 class="dialog-title">系统配置</h3>
        
        <div class="dialog-form">
          <!-- 电话报警配置 -->
          <div class="config-section">
            <h4 class="section-title">电话报警配置</h4>
            <div class="form-row">
              <div class="form-group">
                <label>电话报警地址</label>
                <input v-model="systemConfigForm.phone_alarm_address" class="input-field" placeholder="电话报警服务地址" />
              </div>
              <div class="form-group">
                <label>电话接入ID</label>
                <input v-model="systemConfigForm.phone_access_id" class="input-field" placeholder="电话接入标识" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>电话接入密钥</label>
                <input v-model="systemConfigForm.phone_access_key" type="password" class="input-field" placeholder="电话接入密钥" />
              </div>
            </div>
          </div>

          <!-- 短信配置 -->
          <div class="config-section">
            <h4 class="section-title">短信配置</h4>
            <div class="form-row">
              <div class="form-group">
                <label>短信接入ID</label>
                <input v-model="systemConfigForm.sms_access_id" class="input-field" placeholder="短信接入标识" />
              </div>
              <div class="form-group">
                <label>短信接入密钥</label>
                <input v-model="systemConfigForm.sms_access_key" type="password" class="input-field" placeholder="短信接入密钥" />
              </div>
            </div>
          </div>

          <!-- 邮件服务器配置 -->
          <div class="config-section">
            <h4 class="section-title">邮件服务器配置</h4>
            <div class="form-row">
              <div class="form-group">
                <label>发件服务器SMTP地址</label>
                <input v-model="systemConfigForm.smtp_server" class="input-field" placeholder="如：smtp.gmail.com" />
              </div>
              <div class="form-group">
                <label>发件服务器端口</label>
                <input v-model="systemConfigForm.smtp_port" type="number" class="input-field" placeholder="587" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>发件邮箱账号</label>
                <input v-model="systemConfigForm.email_account" type="email" class="input-field" placeholder="邮箱地址" />
              </div>
              <div class="form-group">
                <label>发件邮箱密码</label>
                <input v-model="systemConfigForm.email_password" type="password" class="input-field" placeholder="邮箱密码" />
              </div>
            </div>
          </div>

          

          
        </div>
        
        <div class="dialog-actions">
          <button @click="saveSystemConfig" class="btn primary" :disabled="!isSystemConfigValid">
            保存配置
          </button>
          <button @click="closeSystemConfigDialog" class="btn secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 站点配置对话框 -->
    <div v-if="showSiteConfigDialog" class="dialog-overlay" @click="closeSiteConfigDialog">
      <div class="dialog-content config-dialog" @click.stop>
        <h3 class="dialog-title">
          站点管理
          <span class="site-count">({{ sites.length }} 个站点)</span>
        </h3>
        
        <!-- 站点操作工具栏 -->
        <div class="site-toolbar">
          <div class="toolbar-left">
            <input 
              v-model="siteSearchQuery" 
              placeholder="搜索站点..." 
              class="search-input-small"
            />
            <button @click="showAddSiteDialog = true" class="btn primary-small">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
              </svg>
              添加站点
            </button>
          </div>
          <div class="toolbar-right">
            <button @click="batchEnableSites" class="btn success-small" :disabled="selectedSites.length === 0">
              批量启用
            </button>
            <button @click="batchDisableSites" class="btn warning-small" :disabled="selectedSites.length === 0">
              批量禁用
            </button>
            <button @click="openAssignDialog" class="btn primary-small" :disabled="selectedSites.length === 0">
              分配用户
            </button>
            <button @click="openUnassignDialog" class="btn secondary" :disabled="selectedSites.length === 0">
              取消分配
            </button>
          </div>
        </div>

        <!-- 站点列表 -->
        <div class="sites-list">
          <div class="sites-header">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="selectAllSites"
                @change="toggleSelectAllSites"
              />
              全选
            </label>
            <span class="header-label">站点编码</span>
            <span class="header-label">站点名称</span>
            <span class="header-label">状态</span>
            <span class="header-label">在线状态</span>
            <span class="header-label">操作</span>
          </div>
          
          <div class="sites-content">
            <div 
              v-for="site in filteredSites" 
              :key="site.id" 
              class="site-item"
              :class="{ 'site-disabled': !(site.isEnabled || site.is_enabled) }"
            >
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="selectedSites"
                  :value="site.id"
                />
              </label>
              <span class="site-code">{{ site.siteCode || site.site_code }}</span>
              <span class="site-name">{{ site.siteName || site.site_name }}</span>
              <span class="site-status">
                <span 
                  class="status-indicator" 
                  :class="(site.isEnabled || site.is_enabled) ? 'status-enabled' : 'status-disabled'"
                >
                  {{ (site.isEnabled || site.is_enabled) ? '启用' : '禁用' }}
                </span>
              </span>
              <span class="site-online">
                <span 
                  class="status-indicator" 
                  :class="(site.isOnline || site.is_online) ? 'status-online' : 'status-offline'"
                >
                  {{ (site.isOnline || site.is_online) ? '在线' : '离线' }}
                </span>
              </span>
              <div class="site-actions">
                <button @click="editSite(site)" class="action-btn-small edit">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <button 
                  @click="toggleSiteStatus(site)" 
                  class="action-btn-small" 
                  :class="(site.isEnabled || site.is_enabled) ? 'disable' : 'enable'"
                >
                  <svg v-if="site.isEnabled || site.is_enabled" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <button @click="deleteSite(site)" class="action-btn-small delete">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button @click="closeSiteConfigDialog" class="btn secondary">关闭</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑站点对话框 -->
    <div v-if="showAddSiteDialog || editingSite" class="dialog-overlay" @click="closeSiteDialog">
      <div class="dialog-content" @click.stop>
        <h3 class="dialog-title">{{ editingSite ? '编辑站点' : '添加站点' }}</h3>
        
        <div class="dialog-form">
          <div class="form-row">
            <div class="form-group">
              <label>站点编码</label>
              <input 
                v-model="siteForm.siteCode" 
                :disabled="editingSite"
                class="input-field" 
                placeholder="如：PX1_611"
              />
            </div>
            <div class="form-group">
              <label>站点名称</label>
              <input v-model="siteForm.siteName" class="input-field" placeholder="站点名称" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>IP地址</label>
              <input v-model="siteForm.ipAddress" class="input-field" placeholder="192.168.1.100" />
            </div>
            <div class="form-group">
              <label>通信端口</label>
              <input v-model="siteForm.port" type="number" class="input-field" placeholder="8080" />
            </div>
          </div>
          
          <!-- 机内摄像头配置 -->
          <div class="form-section-header">📹 机内摄像头配置</div>
          
          <div class="form-row">
            <div class="form-group">
              <label>机内摄像头IP地址</label>
              <input v-model="siteForm.internalCameraIp" class="input-field" placeholder="例如：192.168.1.64" />
              <span class="field-hint">用于监控泵房内部设备的摄像头</span>
            </div>
            <div class="form-group">
              <label>机内摄像头用户名</label>
              <input v-model="siteForm.internalCameraUsername" class="input-field" placeholder="admin" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>机内摄像头密码</label>
              <input v-model="siteForm.internalCameraPassword" type="password" class="input-field" placeholder="请输入摄像头密码" />
            </div>
          </div>

          <!-- 全局摄像头配置 -->
          <div class="form-section-header">🌐 全局摄像头配置</div>
          
          <div class="form-row">
            <div class="form-group">
              <label>全局摄像头IP地址</label>
              <input v-model="siteForm.globalCameraIp" class="input-field" placeholder="例如：192.168.1.65" />
              <span class="field-hint">用于监控泵房全局环境的摄像头</span>
            </div>
            <div class="form-group">
              <label>全局摄像头用户名</label>
              <input v-model="siteForm.globalCameraUsername" class="input-field" placeholder="admin" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>全局摄像头密码</label>
              <input v-model="siteForm.globalCameraPassword" type="password" class="input-field" placeholder="请输入摄像头密码" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>站点位置</label>
              <input v-model="siteForm.siteLocation" class="input-field" placeholder="站点位置" />
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="siteForm.is_enabled" />
                启用站点
              </label>
            </div>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button @click="saveSite" class="btn primary" :disabled="!isSiteFormValid">
            {{ editingSite ? '更新' : '添加' }}
          </button>
          <button @click="closeSiteDialog" class="btn secondary">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 分配站点对话框 -->
    <div v-if="showAssignDialog" class="dialog-overlay" @click="closeAssignDialog">
      <div class="dialog-content config-dialog" @click.stop>
        <h3 class="dialog-title">分配站点给用户</h3>
        
        <!-- 已选站点列表 -->
        <div class="selected-sites-info" style="margin-bottom: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px; border-left: 4px solid #2196f3;">
          <strong>待分配站点 ({{ selectedSites.length }}个)：</strong>
          <div style="margin-top: 8px;">
            <span v-for="siteId in selectedSites" :key="siteId" style="display: inline-block; margin: 4px 8px 4px 0; padding: 4px 10px; background: white; border: 1px solid #2196f3; border-radius: 12px; font-size: 12px; color: #1976d2;">
              {{ getSiteNameById(siteId) }}
            </span>
          </div>
        </div>
        
        <!-- 用户搜索和选择区域 -->
        <div class="user-selection-area">
          <div class="search-section" style="margin-bottom: 12px;">
            <input 
              v-model="userSearchQuery" 
              placeholder="搜索用户名、姓名..." 
              class="search-input"
              style="width: 100%;"
            />
          </div>
          
          <!-- 用户列表 -->
          <div class="user-list-container" style="max-height: 300px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 4px;">
            <div 
              v-for="user in filteredAssignUsers" 
              :key="user.id" 
              class="user-select-item"
              :class="{ 'user-selected': assignUserId === user.id }"
              @click="selectAssignUser(user.id)"
              style="padding: 12px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: all 0.2s;"
            >
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div class="user-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(45deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;">
                    {{ (user.display_name || user.full_name || user.username).charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div style="font-weight: 500; color: #333;">
                      {{ user.display_name || user.full_name || user.username }}
                    </div>
                    <div style="font-size: 12px; color: #666;">
                      @{{ user.username }} · {{ getRoleName(user) }}
                    </div>
                  </div>
                </div>
                <div v-if="assignUserId === user.id" style="color: #2196f3;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </div>
            <div v-if="filteredAssignUsers.length === 0" style="padding: 40px 20px; text-align: center; color: #999;">
              没有找到匹配的用户
            </div>
          </div>
        </div>
        
        <div class="dialog-actions" style="margin-top: 20px;">
          <button @click="confirmAssignSitesToUser" class="btn primary" :disabled="!assignUserId || selectedSites.length===0 || assignLoading">
            确定分配
          </button>
          <button @click="closeAssignDialog" class="btn secondary">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 从用户角度分配站点对话框（用户管理中点击分配站点按钮） -->
    <div v-if="showAssignSitesDialog" class="dialog-overlay" @click="closeAssignSitesDialog">
      <div class="dialog-content config-dialog" @click.stop>
        <h3 class="dialog-title">为用户分配站点</h3>
        <div class="site-toolbar">
          <div class="toolbar-left">
            <input v-model="assignSearch" placeholder="搜索站点..." class="search-input-small" />
          </div>
          <div class="toolbar-right">
            <span>目标用户: {{ getAssignUserName() }}</span>
          </div>
        </div>
        <div class="sites-list">
          <div class="sites-header">
            <label class="checkbox-label">
              <input type="checkbox" v-model="assignSelectAll" @change="toggleAssignSelectAll" />
              全选
            </label>
            <span class="header-label">站点编码</span>
            <span class="header-label">站点名称</span>
            <span class="header-label">状态</span>
            <span class="header-label">在线状态</span>
            <span class="header-label">操作</span>
          </div>
          <div class="sites-content">
            <div 
              v-for="site in filteredMySites" 
              :key="site.id" 
              class="site-item"
              :class="{ 'site-disabled': !(site.isEnabled || site.is_enabled) }"
            >
              <label class="checkbox-label">
                <input type="checkbox" v-model="assignSelectedSites" :value="site.id" />
              </label>
              <span class="site-code">{{ site.siteCode || site.site_code }}</span>
              <span class="site-name">{{ site.siteName || site.site_name }}</span>
              <span class="site-status">
                <span class="status-indicator" :class="(site.isEnabled || site.is_enabled) ? 'status-enabled' : 'status-disabled'">
                  {{ (site.isEnabled || site.is_enabled) ? '启用' : '禁用' }}
                </span>
              </span>
              <span class="site-online">
                <span class="status-indicator" :class="(site.isOnline || site.is_online) ? 'status-online' : 'status-offline'">
                  {{ (site.isOnline || site.is_online) ? '在线' : '离线' }}
                </span>
              </span>
              <div class="site-actions">
                <button class="action-btn-small edit" disabled>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button @click="confirmAssignFromDialog" class="btn primary" :disabled="!assignUserId || assignSelectedSites.length===0 || assignLoading">确定分配</button>
          <button @click="closeAssignSitesDialog" class="btn secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { userAPI, configAPI, siteAssignmentAPI } from '@/services/api'

export default {
  name: 'UserManagementModule',
  setup() {
    const userInfoRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('userInfo') : null
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null
    const currentGroup = ((userInfo && (userInfo.user_group || userInfo.role)) || '').toString().toUpperCase()
    const isRoot = currentGroup === 'ROOT'
    const isAdmin = currentGroup === 'ADMIN'
    const searchQuery = ref('')
    const roleFilter = ref('all')
    const showAddUserDialog = ref(false)
    const editingUser = ref(null)
    
    const userForm = ref({
      username: '',
      name: '',
      email: '',
      phone: '',
      role: 'OPERATOR',
      password: '',
      confirmPassword: ''
    })

    // 数据状态
    const users = ref([])
    const userSitesMap = ref({})
    const loading = ref(false)
    const error = ref(null)
    const deleteDropdown = ref(null)
    
    // 配置对话框状态
    const showSystemConfigDialog = ref(false)
    const showSiteConfigDialog = ref(false)
    
    // 系统配置表单（仅保留电话、短信、邮件服务器配置）
    const systemConfigForm = ref({
      phone_alarm_address: '',
      phone_access_id: '',
      phone_access_key: '',
      sms_access_id: '',
      sms_access_key: '',
      smtp_server: '',
      smtp_port: 587,
      email_account: '',
      email_password: '',
      is_active: true
    })
    
    // 站点管理状态
    const sites = ref([])
    const showAddSiteDialog = ref(false)
    const editingSite = ref(null)
    const siteSearchQuery = ref('')
    const selectedSites = ref([])
    const selectAllSites = ref(false)
    // 分配对话框状态
    const showAssignDialog = ref(false) // 从站点配置对话框分配站点给用户
    const showAssignSitesDialog = ref(false) // 从用户列表为用户分配站点
    const showUnassignDialog = ref(false)
    const assignUserId = ref('')
    const assignRole = ref('')
    const assignLoading = ref(false)
    const mySites = ref([])
    const assignSelectedSites = ref([])
    const assignSelectAll = ref(false)
    const assignSearch = ref('')
    const userSearchQuery = ref('') // 用户搜索关键词
    
    // 站点表单
    const siteForm = ref({
      siteCode: '',
      siteName: '',
      siteLocation: '',
      siteDescription: '',
      ipAddress: '',
      port: 4840,
      protocol: 'OPC.UA',
      // 机内摄像头配置
      internalCameraIp: '',
      internalCameraUsername: '',
      internalCameraPassword: '',
      // 全局摄像头配置
      globalCameraIp: '',
      globalCameraUsername: '',
      globalCameraPassword: '',
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
      operatingPressureMin: '',
      operatingPressureMax: '',
      pumpCount: 0,
      alarmEnabled: true,
      alarmPhoneNumbers: '',
      alarmEmailAddresses: '',
      is_enabled: true
    })
    
    // 分页状态
    const pagination = ref({
      page: 1,
      size: 20,
      total: 0,
      pages: 0
    })

    // API方法
    const loadUsers = async () => {
      try {
        loading.value = true
        error.value = null
        
        // 根据筛选条件映射到后端参数
        const userGroupMap = {
          'all': null,
          'admin': 'ADMIN',
          'operator': 'OPERATOR', 
          'observer': 'OBSERVER'
        }
        
        // 明确传递null作为status，确保不添加status参数到请求中
        const response = await userAPI.getUsersPaginated(
          pagination.value.page,
          pagination.value.size,
          searchQuery.value,
          userGroupMap[roleFilter.value],
          null // status过滤为null，确保返回所有用户（包括非活跃用户）
        )
        
        // 解析后端返回的数据结构: ApiResponse<PagedResponse<UserDto>>
        // 后端返回格式: { success: true, data: { items: [...], total: ..., page: ..., size: ..., pages: ... }, message: "..." }
        const api = response.data || response
        const payload = api.data || api
        
        // 兼容大小写：后端返回 Items（大写），前端可能期望 items（小写）
        const list = payload.items || payload.Items || payload.users || payload.Users || payload.data?.items || payload.data?.Items || []
        users.value = list
        
        // 详细调试日志：确认获取到的用户数量和状态
        console.log('[UserManagement] 加载用户详情:', {
          response: response,
          api: api,
          payload: payload,
          total: payload.total || payload.Total || 0,
          itemsCount: list.length,
          users: list.map(u => ({ id: u.id, username: u.username, status: u.status, isActive: u.isActive }))
        })
        // 优先使用后端返回的站点分配（UserDto.sites），否则回退到逐个查询
        const missingFetchUsers = []
        for (const u of (users.value || [])) {
          if (u.sites && Array.isArray(u.sites)) {
            userSitesMap.value[u.id] = u.sites
          } else {
            missingFetchUsers.push(u)
          }
        }
        if (missingFetchUsers.length > 0) {
          const tasks = missingFetchUsers.map(async (u) => {
            try {
              const res = await siteAssignmentAPI.getSitesByUser(u.id)
              userSitesMap.value[u.id] = res.sites || []
            } catch (e) {
              userSitesMap.value[u.id] = []
            }
          })
          await Promise.allSettled(tasks)
        }
        // 兼容大小写：后端返回 Total（大写），前端可能期望 total（小写）
        pagination.value.total = payload.total || payload.Total || 0
        // 如果后端没有返回总页数，根据总数和每页数量计算
        const totalPages = payload.totalPages || payload.pages || payload.Pages
        if (totalPages !== undefined && totalPages !== null) {
          pagination.value.pages = totalPages
        } else {
          // 自己计算总页数
          pagination.value.pages = pagination.value.total > 0 
            ? Math.ceil(pagination.value.total / pagination.value.size) 
            : 0
        }
        
        // 确保当前页码不超过总页数（如果总页数为0，则保持当前页码为1）
        if (pagination.value.pages > 0 && pagination.value.page > pagination.value.pages) {
          pagination.value.page = pagination.value.pages
        } else if (pagination.value.pages === 0) {
          pagination.value.page = 1
        }
        
      } catch (err) {
        error.value = err.message || '加载用户列表失败'
        console.error('加载用户失败:', err)
      } finally {
        loading.value = false
      }
    }

    const filteredUsers = computed(() => {
      // 由于现在使用API分页，直接返回users
      return users.value
    })

    const isFormValid = computed(() => {
      const form = userForm.value
      if (!form.username || !form.name || !form.email || !form.role) {
        return false
      }
      
      if (!editingUser.value) {
        return form.password && form.password === form.confirmPassword
      }
      
      return true
    })

    const getRoleName = (user) => {
      const raw = user.user_group ?? user.userGroup
      const map = {
        'ADMIN': '管理员',
        'MANAGER': '管理员',
        'OPERATOR': '操作员',
        'OBSERVER': '观察员',
        'ENGINEER': '观察员' // 兼容旧枚举名
      }
      if (typeof raw === 'number') {
        // 后端可能返回枚举数字：ROOT=0, ADMIN=1, OPERATOR=2, OBSERVER=3
        const byIndex = { 1: '管理员', 2: '操作员', 3: '观察员' }
        return byIndex[raw] || '—'
      }
      const key = String(raw || '').toUpperCase()
      return map[key] || '—'
    }

    const getStatusName = (user) => {
      // 后端使用status字段
      const statusNames = {
        'ACTIVE': '活跃',
        'INACTIVE': '禁用',
        'PENDING': '待审核',
        'SUSPENDED': '暂停'
      }
      return statusNames[user.status] || user.status
    }

    // 是否拥有操作权限：ROOT/ADMIN/OPERATOR 均视为有权限
    const hasOperatePermission = (user) => {
      const raw = user.user_group ?? user.userGroup
      if (raw === undefined || raw === null) return false
      if (typeof raw === 'number') {
        // 后端可能以枚举数字返回：ROOT=0, ADMIN=1, OPERATOR=2, OBSERVER=3
        return raw === 0 || raw === 1 || raw === 2
      }
      const group = String(raw).toUpperCase()
      return group === 'ROOT' || group === 'ADMIN' || group === 'OPERATOR'
    }

    const getLevelName = (user) => {
      // 用户级别显示
      const levelNames = {
        'LEVEL_1': '一级',
        'LEVEL_2': '二级',
        'LEVEL_3': '三级',
        'LEVEL_4': '四级',
        'LEVEL_5': '五级'
      }
      return levelNames[user.user_level] || user.user_level
    }

    const getPermissionsCount = (user) => {
      let count = 0
      try {
        if (user.operation_permissions) {
          const opPerms = typeof user.operation_permissions === 'string' 
            ? JSON.parse(user.operation_permissions) 
            : user.operation_permissions
          count += Object.values(opPerms).filter(Boolean).length
        }
        if (user.audit_permissions) {
          const auditPerms = typeof user.audit_permissions === 'string'
            ? JSON.parse(user.audit_permissions)
            : user.audit_permissions
          count += Object.values(auditPerms).filter(Boolean).length
        }
      } catch (e) {
        console.warn('解析权限数据失败:', e)
      }
      return count > 0 ? `${count}项权限` : '无权限'
    }

    const getPermissionsTooltip = (user) => {
      const permissions = []
      try {
        if (user.operation_permissions) {
          const opPerms = typeof user.operation_permissions === 'string'
            ? JSON.parse(user.operation_permissions)
            : user.operation_permissions
          Object.entries(opPerms).forEach(([key, value]) => {
            if (value) permissions.push(`操作: ${key}`)
          })
        }
        if (user.audit_permissions) {
          const auditPerms = typeof user.audit_permissions === 'string'
            ? JSON.parse(user.audit_permissions)
            : user.audit_permissions
          Object.entries(auditPerms).forEach(([key, value]) => {
            if (value) permissions.push(`审核: ${key}`)
          })
        }
      } catch (e) {
        return '权限数据解析失败'
      }
      return permissions.length > 0 ? permissions.join('\n') : '暂无权限'
    }

    const isProtectedUser = (user) => {
      const username = user.username
      const group = user.user_group ?? user.userGroup
      return username === 'root' || String(group).toUpperCase() === 'ROOT'
    }

    const getUserSitesTooltip = (user) => {
      const sites = userSitesMap.value[user.id] || []
      if (!sites.length) return '暂无站点'
      return sites.map(s => `${s.site_code} - ${s.site_name || ''}`.trim()).join('\n')
    }

    const formatTime = (timeStr) => {
      if (!timeStr) return '从未登录'
      const time = new Date(timeStr)
      return time.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const editUser = (user) => {
      editingUser.value = user
      userForm.value = {
        username: user.username,
        name: user.displayName || user.display_name || user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.user_group ?? user.userGroup,
        password: '',
        confirmPassword: ''
      }
    }

    const closeDialog = () => {
      showAddUserDialog.value = false
      editingUser.value = null
      userForm.value = {
        username: '',
        name: '',
        email: '',
        phone: '',
        role: 'OPERATOR',
        password: '',
        confirmPassword: ''
      }
    }

    const saveUser = async () => {
      try {
        loading.value = true
        
        if (editingUser.value) {
          // 更新用户
          const updateData = {
            displayName: (userForm.value.name || '').trim(),
            email: userForm.value.email,
            phone: (userForm.value.phone || '').trim()
          }
          
          // 后端无 /users/{id}/group，直接通过 Update 接口传 userGroup
          if (userForm.value.role && userForm.value.role !== editingUser.value.user_group) {
            updateData.userGroup = userForm.value.role
          }
          
          await userAPI.updateUser(editingUser.value.id, updateData)
          
        } else {
          // 添加新用户
          const userData = {
            username: (userForm.value.username || '').trim(),
            displayName: (userForm.value.name || '').trim(),
            password: userForm.value.password,
            email: userForm.value.email,
            phone: (userForm.value.phone || '').trim(),
            userGroup: userForm.value.role
          }
          
          await userAPI.createUser(userData)
        }
        
        // 重新加载用户列表
        await loadUsers()
        closeDialog()
        
      } catch (err) {
        error.value = err.message || '保存用户失败'
        console.error('保存用户失败:', err)
      } finally {
        loading.value = false
      }
    }

    const toggleUserStatus = async (user) => {
      try {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        await userAPI.updateUserStatus(user.id, newStatus)
        
        // 重新加载用户列表
        await loadUsers()
        
      } catch (err) {
        error.value = err.message || '更新用户状态失败'
        console.error('更新用户状态失败:', err)
      }
    }

    // 删除选项管理
    const showDeleteDropdown = (userId) => {
      deleteDropdown.value = userId
    }
    
    const hideDeleteOptions = (userId) => {
      setTimeout(() => {
        if (deleteDropdown.value === userId) {
          deleteDropdown.value = null
        }
      }, 200)
    }
    
    const keepDeleteDropdown = (userId) => {
      deleteDropdown.value = userId
    }
    
    const showDeleteOptions = (user) => {
      // 对于点击事件，如果已经显示了下拉菜单，直接执行软删除
      if (deleteDropdown.value === user.id) {
        deleteUser(user, false)
      }
    }

    const deleteUser = async (user, isHardDelete = false) => {
      if (user.username === 'admin') {
        alert('不能删除管理员账户')
        return
      }
      
      // 隐藏下拉菜单
      deleteDropdown.value = null
      
      const userName = user.display_name || user.full_name || user.username
      const deleteType = isHardDelete ? '彻底删除' : '禁用'
      const warningMessage = isHardDelete 
        ? `确定要彻底删除用户 "${userName}" 吗？\n\n⚠️ 警告：这将永久删除用户数据，无法恢复！`
        : `确定要禁用用户 "${userName}" 吗？\n\n用户将无法登录，但数据会被保留。`
      
      if (confirm(warningMessage)) {
        try {
          if (isHardDelete) {
            await userAPI.hardDeleteUser(user.id)
          } else {
            await userAPI.deleteUser(user.id)
          }
          
          // 重新加载用户列表
          await loadUsers()
          
        } catch (err) {
          error.value = err.message || `${deleteType}用户失败`
          console.error(`${deleteType}用户失败:`, err)
        }
      }
    }

    // ========== 系统配置相关方法 ==========
    
    const closeSystemConfigDialog = () => {
      showSystemConfigDialog.value = false
      // 重置表单
      systemConfigForm.value = {
        phone_alarm_address: '',
        phone_access_id: '',
        phone_access_key: '',
        sms_access_id: '',
        sms_access_key: '',
        smtp_server: '',
        smtp_port: 587,
        email_account: '',
        email_password: '',
        is_active: true
      }
    }
    
    const saveSystemConfig = async () => {
      try {
        loading.value = true
        // 将表单从 snake_case 映射为后端 DTO 期望的 camelCase
        const f = systemConfigForm.value
        const payload = {
          phoneAlarmAddress: f.phone_alarm_address || '',
          phoneAccessId: f.phone_access_id || '',
          phoneAccessKey: f.phone_access_key || '',
          smsAccessId: f.sms_access_id || '',
          smsAccessKey: f.sms_access_key || '',
          smtpServer: f.smtp_server || '',
          smtpPort: typeof f.smtp_port === 'number' ? f.smtp_port : parseInt(f.smtp_port || 587, 10),
          emailAccount: f.email_account || '',
          emailPassword: f.email_password || '',
          isActive: typeof f.is_active === 'boolean' ? f.is_active : true
        }
        await configAPI.createSystemConfig(payload)
        closeSystemConfigDialog()
        alert('系统配置保存成功！')
      } catch (err) {
        error.value = err.message || '保存系统配置失败'
        console.error('保存系统配置失败:', err)
      } finally {
        loading.value = false
      }
    }

    const openSystemConfigDialog = async () => {
      showSystemConfigDialog.value = true
      try {
        const res = await configAPI.getActiveSystemConfig()
        const outer = res?.data || res || {}
        const cfg = outer.data || outer
        if (cfg) {
          systemConfigForm.value = {
            phone_alarm_address: cfg.phoneAlarmAddress || cfg.phone_alarm_address || '',
            phone_access_id: cfg.phoneAccessId || cfg.phone_access_id || '',
            phone_access_key: cfg.phoneAccessKey || cfg.phone_access_key || '',
            sms_access_id: cfg.smsAccessId || cfg.sms_access_id || '',
            sms_access_key: cfg.smsAccessKey || cfg.sms_access_key || '',
            smtp_server: cfg.smtpServer || cfg.smtp_server || '',
            smtp_port: cfg.smtpPort ?? cfg.smtp_port ?? 587,
            email_account: cfg.emailAccount || cfg.email_account || '',
            email_password: cfg.emailPassword || cfg.email_password || '',
            is_active: cfg.isActive ?? cfg.is_active ?? true
          }
        }
      } catch (e) {
        console.warn('加载系统配置失败，将显示空表单:', e)
      }
    }
    
    // 配置测试功能已移除
    
    // ========== 站点管理相关方法 ==========
    
    const loadSites = async () => {
      try {
        const response = await configAPI.getSiteConfigs()
        console.log('加载站点响应:', response)
        // getSiteConfigs返回格式: { success: true, data: { sites: [...], total: n } }
        if (response.success && response.data) {
          sites.value = response.data.sites || response.data || []
        } else {
          sites.value = []
        }
      } catch (err) {
        console.error('加载站点列表失败:', err)
        sites.value = []
      }
    }
    
    const closeSiteConfigDialog = () => {
      showSiteConfigDialog.value = false
      selectedSites.value = []
      selectAllSites.value = false
    }
    
    const closeSiteDialog = () => {
      showAddSiteDialog.value = false
      editingSite.value = null
      siteForm.value = {
        siteCode: '',
        siteName: '',
        siteLocation: '',
        siteDescription: '',
        ipAddress: '',
        port: 4840,
        protocol: 'OPC.UA',
        // 机内摄像头配置
        internalCameraIp: '',
        internalCameraUsername: '',
        internalCameraPassword: '',
        // 全局摄像头配置
        globalCameraIp: '',
        globalCameraUsername: '',
        globalCameraPassword: '',
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
        operatingPressureMin: '',
        operatingPressureMax: '',
        pumpCount: 0,
        alarmEnabled: true,
        alarmPhoneNumbers: '',
        alarmEmailAddresses: '',
        is_enabled: true
      }
    }
    
    const editSite = (site) => {
      editingSite.value = site
      siteForm.value = {
        siteCode: site.siteCode || site.site_code,
        siteName: site.siteName || site.site_name,
        siteLocation: site.siteLocation || site.site_location || '',
        siteDescription: site.siteDescription || site.site_description || '',
        ipAddress: site.ipAddress || site.ip_address || '',
        port: site.port || 4840,
        protocol: site.protocol || 'OPC.UA',
        // 机内摄像头配置
        internalCameraIp: site.internalCameraIp || site.internal_camera_ip || '',
        internalCameraUsername: site.internalCameraUsername || site.internal_camera_username || '',
        internalCameraPassword: site.internalCameraPassword || site.internal_camera_password || '',
        // 全局摄像头配置
        globalCameraIp: site.globalCameraIp || site.global_camera_ip || '',
        globalCameraUsername: site.globalCameraUsername || site.global_camera_username || '',
        globalCameraPassword: site.globalCameraPassword || site.global_camera_password || '',
        opcuaEndpoint: site.opcuaEndpoint || site.opcua_endpoint || '',
        opcuaSecurityPolicy: site.opcuaSecurityPolicy || site.opcua_security_policy || 'None',
        opcuaSecurityMode: site.opcuaSecurityMode || site.opcua_security_mode || 'None',
        opcuaAnonymous: site.opcuaAnonymous !== undefined ? site.opcuaAnonymous : (site.opcua_anonymous !== undefined ? site.opcua_anonymous : true),
        opcuaUsername: site.opcuaUsername || site.opcua_username || '',
        opcuaPassword: site.opcuaPassword || site.opcua_password || '',
        opcuaSessionTimeout: site.opcuaSessionTimeout || site.opcua_session_timeout || 30000,
        opcuaRequestTimeout: site.opcuaRequestTimeout || site.opcua_request_timeout || 10000,
        contactPerson: site.contactPerson || site.contact_person || '',
        contactPhone: site.contactPhone || site.contact_phone || '',
        contactEmail: site.contactEmail || site.contact_email || '',
        operatingPressureMin: site.operatingPressureMin || site.operating_pressure_min || '',
        operatingPressureMax: site.operatingPressureMax || site.operating_pressure_max || '',
        pumpCount: site.pumpCount !== undefined ? site.pumpCount : (site.pump_count || 0),
        alarmEnabled: site.alarmEnabled !== undefined ? site.alarmEnabled : (site.alarm_enabled !== undefined ? site.alarm_enabled : true),
        alarmPhoneNumbers: site.alarmPhoneNumbers || site.alarm_phone_numbers || '',
        alarmEmailAddresses: site.alarmEmailAddresses || site.alarm_email_addresses || '',
        is_enabled: site.is_enabled !== undefined ? site.is_enabled : (site.isEnabled !== undefined ? site.isEnabled : true)
      }
    }
    
    const saveSite = async () => {
      try {
        loading.value = true
        
        // 将前端camelCase格式转换为后端PascalCase格式
        const apiData = {
          SiteCode: (siteForm.value.siteCode || '').trim(),
          SiteName: siteForm.value.siteName || '',
          SiteLocation: siteForm.value.siteLocation || null,
          SiteDescription: siteForm.value.siteDescription || null,
          IpAddress: siteForm.value.ipAddress || null,
          Port: siteForm.value.port || 4840,
          Protocol: siteForm.value.protocol || 'OPC.UA',
          // 机内摄像头配置
          InternalCameraIp: siteForm.value.internalCameraIp || null,
          InternalCameraUsername: siteForm.value.internalCameraUsername || null,
          InternalCameraPassword: siteForm.value.internalCameraPassword || null,
          // 全局摄像头配置
          GlobalCameraIp: siteForm.value.globalCameraIp || null,
          GlobalCameraUsername: siteForm.value.globalCameraUsername || null,
          GlobalCameraPassword: siteForm.value.globalCameraPassword || null,
          OpcuaEndpoint: siteForm.value.opcuaEndpoint || null,
          OpcuaSecurityPolicy: siteForm.value.opcuaSecurityPolicy || 'None',
          OpcuaSecurityMode: siteForm.value.opcuaSecurityMode || 'None',
          OpcuaAnonymous: siteForm.value.opcuaAnonymous !== undefined ? siteForm.value.opcuaAnonymous : true,
          OpcuaUsername: siteForm.value.opcuaUsername || null,
          OpcuaPassword: siteForm.value.opcuaPassword || null,
          OpcuaSessionTimeout: siteForm.value.opcuaSessionTimeout || 30000,
          OpcuaRequestTimeout: siteForm.value.opcuaRequestTimeout || 10000,
          ContactPerson: siteForm.value.contactPerson || null,
          ContactPhone: siteForm.value.contactPhone || null,
          ContactEmail: siteForm.value.contactEmail || null,
          OperatingPressureMin: siteForm.value.operatingPressureMin || null,
          OperatingPressureMax: siteForm.value.operatingPressureMax || null,
          PumpCount: siteForm.value.pumpCount || 0,
          AlarmEnabled: siteForm.value.alarmEnabled !== undefined ? siteForm.value.alarmEnabled : true,
          AlarmPhoneNumbers: siteForm.value.alarmPhoneNumbers || null,
          AlarmEmailAddresses: siteForm.value.alarmEmailAddresses || null
        }
        
        console.log('发送到后端的数据:', apiData)
        
        if (editingSite.value) {
          // 更新站点（按站点编码）
          const siteCode = editingSite.value.siteCode || editingSite.value.site_code
          await configAPI.updateSiteConfig(siteCode, apiData)
          
          // 更新本地数据
          const index = sites.value.findIndex(s => s.id === editingSite.value.id)
          if (index > -1) {
            sites.value[index] = { ...sites.value[index], ...siteForm.value }
          }
          
          alert('站点更新成功！')
        } else {
          // 添加新站点
          const newSite = await configAPI.createSiteConfig(apiData)
          
          // 重新加载站点列表以获取最新数据
          await loadSites()
          
          alert('站点添加成功！')
        }
        
        closeSiteDialog()
      } catch (err) {
        error.value = err.message || '保存站点失败'
        console.error('保存站点失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    const toggleSiteStatus = async (site) => {
      try {
        const currentStatus = site.isEnabled !== undefined ? site.isEnabled : site.is_enabled
        const newStatus = !currentStatus
        const siteCode = site.siteCode || site.site_code
        await configAPI.updateSiteConfig(siteCode, { IsEnabled: newStatus })
        
        // 更新本地状态（兼容两种格式）
        if (site.isEnabled !== undefined) {
          site.isEnabled = newStatus
        }
        if (site.is_enabled !== undefined) {
          site.is_enabled = newStatus
        }
        
        alert(`站点 ${siteCode} 已${newStatus ? '启用' : '禁用'}`)
      } catch (err) {
        alert(`操作失败: ${err.message}`)
      }
    }
    
    const deleteSite = async (site) => {
      const siteCode = site.siteCode || site.site_code
      if (confirm(`确定要删除站点 "${siteCode}" 吗？`)) {
        try {
          await configAPI.deleteSiteConfig(siteCode)
          
          // 从本地列表移除
          const index = sites.value.findIndex(s => s.id === site.id)
          if (index > -1) {
            sites.value.splice(index, 1)
          }
          
          alert('站点删除成功！')
        } catch (err) {
          alert(`删除失败: ${err.message}`)
        }
      }
    }
    
    const toggleSelectAllSites = () => {
      if (selectAllSites.value) {
        selectedSites.value = filteredSites.value.map(site => site.id)
      } else {
        selectedSites.value = []
      }
    }
    
    const batchEnableSites = async () => {
      if (selectedSites.value.length === 0) return
      
      try {
        // 批量启用站点
        for (const siteId of selectedSites.value) {
          const site = sites.value.find(s => s.id === siteId)
          if (site && !site.is_enabled) {
            await configAPI.updateSiteConfig(siteId, { is_enabled: true })
            site.is_enabled = true
          }
        }
        
        selectedSites.value = []
        selectAllSites.value = false
        alert('批量启用完成！')
      } catch (err) {
        alert(`批量启用失败: ${err.message}`)
      }
    }
    
    const batchDisableSites = async () => {
      if (selectedSites.value.length === 0) return
      
      try {
        // 批量禁用站点
        for (const siteId of selectedSites.value) {
          const site = sites.value.find(s => s.id === siteId)
          if (site && site.is_enabled) {
            await configAPI.updateSiteConfig(siteId, { is_enabled: false })
            site.is_enabled = false
          }
        }
        
        selectedSites.value = []
        selectAllSites.value = false
        alert('批量禁用完成！')
      } catch (err) {
        alert(`批量禁用失败: ${err.message}`)
      }
    }

    // 分配相关方法
    const loadMySites = async (targetUserId = null) => {
      try {
        // 改为加载所有站点作为可分配列表
        const response = await configAPI.getSiteConfigs(1, 1000)
        mySites.value = (response.data?.sites || response.data || []).map(s => ({
          id: s.id,
          siteCode: s.siteCode || s.site_code,
          siteName: s.siteName || s.site_name,
          siteLocation: s.siteLocation || s.site_location,
          isEnabled: s.isEnabled ?? s.is_enabled,
          isOnline: s.isOnline ?? s.is_online
        }))
        
        // 若指定用户，预加载其已分配站点用于预选中
        if (targetUserId) {
          const assigned = await siteAssignmentAPI.getSitesByUser(Number(targetUserId))
          const ids = (assigned.data?.sites || assigned.sites || []).map(s => s.id)
          assignSelectedSites.value = ids
        }
      } catch (e) {
        console.error('获取可分配站点失败', e)
        mySites.value = []
      }
    }

    // 从站点配置对话框打开分配对话框（选中站点后分配给用户）
    const openAssignDialog = () => { 
      assignUserId.value = ''
      assignRole.value = ''
      userSearchQuery.value = ''
      showAssignDialog.value = true
    }
    
    // 选择分配的目标用户
    const selectAssignUser = (userId) => {
      assignUserId.value = userId
    }
    
    // 从用户列表打开分配站点对话框（为某个用户分配站点）
    const openAssignDialogForUser = async (user) => { 
      assignUserId.value = String(user.id)
      assignRole.value = ''
      assignSelectedSites.value = []
      assignSelectAll.value = false
      showAssignSitesDialog.value = true
      await loadMySites(user.id)
    }
    
    const closeAssignDialog = () => { showAssignDialog.value = false }
    const closeAssignSitesDialog = () => { showAssignSitesDialog.value = false }
    const openUnassignDialog = () => { assignUserId.value = ''; showUnassignDialog.value = true }
    const closeUnassignDialog = () => { showUnassignDialog.value = false }
    
    // 辅助函数：根据站点ID获取站点名称
    const getSiteNameById = (siteId) => {
      const site = sites.value.find(s => s.id === siteId)
      if (!site) return `站点 #${siteId}`
      return `${site.siteCode || site.site_code} - ${site.siteName || site.site_name}`
    }
    
    // 辅助函数：获取当前分配用户的名称
    const getAssignUserName = () => {
      if (!assignUserId.value) return '未选择'
      const user = users.value.find(u => u.id === Number(assignUserId.value))
      if (!user) return `用户 #${assignUserId.value}`
      return user.display_name || user.full_name || user.username
    }
    
    // 从站点配置对话框确认分配（将选中的站点分配给选中的用户）
    const confirmAssignSitesToUser = async () => {
      try {
        if (!assignUserId.value || selectedSites.value.length === 0) return
        assignLoading.value = true
        await siteAssignmentAPI.assignSites(Number(assignUserId.value), selectedSites.value, assignRole.value || null)
        alert('站点分配成功')
        closeAssignDialog()
        // 清空选择
        selectedSites.value = []
        selectAllSites.value = false
      } catch (e) { 
        alert(`分配失败: ${e.message}`)
      } finally { 
        assignLoading.value = false
      }
    }

    // 从用户列表确认分配（为指定用户分配选中的站点）
    const confirmAssignFromDialog = async () => {
      try {
        if (!assignUserId.value || assignSelectedSites.value.length === 0) return
        assignLoading.value = true
        await siteAssignmentAPI.assignSites(Number(assignUserId.value), assignSelectedSites.value, assignRole.value || null)
        alert('站点分配成功')
        closeAssignSitesDialog()
        await loadUsers() // 重新加载用户列表以更新站点数量
      } catch (e) { 
        alert(`分配失败: ${e.message}`)
      } finally { 
        assignLoading.value = false
      }
    }

    const toggleAssignSelectAll = () => {
      if (assignSelectAll.value) {
        assignSelectedSites.value = filteredMySites.value.map(s => s.id)
      } else {
        assignSelectedSites.value = []
      }
    }
    const confirmUnassign = async () => {
      try {
        if (!assignUserId.value || selectedSites.value.length === 0) return
        await siteAssignmentAPI.unassignSites(Number(assignUserId.value), selectedSites.value)
        alert('取消分配成功')
        closeUnassignDialog()
      } catch (e) { alert(`取消分配失败: ${e.message}`) }
    }
    
    // ========== 计算属性 ==========
    
    const isSystemConfigValid = computed(() => {
      const form = systemConfigForm.value
      // 至少需要配置一种通信方式
      const hasEmailConfig = form.smtp_server && form.email_account && form.email_password
      const hasSmsConfig = form.sms_access_id && form.sms_access_key
      const hasPhoneConfig = form.phone_access_id && form.phone_access_key
      
      return hasEmailConfig || hasSmsConfig || hasPhoneConfig
    })
    
    const isSiteFormValid = computed(() => {
      const form = siteForm.value
      return form.siteCode && form.siteCode.trim().length > 0 && 
             form.siteName && form.siteName.trim().length > 0
    })
    
    const filteredSites = computed(() => {
      if (!siteSearchQuery.value) {
        return sites.value
      }
      
      const query = siteSearchQuery.value.toLowerCase()
      return sites.value.filter(site => {
        const siteCode = (site.siteCode || site.site_code || '').toLowerCase()
        const siteName = (site.siteName || site.site_name || '').toLowerCase()
        const siteLocation = (site.siteLocation || site.site_location || '').toLowerCase()
        
        return siteCode.includes(query) || 
               siteName.includes(query) || 
               siteLocation.includes(query)
      })
    })
    
    // 已移除配置测试可用性计算

    const filteredMySites = computed(() => {
      if (!assignSearch.value) return mySites.value
      const q = assignSearch.value.toLowerCase()
      return mySites.value.filter(s => {
        const siteCode = (s.siteCode || s.site_code || '').toLowerCase()
        const siteName = (s.siteName || s.site_name || '').toLowerCase()
        const siteLocation = (s.siteLocation || s.site_location || '').toLowerCase()
        
        return siteCode.includes(q) || siteName.includes(q) || siteLocation.includes(q)
      })
    })
    
    // 过滤用户列表（用于分配站点对话框）
    const filteredAssignUsers = computed(() => {
      if (!userSearchQuery.value) return users.value
      const q = userSearchQuery.value.toLowerCase()
      return users.value.filter(u => {
        const username = (u.username || '').toLowerCase()
        const displayName = (u.display_name || u.full_name || '').toLowerCase()
        const email = (u.email || '').toLowerCase()
        
        return username.includes(q) || displayName.includes(q) || email.includes(q)
      })
    })

    // 生命周期和监听器
    onMounted(() => {
      loadUsers()
      loadSites()
    })
    
    // 监听站点配置对话框打开
    watch(showSiteConfigDialog, (newVal) => {
      if (newVal) {
        loadSites()
      }
    })

    // 分页相关方法
    const goToPage = (page) => {
      const totalPages = pagination.value.pages || 0
      if (page < 1 || page > totalPages || page === pagination.value.page || loading.value) {
        return
      }
      pagination.value.page = page
      loadUsers()
    }

    const handlePageSizeChange = () => {
      if (loading.value) return
      pagination.value.page = 1 // 改变每页数量时重置到第一页
      loadUsers()
    }

    const getPageNumbers = () => {
      const current = pagination.value.page
      const total = pagination.value.pages || 0
      const pages = []
      
      // 如果没有数据，返回空数组
      if (total === 0) {
        return pages
      }
      
      // 如果总页数少于等于7，显示所有页码
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // 总页数大于7，显示部分页码
        if (current <= 3) {
          // 当前页在前3页
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 2) {
          // 当前页在后3页
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          // 当前页在中间
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    }

    // 监听搜索和筛选变化
    watch([searchQuery, roleFilter], () => {
      pagination.value.page = 1 // 重置页码
      loadUsers()
    })

    return {
      searchQuery,
      roleFilter,
      showAddUserDialog,
      editingUser,
      userForm,
      users,
      filteredUsers,
      userSitesMap,
      loading,
      error,
      pagination,
      isFormValid,
      getRoleName,
      getStatusName,
      hasOperatePermission,
      getLevelName,
      getPermissionsCount,
      getPermissionsTooltip,
      getUserSitesTooltip,
      isRoot,
      isAdmin,
      formatTime,
      editUser,
      closeDialog,
      saveUser,
      toggleUserStatus,
      deleteUser,
      loadUsers,
      deleteDropdown,
      showDeleteDropdown,
      hideDeleteOptions,
      keepDeleteDropdown,
      showDeleteOptions,
      // 分页相关
      goToPage,
      handlePageSizeChange,
      getPageNumbers,
      // 系统配置相关
      showSystemConfigDialog,
      systemConfigForm,
      openSystemConfigDialog,
      closeSystemConfigDialog,
      saveSystemConfig,
      isSystemConfigValid,
      isProtectedUser,
      
      // 站点管理相关
      showSiteConfigDialog,
      showAddSiteDialog,
      editingSite,
      sites,
      siteSearchQuery,
      selectedSites,
      selectAllSites,
      siteForm,
      filteredSites,
      closeSiteConfigDialog,
      closeSiteDialog,
      editSite,
      saveSite,
      toggleSiteStatus,
      deleteSite,
      toggleSelectAllSites,
      batchEnableSites,
      batchDisableSites,
      // 分配
      showAssignDialog,
      showAssignSitesDialog,
      showUnassignDialog,
      assignUserId,
      assignRole,
      openAssignDialog,
      closeAssignDialog,
      closeAssignSitesDialog,
      confirmAssignFromDialog,
      confirmAssignSitesToUser,
      assignLoading,
      assignSearch,
      mySites,
      assignSelectedSites,
      assignSelectAll,
      filteredMySites,
      filteredAssignUsers,
      toggleAssignSelectAll,
      openUnassignDialog,
      closeUnassignDialog,
      confirmUnassign,
      openAssignDialogForUser,
      getSiteNameById,
      getAssignUserName,
      selectAssignUser,
      userSearchQuery,
      isSiteFormValid,
      loadSites
    }
  }
}
</script>

<style scoped>
.user-management-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-controls {
  padding: 24px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.user-count {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.loading-text {
  font-size: 14px;
  color: #007bff;
  font-weight: 400;
  margin-left: 12px;
}

.error-message {
  padding: 24px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
}

.error-message p {
  margin: 0 0 12px 0;
  font-weight: 500;
}

.controls-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.search-section {
  flex: 1;
}

.search-group {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
}

.filter-select {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  min-width: 120px;
}

.action-section {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn.config {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
}

.btn.test-btn {
  background: #17a2b8;
  color: white;
  font-size: 12px;
  padding: 8px 12px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-list {
  padding: 24px;
}

.table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 350px);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  position: relative;
  /* 自定义滚动条样式 - 只在内容超出时显示 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f1f5f9;
}

.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.user-table th {
  background: #f8fafc;
  padding: 16px 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

.user-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.user-row:hover {
  background: #f8fafc;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.username {
  font-weight: 500;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.role-badge.operator {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

.role-badge.ENGINEER {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.role-badge.MANAGER {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.role-badge.OPERATOR {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

/* 用户级别标签样式 */
.level-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.level-badge.LEVEL_1 {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.level-badge.LEVEL_2 {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.level-badge.LEVEL_3 {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.level-badge.LEVEL_4 {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
}

.level-badge.LEVEL_5 {
  background: rgba(102, 16, 242, 0.1);
  color: #6610f2;
}

/* 权限信息样式 */
.permissions-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sites-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.site-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1.5px solid #111;
  border-radius: 10px;
  font-size: 12px;
  color: #111;
  background: #fff;
  box-shadow: 0 1px 0 rgba(17,17,17,0.08);
}

.site-count-badge .badge-icon {
  color: #111;
}

.site-count-badge .badge-text {
  font-weight: 600;
  min-width: 16px;
  text-align: center;
}

.permissions-count {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  cursor: help;
  white-space: nowrap;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.ACTIVE {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.status-badge.INACTIVE {
  background: rgba(149, 165, 166, 0.1);
  color: #95a5a6;
}

.status-badge.PENDING {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.status-badge.SUSPENDED {
  background: rgba(255, 87, 34, 0.1);
  color: #ff5722;
}

/* 兼容旧的状态样式 */
.status-badge.active {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
}

.status-badge.inactive {
  background: rgba(149, 165, 166, 0.1);
  color: #95a5a6;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 6px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.action-btn.enable:hover {
  background: #27ae60;
  color: white;
  border-color: #27ae60;
}

.action-btn.disable:hover {
  background: #f39c12;
  color: white;
  border-color: #f39c12;
}

.action-btn.delete:hover:not(:disabled) {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 删除下拉菜单样式 */
.delete-dropdown {
  position: relative;
  display: inline-block;
}

.delete-options {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.delete-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
  text-align: left;
}

.delete-option:hover {
  background: #f8f9fa;
}

.delete-option.soft:hover {
  background: #fff3cd;
  color: #856404;
}

.delete-option.hard:hover {
  background: #f8d7da;
  color: #721c24;
}

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

.dialog-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.config-dialog {
  max-width: 800px;
  width: 95%;
}

.config-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #28a745;
  border-radius: 2px;
}

.test-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.full-width {
  grid-column: 1 / -1;
}

.textarea {
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  transform: scale(1.2);
}

/* 站点管理样式 */
.site-count {
  font-size: 14px;
  color: #666;
  font-weight: normal;
  margin-left: 8px;
}

.site-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input-small {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}

.btn.primary-small,
.btn.success-small,
.btn.warning-small {
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn.success-small {
  background: #28a745;
  color: white;
}

.btn.warning-small {
  background: #ffc107;
  color: #212529;
}

.sites-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 20px;
}

.sites-header {
  display: grid;
  grid-template-columns: 60px 120px 1fr 80px 80px 120px;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  font-size: 14px;
  align-items: center;
}

.sites-content {
  max-height: 320px;
  overflow-y: auto;
}

.site-item {
  display: grid;
  grid-template-columns: 60px 120px 1fr 80px 80px 120px;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s;
}

.site-item:hover {
  background: #f8f9fa;
}

.site-item.site-disabled {
  opacity: 0.6;
  background: #f8f9fa;
}

.site-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.site-name {
  font-weight: 500;
  color: #333;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-enabled {
  background: #d4edda;
  color: #155724;
}

.status-disabled {
  background: #f8d7da;
  color: #721c24;
}

.status-online {
  background: #d1ecf1;
  color: #0c5460;
}

.status-offline {
  background: #f5c6cb;
  color: #721c24;
}

.site-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.action-btn-small {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  width: 28px;
  height: 28px;
}

.action-btn-small.edit {
  background: #17a2b8;
  color: white;
}

.action-btn-small.enable {
  background: #28a745;
  color: white;
}

.action-btn-small.disable {
  background: #6c757d;
  color: white;
}

.action-btn-small.delete {
  background: #dc3545;
  color: white;
}

.action-btn-small:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-label {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.dialog-form {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.field-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.form-section-header {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
  margin: 24px 0 16px 0;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left: 4px solid #409EFF;
  border-radius: 4px;
}

.input-field {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  /* 隐藏部分列以适应小屏幕 */
  .user-table th:nth-child(4), /* 用户级别 */
  .user-table td:nth-child(4) {
    display: none;
  }
  
  .user-table th:nth-child(6), /* 电话 */
  .user-table td:nth-child(6) {
    display: none;
  }
  
  .user-table th:nth-child(8), /* 操作权限 */
  .user-table td:nth-child(8) {
    display: none;
  }
  
  .table-container {
    max-height: calc(100vh - 320px);
  }
}

@media (max-width: 968px) {
  /* 进一步隐藏列 */
  .user-table th:nth-child(5), /* 邮箱 */
  .user-table td:nth-child(5) {
    display: none;
  }
  
  .table-container {
    max-height: calc(100vh - 300px);
  }
}

@media (max-width: 768px) {
  .controls-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-group {
    flex-direction: column;
  }
  
  .user-table {
    font-size: 12px;
  }
  
  .user-table th,
  .user-table td {
    padding: 6px 4px;
  }
  
  /* 在小屏幕上只显示核心列 */
  .user-table th:nth-child(3), /* 用户组 */
  .user-table td:nth-child(3) {
    display: none;
  }
  
  .table-container {
    max-height: calc(100vh - 280px);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  /* 调整删除下拉菜单位置 */
  .delete-options {
    right: auto;
    left: 0;
  }
}

/* 用户选择列表样式 */
.user-select-item {
  transition: all 0.2s ease;
}

.user-select-item:hover {
  background-color: #f5f5f5;
}

.user-select-item.user-selected {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.user-select-item:last-child {
  border-bottom: none;
}

.user-list-container {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f5f5f5;
}

.user-list-container::-webkit-scrollbar {
  width: 8px;
}

.user-list-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.user-list-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.user-list-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 分页控件样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.page-size-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.page-size-select:hover {
  border-color: #667eea;
}

.page-size-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.pagination-text {
  margin-left: 8px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.pagination-btn.page-number {
  font-weight: 500;
}

.pagination-btn.page-number.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
  font-weight: 600;
}

.pagination-btn.page-number.active:hover {
  background: linear-gradient(45deg, #5568d3, #653a91);
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-ellipsis {
  padding: 0 8px;
  color: #999;
  font-size: 14px;
}

.empty-row {
  background: #fafafa;
}

.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 - 分页控件 */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination-info {
    justify-content: center;
    width: 100%;
  }
  
  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>


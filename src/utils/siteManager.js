/**
 * 站点管理工具
 * 提供全局站点状态管理和切换功能
 */

// 当前选中的站点
let currentSiteCode = null;
let currentSite = null;

// 站点切换监听器
const listeners = new Set();

/**
 * 获取当前站点代码
 */
export function getCurrentSiteCode() {
  if (!currentSiteCode) {
    // 从localStorage恢复
    currentSiteCode = localStorage.getItem('currentSiteId') || null;
  }
  return currentSiteCode;
}

/**
 * 获取当前站点对象
 */
export function getCurrentSite() {
  return currentSite;
}

/**
 * 设置当前站点
 */
export function setCurrentSite(siteCode, site = null) {
  const oldSiteCode = currentSiteCode;
  currentSiteCode = siteCode;
  currentSite = site;
  
  // 保存到localStorage
  if (siteCode) {
    localStorage.setItem('currentSiteId', siteCode);
  } else {
    localStorage.removeItem('currentSiteId');
  }
  
  // 触发变更事件
  if (oldSiteCode !== siteCode) {
    notifyListeners(siteCode, site);
  }
}

/**
 * 监听站点切换
 * @param {Function} callback - 回调函数 (siteCode, site) => void
 * @returns {Function} 取消监听的函数
 */
export function onSiteChange(callback) {
  listeners.add(callback);
  
  // 立即调用一次，传入当前站点
  if (currentSiteCode) {
    callback(currentSiteCode, currentSite);
  }
  
  // 返回取消监听函数
  return () => {
    listeners.delete(callback);
  };
}

/**
 * 添加站点切换监听器（别名，兼容性）
 * @param {Function} callback - 回调函数 (siteCode, site) => void
 */
export function addSiteChangeListener(callback) {
  listeners.add(callback);
  
  // 立即调用一次，传入当前站点
  if (currentSiteCode) {
    callback(currentSiteCode, currentSite);
  }
}

/**
 * 移除站点切换监听器（别名，兼容性）
 * @param {Function} callback - 回调函数
 */
export function removeSiteChangeListener(callback) {
  listeners.delete(callback);
}

/**
 * 通知所有监听器
 */
function notifyListeners(siteCode, site) {
  listeners.forEach(callback => {
    try {
      callback(siteCode, site);
    } catch (error) {
      console.error('站点切换监听器错误:', error);
    }
  });
}

// 监听全局的 site-changed 事件（兼容现有代码）
if (typeof window !== 'undefined') {
  window.addEventListener('site-changed', (event) => {
    const { siteId, site } = event.detail || {};
    if (siteId) {
      setCurrentSite(siteId, site);
    }
  });
}


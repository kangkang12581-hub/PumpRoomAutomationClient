import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0', // 监听所有网络接口，允许通过IP访问
    port: 3000,
    open: true,
    proxy: {
      // 转发流服务 API（必须放在 /api 之前，优先匹配）
      // 注意：代理在服务器本地执行，所以使用 localhost 即可
      // 流服务监听在 0.0.0.0:5500，允许所有IP访问
      '/api/stream': {
        target: 'http://127.0.0.1:5500',
        changeOrigin: false,  // 本地代理不需要改变 origin
        secure: false,
        proxyTimeout: 30000,
        timeout: 30000,
        // 不改写路径，保持 /api/stream/...
        rewrite: path => path,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('代理错误:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理请求:', req.method, req.url);
          });
        }
      },
      // 转发后端 API（放在流服务之后，作为兜底规则）
      '/api': {
        target: 'http://172.16.3.91:8080',  // Spring Boot后端端口（远程服务器）
        changeOrigin: true
        // 不移除 /api 前缀，保持完整路径
      },
      // 转发 WebSocket
      '/ws': {
        target: 'ws://172.16.3.91:8080',  // Spring Boot后端端口（远程服务器）
        ws: true,
        changeOrigin: true
      },
      // 转发 HLS 切片到生产 Nginx（80端口）或你的静态服务器
      '/hls': {
        target: 'http://localhost',
        changeOrigin: true,
        // 不改写路径，保持 /hls/<cam>/index.m3u8
        rewrite: path => path
      }
    }
  }
})


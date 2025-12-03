#!/bin/bash

# 前端开发服务器启动脚本
# 自动加载 Node.js 环境并启动 Vite 开发服务器

# 设置脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  启动前端开发服务器"
echo "=========================================="

# 加载 Node.js 环境
export PATH="$HOME/.local/node/current/bin:$PATH"

# 验证 Node.js 是否可用
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未找到！"
    echo "请先运行: bash /home/adminroot/PumpRoomAutomationSystem/install_nodejs.sh"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未找到！"
    echo "请先运行: bash /home/adminroot/PumpRoomAutomationSystem/install_nodejs.sh"
    exit 1
fi

# 显示版本信息
echo "✅ Node.js: $(node --version)"
echo "✅ npm: v$(npm --version)"
echo "📂 工作目录: $SCRIPT_DIR"
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "⚠️  依赖未安装，正在安装..."
    npm install
    echo ""
fi

# 启动开发服务器
echo "🚀 启动 Vite 开发服务器..."
echo "   本地访问: http://localhost:3000"
echo "   内网访问: http://192.168.10.96:3000"
echo "   后端 API: http://localhost:5000/api"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "=========================================="
echo ""

npm run dev


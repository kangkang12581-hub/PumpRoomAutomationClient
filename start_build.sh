#!/bin/bash

# 前端生产构建脚本
# 自动加载 Node.js 环境并构建生产版本

# 设置脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  构建前端生产版本"
echo "=========================================="

# 加载 Node.js 环境
export PATH="$HOME/.local/node/current/bin:$PATH"

# 验证 Node.js 是否可用
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未找到！"
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

# 构建生产版本
echo "🔨 开始构建..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ 构建完成！"
    echo "=========================================="
    echo "构建产物位置: $SCRIPT_DIR/dist/"
    echo ""
    echo "可以使用以下命令预览："
    echo "  npm run preview"
    echo ""
else
    echo ""
    echo "❌ 构建失败！"
    exit 1
fi


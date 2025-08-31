#!/usr/bin/env python3
"""
BioNext MCP Server 启动脚本
专为魔搭环境优化
"""

import sys
import os
from pathlib import Path

# 添加当前目录到Python路径
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    from bionext_mcp.my_server import mcp
    
    # 设置环境变量
    os.environ.setdefault('PROJECT_PATH', '/tmp/analysis')
    
    # 确保分析目录存在
    Path(os.environ['PROJECT_PATH']).mkdir(parents=True, exist_ok=True)
    
    print(f"🚀 启动BioNext MCP服务器...")
    print(f"📁 工作目录: {os.getcwd()}")
    print(f"📁 分析目录: {os.environ['PROJECT_PATH']}")
    print(f"🐍 Python版本: {sys.version}")
    
    # 启动MCP服务器
    mcp.run(transport="stdio")
    
except ImportError as e:
    print(f"❌ 导入错误: {e}", file=sys.stderr)
    print(f"📁 当前目录: {os.getcwd()}", file=sys.stderr)
    print(f"🐍 Python路径: {sys.path}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"❌ MCP服务器启动失败: {e}", file=sys.stderr)
    sys.exit(1)

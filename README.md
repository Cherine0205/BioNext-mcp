# BioNext-MCP：智能生物信息学分析助手

> 专为Claude Desktop设计的生物信息学MCP服务器，实现"对话式"Python脚本自动执行

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

## ✨ 核心特性

🤖 **智能脚本检测** - 自动识别Claude响应中的Python代码块  
🔒 **安全执行环境** - 每个脚本在隔离目录中运行  
📊 **完整IO收集** - 捕获所有输出、错误和生成的文件  
🪟 **Windows兼容** - 完全支持Windows环境  
🚫 **无API依赖** - 充分利用Claude Desktop的本地能力  
🧬 **生物信息学专用** - 智能识别生物数据分析脚本

## 🎯 主要工具

### 🌟 `execute_claude_script` (核心工具)
自动检测并执行Claude生成的Python脚本
- 智能提取Python代码块
- 生物信息学相关性检测
- 安全隔离执行
- 详细执行报告

### 📋 `analyze_bioinformatics_task`
分析和规划生物信息学任务
- 理解自然语言需求
- 创建工作流结构
- 生成分析提示

### 🔍 `debug_workflow`
智能调试和问题分析
- 执行错误分析
- 解决方案建议
- 详细日志查看

## 🚀 快速开始

### 1. 克隆和安装
```bash
git clone https://github.com/your-username/BioNext-mcp.git
cd BioNext-mcp
npm install
npm run build
```

### 2. 配置Claude Desktop
找到Claude Desktop配置文件：
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

添加配置：
```json
{
  "mcpServers": {
    "bioinformatics-workflow": {
      "command": "node",
      "args": ["path/to/BioNext-mcp/dist/index.js"],
      "cwd": "path/to/BioNext-mcp",
      "env": {
        "PROJECT_PATH": "path/to/your/analysis/directory"
      }
    }
  }
}
```

### 3. 重启Claude Desktop

## 💡 使用方法

### 基本工作流程
1. **向Claude提问**: "我需要分析RNA-seq数据"
2. **获得Python脚本**: Claude生成分析代码
3. **一键执行**: 使用`execute_claude_script`工具
4. **查看结果**: 获得详细报告和生成文件

### 示例对话
```
你: "帮我创建一个RNA-seq质量控制脚本"
Claude: "我来为你创建脚本..." [生成Python代码]
你: 使用execute_claude_script工具执行
系统: 返回详细执行报告和结果文件
```

## 🧬 支持的分析类型

系统智能识别以下生物信息学内容：

**Python库**: pandas, numpy, matplotlib, seaborn, biopython, pysam, HTSeq, scipy, sklearn  
**数据格式**: FASTQ, FASTA, VCF, BAM, SAM, BED, GTF, GFF, CSV, TSV  
**分析领域**: 基因组学、转录组学、变异检测、单细胞分析、功能注释、统计分析

## 📊 执行报告示例

```
# Claude Python脚本执行报告

## 工作流ID: bio_1234567890_abc123def

## 执行概况:
- 检测到 2 个Python脚本
- 成功执行: 2 个
- 执行失败: 0 个

## 详细结果:
### 脚本 1: claude_script_1.py
**状态**: ✅ 成功
**描述**: RNA-seq数据质量控制
**输出**: 质量控制完成，生成qc_report.html

### 脚本 2: claude_script_2.py
**状态**: ✅ 成功
**描述**: 差异表达分析
**输出**: 发现1,245个差异表达基因，结果保存到deg_results.csv
```

## 🛠️ 技术架构

- **TypeScript** - 类型安全的开发语言
- **MCP SDK** - Model Context Protocol支持
- **Node.js** - 跨平台运行时环境
- **Python** - 生物信息学脚本执行环境

## 📁 项目结构

```
BioNext-mcp/
├── src/
│   ├── index.ts          # 主服务器文件
│   └── types.ts          # 类型定义
├── dist/                 # 编译输出
├── GUIDE.md             # 完整使用指南
├── README.md            # 项目介绍
├── mcp-config.json      # 配置模板
└── package.json         # 项目配置
```

## 📚 文档

- [完整使用指南](./GUIDE.md) - 详细的安装、配置和使用说明
- [测试示例](./test_claude_response.md) - Claude响应和执行示例

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

[MIT License](https://opensource.org/licenses/MIT)
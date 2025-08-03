# BioNext-MCP 完整使用指南

## 🎯 项目概述

BioNext-MCP是一个专为Claude Desktop设计的生物信息学工作流MCP服务器，主要功能是自动检测并执行Claude生成的Python脚本，实现真正的"对话式生物信息学分析"。

## 🚀 核心特性

- **智能脚本检测** - 自动从Claude响应中提取Python代码
- **安全执行环境** - 每个脚本在独立目录中运行
- **完整IO收集** - 捕获所有输出、错误和生成的文件
- **Windows兼容** - 完全支持Windows环境
- **无API依赖** - 充分利用Claude Desktop的本地能力

## 📋 系统要求

- Node.js 18+
- Python 3.7+
- Claude Desktop应用
- Windows/macOS/Linux

## 🔧 安装配置

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

添加以下配置：
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

## 🎮 使用方法

### 基本工作流程

1. **向Claude提问**
   ```
   "我有一些RNA-seq数据需要进行质量控制和差异表达分析"
   ```

2. **Claude生成Python脚本**
   Claude会提供包含Python代码块的响应

3. **执行脚本**
   使用`execute_claude_script`工具，参数：
   ```json
   {
     "claude_response": "[复制Claude的完整响应]",
     "execution_context": "RNA-seq数据分析"
   }
   ```

4. **查看结果**
   获得详细的执行报告和生成的文件

### 工具说明

#### 🌟 `execute_claude_script` (主要工具)
自动检测并执行Claude生成的Python脚本

**参数：**
- `claude_response` (必需): Claude的完整响应文本
- `execution_context` (可选): 执行上下文描述
- `workflow_id` (可选): 工作流ID

#### 📋 `analyze_bioinformatics_task`
分析和规划生物信息学任务

**参数：**
- `user_request` (必需): 用户需求描述
- `data_files` (必需): 数据文件列表
- `additional_context` (可选): 附加信息

#### 🔍 `debug_workflow`
调试工作流执行问题

**参数：**
- `workflow_id` (必需): 要调试的工作流ID
- `error_context` (可选): 错误上下文

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
**输出**: 发现1,245个差异表达基因
```

## 📁 文件结构

每次执行都会创建独立的工作目录：
```
analysis/
└── bio_1234567890_abc123def/
    ├── claude_script_1.py          # 提取的Python脚本
    ├── claude_script_2.py          # 提取的Python脚本
    ├── claude_script_results.json  # 执行结果
    ├── expression_data.csv         # 脚本生成的数据
    └── plot.png                    # 脚本生成的图表
```

## 🛠️ 故障排除

### 常见问题

1. **"Cannot find module"错误**
   - 确保已运行`npm run build`
   - 检查Claude Desktop配置中的路径

2. **Python脚本执行失败**
   - 确保Python已安装并在PATH中
   - 检查所需的Python包是否已安装
   - 使用`debug_workflow`工具分析具体错误

3. **脚本未被检测到**
   - 确保Python代码被包含在```python代码块中
   - 代码必须包含生物信息学相关关键词

### 调试技巧

1. **查看详细日志**
   - 检查执行目录中的结果文件
   - 使用`debug_workflow`工具

2. **分步执行**
   - 将复杂脚本分解为多个简单脚本
   - 逐步验证每个步骤

## 🧬 支持的生物信息学工具

系统智能识别以下生物信息学相关内容：

**Python库：**
- pandas, numpy, matplotlib, seaborn
- biopython, pysam, HTSeq
- scipy, sklearn

**数据格式：**
- FASTQ, FASTA, VCF, BAM, SAM
- BED, GTF, GFF, CSV, TSV

**分析类型：**
- 序列分析、基因组学、转录组学
- 变异检测、功能注释
- 统计分析、数据可视化

## 💡 最佳实践

1. **明确描述需求**
   - 详细说明分析目标
   - 提供数据类型和格式信息

2. **逐步分析**
   - 从简单的质量控制开始
   - 逐步进行复杂分析

3. **验证结果**
   - 检查生成的文件和图表
   - 使用统计方法验证结果

4. **保存工作流**
   - 记录成功的分析流程
   - 为类似分析创建模板

## 🤝 贡献指南

欢迎提交问题报告和功能建议！

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 创建Pull Request

## 📄 许可证

MIT License - 详见LICENSE文件

---

**享受智能的生物信息学分析体验！** 🧬✨
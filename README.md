# BioNext-MCP：智能生物信息学分析助手

> 专为Claude Desktop设计的生物信息学MCP服务器，让你通过自然语言对话即可执行Python生物信息学分析

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)

## ✨ 核心特性

🗣️ **自然语言交互** - 无需编写代码，直接用中文对话完成分析  
🐍 **智能Python环境** - 自动检测Python安装，智能安装依赖包  
🤖 **智能脚本检测** - 自动识别Claude响应中的Python代码块  
🔒 **安全执行环境** - 每个脚本在隔离目录中运行  
📊 **完整分析报告** - 详细的执行日志、结果文件和可视化输出  
🪟 **Windows专用优化** - 专为Windows环境设计优化  
🧬 **生物信息学专业** - 支持单细胞、基因组、转录组等多种分析

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

## 📋 系统要求

### 🐍 Python环境（必需）
- **Python 3.9+** （推荐Python 3.10或3.11）
- **pip包管理器**

### 💻 开发环境
- **Node.js 18+**
- **Windows 10/11** （专为Windows优化）
- **Claude Desktop** 客户端

## 🚀 安装指南

### 第一步：安装Python

#### 方法1：从官网下载（推荐）
1. 访问 [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. 下载最新版本的Python（建议Python 3.10或3.11）
3. 运行安装程序时，**务必勾选 "Add Python to PATH"**
4. 选择 "Install Now" 进行默认安装

#### 方法2：使用Microsoft Store
1. 打开Microsoft Store
2. 搜索 "Python"
3. 安装 "Python 3.11" 或更新版本

#### 方法3：使用包管理器
```powershell
# 使用Chocolatey
choco install python

# 使用Scoop
scoop install python

# 使用winget
winget install Python.Python.3
```

#### 验证Python安装
打开命令提示符(cmd)或PowerShell，输入：
```bash
python --version
# 或
py --version
```
如果显示Python版本信息，说明安装成功！

### 第二步：安装BioNext-MCP

#### 1. 克隆项目
```bash
git clone https://github.com/your-username/BioNext-mcp.git
cd BioNext-mcp
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 编译项目
```bash
npm run build
```

### 第三步：配置Claude Desktop

#### 1. 找到配置文件
Windows配置文件位置：
```
%APPDATA%\Claude\claude_desktop_config.json
```

#### 2. 添加MCP服务器配置
在配置文件中添加以下内容：
```json
{
  "mcpServers": {
    "bioinformatics-workflow": {
      "command": "node",
      "args": ["D:\\path\\to\\BioNext-mcp\\dist\\index.js"],
      "cwd": "D:\\path\\to\\BioNext-mcp",
      "env": {
        "PROJECT_PATH": "D:\\path\\to\\your\\analysis\\directory"
      }
    }
  }
}
```

**重要提示：**
- 将 `D:\\path\\to\\BioNext-mcp` 替换为你的实际安装路径
- 将 `D:\\path\\to\\your\\analysis\\directory` 替换为你希望存放分析结果的目录
- Windows路径中使用双反斜杠 `\\`

#### 3. 重启Claude Desktop
关闭并重新打开Claude Desktop应用程序

## 💡 使用方法

### 🗣️ 自然语言交互（推荐）

你可以直接用中文与Claude对话，无需编写任何代码或JSON！

#### 示例对话1：单细胞分析
```
你: 帮我分析这个生物信息学任务：对 C:\Users\username\Desktop\data\singlecell.h5ad 进行单细胞聚类分析

Claude: [自动调用analyze_bioinformatics_task工具分析任务]

Claude: [生成完整的Python分析脚本]

Claude: [自动调用execute_claude_script工具执行脚本，返回详细报告]
```

#### 示例对话2：基因表达分析
```
你: 我有一个基因表达数据文件 D:\data\expression.csv，想做差异表达分析

Claude: [理解需求并生成相应的Python代码]

Claude: [自动执行脚本并返回结果]
```

### 🛠️ 工具使用流程

#### 第一步：任务分析
直接用自然语言描述你的需求，Claude会自动：
- 理解你的分析目标
- 识别数据文件路径
- 调用 `analyze_bioinformatics_task` 工具

#### 第二步：代码生成
说"请生成Python代码"，Claude会：
- 创建完整的分析脚本
- 包含数据加载、处理、分析、可视化等步骤
- 自动选择合适的生物信息学库

#### 第三步：脚本执行
说"执行脚本"，系统会：
- 自动检测Python环境
- 智能安装所需的包（pandas, numpy, scanpy等）
- 在隔离环境中安全执行
- 生成详细的分析报告

### 📁 文件路径格式

在描述文件路径时，可以使用以下格式：
```
✅ 正确格式：
- C:\Users\username\Desktop\data\file.h5ad
- D:\research\data\expression.csv
- E:\projects\genomics\variants.vcf

❌ 注意事项：
- 确保文件路径存在
- 使用完整的绝对路径
- 支持各种生物信息学格式
```

## 🧬 支持的分析类型

### 📊 单细胞分析
- **数据格式**: h5ad, h5, csv, tsv
- **分析内容**: 质量控制、降维、聚类、细胞类型注释、轨迹分析
- **常用库**: scanpy, pandas, numpy, matplotlib, seaborn

### 🧬 基因组学分析
- **数据格式**: FASTA, FASTQ, VCF, BED, GTF, GFF
- **分析内容**: 序列分析、变异检测、基因注释、功能富集
- **常用库**: biopython, pysam, pandas, matplotlib

### 📈 转录组学分析
- **数据格式**: CSV, TSV, Excel, count matrix
- **分析内容**: 差异表达、GO富集、KEGG通路、热图可视化
- **常用库**: pandas, numpy, scipy, matplotlib, seaborn

### 📉 统计分析
- **分析内容**: 描述性统计、假设检验、回归分析、机器学习
- **常用库**: scipy, sklearn, statsmodels, pandas

### 🎨 数据可视化
- **图表类型**: 散点图、热图、小提琴图、UMAP/t-SNE图、火山图
- **可视化库**: matplotlib, seaborn, plotly

## 🤖 智能功能

### 🐍 自动Python环境管理
- ✅ **智能检测**: 自动查找系统中的Python安装
- ✅ **环境指导**: Python未安装时提供详细安装指南
- ✅ **依赖管理**: 自动分析并安装所需的Python包
- ✅ **错误重试**: 包安装失败时自动升级pip并重试

### 🔍 智能代码识别
- ✅ **代码提取**: 从Claude响应中自动提取Python代码块
- ✅ **相关性检测**: 智能识别生物信息学相关代码
- ✅ **依赖分析**: 自动分析import语句和所需包

## 📊 执行报告示例

```
# Claude Python脚本执行报告

## 工作流ID: bio_1705123456_abc123def

## 执行概况:
- 检测到 **1** 个Python脚本
- 成功执行: **1** 个
- 执行失败: **0** 个

## Python环境:
- Python命令: `python`
- 检测到的依赖包: scanpy, pandas, numpy, matplotlib, seaborn

## 包安装结果:
- 📦 开始安装Python包: scanpy, pandas, numpy, matplotlib, seaborn
- ✅ scanpy 安装成功
- ✅ pandas 安装成功
- ✅ numpy 安装成功
- ✅ matplotlib 安装成功
- ✅ seaborn 安装成功

## 详细结果:

### 脚本 1: claude_script_1.py
**状态**: ✅ 成功
**描述**: 单细胞数据聚类分析
**依赖包**: scanpy, pandas, numpy, matplotlib, seaborn

**标准输出**:
```
Loading data from C:\Users\username\Desktop\data\singlecell.h5ad
Data shape: (2700, 32738)
Performing quality control...
Filtering cells and genes...
Normalizing data...
Finding highly variable genes...
Performing PCA...
Computing neighborhood graph...
Performing UMAP embedding...
Leiden clustering completed. Found 8 clusters.
Plots saved to: umap_clusters.png, cluster_markers.png
Analysis completed successfully!
```

**执行目录**: D:\analysis\bio_1705123456_abc123def
```

## ⚠️ 常见问题解决

### Python未安装
如果出现"未找到Python解释器"错误，系统会自动显示详细的Python安装指南。

### 包安装失败
系统会自动：
1. 升级pip到最新版本
2. 重试安装失败的包
3. 提供详细的错误信息

### 文件路径问题
确保：
- 使用完整的绝对路径
- 文件确实存在于指定位置
- Python有权限访问该文件

## 🔧 高级配置

### 自定义分析目录
在Claude Desktop配置中设置 `PROJECT_PATH` 环境变量：
```json
"env": {
  "PROJECT_PATH": "D:\\my_bioinformatics_analysis"
}
```

### 调试模式
查看详细的执行日志，帮助排查问题：
- 所有执行信息会输出到控制台
- 每个脚本的完整输出都会被记录
- 包安装过程的详细日志

## 🛠️ 技术架构

- **TypeScript** - 类型安全的服务器开发
- **MCP SDK** - Model Context Protocol标准支持
- **Node.js** - 跨平台运行时环境
- **Python** - 生物信息学脚本执行环境
- **Windows优化** - 专为Windows环境优化的命令执行

## 📁 项目结构

```
BioNext-mcp/
├── src/
│   ├── index.ts          # 主服务器文件（1000+行核心逻辑）
│   └── types.ts          # TypeScript类型定义
├── dist/                 # 编译输出目录
├── test/                 # 测试示例和结果
├── README.md            # 完整使用指南（本文件）
├── mcp-config.json      # MCP配置模板
├── package.json         # Node.js项目配置
└── tsconfig.json        # TypeScript编译配置
```

## 🎯 核心优势

### 🆚 与传统方法对比

| 特性 | 传统方法 | BioNext-MCP |
|------|---------|-------------|
| 编程需求 | 需要Python编程经验 | 纯自然语言交互 |
| 环境配置 | 手动安装包和依赖 | 自动检测和安装 |
| 错误处理 | 需要手动调试 | 智能错误分析和建议 |
| 结果管理 | 分散的文件和输出 | 统一的分析报告 |
| 学习曲线 | 陡峭 | 平缓，即学即用 |

### 🎯 适用人群

- **生物学研究者** - 有分析需求但缺乏编程经验
- **医学研究人员** - 需要快速处理组学数据
- **学生和初学者** - 学习生物信息学分析方法
- **有经验的分析师** - 提高分析效率和自动化程度

## 🤝 贡献与支持

### 问题反馈
遇到问题？请通过以下方式反馈：
- 提交GitHub Issue
- 详细描述问题和错误信息
- 提供系统环境信息

### 功能建议
欢迎提出新功能建议：
- 新的分析类型支持
- 界面和交互改进
- 性能优化建议

## 📄 许可证

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源协议。

---

**🚀 开始你的生物信息学分析之旅！**  
只需三步：安装Python → 配置MCP → 开始对话分析
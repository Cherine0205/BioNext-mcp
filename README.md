# BioNext-MCP: 智能生物信息学分析助手

> 通过Claude Desktop进行生物信息学分析的最简单方式 - 只需用自然语言聊天，无需编程！

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![ModelScope](https://img.shields.io/badge/ModelScope-Deployed-00C4CC?logo=modelcontextprotocol&logoColor=white)](https://modelscope.cn/)

[English](README_EN.md) | **中文版**

## 🎯 项目简介

BioNext-MCP是一个专为ModelScope设计的智能生物信息学分析工具，让您通过自然语言对话就能完成复杂的生物信息学分析，无需编写任何代码！

**简单来说：**
- 🗣️ 用自然语言告诉Claude您想分析什么数据
- 🤖 Claude自动生成专业的Python分析脚本
- ⚡ 系统自动执行脚本并显示结果
- 📊 获得精美的HTML报告和可视化图表

## ✨ 核心功能

### 🧬 支持的分析类型
- **单细胞RNA测序** (scRNA-seq) - 细胞聚类、差异表达、轨迹分析
- **基因组学** - 变异分析、注释、功能富集
- **转录组学** - 差异表达、通路分析、共表达网络
- **蛋白质组学** - 蛋白质鉴定、定量分析
- **多组学整合** - 数据融合、相关性分析

### 🎨 智能特性
- **自动环境配置** - 检测Python，自动安装所需包（pandas, numpy, matplotlib等）
- **UTF-8编码支持** - 完美支持中文字符
- **可视化优先** - 自动生成图表并在HTML报告中显示
- **质量保证** - 专注于代码完整性和分析准确性
- **错误处理** - 智能诊断问题并提供解决方案

## 🚀 快速开始

### 环境要求
- **Python**: >= 3.9
- **Node.js**: >= 16.0.0
- **操作系统**: Windows, macOS, Linux

### 安装步骤

#### 1. 安装Python环境

**推荐：官方网站安装**
1. 访问 [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. 下载Python 3.9或更高版本
3. **安装时务必勾选"Add Python to PATH"**

**验证安装**
打开命令提示符并输入：
```bash
python --version
```
如果看到版本信息，说明安装成功！

#### 2. 安装BioNext-MCP

**下载项目**
```bash
git clone https://github.com/Cherine0205/BioNext-mcp.git
cd BioNext-mcp
```

**安装依赖**
```bash
npm install
npm run build
```

#### 3. 配置Claude Desktop

**找到配置文件**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**添加配置**
```json
{
  "mcpServers": {
    "bioinformatics-workflow": {
      "command": "node",
      "args": ["D:\\path\\to\\BioNext-mcp\\dist\\index.js"],
      "cwd": "D:\\path\\to\\BioNext-mcp",
      "env": {
        "PROJECT_PATH": "D:\\path\\to\\your\\analysis\\directory",
        "PYTHON_PATH": "/usr/bin/python3"
      }
    }
  }
}
```

**重要提示：**
- 替换路径为您的实际安装路径
- 设置分析目录为您想要保存结果的位置
- 重启Claude Desktop

## 💡 使用方法

### 基本对话流程

1. **描述您的分析需求**
```
我有一个单细胞RNA测序数据文件data.h5ad，想要进行细胞聚类分析和差异表达分析
```

2. **Claude将自动生成分析脚本并执行**
3. **获得详细的HTML报告**，包括：
   - 执行结果和统计信息
   - 生成的图表和可视化
   - 完整的分析日志

### 实际示例

#### 🧪 单细胞分析
```
请帮我分析这个scRNA-seq数据：
- 文件：C:\data\pbmc3k.h5ad
- 需求：质量控制、标准化、聚类、标记基因识别
- 输出：UMAP图、聚类热图、差异表达基因列表
```

#### 🧬 基因表达分析
```
我有两组RNA-seq表达矩阵：
- 对照组：control_samples.csv
- 处理组：treatment_samples.csv
- 分析：差异表达、GO富集、KEGG通路分析
- 可视化：火山图、热图、通路图
```

#### 📊 数据探索
```
帮我探索这个基因表达数据集：
- 文件：gene_expression.csv
- 需求：数据概览、相关性分析、PCA分析
- 生成：统计摘要、相关性热图、PCA图
```

## 🎨 精美报告

### HTML报告特性
- **📊 可视化画廊** - 自动检测并显示生成的图像
- **🔍 交互式查看** - 点击图像可缩放查看
- **📝 详细日志** - 完整的执行过程记录
- **📈 统计摘要** - 脚本执行状态和性能指标

### 自动浏览器打开
- 分析完成后报告自动在浏览器中打开
- 如果未自动打开，手动打开生成的HTML文件

## 🛠️ 常见问题

### Python相关问题
**Q: "Python not found"错误？**
A: 确保Python已安装并添加到PATH环境变量

**Q: 包安装失败？**
A: 系统会自动重试，或手动运行`pip install package_name`

### 分析相关问题
**Q: 脚本执行失败？**
A: 
- 检查数据文件路径是否正确
- 确认数据格式符合要求
- 查看错误日志获取详细信息

**Q: 没有生成HTML报告？**
A: HTML报告只有在所有脚本成功执行时才会生成，先修复执行错误

### 数据格式
**Q: 支持哪些数据格式？**
A: 
- CSV, TSV, Excel文件
- HDF5格式 (.h5, .h5ad)
- FASTA, FASTQ序列文件
- VCF变异文件
- 其他常见生物信息学格式

## 🎯 使用技巧

### 1. 清晰描述需求
```
✅ 好的描述：
"分析单细胞数据，进行质量控制（过滤低质量细胞）、标准化、降维（PCA+UMAP）、聚类（leiden算法）、为每个聚类找到标记基因"

❌ 模糊描述：
"分析这个数据"
```

### 2. 提供完整文件路径
```
✅ 使用绝对路径：
"C:\Users\username\data\sample.h5ad"

❌ 相对路径可能失败：
"./data/sample.h5ad"
```

### 3. 指定输出要求
```
✅ 清晰的输出：
"生成UMAP图、热图，保存结果到CSV文件"

❌ 不清晰：
"做一些可视化"
```

### 4. 分步分析
对于复杂分析，分成多个对话：
1. 第一步：数据加载和质量控制
2. 第二步：标准化和降维
3. 第三步：聚类和可视化
4. 第四步：差异分析

## 🔧 ModelScope部署

### 部署配置
本项目已针对ModelScope平台进行了优化，包含以下特性：

- **托管部署支持** - 支持在ModelScope平台上直接部署
- **环境变量配置** - 完整的Python和Node.js环境配置
- **自动依赖管理** - 自动安装所需的Python包和Node.js模块
- **错误处理机制** - 完善的错误诊断和解决方案

### 部署要求
- **Python**: >= 3.9
- **Node.js**: >= 16.0.0
- **内存**: >= 2GB RAM
- **存储**: >= 1GB 可用空间

### 环境变量
- `PROJECT_PATH`: 分析结果输出路径
- `PYTHON_PATH`: Python解释器路径
- `NODE_ENV`: Node.js运行环境
- `PYTHON_VERSION`: Python版本要求

## 🎉 开始您的生物信息学之旅

现在您已经准备好了！打开Claude Desktop，告诉它您想分析什么数据，让AI为您处理复杂的生物信息学分析！

---

## 📞 获取帮助

- **GitHub Issues**: 报告问题或提出改进建议
- **文档**: 查看详细使用文档
- **示例**: 参考示例分析案例

**记住：** 用自然语言描述您的分析需求，Claude会为您处理所有技术细节！🚀

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**BioNext-MCP团队** - 让生物信息学分析变得简单易用！

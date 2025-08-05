# BioNext-MCP：智能生物信息学分析助手

> 通过Claude Desktop进行生物信息学分析的最简单方式 - 只需用中文对话，无需编程！

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Windows](https://img.shields.io/badge/Windows-10%2F11-0078D4?logo=windows&logoColor=white)](https://www.microsoft.com/windows/)

**中文** | [English](README_EN.md)

## 🎯 这是什么？

BioNext-MCP让您可以通过与Claude Desktop的自然语言对话来完成复杂的生物信息学分析，无需编写任何代码！

**简单来说：**
- 🗣️ 用中文告诉Claude你想分析什么数据
- 🤖 Claude自动生成专业的Python分析脚本
- ⚡ 系统自动执行脚本并展示结果
- 📊 获得美观的HTML报告和可视化图表

## ✨ 主要功能

### 🧬 支持的分析类型
- **单细胞RNA测序** (scRNA-seq) - 细胞聚类、差异表达、轨迹分析
- **基因组学** - 变异分析、注释、功能富集
- **转录组学** - 差异表达、通路分析、共表达网络
- **蛋白质组学** - 蛋白质鉴定、定量分析
- **多组学整合** - 数据融合、关联分析

### 🎨 智能特性
- **自动环境配置** - 检测Python，自动安装所需包（pandas, numpy, matplotlib等）
- **中文无乱码** - 完美支持中文输入输出
- **可视化优先** - 自动生成图表并在HTML报告中展示
- **质量保证** - 注重代码完整性和分析准确性
- **错误处理** - 智能诊断问题并提供解决建议

## 🚀 快速开始

### 第一步：安装Python环境

#### 推荐方式：从官网安装
1. 访问 [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. 下载Python 3.9或更高版本
3. 安装时**务必勾选 "Add Python to PATH"**

#### 验证安装
打开命令提示符，输入：
```bash
python --version
```
看到版本信息说明安装成功！

### 第二步：安装BioNext-MCP

1. **下载项目**
```bash
git clone https://github.com/your-username/BioNext-mcp.git
cd BioNext-mcp
```

2. **安装依赖**
```bash
npm install
npm run build
```

### 第三步：配置Claude Desktop

1. **找到配置文件**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **添加配置**
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

**重要：** 
- 将路径替换为你的实际安装路径
- 将分析目录设置为你希望保存结果的位置

3. **重启Claude Desktop**

## 💡 如何使用

### 基础对话流程

1. **描述你的分析需求**
```
我有一个单细胞RNA测序数据文件data.h5ad，想要进行细胞聚类分析和差异表达分析
```

2. **Claude会生成分析脚本并自动执行**
3. **获得详细的HTML报告**，包含：
   - 执行结果和统计信息
   - 生成的图表和可视化
   - 完整的分析日志

### 实用示例

#### 🧪 单细胞分析
```
请帮我分析这个scRNA-seq数据：
- 文件：C:\data\pbmc3k.h5ad
- 需要：质量控制、标准化、聚类、标记基因识别
- 输出：UMAP图、聚类热图、差异表达基因列表
```

#### 🧬 基因表达分析
```
我有两组RNA-seq样本的表达矩阵：
- 对照组：control_samples.csv
- 处理组：treatment_samples.csv
- 分析：差异表达、GO富集、KEGG通路分析
- 可视化：火山图、热图、通路图
```

#### 📊 数据探索
```
帮我探索这个基因表达数据集：
- 文件：gene_expression.csv
- 需要：数据概览、相关性分析、PCA分析
- 生成：统计摘要、相关性热图、PCA图
```

## 🎨 获得精美报告

### HTML报告特性
- **📊 可视化画廊** - 自动检测并展示生成的图片
- **🔍 交互式查看** - 点击图片放大查看
- **📝 详细日志** - 完整的执行过程记录
- **📈 统计摘要** - 脚本执行状态和性能指标

### 自动打开浏览器
- 分析完成后自动在浏览器中打开报告
- 如果未自动打开，可手动打开生成的HTML文件

## 🛠️ 常见问题

### Python相关
**Q: 提示找不到Python？**
A: 确保Python已安装并添加到PATH环境变量中

**Q: 包安装失败？**
A: 系统会自动重试，也可以手动运行 `pip install 包名`

### 分析相关
**Q: 脚本执行失败？**
A: 
- 检查数据文件路径是否正确
- 确认数据格式是否符合要求
- 查看错误日志获取详细信息

**Q: 没有生成HTML报告？**
A: HTML报告只在所有脚本成功执行时生成，请先修复执行错误

### 数据格式
**Q: 支持哪些数据格式？**
A: 
- CSV, TSV, Excel文件
- HDF5格式（.h5, .h5ad）
- FASTA, FASTQ序列文件
- VCF变异文件
- 其他常见生物信息学格式

## 🎯 使用技巧

### 1. 明确描述需求
```
✅ 好的描述：
"分析单细胞数据，进行质量控制（过滤低质量细胞），标准化，降维（PCA+UMAP），聚类（leiden算法），找出每个cluster的marker基因"

❌ 模糊描述：
"分析一下这个数据"
```

### 2. 提供完整文件路径
```
✅ 使用绝对路径：
"C:\Users\username\data\sample.h5ad"

❌ 相对路径可能出错：
"./data/sample.h5ad"
```

### 3. 指定输出需求
```
✅ 明确输出：
"生成UMAP图、热图、保存结果到CSV文件"

❌ 不明确：
"做一些可视化"
```

### 4. 分步骤分析
对于复杂分析，可以分多次对话：
1. 第一次：数据加载和质量控制
2. 第二次：标准化和降维
3. 第三次：聚类和可视化
4. 第四次：差异分析

## 🎉 开始你的生物信息学之旅

现在你已经准备好了！打开Claude Desktop，告诉它你想分析什么数据，让AI为你完成复杂的生物信息学分析吧！

---

## 📞 获取帮助

- **GitHub Issues**: 报告问题或建议改进
- **文档**: 查看详细的使用文档
- **示例**: 参考示例分析案例

**记住：** 用自然语言描述你的分析需求，Claude会为你处理所有技术细节！🚀
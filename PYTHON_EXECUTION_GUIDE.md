# Python脚本自动执行功能指南

## 🎯 新功能概述

现在MCP服务器可以自动检测Claude LLM生成的Python脚本并执行它们！当你与Claude讨论生物信息学问题时，如果Claude提供了Python代码解决方案，MCP服务器会自动识别并执行这些脚本。

## 🔧 核心功能

### `execute_claude_script` 工具

**智能检测和执行Claude生成的Python脚本**

- 自动从Claude响应中提取Python代码块
- 智能识别生物信息学相关的脚本
- 在隔离环境中安全执行
- 收集执行结果和错误信息
- 提供详细的执行报告

## 🚀 使用方法

### 方法1：直接使用工具
```json
{
  "claude_response": "这里是Claude的完整响应，包含Python代码块",
  "execution_context": "RNA-seq数据分析",
  "workflow_id": "可选的工作流ID"
}
```

### 方法2：与现有工作流集成
1. 使用 `analyze_bioinformatics_task` 创建分析任务
2. Claude生成分析计划和Python脚本
3. 自动调用 `execute_claude_script` 执行脚本

## 🔍 智能检测机制

### 支持的代码块格式：
- ````python` 标准Python代码块
- ```` ``` ```` 通用代码块（如果包含Python语法）

### 生物信息学相关性检测：
系统会检查代码中是否包含以下关键词：

**生物信息学库：**
- biopython, pandas, numpy, matplotlib, seaborn
- Bio, pysam, HTSeq, pybedtools

**生物数据格式：**
- fastq, fasta, vcf, bam, sam, bed, gtf, gff

**生物学术语：**
- sequence, genome, gene, protein, DNA, RNA
- alignment, blast, annotation, expression

## 📊 执行报告

每次执行后，你会收到详细报告：

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
**描述**: RNA-seq数据质量控制分析

**标准输出**:
```
Quality control completed successfully
Generated QC report: qc_report.html
```

**错误输出**:
```
(无错误)
```

### 脚本 2: claude_script_2.py
**状态**: ✅ 成功
**描述**: 差异表达基因分析

**标准输出**:
```
Found 1,245 differentially expressed genes
Results saved to: deg_results.csv
```
```

## 🛡️ 安全特性

1. **隔离执行**: 每个脚本在独立目录中执行
2. **超时保护**: 脚本执行超时限制（5分钟）
3. **智能过滤**: 只执行生物信息学相关的脚本
4. **完整日志**: 保存所有执行记录和结果

## 📁 文件结构

执行后的目录结构：
```
test/
└── bio_1234567890_abc123def/
    ├── claude_script_1.py          # 提取的Python脚本
    ├── claude_script_2.py          # 提取的Python脚本
    ├── claude_script_results.json  # 详细执行结果
    └── [脚本生成的输出文件]
```

## 💡 使用场景

### 场景1：数据分析
你：「我有一些RNA-seq数据需要进行质量控制」
Claude：「我来为你写一个Python脚本...」
```python
import pandas as pd
import matplotlib.pyplot as plt
# ... 质量控制代码
```
MCP：自动检测并执行脚本，生成QC报告

### 场景2：数据可视化  
你：「帮我可视化基因表达数据」
Claude：「这里是一个热图可视化脚本...」
```python
import seaborn as sns
import pandas as pd
# ... 热图生成代码
```
MCP：自动执行并生成可视化图片

### 场景3：统计分析
你：「需要进行差异表达分析」
Claude：「我来写一个DESeq2的Python包装脚本...」
```python
import pandas as pd
from scipy import stats
# ... 统计分析代码
```
MCP：自动执行并生成分析结果

## ⚠️ 注意事项

1. **Python环境**: 确保系统安装了Python和必要的生物信息学包
2. **数据路径**: 脚本中的文件路径应该是相对路径或可访问的绝对路径
3. **依赖包**: 如果脚本需要特定的Python包，确保已安装
4. **执行权限**: 确保MCP服务器有执行Python脚本的权限

## 🎉 优势

- **无缝集成**: Claude写代码，MCP自动执行
- **智能识别**: 只执行相关的生物信息学脚本
- **完整反馈**: 详细的执行结果和错误信息
- **安全可靠**: 隔离执行环境，完整的日志记录
- **即时结果**: 立即看到代码执行效果

现在你可以直接告诉Claude你的生物信息学需求，让它生成Python脚本，然后MCP会自动执行并给你结果！
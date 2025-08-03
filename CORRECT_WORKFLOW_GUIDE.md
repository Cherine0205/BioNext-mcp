# 正确的工作流程指南

## 🎯 推荐的使用流程

### 第一步：向Claude提出生物信息学问题
```
你：我有一些RNA-seq数据需要进行质量控制和差异表达分析
```

### 第二步：Claude生成Python脚本
```
Claude：我来为你创建Python脚本进行分析...

```python
import pandas as pd
import matplotlib.pyplot as plt
# ... 质量控制代码
```

```python  
import numpy as np
from scipy import stats
# ... 差异表达分析代码
```
```

### 第三步：使用execute_claude_script执行脚本
```json
{
  "claude_response": "[复制Claude的完整响应，包含所有Python代码块]",
  "execution_context": "RNA-seq质量控制和差异表达分析"
}
```

### 第四步：查看执行结果和调试
MCP会自动：
- ✅ 检测Python脚本
- ✅ 在隔离环境中执行
- ✅ 收集所有输出和错误
- ✅ 生成详细报告
- ✅ 如有问题，提供调试建议

## 🚀 核心工具说明

### 主要工具：`execute_claude_script` 🌟
**这是你的主要工具！**
- 自动检测Claude响应中的Python脚本
- 在Windows环境中安全执行
- 收集完整的输入输出
- 提供详细的执行报告
- 支持调试和错误分析

### 辅助工具：`analyze_bioinformatics_task`
**用于分析和规划：**
- 理解你的分析需求
- 创建工作流结构
- 为Claude提供上下文

### 调试工具：`debug_workflow`
**当出现问题时使用：**
- 分析执行错误
- 提供解决方案建议
- 查看详细日志

## ❌ 不推荐的流程

~~1. 使用 `analyze_bioinformatics_task`~~
~~2. 使用 `execute_workflow`~~ (已弃用)
~~3. 手动调试~~

## ✅ 推荐的流程

1. **直接与Claude对话** - 描述你的生物信息学需求
2. **获取Python脚本** - Claude生成解决方案
3. **使用execute_claude_script** - 一键执行并获得结果
4. **必要时调试** - 使用debug_workflow分析问题

## 🔧 Windows兼容性修复

现在系统已经修复了Windows兼容性问题：
- ✅ 使用`cmd.exe`而不是`bash`
- ✅ 生成`.bat`文件而不是`.sh`文件  
- ✅ 使用Windows路径格式
- ✅ 兼容Windows Python环境

## 💡 实际使用示例

### 场景：RNA-seq数据分析

**你：** "我有4个RNA-seq样本需要分析，想看看基因表达的差异"

**Claude：** "我来为你创建分析脚本..."
```python
# Claude生成的质量控制脚本
import pandas as pd
# ... 代码
```

**你：** 使用`execute_claude_script`工具，参数：
```json
{
  "claude_response": "[Claude的完整响应]",
  "execution_context": "RNA-seq差异表达分析"
}
```

**MCP：** 
```
# Claude Python脚本执行报告

## 执行概况:
- 检测到 2 个Python脚本
- 成功执行: 2 个
- 执行失败: 0 个

## 详细结果:
### 脚本 1: claude_script_1.py
**状态**: ✅ 成功
**输出**: 质量控制完成，生成了qc_report.html

### 脚本 2: claude_script_2.py  
**状态**: ✅ 成功
**输出**: 发现1,245个差异表达基因，结果保存到deg_results.csv
```

## 🎉 优势

- **简单直接** - 不需要复杂的工作流设置
- **自动化** - Claude写代码，MCP自动执行
- **完整反馈** - 详细的执行结果和错误信息
- **Windows友好** - 完全兼容Windows环境
- **安全隔离** - 每次执行都在独立目录中

现在你可以享受真正的"对话式生物信息学分析"体验！🚀
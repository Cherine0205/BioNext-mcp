# BioNext-MCP 使用指南

## 🎯 系统概述

这是一个全新设计的生物信息学MCP服务器，充分利用Claude Desktop的本地LLM能力，无需外部API。

## 🔧 核心功能

### 1. `analyze_bioinformatics_task`
**智能分析生物信息学任务**
- 理解用户的自然语言请求
- 自动识别分析类型和所需工具
- 创建unique工作流目录
- 生成分析提示给Claude LLM

### 2. `execute_workflow`
**执行生物信息学工作流**
- 在独立目录中执行分析脚本
- 收集执行输出和错误信息
- 保存执行结果供后续分析

### 3. `debug_workflow`
**智能调试工作流**
- 分析执行错误和问题
- 提供详细的调试信息
- 生成解决方案建议

## 🚀 使用流程

### 步骤1: 分析任务
```json
{
  "user_request": "我想对RNA-seq数据进行差异表达分析",
  "data_files": [
    "sample1_R1.fastq.gz: 处理组样本1",
    "sample1_R2.fastq.gz: 处理组样本1",
    "control1_R1.fastq.gz: 对照组样本1",
    "control1_R2.fastq.gz: 对照组样本1"
  ],
  "additional_context": "需要比较处理组和对照组的基因表达差异"
}
```

### 步骤2: 执行工作流
```json
{
  "workflow_id": "bio_1234567890_abc123def"
}
```

### 步骤3: 调试分析
```json
{
  "workflow_id": "bio_1234567890_abc123def",
  "error_context": "FastQC执行失败"
}
```

## 💡 工作原理

1. **无API依赖**: 完全使用Claude Desktop的本地LLM能力
2. **智能理解**: Claude直接理解用户意图并生成分析计划
3. **自动执行**: 在隔离的工作流目录中执行脚本
4. **智能调试**: 收集执行结果并提供调试建议

## 📁 文件结构

每个工作流都会在 `PROJECT_PATH` 下创建独立目录：
```
test/
└── bio_1234567890_abc123def/
    ├── workflow_info.json      # 工作流信息
    ├── execute.sh             # 执行脚本
    ├── execution_result.json  # 执行结果
    ├── output/                # 分析输出
    └── logs/                  # 日志文件
```

## 🎯 优势

- **简化配置**: 无需配置外部API密钥
- **智能交互**: Claude直接理解和处理用户请求
- **完整流程**: 从分析到执行到调试的完整工作流
- **安全隔离**: 每个工作流在独立目录中执行
- **详细日志**: 完整的执行日志和调试信息

## 📝 注意事项

1. 确保所需的生物信息学工具已安装在系统中
2. 工作流目录需要有足够的磁盘空间
3. 复杂分析可能需要较长执行时间
4. 建议先在小数据集上测试工作流

## 🔄 与Claude LLM的协作

这个系统设计为与Claude LLM紧密协作：
1. MCP工具收集用户需求和数据信息
2. Claude LLM分析需求并生成具体的分析计划
3. MCP工具执行分析并收集结果
4. Claude LLM分析结果并提供调试建议

这种设计充分发挥了Claude的分析能力和MCP的执行能力！
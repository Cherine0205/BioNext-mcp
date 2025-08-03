# 生物信息学工作流MCP服务器

这是一个基于Model Context Protocol (MCP)的生物信息学工作流服务器，专为Claude Desktop设计，提供智能的Python脚本自动执行功能。

## 功能特性

### 🎯 核心工具

#### 1. `analyze_bioinformatics_task`
**智能分析生物信息学任务**
- 理解用户的自然语言请求
- 自动识别分析类型和所需工具
- 创建unique工作流目录
- 生成分析提示给Claude LLM

#### 2. `execute_workflow`
**执行生物信息学工作流**
- 在独立目录中执行分析脚本
- 收集执行输出和错误信息
- 保存执行结果供后续分析

#### 3. `debug_workflow`
**智能调试工作流**
- 分析执行错误和问题
- 提供详细的调试信息
- 生成解决方案建议

#### 4. `execute_claude_script` 🆕
**自动执行Claude生成的Python脚本**
- 智能检测Claude响应中的Python代码
- 自动识别生物信息学相关脚本
- 在隔离环境中安全执行
- 提供详细的执行报告和结果

### 🚀 新特性

- **无API依赖**: 完全使用Claude Desktop的本地LLM能力
- **智能脚本执行**: 自动检测并执行Claude生成的Python脚本
- **完整工作流**: 从分析到执行到调试的完整流程
- **安全隔离**: 每个工作流在独立目录中执行

## 快速开始

### 1. 安装和构建
```bash
npm install
npm run build
```

### 2. 配置Claude Desktop
在Claude Desktop配置文件中添加：
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

### 4. 开始使用
1. 向Claude描述你的生物信息学需求
2. 当Claude生成Python脚本时，使用`execute_claude_script`工具自动执行
3. 查看详细的执行报告和结果

## 支持的生物信息学工具

本服务器支持多种生物信息学工具，包括：

- **质量控制和预处理**: FastQC, fastp, Cutadapt, Trimmomatic, MultiQC等
- **序列比对**: BWA, Bowtie2, HISAT2, STAR, TopHat2等
- **基因表达分析**: Salmon, Kallisto, RSEM, HTSeq, DESeq2, edgeR等
- **变异检测**: GATK, FreeBayes, bcftools, VarScan2等
- **单细胞分析**: Seurat, Scanpy, CellRanger等
- **功能富集分析**: clusterProfiler, GSEA, DAVID等

## 使用示例

### 生成RNA-seq分析计划

```json
{
  "goal": "进行RNA-seq差异表达分析，比较处理组和对照组的基因表达差异",
  "datalist": [
    "sample1_R1.fastq.gz: 处理组样本1的RNA-seq数据",
    "sample1_R2.fastq.gz: 处理组样本1的RNA-seq数据",
    "control1_R1.fastq.gz: 对照组样本1的RNA-seq数据",
    "control1_R2.fastq.gz: 对照组样本1的RNA-seq数据",
    "reference.fa: 参考基因组",
    "annotation.gtf: 基因注释文件"
  ]
}
```

### 根据计划生成脚本

```json
{
  "plan": [
    {
      "step_number": 1,
      "description": "质量控制和去除接头",
      "input_filename": ["sample1_R1.fastq.gz", "sample1_R2.fastq.gz"],
      "output_filename": ["trimmed_sample1_R1.fastq.gz", "trimmed_sample1_R2.fastq.gz"],
      "tools": "Trimmomatic"
    }
  ]
}
```

## 技术架构

- **TypeScript**: 主要开发语言
- **MCP SDK**: Model Context Protocol支持
- **Axios**: HTTP客户端，用于调用OpenAI API
- **Node.js**: 运行时环境

## 开发

### 开发模式

```bash
npm run dev
```

### 项目结构

```
src/
├── index.ts          # 主服务器文件
├── types.ts          # 类型定义
├── config.ts         # 配置管理
├── openai-client.ts  # OpenAI客户端
└── prompts.ts        # 提示词模板
```

## 许可证

MIT License
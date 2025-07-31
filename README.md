# 生物信息学工作流MCP服务器

这是一个基于Model Context Protocol (MCP)的生物信息学工作流服务器，为大语言模型提供两个核心工具：计划生成和脚本生成。

## 功能特性

### 1. generate_plan
根据用户提供的分析目标和数据文件，生成详细的生物信息学分析计划。

**输入参数：**
- `goal`: 分析目标（如"进行RNA-seq差异表达分析"）
- `datalist`: 输入数据文件列表
- `id`: 项目ID（可选）
- `project_path`: 项目路径（可选）

**输出：**
结构化的分析计划，包含多个步骤，每个步骤包含：
- 步骤编号
- 详细描述
- 输入文件
- 输出文件
- 使用的工具

### 2. generate_script
根据分析计划生成可执行的shell脚本。

**输入参数：**
- `plan`: 分析计划步骤数组
- `id`: 项目ID（可选）
- `project_path`: 项目路径（可选）

**输出：**
每个步骤的可执行脚本命令，包括软件安装和具体的分析命令。

## 安装和配置

1. 安装依赖：
```bash
cd mcp_server
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑.env文件，设置您的API密钥和配置
```

3. 构建项目：
```bash
npm run build
```

4. 启动服务器：
```bash
npm start
```

## 环境变量配置

- `OPENAI_API_KEY`: OpenAI API密钥
- `OPENAI_BASE_URL`: API基础URL（默认为OpenAI官方API）
- `OPENAI_MODEL`: 使用的模型（默认gpt-4o-mini）
- `PROJECT_PATH`: 项目根路径

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
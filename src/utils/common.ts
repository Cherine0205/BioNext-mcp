import * as fs from 'fs';
import * as path from 'path';

/**
 * 生成唯一的工作流ID
 */
export function generateId(): string {
  return `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取Shell配置（支持Windows和macOS/Linux）
 */
export function getShellConfig() {
  const platform = process.platform;
  if (platform === 'win32') {
    return {
      shell: 'cmd.exe'
    };
  } else {
    // macOS/Linux
    return {
      shell: '/bin/bash'
    };
  }
}

/**
 * 构建CD命令（支持Windows和macOS/Linux）
 */
export function buildCdCommand(directory: string): string {
  const platform = process.platform;
  if (platform === 'win32') {
    return `cd /d "${directory}"`;
  } else {
    // macOS/Linux
    return `cd "${directory}"`;
  }
}

/**
 * 列出工作流目录中的文件
 */
export function listWorkflowFiles(workflowDir: string): string[] {
  try {
    return fs.readdirSync(workflowDir, { recursive: true }).map(file => String(file));
  } catch (error) {
    return [];
  }
}

/**
 * 计算两个字符串的相似度
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * 计算编辑距离
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * 创建分析提示，包含脚本长度限制提醒
 */
export function createAnalysisPrompt(
  userRequest: string, 
  dataFiles: string[], 
  additionalContext: string, 
  workflowId: string
): string {
  const safeUserRequest = userRequest || '未指定分析需求';
  const safeDataFiles = Array.isArray(dataFiles) ? dataFiles : [];
  const safeAdditionalContext = additionalContext || '无';
  const safeWorkflowId = workflowId || 'unknown';
  
  // 分析数据文件类型
  const dataTypes = analyzeDataTypes(safeDataFiles);
  
  return `# 生物信息学工作流分析

## 用户请求:
${safeUserRequest}

## 数据文件:
${safeDataFiles.length > 0 ? safeDataFiles.map((file, idx) => `${idx + 1}. ${file}`).join('\n') : '无数据文件'}

## 检测到的数据类型:
${dataTypes}

## 附加信息:
${safeAdditionalContext}

## 工作流ID:
${safeWorkflowId}

---

**🧬 生物信息学分析指南**

### 支持的数据类型和分析：

**1. 单细胞RNA测序 (scRNA-seq)**
- 文件格式: .h5ad, .h5, .csv, .txt
- 分析内容: 质量控制、标准化、降维(PCA/UMAP/tSNE)、聚类、差异表达、轨迹分析
- 工具: scanpy, anndata, leiden, louvain, scipy

**2. 基因表达数据 (RNA-seq)**
- 文件格式: .csv, .txt, .tsv, .xlsx
- 分析内容: 差异表达分析、火山图、热图、GO/KEGG富集分析
- 工具: pandas, numpy, matplotlib, seaborn, scipy, statsmodels

**3. 基因组学数据**
- 文件格式: .vcf, .bam, .sam, .fasta, .fastq, .bed
- 分析内容: 变异分析、注释、功能富集、序列分析
- 工具: pysam, biopython, pandas, numpy

**4. 蛋白质组学数据**
- 文件格式: .csv, .txt, .xlsx
- 分析内容: 蛋白质鉴定、定量分析、功能注释
- 工具: pandas, numpy, matplotlib, seaborn

**5. 多组学整合分析**
- 文件格式: 多种格式组合
- 分析内容: 数据融合、关联分析、网络分析
- 工具: pandas, numpy, scipy, networkx, matplotlib

**6. 数据探索和可视化**
- 文件格式: 通用格式
- 分析内容: 数据概览、统计摘要、相关性分析、可视化
- 工具: pandas, numpy, matplotlib, seaborn, plotly

### 💡 代码质量建议
- 优先保证代码的**完整性和逻辑清晰**，而非严格限制行数
- 每个脚本应该完成一个**明确的分析目标**
- 建议适当拆分复杂分析为多个逻辑步骤
- 注重代码的**可读性、注释完整性和错误处理**
- 生信分析通常需要完整的数据处理流程，请确保分析的连贯性

**Claude LLM，请基于以上信息：**

1. **分析用户意图** - 理解用户想要进行什么类型的生物信息学分析
2. **设计分析流程** - 创建详细的分析步骤，确保逻辑完整
3. **生成高质量脚本** - 生成功能完整、注释清晰的Python脚本
4. **重视可视化** - 生信分析应包含适当的图表和可视化结果
5. **考虑数据类型** - 根据文件类型选择合适的工具和参数
6. **错误处理** - 包含适当的错误处理和用户友好的提示信息

请提供：
- 详细的分析计划
- 功能完整的Python脚本（优先保证质量和完整性）
- 预期的输出文件和可视化结果
- 可能遇到的问题和解决方案

如果分析复杂，可以适当拆分为多个逻辑步骤，我会依次执行每个脚本。`;
}

/**
 * 分析数据文件类型
 */
function analyzeDataTypes(files: string[]): string {
  if (files.length === 0) return '无数据文件';
  
  const dataTypes = files.map(file => {
    const ext = file.toLowerCase().split('.').pop();
    const fileName = file.toLowerCase();
    
    if (fileName.includes('single') || fileName.includes('sc') || ext === 'h5ad') {
      return '单细胞RNA测序数据';
    } else if (ext === 'vcf') {
      return '基因组变异数据';
    } else if (ext === 'fasta' || ext === 'fastq') {
      return '序列数据';
    } else if (ext === 'bam' || ext === 'sam') {
      return '比对数据';
    } else if (ext === 'bed') {
      return '基因组注释数据';
    } else if (ext === 'csv' || ext === 'txt' || ext === 'tsv' || ext === 'xlsx') {
      if (fileName.includes('expression') || fileName.includes('gene') || fileName.includes('rna')) {
        return '基因表达数据';
      } else if (fileName.includes('protein') || fileName.includes('peptide')) {
        return '蛋白质组学数据';
      } else {
        return '表格数据';
      }
    } else {
      return '未知数据类型';
    }
  });
  
  return dataTypes.join(', ');
}
import * as fs from 'fs';
import * as path from 'path';

/**
 * 生成唯一的工作流ID
 */
export function generateId(): string {
  return `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取Windows Shell配置
 */
export function getShellConfig() {
  return {
    shell: 'cmd.exe'
  };
}

/**
 * 构建Windows CD命令
 */
export function buildCdCommand(directory: string): string {
  return `cd /d "${directory}"`;
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
  
  return `# 生物信息学工作流分析

## 用户请求:
${safeUserRequest}

## 数据文件:
${safeDataFiles.length > 0 ? safeDataFiles.map((file, idx) => `${idx + 1}. ${file}`).join('\n') : '无数据文件'}

## 附加信息:
${safeAdditionalContext}

## 工作流ID:
${safeWorkflowId}

---

**💡 代码质量建议**
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

请提供：
- 详细的分析计划
- 功能完整的Python脚本（优先保证质量和完整性）
- 预期的输出文件和可视化结果
- 可能遇到的问题和解决方案

如果分析复杂，可以适当拆分为多个逻辑步骤，我会依次执行每个脚本。`;
}
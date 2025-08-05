import * as fs from 'fs';
import * as path from 'path';
import { WorkflowInfo } from '../types.js';
import { generateId, createAnalysisPrompt } from '../utils/common.js';

/**
 * 处理分析生物信息学任务的请求
 */
export async function handleAnalyzeTask(args: any, projectPath: string) {
  // 安全地处理参数，确保默认值
  const safeArgs = args || {};
  const user_request = safeArgs.user_request || '';
  const data_files = Array.isArray(safeArgs.data_files) ? safeArgs.data_files : [];
  const additional_context = safeArgs.additional_context || '';
  const workflowId = generateId();
  
  try {
    // 验证必需参数
    if (!user_request || user_request.trim() === '') {
      throw new Error('user_request is required and cannot be empty');
    }
    
    console.error(`Analyzing bioinformatics task: ${user_request}`);
    console.error(`Data files: ${data_files.length} files`);
    console.error(`Additional context: ${additional_context}`);
    
    // 创建工作流目录
    const workflowDir = path.join(projectPath, workflowId);
    fs.mkdirSync(workflowDir, { recursive: true });
    
    // 生成详细的分析计划和脚本
    console.error(`Creating analysis prompt...`);
    const analysisPrompt = createAnalysisPrompt(user_request, data_files, additional_context, workflowId);
    console.error(`Analysis prompt created successfully`);
    
    // 保存分析请求信息
    console.error(`Creating workflow info object...`);
    const workflowInfo: WorkflowInfo = {
      id: workflowId,
      user_request,
      data_files,
      additional_context,
      created_at: new Date().toISOString(),
      status: 'planned',
      workflow_dir: workflowDir
    };
    
    console.error(`Saving workflow info to JSON...`);
    try {
      fs.writeFileSync(
        path.join(workflowDir, 'workflow_info.json'),
        JSON.stringify(workflowInfo, null, 2)
      );
      console.error(`Workflow info saved successfully`);
    } catch (jsonError) {
      console.error(`JSON stringify error:`, jsonError);
      throw jsonError;
    }

    return {
      content: [
        {
          type: 'text',
          text: `# 生物信息学工作流分析完成

## 工作流ID: ${workflowId}

## 用户请求分析:
${user_request}

## 数据文件:
${data_files.length > 0 ? data_files.map((file: string, idx: number) => `${idx + 1}. ${file}`).join('\n') : '无数据文件'}

## 分析计划:
基于您的请求，我已经创建了一个完整的生物信息学工作流。

**下一步操作:**
1. 请让Claude生成具体的Python分析脚本（每个脚本≤100行）
2. 使用 \`execute_claude_script\` 工具自动执行生成的脚本
3. 如果遇到问题，使用 \`debug_workflow\` 工具进行调试

## 工作流目录:
${workflowDir}

## Claude LLM 分析提示:
${analysisPrompt}

**请告诉我您希望如何处理这个工作流 - 是立即执行还是需要先查看具体的分析步骤？**`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Task analysis error: ${errorMessage}`);
    throw new Error(`Failed to analyze task: ${errorMessage}`);
  }
}
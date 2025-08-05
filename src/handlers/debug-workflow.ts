import * as fs from 'fs';
import * as path from 'path';
import { WorkflowInfo } from '../types.js';
import { listWorkflowFiles } from '../utils/common.js';

/**
 * 处理调试工作流的请求
 */
export async function handleDebugWorkflow(args: any, projectPath: string) {
  const safeArgs = args || {};
  const workflow_id = safeArgs.workflow_id || '';
  const error_context = safeArgs.error_context || '';
  
  if (!workflow_id || workflow_id.trim() === '') {
    throw new Error('workflow_id is required and cannot be empty');
  }
  
  try {
    const workflowDir = path.join(projectPath, workflow_id);
    const workflowInfoPath = path.join(workflowDir, 'workflow_info.json');
    const executionResultPath = path.join(workflowDir, 'claude_script_results.json');
    
    if (!fs.existsSync(workflowInfoPath)) {
      throw new Error(`Workflow ${workflow_id} not found`);
    }
    
    const workflowInfo: WorkflowInfo = JSON.parse(fs.readFileSync(workflowInfoPath, 'utf8'));
    let executionResult = null;
    
    if (fs.existsSync(executionResultPath)) {
      executionResult = JSON.parse(fs.readFileSync(executionResultPath, 'utf8'));
    }
    
    // 收集所有相关文件信息
    const debugInfo = {
      workflow_info: workflowInfo,
      execution_result: executionResult,
      error_context,
      workflow_files: listWorkflowFiles(workflowDir)
    };
    
    return {
      content: [
        {
          type: 'text',
          text: `# 工作流调试报告

## 工作流ID: ${workflow_id}

## 原始请求:
${workflowInfo.user_request}

## 执行状态:
${executionResult ? executionResult.status : 'Not executed yet'}

## 错误分析:
${analyzeErrors(executionResult, error_context)}

## 建议解决方案:
${generateSuggestions(workflowInfo, executionResult)}

## 工作流文件:
${debugInfo.workflow_files.map(file => `- ${file}`).join('\n')}

## 详细调试信息:
\`\`\`json
${JSON.stringify(debugInfo, null, 2)}
\`\`\`

**请根据以上分析信息告诉Claude LLM具体的问题，我可以帮助生成修复方案或重新设计工作流。**`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Workflow debug error: ${errorMessage}`);
    throw new Error(`Failed to debug workflow: ${errorMessage}`);
  }
}

/**
 * 分析错误信息
 */
function analyzeErrors(executionResult: any, errorContext: string): string {
  if (!executionResult) {
    return "工作流尚未执行";
  }

  if (executionResult.status === 'success') {
    return "工作流执行成功，无错误";
  }

  let analysis = "检测到以下问题:\n";
  
  if (executionResult.stderr) {
    analysis += `\n**标准错误输出:**\n${executionResult.stderr}\n`;
  }

  if (errorContext) {
    analysis += `\n**用户提供的错误信息:**\n${errorContext}\n`;
  }

  return analysis;
}

/**
 * 生成解决建议
 */
function generateSuggestions(workflowInfo: any, executionResult: any): string {
  let suggestions = "建议的解决方案:\n\n";

  suggestions += "1. **检查工具安装** - 确保所需的生物信息学工具已正确安装\n";
  suggestions += "2. **验证数据文件** - 确认输入文件存在且格式正确\n";
  suggestions += "3. **检查文件路径** - 确保所有文件路径都是正确的\n";
  suggestions += "4. **查看日志文件** - 检查工作流目录中的日志文件获取更多信息\n";

  if (executionResult && executionResult.stderr) {
    suggestions += "5. **分析错误信息** - 将错误信息提供给Claude LLM进行详细分析\n";
  }

  suggestions += "\n**下一步行动:**\n";
  suggestions += "- 将详细错误信息告诉Claude LLM\n";
  suggestions += "- 请求生成修复后的工作流\n";
  suggestions += "- 考虑简化分析流程或使用替代工具\n";

  return suggestions;
}
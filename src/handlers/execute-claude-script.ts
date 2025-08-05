import * as fs from 'fs';
import * as path from 'path';
import { FullExecutionResult } from '../types.js';
import { generateId } from '../utils/common.js';
import { detectPythonCommand } from '../python/detector.js';
import { extractPythonScripts } from '../python/extractor.js';
import { installPythonPackages } from '../python/package-manager.js';
import { executePythonScripts } from '../python/executor.js';
import { generateHtmlReport, openHtmlReport } from '../report/html-generator.js';

/**
 * 处理执行Claude脚本的请求
 */
export async function handleExecuteClaudeScript(args: any, projectPath: string) {
  const safeArgs = args || {};
  const claude_response = safeArgs.claude_response || '';
  const workflow_id = safeArgs.workflow_id || generateId();
  const execution_context = safeArgs.execution_context || '';
  
  if (!claude_response || claude_response.trim() === '') {
    throw new Error('claude_response is required and cannot be empty');
  }
  
  try {
    console.error(`Analyzing Claude response for Python scripts...`);
    console.error(`Response length: ${claude_response.length} characters`);
    
    // 检测和提取Python脚本
    const pythonScripts = extractPythonScripts(claude_response);
    
    if (pythonScripts.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `# Claude脚本执行结果

## 检测结果: 未发现Python脚本

在Claude的响应中没有检测到可执行的Python代码块。

**提示**: 确保Python代码被包含在 \`\`\`python 代码块中。`,
          },
        ],
      };
    }

    // 记录脚本信息
    const totalLines = pythonScripts.reduce((sum, script) => sum + (script.lineCount || 0), 0);
    let scriptInfo = '';
    if (pythonScripts.length > 0) {
      scriptInfo = `\n📊 **脚本统计**: 共 ${pythonScripts.length} 个脚本，总计 ${totalLines} 行代码。注重代码质量和分析完整性。\n`;
    }

    // 创建执行目录
    const executionDir = path.join(projectPath, workflow_id);
    fs.mkdirSync(executionDir, { recursive: true });
    
    // 调试：保存原始响应到文件
    fs.writeFileSync(
      path.join(executionDir, 'debug_claude_response.txt'),
      claude_response,
      'utf8'
    );
    
    const executionResults = [];
    let pythonCommand: string;
    
    try {
      // 检测可用的Python命令
      pythonCommand = await detectPythonCommand();
      console.error(`Python检测成功: ${pythonCommand}`);
    } catch (pythonError: any) {
      // Python未安装，返回安装指导
      return {
        content: [
          {
            type: 'text',
            text: `# ❌ Python环境检测失败

${pythonError.message}

**请按照上述指导安装Python后重新运行脚本。**

## 检测到的脚本信息:
- 发现 **${pythonScripts.length}** 个Python脚本
- 需要的包: ${Array.from(new Set(pythonScripts.flatMap(s => s.dependencies))).join(', ') || '无特殊依赖'}
${scriptInfo}
安装Python后，这些脚本将自动执行！`,
          },
        ],
      };
    }
    
    // 收集所有脚本的依赖包
    const allDependencies = Array.from(new Set(pythonScripts.flatMap(script => script.dependencies)));
    
    // 安装依赖包
    const packageInstallResult = await installPythonPackages(pythonCommand, allDependencies, executionDir);
    
    // 执行所有脚本
    const scriptExecutionResults = await executePythonScripts(pythonScripts, pythonCommand, executionDir);
    
    // 保存执行结果
    const fullResult: FullExecutionResult = {
      workflow_id,
      execution_context,
      claude_response: claude_response.substring(0, 1000) + '...', // 截断长响应
      scripts_found: pythonScripts.length,
      dependencies_detected: allDependencies,
      package_installation: packageInstallResult,
      execution_results: scriptExecutionResults,
      executed_at: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(executionDir, 'claude_script_results.json'),
      JSON.stringify(fullResult, null, 2)
    );
    
    // 生成报告
    const successCount = scriptExecutionResults.filter(r => r.status === 'success').length;
    const errorCount = scriptExecutionResults.filter(r => r.status === 'error').length;
    
    console.error(`执行结果统计: 成功=${successCount}, 失败=${errorCount}, 总计=${scriptExecutionResults.length}`);
    
    // 只在所有脚本都执行成功时生成和打开HTML报告
    let htmlReportInfo = '';
    if (errorCount === 0 && successCount > 0) {
      try {
        console.error('开始生成HTML报告...');
        const reportPath = generateHtmlReport(fullResult, pythonScripts, executionDir);
        console.error(`HTML报告已生成: ${reportPath}`);
        
        // 检查文件是否确实存在
        if (fs.existsSync(reportPath)) {
          console.error('HTML报告文件确认存在，准备打开浏览器...');
          
          // 异步打开浏览器，不等待结果
          openHtmlReport(reportPath).catch(error => {
            console.error('Failed to open HTML report:', error);
          });
          
          htmlReportInfo = `## 📊 HTML详细报告:
**已自动生成并打开HTML格式的详细执行报告！**
- 报告路径: \`${reportPath}\`
- 包含完整的执行日志、代码高亮和交互式界面
- 如未自动打开，请手动打开上述文件

`;
        } else {
          console.error('HTML报告文件生成失败，文件不存在');
          htmlReportInfo = `## ⚠️ HTML报告生成失败:
报告文件未能成功创建

`;
        }
      } catch (reportError) {
        console.error('Failed to generate HTML report:', reportError);
        htmlReportInfo = `## ⚠️ HTML报告生成失败:
无法生成HTML报告: ${reportError instanceof Error ? reportError.message : '未知错误'}

`;
      }
    } else if (errorCount > 0) {
      console.error(`由于有${errorCount}个脚本执行失败，跳过HTML报告生成`);
      htmlReportInfo = `## 📋 执行报告:
由于有脚本执行失败，未生成HTML报告。请修复错误后重新执行。

`;
    } else {
      console.error('没有成功执行的脚本，跳过HTML报告生成');
      htmlReportInfo = `## 📋 执行报告:
没有成功执行的脚本，未生成HTML报告。

`;
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `# Claude Python脚本执行报告

## 工作流ID: ${workflow_id}

## 执行概况:
- 检测到 **${pythonScripts.length}** 个Python脚本
- 成功执行: **${successCount}** 个
- 执行失败: **${errorCount}** 个
${scriptInfo}
## Python环境:
- Python命令: \`${pythonCommand}\`
- 检测到的依赖包: ${allDependencies.length > 0 ? allDependencies.join(', ') : '无特殊依赖'}

## 包安装结果:
${packageInstallResult.logs.map(log => `- ${log}`).join('\n')}

## 执行上下文:
${execution_context}

${htmlReportInfo}## 详细结果:

${scriptExecutionResults.map((result, idx) => `
### 脚本 ${result.script_number}: ${result.script_name}
**状态**: ${result.status === 'success' ? '✅ 成功' : '❌ 失败'}
**描述**: ${result.description}
**依赖包**: ${result.dependencies.length > 0 ? result.dependencies.join(', ') : '无特殊依赖'}
${pythonScripts[idx]?.lineCount ? `**代码行数**: ${pythonScripts[idx].lineCount} 行` : ''}

**标准输出**:
\`\`\`
${result.stdout || '(无输出)'}
\`\`\`

**错误输出**:
\`\`\`
${result.stderr || '(无错误)'}
\`\`\`
`).join('\n')}

## 执行目录:
${executionDir}

${errorCount > 0 ? 
`## ⚠️ 发现错误
有 ${errorCount} 个脚本执行失败，请检查错误信息并考虑：
1. 检查Python环境和依赖包安装状态
2. 验证输入数据和文件路径
3. 检查脚本逻辑和语法
4. 使用 \`debug_workflow\` 工具进行详细分析

${!packageInstallResult.success ? '⚠️ 部分Python包安装失败，这可能是导致脚本执行失败的原因。' : ''}` :
`## 🎉 执行成功
所有脚本都成功执行！你可以查看执行目录中的结果文件或打开HTML报告查看详细信息。`}

**下次如果Claude生成新的脚本，我会自动检测依赖并安装，然后执行它们！请注重代码质量和分析的完整性。**`,
        },
      ],
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Claude script execution error: ${errorMessage}`);
    throw new Error(`Failed to execute Claude scripts: ${errorMessage}`);
  }
}
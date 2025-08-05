import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PythonScript, ExecutionResult } from '../types.js';
import { buildCdCommand, getShellConfig } from '../utils/common.js';

const execAsync = promisify(exec);

/**
 * 执行Python脚本
 */
export async function executePythonScripts(
  scripts: PythonScript[],
  pythonCommand: string,
  executionDir: string
): Promise<ExecutionResult[]> {
  const executionResults: ExecutionResult[] = [];
  
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const scriptName = `claude_script_${i + 1}.py`;
    const scriptPath = path.join(executionDir, scriptName);
    
    // 保存脚本文件 (使用UTF-8编码)
    fs.writeFileSync(scriptPath, script.code, 'utf8');
    
    console.error(`Executing Python script ${i + 1}/${scripts.length}`);
    
    // 记录脚本信息
    if (script.lineCount) {
      console.error(`📝 Script ${scriptName} has ${script.lineCount} lines`);
    }
    
    try {
      // 执行Python脚本 (Windows)
      const pythonCmd = `${buildCdCommand(executionDir)} && ${pythonCommand} "${scriptName}"`;
      
      console.error(`Executing command: ${pythonCmd}`);
      
      const { stdout, stderr } = await execAsync(pythonCmd, {
        timeout: 300000, // 5分钟超时
        encoding: 'utf8',
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
        ...getShellConfig()
      });
      
      executionResults.push({
        script_number: i + 1,
        script_name: scriptName,
        description: script.description,
        dependencies: script.dependencies,
        status: 'success',
        stdout,
        stderr,
        execution_time: new Date().toISOString()
      });
      
    } catch (execError: any) {
      executionResults.push({
        script_number: i + 1,
        script_name: scriptName,
        description: script.description,
        dependencies: script.dependencies,
        status: 'error',
        stdout: execError.stdout || '',
        stderr: execError.stderr || execError.message,
        execution_time: new Date().toISOString()
      });
    }
  }
  
  return executionResults;
}
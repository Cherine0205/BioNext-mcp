import { exec } from 'child_process';
import { promisify } from 'util';
import { PackageInstallResult } from '../types.js';
import { buildCdCommand, getShellConfig } from '../utils/common.js';

const execAsync = promisify(exec);

/**
 * 安装Python包
 */
export async function installPythonPackages(
  pythonCommand: string, 
  packages: string[], 
  executionDir: string
): Promise<PackageInstallResult> {
  const logs: string[] = [];
  let allSuccess = true;
  
  if (packages.length === 0) {
    logs.push('📦 无需安装额外的Python包');
    return { success: true, logs };
  }
  
  logs.push(`📦 开始安装Python包: ${packages.join(', ')}`);
  
  for (const pkg of packages) {
    try {
      logs.push(`🔄 正在安装 ${pkg}...`);
      
      const installCmd = `${buildCdCommand(executionDir)} && ${pythonCommand} -m pip install ${pkg} --quiet --no-warn-script-location`;
      
      const { stdout, stderr } = await execAsync(installCmd, {
        timeout: 120000, // 2分钟超时
        encoding: 'utf8',
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
        ...getShellConfig()
      });
      
      if (stderr && !stderr.includes('WARNING') && !stderr.includes('already satisfied')) {
        logs.push(`⚠️ ${pkg} 安装时有警告: ${stderr.trim()}`);
      } else {
        logs.push(`✅ ${pkg} 安装成功`);
      }
      
    } catch (error: any) {
      const errorMsg = error.stderr || error.message || '未知错误';
      logs.push(`❌ ${pkg} 安装失败: ${errorMsg}`);
      
      // 尝试升级pip并重试
      if (errorMsg.includes('pip') || errorMsg.includes('setuptools')) {
        try {
          logs.push(`🔄 尝试升级pip并重新安装 ${pkg}...`);
          const upgradeCmd = `${buildCdCommand(executionDir)} && ${pythonCommand} -m pip install --upgrade pip setuptools wheel`;
          
          await execAsync(upgradeCmd, { 
            timeout: 60000, 
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
            ...getShellConfig() 
          });
          
          const retryCmd = `${buildCdCommand(executionDir)} && ${pythonCommand} -m pip install ${pkg} --quiet`;
          
          await execAsync(retryCmd, { 
            timeout: 120000, 
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
            ...getShellConfig() 
          });
          logs.push(`✅ ${pkg} 重试安装成功`);
          // 重试成功，不设置allSuccess = false
          
        } catch (retryError) {
          logs.push(`❌ ${pkg} 重试安装仍然失败`);
          allSuccess = false;
        }
      } else {
        allSuccess = false;
      }
    }
  }
  
  return { success: allSuccess, logs };
}
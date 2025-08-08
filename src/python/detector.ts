import { exec } from 'child_process';
import { promisify } from 'util';
import { getShellConfig } from '../utils/common.js';

const execAsync = promisify(exec);

/**
 * 检测可用的Python命令
 */
export async function detectPythonCommand(): Promise<string> {
  const pythonCommands = ['python', 'python3', 'py'];
  
  for (const cmd of pythonCommands) {
    try {
      const { stdout } = await execAsync(`${cmd} --version`, {
        timeout: 5000,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
        ...getShellConfig()
      });
      if (stdout) {
        console.error(`Found Python: ${cmd} - ${stdout.trim()}`);
        return cmd;
      }
    } catch (error) {
      console.error(`${cmd} not available: ${error instanceof Error ? error.message : error}`);
    }
  }
  
  // 尝试常见的Python安装路径（包括macOS miniforge）
  const fullPaths = [
    // Windows路径
    'C:\\Python39\\python.exe',
    'C:\\Python38\\python.exe',
    'C:\\Python310\\python.exe',
    'C:\\Python311\\python.exe',
    'C:\\Python312\\python.exe',
    'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Python\\Python39\\python.exe',
    'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Python\\Python310\\python.exe',
    'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Python\\Python311\\python.exe',
    'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Python\\Python312\\python.exe',
    // macOS miniforge路径
    '/Users/zhuzhu/miniforge3/bin/python',
    '/opt/homebrew/bin/python3',
    '/usr/local/bin/python3',
    '/usr/bin/python3'
  ];
  
  for (const fullPath of fullPaths) {
    try {
      const { stdout } = await execAsync(`"${fullPath}" --version`, {
        timeout: 5000,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
        ...getShellConfig()
      });
      if (stdout) {
        console.error(`Found Python at full path: ${fullPath} - ${stdout.trim()}`);
        return `"${fullPath}"`;
      }
    } catch (error) {
      // 继续尝试下一个路径
    }
  }
  
  // 生成详细的Python安装指导
  const installationGuide = generatePythonInstallationGuide();
  throw new Error(`未找到Python解释器！\n\n${installationGuide}`);
}

/**
 * 生成Python安装指导
 */
function generatePythonInstallationGuide(): string {
  return `🐍 Python安装指导

请按照以下步骤安装Python：

## 方法1: 从官网下载（推荐）
1. 访问 https://www.python.org/downloads/
2. 下载最新版本的Python (建议Python 3.9或更高版本)
3. 运行安装程序时，**务必勾选 "Add Python to PATH"**
4. 选择 "Install Now" 进行默认安装

## 方法2: 使用Microsoft Store（Windows 10/11）
1. 打开Microsoft Store
2. 搜索 "Python"
3. 安装 "Python 3.11" 或更新版本

## 方法3: 使用包管理器
- **Chocolatey**: choco install python
- **Scoop**: scoop install python
- **winget**: winget install Python.Python.3

## 安装完成后验证：
打开命令提示符(cmd)或PowerShell，输入以下命令：
\`\`\`
python --version
\`\`\`
或
\`\`\`
py --version
\`\`\`

如果显示Python版本信息，说明安装成功！

## 常见问题：
- 如果提示"python不是内部或外部命令"，请重启命令提示符或重新安装时勾选"Add to PATH"
- 推荐安装Python 3.9+版本以获得最佳兼容性

安装完成后，请重新运行您的生物信息学分析任务。`;
}
"""
BioNext MCP Server - Intelligent Bioinformatics Analysis Assistant

This module provides a Model Context Protocol (MCP) server implementation for
automated bioinformatics analysis workflows. It enables researchers to perform
complex biological data analysis through natural language conversations with
AI assistants, without requiring programming expertise.

The server implements three core MCP tools:
1. analyze_bioinformatics_task: Task planning and workflow creation
2. debug_workflow: Workflow debugging and error diagnosis
3. execute_claude_script: Automated script execution and reporting

Author: BioNext Team
Version: 2.2.1
License: MIT
"""

from fastmcp import FastMCP
import os
import json
import uuid
from datetime import datetime
from pathlib import Path
import subprocess
import sys
import webbrowser
from typing import List, Dict, Any, Optional
import logging

# Configure logging for debugging and monitoring
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize MCP server instance
mcp = FastMCP("BioNext-MCP&Agent挑战赛")

# Global configuration constants
PROJECT_PATH = os.environ.get('PROJECT_PATH', './analysis')
DEFAULT_TIMEOUT = 600  # 10 minutes for script execution
PACKAGE_INSTALL_TIMEOUT = 300  # 5 minutes for package installation

# Ensure analysis directory exists
Path(PROJECT_PATH).mkdir(exist_ok=True)

def generate_id() -> str:
    """生成唯一的工作流ID"""
    return str(uuid.uuid4())

def create_analysis_prompt(user_request: str, data_files: List[str], additional_context: str, workflow_id: str) -> str:
    """创建生物信息学分析提示"""
    prompt = f"""
# 生物信息学分析工作流 {workflow_id}

## 用户请求
{user_request}

## 数据文件
{chr(10).join([f"- {file}" for file in data_files]) if data_files else "无数据文件"}

## 额外上下文
{additional_context if additional_context else "无额外要求"}

## 分析要求
请生成完整的Python分析脚本，包括：
1. 数据加载和预处理
2. 质量控制和标准化
3. 核心分析步骤
4. 可视化图表生成
5. 结果保存和报告

每个脚本不超过100行，确保代码可执行性和分析完整性。
"""
    return prompt.strip()

@mcp.tool()
def analyze_bioinformatics_task(user_request: str, data_files: List[str], additional_context: str = "") -> str:

    try:
        # 验证必需参数
        if not user_request or not user_request.strip():
            raise ValueError('user_request是必需的，不能为空')
        
        if not data_files:
            data_files = []
        
        workflow_id = generate_id()
        workflow_dir = Path(PROJECT_PATH) / workflow_id
        workflow_dir.mkdir(parents=True, exist_ok=True)
        
        # 生成分析提示
        analysis_prompt = create_analysis_prompt(user_request, data_files, additional_context, workflow_id)
        
        # 保存工作流信息
        workflow_info = {
            "id": workflow_id,
            "user_request": user_request,
            "data_files": data_files,
            "additional_context": additional_context,
            "created_at": datetime.now().isoformat(),
            "status": "planned",
            "workflow_dir": str(workflow_dir)
        }
        
        with open(workflow_dir / "workflow_info.json", "w", encoding="utf-8") as f:
            json.dump(workflow_info, f, ensure_ascii=False, indent=2)
        
        # 保存分析提示
        with open(workflow_dir / "analysis_prompt.txt", "w", encoding="utf-8") as f:
            f.write(analysis_prompt)
        
        return f"""# 生物信息学工作流分析完成

## 工作流ID: {workflow_id}

## 用户请求分析:
{user_request}

## 数据文件:
{chr(10).join([f"{idx + 1}. {file}" for idx, file in enumerate(data_files)]) if data_files else '无数据文件'}

## 分析计划:
基于您的请求，我已经创建了一个完整的生物信息学工作流。

**下一步操作:**
1. 请让Claude生成具体的Python分析脚本（每个脚本≤100行）
2. 使用 `execute_claude_script` 工具自动执行生成的脚本
3. 如果遇到问题，使用 `debug_workflow` 工具进行调试

## 工作流目录:
{workflow_dir}

## Claude LLM 分析提示:
{analysis_prompt}

**请告诉我您希望如何处理这个工作流 - 是立即执行还是需要先查看具体的分析步骤？**"""
    
    except Exception as e:
        return f"❌ 任务分析失败: {str(e)}"

@mcp.tool()
def debug_workflow(workflow_id: str, error_context: str = "") -> str:
    """
    🔧 工作流调试工具 - 分析工作流执行结果并提供调试建议
    
    Args:
        workflow_id: 要调试的工作流ID
        error_context: 关于错误或问题的额外上下文
    """
    try:
        workflow_dir = Path(PROJECT_PATH) / workflow_id
        
        if not workflow_dir.exists():
            return f"❌ 工作流 {workflow_id} 不存在"
        
        # 检查工作流状态
        workflow_info_file = workflow_dir / "workflow_info.json"
        if workflow_info_file.exists():
            with open(workflow_info_file, "r", encoding="utf-8") as f:
                workflow_info = json.load(f)
        else:
            workflow_info = {"status": "unknown"}
        
        # 检查执行日志
        log_files = list(workflow_dir.glob("*.log"))
        error_files = list(workflow_dir.glob("*error*.txt"))
        
        debug_info = f"""# 🔧 工作流调试报告

## 工作流ID: {workflow_id}
## 当前状态: {workflow_info.get('status', 'unknown')}
## 创建时间: {workflow_info.get('created_at', 'unknown')}

## 文件检查:
- 工作流目录: {'✅ 存在' if workflow_dir.exists() else '❌ 不存在'}
- 工作流信息: {'✅ 存在' if workflow_info_file.exists() else '❌ 不存在'}
- 日志文件: {len(log_files)} 个
- 错误文件: {len(error_files)} 个

## 错误上下文:
{error_context if error_context else '无额外错误信息'}

## 调试建议:
1. 检查Python环境是否正确安装
2. 确认所需数据文件路径是否正确
3. 查看执行日志了解具体错误
4. 验证Python包依赖是否完整

## 可用文件:
{chr(10).join([f"- {f.name}" for f in workflow_dir.iterdir()]) if workflow_dir.exists() else '无文件'}"""
        
        return debug_info
    
    except Exception as e:
        return f"❌ 调试失败: {str(e)}"

def detect_python_command() -> str:
    """检测可用的Python命令"""
    python_commands = ['python3', 'python', 'py']
    
    for cmd in python_commands:
        try:
            result = subprocess.run([cmd, '--version'], capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                return cmd
        except (subprocess.TimeoutExpired, FileNotFoundError):
            continue
    
    raise RuntimeError("未检测到可用的Python环境。请安装Python 3.8+并确保在PATH中。")

def extract_python_scripts(claude_response: str) -> List[Dict[str, Any]]:
    """从Claude响应中提取Python脚本"""
    scripts = []
    lines = claude_response.split('\n')
    in_code_block = False
    current_script = []
    script_start = 0
    
    for i, line in enumerate(lines):
        if '```python' in line:
            in_code_block = True
            current_script = []
            script_start = i + 1
        elif '```' in line and in_code_block:
            in_code_block = False
            if current_script:
                script_content = '\n'.join(current_script)
                scripts.append({
                    'content': script_content,
                    'lineCount': len(current_script),
                    'startLine': script_start,
                    'dependencies': extract_dependencies(script_content)
                })
                current_script = []
        elif in_code_block:
            current_script.append(line)
    
    return scripts

def extract_dependencies(script_content: str) -> List[str]:
    """提取脚本中的依赖包"""
    import re
    patterns = [
        r'import\s+(\w+)',
        r'from\s+(\w+)',
        r'pip\s+install\s+(\w+)',
        r'conda\s+install\s+(\w+)'
    ]
    
    dependencies = set()
    for pattern in patterns:
        matches = re.findall(pattern, script_content)
        dependencies.update(matches)
    
    # 过滤掉标准库
    stdlib_modules = {'os', 'sys', 'json', 'datetime', 'pathlib', 'subprocess', 'webbrowser', 'uuid', 'typing'}
    return [dep for dep in dependencies if dep not in stdlib_modules]

def install_python_packages(python_cmd: str, packages: List[str], execution_dir: Path) -> Dict[str, Any]:
    """安装Python包"""
    if not packages:
        return {"success": True, "message": "无需安装额外包"}
    
    results = []
    for package in packages:
        try:
            result = subprocess.run(
                [python_cmd, "-m", "pip", "install", package],
                capture_output=True,
                text=True,
                cwd=execution_dir,
                timeout=300
            )
            results.append({
                "package": package,
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr
            })
        except Exception as e:
            results.append({
                "package": package,
                "success": False,
                "error": str(e)
            })
    
    return {
        "success": all(r["success"] for r in results),
        "results": results
    }

def execute_python_script(python_cmd: str, script_content: str, execution_dir: Path, script_name: str) -> Dict[str, Any]:
    """执行单个Python脚本"""
    script_file = execution_dir / f"{script_name}.py"
    
    # 保存脚本到文件
    with open(script_file, "w", encoding="utf-8") as f:
        f.write(script_content)
    
    try:
        # 执行脚本
        result = subprocess.run(
            [python_cmd, str(script_file)],
            capture_output=True,
            text=True,
            cwd=execution_dir,
            timeout=600  # 10分钟超时
        )
        
        return {
            "script_name": script_name,
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "return_code": result.returncode,
            "file_path": str(script_file)
        }
    
    except subprocess.TimeoutExpired:
        return {
            "script_name": script_name,
            "success": False,
            "error": "执行超时（超过10分钟）",
            "file_path": str(script_file)
        }
    except Exception as e:
        return {
            "script_name": script_name,
            "success": False,
            "error": str(e),
            "file_path": str(script_file)
        }

def generate_html_execution_report(
    workflow_id: str, 
    execution_results: List[Dict[str, Any]], 
    execution_dir: Path
) -> str:
    """
    Generate comprehensive HTML execution report.
    
    This function creates a professional HTML report documenting the execution
    results of all analysis scripts, including statistics, detailed outputs,
    and error information.
    
    Args:
        workflow_id: Unique identifier for the workflow
        execution_results: List of script execution results
        execution_dir: Directory containing execution artifacts
        
    Returns:
        str: Path to the generated HTML report file
        
    Note:
        Report includes responsive design and comprehensive execution metrics.
    """
    # Calculate execution statistics
    total_scripts = len(execution_results)
    successful_executions = sum(1 for r in execution_results if r.get('success'))
    failed_executions = total_scripts - successful_executions
    success_rate = (successful_executions / total_scripts * 100) if total_scripts > 0 else 0
    
    # Generate HTML content with modern styling
    html_content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BioNext MCP 执行报告 - {workflow_id}</title>
    <style>
        :root {{
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --success-color: #28a745;
            --error-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --light-bg: #f8f9fa;
            --border-color: #dee2e6;
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }}
        
        .header {{
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }}
        
        .header p {{
            font-size: 1.1em;
            opacity: 0.9;
        }}
        
        .timestamp {{
            color: rgba(255,255,255,0.8);
            font-size: 0.9em;
            margin-top: 10px;
        }}
        
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }}
        
        .stat-card {{
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }}
        
        .stat-card:hover {{
            transform: translateY(-5px);
        }}
        
        .stat-card h3 {{
            color: var(--primary-color);
            margin-bottom: 15px;
            font-size: 1.2em;
        }}
        
        .stat-card .number {{
            font-size: 2.5em;
            font-weight: bold;
            color: var(--secondary-color);
        }}
        
        .execution-results {{
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        .script-result {{
            margin: 25px 0;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid var(--info-color);
            background: var(--light-bg);
            transition: all 0.3s ease;
        }}
        
        .script-result:hover {{
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }}
        
        .script-result.success {{
            border-left-color: var(--success-color);
            background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
        }}
        
        .script-result.error {{
            border-left-color: var(--error-color);
            background: linear-gradient(135deg, #fff8f8 0%, #ffe8e8 100%);
        }}
        
        .script-result h3 {{
            margin-bottom: 15px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        
        .status-icon {{
            font-size: 1.2em;
        }}
        
        .code-block {{
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            margin: 15px 0;
            overflow-x: auto;
            border: 1px solid #4a5568;
        }}
        
        .file-path {{
            background: var(--light-bg);
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            color: var(--primary-color);
            margin: 10px 0;
        }}
        
        .summary-section {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            text-align: center;
        }}
        
        .summary-section h2 {{
            margin-bottom: 15px;
            font-size: 1.8em;
        }}
        
        .success-rate {{
            font-size: 2em;
            font-weight: bold;
            margin: 15px 0;
        }}
        
        @media (max-width: 768px) {{
            .container {{
                padding: 15px;
            }}
            
            .header {{
                padding: 20px;
            }}
            
            .header h1 {{
                font-size: 2em;
            }}
            
            .stats-grid {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧬 BioNext MCP 执行报告</h1>
            <p>工作流ID: {workflow_id}</p>
            <p class="timestamp">生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
        
        <div class="summary-section">
            <h2>📊 执行概览</h2>
            <div class="success-rate">{success_rate:.1f}%</div>
            <p>总体执行成功率</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>总脚本数</h3>
                <div class="number">{total_scripts}</div>
            </div>
            <div class="stat-card">
                <h3>成功执行</h3>
                <div class="number" style="color: var(--success-color);">{successful_executions}</div>
            </div>
            <div class="stat-card">
                <h3>执行失败</h3>
                <div class="number" style="color: var(--error-color);">{failed_executions}</div>
            </div>
            <div class="stat-card">
                <h3>成功率</h3>
                <div class="number" style="color: var(--info-color);">{success_rate:.1f}%</div>
            </div>
        </div>
        
        <div class="execution-results">
            <h2>📋 执行结果详情</h2>
"""
    
    # Generate detailed results for each script
    for i, result in enumerate(execution_results):
        status_class = "success" if result.get('success') else "error"
        status_icon = "✅" if result.get('success') else "❌"
        status_text = "执行成功" if result.get('success') else "执行失败"
        
        html_content += f"""
            <div class="script-result {status_class}">
                <h3>
                    <span class="status-icon">{status_icon}</span>
                    脚本 {i+1}: {result.get('script_name', 'unknown')}
                </h3>
                <p><strong>状态:</strong> {status_text}</p>
                <div class="file-path">
                    <strong>文件路径:</strong> {result.get('file_path', 'unknown')}
                </div>
        """
        
        if result.get('stdout'):
            html_content += f"""
                <h4>📤 标准输出:</h4>
                <div class="code-block">{result.get('stdout')}</div>
            """
        
        if result.get('stderr'):
            html_content += f"""
                <h4>⚠️ 错误输出:</h4>
                <div class="code-block">{result.get('stderr')}</div>
            """
        
        if result.get('error'):
            html_content += f"""
                <h4>🚨 执行错误:</h4>
                <div class="code-block">{result.get('error')}</div>
            """
        
        html_content += "</div>"
    
    # Complete HTML document
    html_content += """
        </div>
        
        <div class="summary-section">
            <h2>🎯 下一步建议</h2>
            <p>根据执行结果，您可以：</p>
            <ul style="text-align: left; display: inline-block; margin-top: 15px;">
                <li>查看成功执行的脚本输出结果</li>
                <li>分析失败脚本的错误信息</li>
                <li>使用 debug_workflow 工具进行问题诊断</li>
                <li>根据输出结果进行后续分析</li>
            </ul>
        </div>
    </div>
</body>
</html>"""
    
    # Save HTML report
    report_file = execution_dir / "execution_report.html"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    # logger.info(f"HTML execution report generated: {report_file}") # This line was removed as per the new_code, as logger is not defined.
    return str(report_file)

@mcp.tool()
def execute_claude_script(claude_response: str, workflow_id: str = "", execution_context: str = "") -> str:
    """
    🚀 生物信息学脚本执行器 - 自动检测并执行Claude生成的Python脚本。
    功能包括：✅ 自动检测Python环境 ✅ 自动安装所需包（pandas, numpy, scanpy等） ✅ 完整的执行日志和错误处理 ✅ HTML报告生成和自动浏览器打开
    
    Args:
        claude_response: 包含Python脚本的Claude响应内容
        workflow_id: 可选的工作流ID，用于关联此执行
        execution_context: 脚本执行上下文说明
    """
    try:
        if not claude_response or not claude_response.strip():
            return "❌ claude_response是必需的，不能为空"
        
        if not workflow_id:
            workflow_id = generate_id()
        
        # 提取Python脚本
        python_scripts = extract_python_scripts(claude_response)
        
        if not python_scripts:
            return """# Claude脚本执行结果

## 检测结果: 未发现Python脚本

在Claude的响应中没有检测到可执行的Python代码块。

**提示**: 确保Python代码被包含在 ```python 代码块中。"""
        
        # 创建执行目录
        execution_dir = Path(PROJECT_PATH) / workflow_id
        execution_dir.mkdir(parents=True, exist_ok=True)
        
        # 保存原始响应
        with open(execution_dir / "claude_response.txt", "w", encoding="utf-8") as f:
            f.write(claude_response)
        
        # 检测Python环境
        try:
            python_cmd = detect_python_command()
        except RuntimeError as e:
            return f"""# ❌ Python环境检测失败

{str(e)}

**请按照上述指导安装Python后重新运行脚本。**

## 检测到的脚本信息:
- 发现 **{len(python_scripts)}** 个Python脚本
- 需要的包: {', '.join(set().union(*[s.get('dependencies', []) for s in python_scripts])) or '无特殊依赖'}
安装Python后，这些脚本将自动执行！"""
        
        # 收集所有依赖
        all_dependencies = list(set().union(*[s.get('dependencies', []) for s in python_scripts]))
        
        # 安装依赖
        package_result = install_python_packages(python_cmd, all_dependencies, execution_dir)
        
        # 执行脚本
        execution_results = []
        for i, script in enumerate(python_scripts):
            script_name = f"script_{i+1}"
            result = execute_python_script(python_cmd, script['content'], execution_dir, script_name)
            execution_results.append(result)
            
            # 保存脚本执行结果
            with open(execution_dir / f"{script_name}_result.json", "w", encoding="utf-8") as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
        
        # 生成HTML报告
        report_file = generate_html_execution_report(workflow_id, execution_results, execution_dir)
        
        # 统计结果
        success_count = sum(1 for r in execution_results if r.get('success'))
        total_count = len(execution_results)
        
        result_summary = f"""# 🚀 Claude脚本执行完成

## 执行统计
- **总脚本数**: {total_count}
- **成功执行**: {success_count}
- **执行失败**: {total_count - success_count}
- **成功率**: {(success_count/total_count*100):.1f}%

## 工作流ID
{workflow_id}

## 执行上下文
{execution_context if execution_context else '无特殊上下文'}

## 详细结果
"""
        
        for i, result in enumerate(execution_results):
            status = "✅ 成功" if result.get('success') else "❌ 失败"
            result_summary += f"\n### 脚本 {i+1}: {result.get('script_name', 'unknown')} - {status}"
            if result.get('stdout'):
                result_summary += f"\n**输出**: {result.get('stdout')[:200]}{'...' if len(result.get('stdout', '')) > 200 else ''}"
            if result.get('error'):
                result_summary += f"\n**错误**: {result.get('error')}"
        
        result_summary += f"""

## 📊 HTML报告
执行报告已生成: {report_file}

## 🎯 下一步
1. 查看HTML报告了解详细执行结果
2. 如有错误，使用 `debug_workflow` 工具进行调试
3. 根据输出结果进行后续分析"""
        
        # 尝试打开HTML报告
        try:
            webbrowser.open(f"file://{report_file}")
        except:
            pass
        
        return result_summary
    
    except Exception as e:
        return f"❌ 脚本执行失败: {str(e)}"

# 个性化资源
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """生成个性化问候语"""
    return f"您好, {name}! 欢迎使用BioNext MCP&Agent挑战赛生物信息学分析工具，当前支持{len(mcp.tools)}个核心工具"

def main():
    """MCP服务器主入口函数"""
    try:
        # 设置环境变量
        os.environ.setdefault('PROJECT_PATH', './analysis')
        
        # 确保分析目录存在
        Path(PROJECT_PATH).mkdir(exist_ok=True)
        
        # 启动MCP服务器
        mcp.run(transport="stdio")
    except Exception as e:
        print(f"Error starting MCP server: {e}", file=sys.stderr)
        print(f"Current working directory: {os.getcwd()}", file=sys.stderr)
        print(f"Python path: {sys.path}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

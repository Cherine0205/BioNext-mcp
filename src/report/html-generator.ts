import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { FullExecutionResult, PythonScript } from '../types.js';
import { getShellConfig } from '../utils/common.js';

const execAsync = promisify(exec);

/**
 * 生成HTML执行报告
 */
export function generateHtmlReport(
  result: FullExecutionResult,
  scripts: PythonScript[],
  executionDir: string
): string {
  const reportPath = path.join(executionDir, 'execution_report.html');
  
  console.error(`生成HTML报告: ${reportPath}`);
  console.error(`执行目录: ${executionDir}`);
  
  // 检测生成的图像文件
  const imageFiles = detectImageFiles(executionDir);
  console.error(`检测到图像文件: ${imageFiles.length} 个`);
  if (imageFiles.length > 0) {
    console.error(`图像文件列表: ${imageFiles.join(', ')}`);
  }
  
  const html = createHtmlContent(result, scripts, imageFiles, executionDir);
  
  try {
    fs.writeFileSync(reportPath, html, 'utf8');
    console.error(`HTML报告文件写入成功，大小: ${html.length} 字符`);
  } catch (writeError) {
    console.error(`HTML报告写入失败: ${writeError instanceof Error ? writeError.message : writeError}`);
    throw writeError;
  }
  
  return reportPath;
}

/**
 * 检测执行目录中的图像文件
 */
function detectImageFiles(executionDir: string): string[] {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.pdf'];
  const imageFiles: string[] = [];
  
  try {
    const files = fs.readdirSync(executionDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        imageFiles.push(file);
      }
    }
  } catch (error) {
    console.error('Error detecting image files:', error);
  }
  
  return imageFiles;
}

/**
 * 自动在浏览器中打开HTML报告
 */
export async function openHtmlReport(reportPath: string): Promise<void> {
  try {
    // Windows下使用start命令打开默认浏览器
    // 使用cmd /c 确保命令正确执行
    const command = `cmd /c start "" "${reportPath}"`;
    console.error(`尝试打开HTML报告: ${command}`);
    
    await execAsync(command, {
      timeout: 10000,
      encoding: 'utf8',
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });
    console.error(`HTML报告已在浏览器中打开: ${reportPath}`);
  } catch (error) {
    console.error(`无法自动打开浏览器: ${error instanceof Error ? error.message : error}`);
    console.error(`请手动打开报告文件: ${reportPath}`);
    
    // 尝试备用方法
    try {
      console.error('尝试备用打开方法...');
      await execAsync(`explorer "${reportPath}"`, {
        timeout: 5000,
        encoding: 'utf8'
      });
      console.error('使用资源管理器打开文件');
    } catch (explorerError) {
      console.error(`备用方法也失败: ${explorerError instanceof Error ? explorerError.message : explorerError}`);
    }
  }
}

/**
 * 创建HTML内容
 */
function createHtmlContent(result: FullExecutionResult, scripts: PythonScript[], imageFiles: string[], executionDir: string): string {
  const successCount = result.execution_results.filter(r => r.status === 'success').length;
  const errorCount = result.execution_results.filter(r => r.status === 'error').length;
  const totalScripts = result.execution_results.length;
  
  // 计算脚本统计信息
  const totalLines = scripts.reduce((sum, s) => sum + (s.lineCount || 0), 0);
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生物信息学脚本执行报告 - ${result.workflow_id}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .summary {
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .info { color: #17a2b8; }
        .warning { color: #ffc107; }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        
        .script-card {
            background: #f8f9fa;
            border-left: 5px solid #3498db;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 0 10px 10px 0;
            transition: all 0.3s ease;
        }
        
        .script-card:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .script-card.success {
            border-left-color: #28a745;
        }
        
        .script-card.error {
            border-left-color: #dc3545;
        }
        
        .script-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .script-title {
            font-size: 1.3em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .status-badge {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-success {
            background: #d4edda;
            color: #155724;
        }
        
        .status-error {
            background: #f8d7da;
            color: #721c24;
        }
        
        .script-info {
            margin-bottom: 15px;
        }
        
        .info-item {
            margin-bottom: 5px;
            color: #666;
        }
        
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            overflow-x: auto;
            margin: 10px 0;
        }
        
        .dependencies {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }
        
        .dependency-tag {
            background: #e3f2fd;
            color: #1976d2;
            padding: 3px 8px;
            border-radius: 15px;
            font-size: 0.8em;
        }
        
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .alert-warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        
        .alert-info {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
        
        .footer {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .collapsible {
            cursor: pointer;
            user-select: none;
        }
        
        .collapsible:after {
            content: ' ▼';
            font-size: 0.8em;
        }
        
        .collapsible.collapsed:after {
            content: ' ▶';
        }
        
        .collapsible-content {
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .collapsible-content.collapsed {
            max-height: 0;
        }
        
        .visualization-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .visualization-item {
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .visualization-item h4 {
            margin-bottom: 10px;
            color: #2c3e50;
            font-size: 1.1em;
        }
        
        .visualization-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .visualization-image:hover {
            transform: scale(1.05);
        }
        
        .pdf-placeholder {
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 20px;
            color: #6c757d;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
        }
        
        .modal-content {
            margin: auto;
            display: block;
            width: 90%;
            max-width: 1200px;
            max-height: 90%;
            object-fit: contain;
        }
        
        .close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover,
        .close:focus {
            color: #bbb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧬 生物信息学脚本执行报告</h1>
            <div class="subtitle">工作流ID: ${result.workflow_id}</div>
            <div class="subtitle">执行时间: ${new Date(result.executed_at).toLocaleString('zh-CN')}</div>
        </div>
        
        <div class="summary">
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number info">${totalScripts}</div>
                    <div class="stat-label">总脚本数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number success">${successCount}</div>
                    <div class="stat-label">成功执行</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number error">${errorCount}</div>
                    <div class="stat-label">执行失败</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number warning">${result.dependencies_detected.length}</div>
                    <div class="stat-label">依赖包数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number info">${totalLines}</div>
                    <div class="stat-label">总代码行数</div>
                </div>
            </div>
            

            
            <div class="alert alert-info">
                <strong>📊 执行概况:</strong> 
                ${errorCount === 0 ? 
                  '🎉 所有脚本都成功执行！' : 
                  `${successCount}/${totalScripts} 个脚本成功执行，${errorCount} 个脚本执行失败。`
                }
            </div>
        </div>
        
        <div class="content">
            ${result.execution_context ? `
            <div class="section">
                <h2>📝 执行上下文</h2>
                <p>${result.execution_context}</p>
            </div>
            ` : ''}
            
            <div class="section">
                <h2>📦 依赖包安装</h2>
                ${result.package_installation.logs.map(log => `<div class="info-item">${log}</div>`).join('')}
            </div>
            
            ${imageFiles.length > 0 ? `
            <div class="section">
                <h2>📊 生成的可视化结果</h2>
                <div class="visualization-gallery">
                    ${imageFiles.map(imageFile => `
                        <div class="visualization-item">
                            <h4>${imageFile}</h4>
                            ${path.extname(imageFile).toLowerCase() === '.pdf' ? 
                                `<div class="pdf-placeholder">
                                    <p>📄 PDF文件: ${imageFile}</p>
                                    <p>请在执行目录中查看此PDF文件</p>
                                </div>` :
                                `<img src="${imageFile}" alt="${imageFile}" class="visualization-image" onclick="openImageModal(this)">`
                            }
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="section">
                <h2>🐍 脚本执行详情</h2>
                ${result.execution_results.map((execResult, index) => {
                  const script = scripts[index];
                  const isSuccess = execResult.status === 'success';
                  
                  return `
                  <div class="script-card ${isSuccess ? 'success' : 'error'}">
                      <div class="script-header">
                          <div class="script-title">${execResult.script_name}</div>
                          <div class="status-badge ${isSuccess ? 'status-success' : 'status-error'}">
                              ${isSuccess ? '✅ 成功' : '❌ 失败'}
                          </div>
                      </div>
                      
                      <div class="script-info">
                          <div class="info-item"><strong>描述:</strong> ${execResult.description}</div>
                          <div class="info-item"><strong>执行时间:</strong> ${new Date(execResult.execution_time).toLocaleString('zh-CN')}</div>
                          ${script?.lineCount ? `<div class="info-item"><strong>代码行数:</strong> ${script.lineCount} 行</div>` : ''}
                          ${execResult.dependencies.length > 0 ? `
                          <div class="info-item">
                              <strong>依赖包:</strong>
                              <div class="dependencies">
                                  ${execResult.dependencies.map(dep => `<span class="dependency-tag">${dep}</span>`).join('')}
                              </div>
                          </div>
                          ` : ''}
                      </div>
                      
                      ${execResult.stdout ? `
                      <div>
                          <h4 class="collapsible" onclick="toggleCollapse(this)">标准输出</h4>
                          <div class="collapsible-content">
                              <div class="code-block">${escapeHtml(execResult.stdout)}</div>
                          </div>
                      </div>
                      ` : ''}
                      
                      ${execResult.stderr ? `
                      <div>
                          <h4 class="collapsible" onclick="toggleCollapse(this)">错误输出</h4>
                          <div class="collapsible-content">
                              <div class="code-block">${escapeHtml(execResult.stderr)}</div>
                          </div>
                      </div>
                      ` : ''}
                  </div>
                  `;
                }).join('')}
            </div>
        </div>
        
        <div class="footer">
            <p>🧬 BioNext-MCP 生物信息学分析助手</p>
            <p>报告生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>
    </div>
    
    <!-- 图片模态框 -->
    <div id="imageModal" class="modal">
        <span class="close" onclick="closeImageModal()">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>
    
    <script>
        function toggleCollapse(element) {
            const content = element.nextElementSibling;
            const isCollapsed = content.classList.contains('collapsed');
            
            if (isCollapsed) {
                content.classList.remove('collapsed');
                element.classList.remove('collapsed');
            } else {
                content.classList.add('collapsed');
                element.classList.add('collapsed');
            }
        }
        
        // 图片模态框功能
        function openImageModal(img) {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            modal.style.display = 'block';
            modalImg.src = img.src;
        }
        
        function closeImageModal() {
            const modal = document.getElementById('imageModal');
            modal.style.display = 'none';
        }
        
        // 点击模态框外部关闭
        window.onclick = function(event) {
            const modal = document.getElementById('imageModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
        
        // 默认折叠长输出
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlocks = document.querySelectorAll('.code-block');
            codeBlocks.forEach(block => {
                if (block.textContent.length > 1000) {
                    const header = block.previousElementSibling;
                    if (header && header.classList.contains('collapsible')) {
                        toggleCollapse(header);
                    }
                }
            });
        });
    </script>
</body>
</html>`;
}

/**
 * HTML转义
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
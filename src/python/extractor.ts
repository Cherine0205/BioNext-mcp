import { PythonScript } from '../types.js';
import { calculateSimilarity } from '../utils/common.js';

/**
 * 从Claude响应中提取Python脚本
 */
export function extractPythonScripts(text: string): PythonScript[] {
  const scripts: PythonScript[] = [];
  
  // 匹配 ```python 代码块
  const pythonCodeBlockRegex = /```python\n([\s\S]*?)```/g;
  let match;
  
  while ((match = pythonCodeBlockRegex.exec(text)) !== null) {
    const code = match[1].trim();
    
    // 跳过空代码块或过短的代码块
    if (code.length < 10) continue;
    
    // 检查是否是生物信息学相关的代码
    if (isBioinformaticsScript(code)) {
      // 计算代码行数
      const lineCount = code.split('\n').length;
      
      // 尝试提取代码前的描述
      const beforeCode = text.substring(0, match.index);
      const description = extractScriptDescription(beforeCode);
      
      // 提取依赖包
      const dependencies = extractDependencies(code);
      
      scripts.push({
        code,
        description: description || '自动检测的Python脚本',
        dependencies,
        lineCount
      });
    }
  }
  
  // 也尝试匹配没有语言标识的代码块，但包含生物信息学关键词
  const genericCodeBlockRegex = /```\n([\s\S]*?)```/g;
  while ((match = genericCodeBlockRegex.exec(text)) !== null) {
    const code = match[1].trim();
    
    if (code.length < 10) continue;
    
    // 检查是否看起来像Python代码且与生物信息学相关
    if (looksLikePython(code) && isBioinformaticsScript(code)) {
      const beforeCode = text.substring(0, match.index);
      const description = extractScriptDescription(beforeCode);
      
      // 避免重复添加已经通过python标签提取的代码
      const alreadyExists = scripts.some(script => 
        calculateSimilarity(script.code, code) > 0.8
      );
      
      if (!alreadyExists) {
        const lineCount = code.split('\n').length;
        const dependencies = extractDependencies(code);
        scripts.push({
          code,
          description: description || '检测到的Python脚本',
          dependencies,
          lineCount
        });
      }
    }
  }
  
  return scripts;
}

/**
 * 检查代码是否与生物信息学相关
 */
function isBioinformaticsScript(code: string): boolean {
  const bioKeywords = [
    // 生物信息学库
    'biopython', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'scipy',
    'sklearn', 'Bio', 'pysam', 'HTSeq', 'pybedtools', 'plotly', 'bokeh',
    
    // 可视化相关
    'plt.', 'pyplot', 'figure', 'subplot', 'plot', 'scatter', 'histogram',
    'heatmap', 'boxplot', 'violinplot', 'barplot', 'lineplot', 'scatterplot',
    'clustermap', 'pairplot', 'distplot', 'jointplot', 'regplot',
    'savefig', 'show()', 'imshow', 'contour', 'pie', 'bar(',
    
    // 生物信息学术语
    'fastq', 'fasta', 'vcf', 'bam', 'sam', 'bed', 'gtf', 'gff',
    'sequence', 'genome', 'gene', 'protein', 'DNA', 'RNA',
    'alignment', 'blast', 'annotation', 'expression',
    'variant', 'mutation', 'phylogeny', 'assembly',
    
    // 常见生物信息学操作
    'SeqIO', 'read_csv', 'read_table', 'clustering', 'pca', 'differential',
    'correlation', 'pathway', 'enrichment', 'ontology',
    
    // 单细胞分析
    'scanpy', 'anndata', 'adata', 'obs', 'var', 'obsm', 'varm',
    'umap', 'tsne', 'leiden', 'louvain', 'highly_variable',
    
    // 文件扩展名
    '.fastq', '.fasta', '.vcf', '.bam', '.sam', '.bed',
    '.gtf', '.gff', '.csv', '.tsv', '.txt', '.h5ad', '.h5',
    '.png', '.pdf', '.svg', '.jpg', '.jpeg'
  ];
  
  const codeUpper = code.toUpperCase();
  return bioKeywords.some(keyword => 
    codeUpper.includes(keyword.toUpperCase())
  );
}

/**
 * 检查代码是否看起来像Python
 */
function looksLikePython(code: string): boolean {
  const pythonIndicators = [
    'import ', 'from ', 'def ', 'class ', 'if __name__',
    'print(', '.py', 'pandas', 'numpy', '#!/usr/bin/env python'
  ];
  
  return pythonIndicators.some(indicator => 
    code.includes(indicator)
  );
}

/**
 * 提取脚本描述
 */
function extractScriptDescription(beforeCode: string): string {
  // 提取代码块前最近的一段文字作为描述
  const lines = beforeCode.split('\n').reverse();
  const descriptionLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    
    // 跳过markdown标记
    if (trimmed.startsWith('#') || trimmed.startsWith('*') || 
        trimmed.startsWith('-') || trimmed.startsWith('>')) {
      descriptionLines.unshift(trimmed);
      continue;
    }
    
    // 如果是普通文本，添加并停止
    if (trimmed.length > 10 && trimmed.length < 200) {
      descriptionLines.unshift(trimmed);
      break;
    }
  }
  
  return descriptionLines.join(' ').substring(0, 150);
}

/**
 * 提取Python代码的依赖包
 */
function extractDependencies(code: string): string[] {
  const dependencies = new Set<string>();
  
  // 匹配 import 语句
  const importRegex = /^(?:from\s+(\S+)|import\s+(\S+))/gm;
  let match;
  
  while ((match = importRegex.exec(code)) !== null) {
    const packageName = match[1] || match[2];
    if (packageName) {
      // 提取主包名（去掉子模块）
      const mainPackage = packageName.split('.')[0];
      
      // 映射常见的包名到pip包名（只映射不同名的包）
      const packageMapping: { [key: string]: string } = {
        'Bio': 'biopython',
        'cv2': 'opencv-python',
        'sklearn': 'scikit-learn',
        'PIL': 'Pillow',
        'skimage': 'scikit-image'
      };
      
      const pipPackage = packageMapping[mainPackage] || mainPackage;
      
      // 只添加非标准库的包
      if (!isStandardLibrary(mainPackage)) {
        dependencies.add(pipPackage);
      }
    }
  }
  
  return Array.from(dependencies);
}

/**
 * 检查是否为Python标准库
 */
function isStandardLibrary(packageName: string): boolean {
  const standardLibraries = [
    'os', 'sys', 'json', 'csv', 'sqlite3', 'datetime', 'time', 'random',
    'math', 'statistics', 'collections', 'itertools', 'functools', 'operator',
    'pathlib', 'glob', 'shutil', 'tempfile', 'zipfile', 'tarfile',
    'urllib', 'http', 'email', 'html', 'xml', 'pickle', 'copy',
    'threading', 'multiprocessing', 'subprocess', 'argparse', 'logging',
    'unittest', 're', 'string', 'textwrap', 'unicodedata', 'struct',
    'codecs', 'io', 'base64', 'binascii', 'hashlib', 'hmac', 'secrets'
  ];
  
  return standardLibraries.includes(packageName);
}
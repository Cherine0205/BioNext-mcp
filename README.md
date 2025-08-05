# BioNext-MCP: Intelligent Bioinformatics Analysis Assistant

> The simplest way to perform bioinformatics analysis through Claude Desktop - just chat in natural language, no programming required!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Windows](https://img.shields.io/badge/Windows-10%2F11-0078D4?logo=windows&logoColor=white)](https://www.microsoft.com/windows/)

[中文版](README_CN.md) | **English**

## 🎯 What is this?

BioNext-MCP allows you to perform complex bioinformatics analysis through natural language conversations with Claude Desktop, without writing any code!

**Simply put:**
- 🗣️ Tell Claude what data you want to analyze in plain English
- 🤖 Claude automatically generates professional Python analysis scripts
- ⚡ System automatically executes scripts and displays results
- 📊 Get beautiful HTML reports and visualization charts

## ✨ Key Features

### 🧬 Supported Analysis Types
- **Single-cell RNA sequencing** (scRNA-seq) - Cell clustering, differential expression, trajectory analysis
- **Genomics** - Variant analysis, annotation, functional enrichment
- **Transcriptomics** - Differential expression, pathway analysis, co-expression networks
- **Proteomics** - Protein identification, quantitative analysis
- **Multi-omics integration** - Data fusion, correlation analysis

### 🎨 Smart Features
- **Automatic environment setup** - Detects Python, auto-installs required packages (pandas, numpy, matplotlib, etc.)
- **UTF-8 encoding support** - Perfect support for international characters
- **Visualization-first** - Automatically generates charts and displays them in HTML reports
- **Quality assurance** - Focuses on code completeness and analysis accuracy
- **Error handling** - Smart diagnosis of issues with solution suggestions

## 🚀 Quick Start

### Step 1: Install Python Environment

#### Recommended: Official Website Installation
1. Visit [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Download Python 3.9 or higher
3. **Make sure to check "Add Python to PATH" during installation**

#### Verify Installation
Open command prompt and type:
```bash
python --version
```
If you see version information, installation was successful!

### Step 2: Install BioNext-MCP

1. **Download Project**
```bash
git clone https://github.com/your-username/BioNext-mcp.git
cd BioNext-mcp
```

2. **Install Dependencies**
```bash
npm install
npm run build
```

### Step 3: Configure Claude Desktop

1. **Find Configuration File**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add Configuration**
```json
{
  "mcpServers": {
    "bioinformatics-workflow": {
      "command": "node",
      "args": ["D:\\path\\to\\BioNext-mcp\\dist\\index.js"],
      "cwd": "D:\\path\\to\\BioNext-mcp",
      "env": {
        "PROJECT_PATH": "D:\\path\\to\\your\\analysis\\directory"
      }
    }
  }
}
```

**Important:** 
- Replace paths with your actual installation paths
- Set analysis directory to where you want results saved

3. **Restart Claude Desktop**

## 💡 How to Use

### Basic Conversation Flow

1. **Describe Your Analysis Needs**
```
I have a single-cell RNA sequencing data file data.h5ad, and I want to perform cell clustering analysis and differential expression analysis
```

2. **Claude will generate analysis scripts and execute them automatically**
3. **Get detailed HTML reports** including:
   - Execution results and statistics
   - Generated charts and visualizations
   - Complete analysis logs

### Practical Examples

#### 🧪 Single-cell Analysis
```
Please help me analyze this scRNA-seq data:
- File: C:\data\pbmc3k.h5ad
- Need: quality control, normalization, clustering, marker gene identification
- Output: UMAP plot, clustering heatmap, differential expression gene list
```

#### 🧬 Gene Expression Analysis
```
I have RNA-seq expression matrices from two groups:
- Control group: control_samples.csv
- Treatment group: treatment_samples.csv
- Analysis: differential expression, GO enrichment, KEGG pathway analysis
- Visualization: volcano plot, heatmap, pathway diagrams
```

#### 📊 Data Exploration
```
Help me explore this gene expression dataset:
- File: gene_expression.csv
- Need: data overview, correlation analysis, PCA analysis
- Generate: statistical summary, correlation heatmap, PCA plot
```

## 🎨 Beautiful Reports

### HTML Report Features
- **📊 Visualization Gallery** - Automatically detects and displays generated images
- **🔍 Interactive Viewing** - Click images to zoom and view
- **📝 Detailed Logs** - Complete execution process records
- **📈 Statistical Summary** - Script execution status and performance metrics

### Automatic Browser Opening
- Reports automatically open in browser after analysis completion
- If not auto-opened, manually open the generated HTML file

## 🛠️ Common Issues

### Python-related
**Q: "Python not found" error?**
A: Ensure Python is installed and added to PATH environment variable

**Q: Package installation fails?**
A: System will automatically retry, or manually run `pip install package_name`

### Analysis-related
**Q: Script execution fails?**
A: 
- Check if data file paths are correct
- Confirm data format meets requirements
- Check error logs for detailed information

**Q: No HTML report generated?**
A: HTML reports are only generated when all scripts execute successfully, fix execution errors first

### Data Formats
**Q: What data formats are supported?**
A: 
- CSV, TSV, Excel files
- HDF5 format (.h5, .h5ad)
- FASTA, FASTQ sequence files
- VCF variant files
- Other common bioinformatics formats

## 🎯 Usage Tips

### 1. Clear Description of Needs
```
✅ Good description:
"Analyze single-cell data, perform quality control (filter low-quality cells), normalization, dimensionality reduction (PCA+UMAP), clustering (leiden algorithm), find marker genes for each cluster"

❌ Vague description:
"Analyze this data"
```

### 2. Provide Complete File Paths
```
✅ Use absolute paths:
"C:\Users\username\data\sample.h5ad"

❌ Relative paths may fail:
"./data/sample.h5ad"
```

### 3. Specify Output Requirements
```
✅ Clear output:
"Generate UMAP plot, heatmap, save results to CSV file"

❌ Unclear:
"Do some visualization"
```

### 4. Step-by-step Analysis
For complex analyses, break into multiple conversations:
1. First: Data loading and quality control
2. Second: Normalization and dimensionality reduction
3. Third: Clustering and visualization
4. Fourth: Differential analysis

## 🎉 Start Your Bioinformatics Journey

You're ready now! Open Claude Desktop, tell it what data you want to analyze, and let AI handle the complex bioinformatics analysis for you!

---

## 📞 Get Help

- **GitHub Issues**: Report problems or suggest improvements
- **Documentation**: View detailed usage documentation
- **Examples**: Reference example analysis cases

**Remember:** Describe your analysis needs in natural language, Claude will handle all the technical details for you! 🚀
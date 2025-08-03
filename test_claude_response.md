# 测试Claude响应示例

这是一个模拟的Claude响应，包含生物信息学Python脚本，用于测试自动执行功能。

## RNA-seq数据质量控制分析

我来为你创建一个Python脚本来进行RNA-seq数据的质量控制分析：

```python
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os

# 创建测试数据
print("开始RNA-seq质量控制分析...")

# 模拟一些质量控制指标
samples = ['Sample1', 'Sample2', 'Sample3', 'Sample4']
total_reads = [10000000, 9500000, 11000000, 10200000]
mapped_reads = [8500000, 8000000, 9200000, 8800000]
gc_content = [45.2, 46.1, 44.8, 45.7]

# 创建数据框
qc_data = pd.DataFrame({
    'Sample': samples,
    'Total_Reads': total_reads,
    'Mapped_Reads': mapped_reads,
    'Mapping_Rate': [m/t*100 for m, t in zip(mapped_reads, total_reads)],
    'GC_Content': gc_content
})

print("质量控制数据:")
print(qc_data)

# 保存结果
qc_data.to_csv('qc_results.csv', index=False)
print("结果已保存到 qc_results.csv")

# 创建可视化
plt.figure(figsize=(10, 6))

# 子图1：映射率
plt.subplot(1, 2, 1)
plt.bar(samples, qc_data['Mapping_Rate'])
plt.title('Mapping Rate by Sample')
plt.ylabel('Mapping Rate (%)')
plt.ylim(0, 100)

# 子图2：GC含量
plt.subplot(1, 2, 2)
plt.bar(samples, qc_data['GC_Content'])
plt.title('GC Content by Sample')
plt.ylabel('GC Content (%)')

plt.tight_layout()
plt.savefig('qc_plot.png', dpi=300, bbox_inches='tight')
print("可视化图表已保存到 qc_plot.png")

print("质量控制分析完成！")
```

## 基因表达差异分析

接下来，我们来做一个简单的差异表达分析：

```python
import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

print("开始差异表达分析...")

# 创建模拟的基因表达数据
np.random.seed(42)
n_genes = 1000
n_samples_per_group = 3

# 生成基因名
genes = [f'Gene_{i:04d}' for i in range(n_genes)]

# 生成表达数据（对数正态分布）
control_data = np.random.lognormal(mean=5, sigma=1, size=(n_genes, n_samples_per_group))
treatment_data = np.random.lognormal(mean=5, sigma=1, size=(n_genes, n_samples_per_group))

# 为一些基因添加差异表达
diff_genes_idx = np.random.choice(n_genes, size=100, replace=False)
treatment_data[diff_genes_idx] *= np.random.uniform(1.5, 3.0, size=(100, n_samples_per_group))

# 进行t检验
pvalues = []
fold_changes = []

for i in range(n_genes):
    control_mean = np.mean(control_data[i])
    treatment_mean = np.mean(treatment_data[i])
    
    # t检验
    _, pval = stats.ttest_ind(control_data[i], treatment_data[i])
    pvalues.append(pval)
    
    # 计算fold change
    fc = treatment_mean / control_mean if control_mean > 0 else 1
    fold_changes.append(fc)

# 创建结果数据框
results = pd.DataFrame({
    'Gene': genes,
    'Control_Mean': [np.mean(control_data[i]) for i in range(n_genes)],
    'Treatment_Mean': [np.mean(treatment_data[i]) for i in range(n_genes)],
    'Fold_Change': fold_changes,
    'Log2_FC': [np.log2(fc) for fc in fold_changes],
    'P_Value': pvalues
})

# 添加显著性标记
results['Significant'] = (results['P_Value'] < 0.05) & (abs(results['Log2_FC']) > 1)

print(f"总基因数: {len(results)}")
print(f"显著差异表达基因数: {results['Significant'].sum()}")

# 保存结果
results.to_csv('differential_expression_results.csv', index=False)
print("差异表达分析结果已保存到 differential_expression_results.csv")

# 创建火山图
plt.figure(figsize=(10, 8))
non_sig = results[~results['Significant']]
sig = results[results['Significant']]

plt.scatter(non_sig['Log2_FC'], -np.log10(non_sig['P_Value']), 
           c='gray', alpha=0.6, s=10, label='Non-significant')
plt.scatter(sig['Log2_FC'], -np.log10(sig['P_Value']), 
           c='red', alpha=0.8, s=10, label='Significant')

plt.xlabel('Log2 Fold Change')
plt.ylabel('-Log10 P-Value')
plt.title('Volcano Plot - Differential Gene Expression')
plt.axhline(y=-np.log10(0.05), color='black', linestyle='--', alpha=0.5)
plt.axvline(x=1, color='black', linestyle='--', alpha=0.5)
plt.axvline(x=-1, color='black', linestyle='--', alpha=0.5)
plt.legend()
plt.grid(True, alpha=0.3)

plt.savefig('volcano_plot.png', dpi=300, bbox_inches='tight')
print("火山图已保存到 volcano_plot.png")

print("差异表达分析完成！")
```

这两个脚本将帮助你完成RNA-seq数据的基础分析流程。
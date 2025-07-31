#!/usr/bin/env node

// 这是一个测试示例，展示如何使用MCP服务器的工具
// 注意：这个文件仅用于演示MCP工具的输入输出格式

const testCases = {
  // 测试用例1: 生成RNA-seq分析计划
  generate_plan_example: {
    tool: "generate_plan",
    input: {
      goal: "进行RNA-seq差异表达分析，比较处理组和对照组的基因表达差异",
      datalist: [
        "data/sample1_R1.fastq.gz: 处理组样本1的双端RNA-seq数据，第一端",
        "data/sample1_R2.fastq.gz: 处理组样本1的双端RNA-seq数据，第二端",
        "data/sample2_R1.fastq.gz: 处理组样本2的双端RNA-seq数据，第一端",
        "data/sample2_R2.fastq.gz: 处理组样本2的双端RNA-seq数据，第二端",
        "data/control1_R1.fastq.gz: 对照组样本1的双端RNA-seq数据，第一端",
        "data/control1_R2.fastq.gz: 对照组样本1的双端RNA-seq数据，第二端",
        "data/control2_R1.fastq.gz: 对照组样本2的双端RNA-seq数据，第一端",
        "data/control2_R2.fastq.gz: 对照组样本2的双端RNA-seq数据，第二端",
        "reference/hg38.fa: 人类参考基因组序列",
        "reference/gencode.v44.annotation.gtf: 基因注释文件"
      ],
      id: "rna_seq_project_001",
      project_path: "/home/user/bioinformatics"
    },
    expected_output_format: {
      plan: [
        {
          step_number: 1,
          description: "质量控制和去除接头序列...",
          input_filename: ["data/sample1_R1.fastq.gz", "data/sample1_R2.fastq.gz"],
          output_filename: ["./output/rna_seq_project_001/step_1/result/trimmed_sample1_R1.fastq.gz"],
          tools: "FastQC, Trimmomatic"
        }
        // ... 更多步骤
      ]
    }
  },

  // 测试用例2: 根据计划生成脚本
  generate_script_example: {
    tool: "generate_script",
    input: {
      plan: [
        {
          step_number: 1,
          description: "使用FastQC进行质量控制，使用Trimmomatic去除低质量碱基和接头序列",
          input_filename: [
            "data/sample1_R1.fastq.gz: 处理组样本1的双端RNA-seq数据，第一端",
            "data/sample1_R2.fastq.gz: 处理组样本1的双端RNA-seq数据，第二端"
          ],
          output_filename: [
            "./output/rna_seq_project_001/step_1/result/trimmed_sample1_R1.fastq.gz: 质量过滤后的数据",
            "./output/rna_seq_project_001/step_1/result/trimmed_sample1_R2.fastq.gz: 质量过滤后的数据"
          ],
          tools: "FastQC, Trimmomatic"
        },
        {
          step_number: 2,
          description: "使用HISAT2将质量过滤后的reads比对到参考基因组",
          input_filename: [
            "./output/rna_seq_project_001/step_1/result/trimmed_sample1_R1.fastq.gz: 质量过滤后的数据",
            "./output/rna_seq_project_001/step_1/result/trimmed_sample1_R2.fastq.gz: 质量过滤后的数据",
            "reference/hg38.fa: 人类参考基因组序列"
          ],
          output_filename: [
            "./output/rna_seq_project_001/step_2/result/sample1_aligned.bam: 比对结果文件"
          ],
          tools: "HISAT2, SAMtools"
        }
      ],
      id: "rna_seq_project_001",
      project_path: "/home/user/bioinformatics"
    },
    expected_output_format: {
      scripts: [
        {
          step_number: 1,
          script: [
            "conda install -y fastqc trimmomatic",
            "fastqc data/sample1_R1.fastq.gz",
            "fastqc data/sample1_R2.fastq.gz",
            "trimmomatic PE -phred33 data/sample1_R1.fastq.gz data/sample1_R2.fastq.gz ..."
          ],
          description: "使用FastQC进行质量控制，使用Trimmomatic去除低质量碱基和接头序列"
        },
        {
          step_number: 2,
          script: [
            "conda install -y hisat2 samtools",
            "hisat2-build reference/hg38.fa reference/hg38",
            "hisat2 -x reference/hg38 -1 ./output/rna_seq_project_001/step_1/result/trimmed_sample1_R1.fastq.gz -2 ./output/rna_seq_project_001/step_1/result/trimmed_sample1_R2.fastq.gz -S ./output/rna_seq_project_001/step_2/result/sample1_aligned.sam",
            "samtools view -bS ./output/rna_seq_project_001/step_2/result/sample1_aligned.sam > ./output/rna_seq_project_001/step_2/result/sample1_aligned.bam"
          ],
          description: "使用HISAT2将质量过滤后的reads比对到参考基因组"
        }
      ],
      total_steps: 2
    }
  }
};

console.log("=== MCP 服务器测试用例 ===");
console.log(JSON.stringify(testCases, null, 2));

console.log("\n=== 使用说明 ===");
console.log("1. 确保已经安装依赖: npm install");
console.log("2. 配置环境变量: 复制 .env.example 为 .env 并填入API密钥");
console.log("3. 构建项目: npm run build");
console.log("4. 启动服务器: npm start");
console.log("5. 在MCP客户端中使用 generate_plan 和 generate_script 工具");
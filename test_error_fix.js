// 测试修复后的MCP服务器
const testCases = [
  // 测试1: 正常参数
  {
    name: "analyze_bioinformatics_task - 正常参数",
    tool: "analyze_bioinformatics_task",
    args: {
      user_request: "进行RNA-seq数据分析",
      data_files: ["sample1.fastq", "sample2.fastq"],
      additional_context: "比较处理组和对照组"
    }
  },
  
  // 测试2: 缺少data_files
  {
    name: "analyze_bioinformatics_task - 缺少data_files",
    tool: "analyze_bioinformatics_task", 
    args: {
      user_request: "进行RNA-seq数据分析",
      additional_context: "比较处理组和对照组"
    }
  },
  
  // 测试3: data_files为null
  {
    name: "analyze_bioinformatics_task - data_files为null",
    tool: "analyze_bioinformatics_task",
    args: {
      user_request: "进行RNA-seq数据分析",
      data_files: null,
      additional_context: "比较处理组和对照组"
    }
  },
  
  // 测试4: 空参数对象
  {
    name: "analyze_bioinformatics_task - 空参数",
    tool: "analyze_bioinformatics_task",
    args: {}
  },
  
  // 测试5: args为null
  {
    name: "analyze_bioinformatics_task - args为null",
    tool: "analyze_bioinformatics_task",
    args: null
  },
  
  // 测试6: execute_claude_script正常参数
  {
    name: "execute_claude_script - 正常参数",
    tool: "execute_claude_script",
    args: {
      claude_response: "这是一个测试响应，包含Python脚本:\n```python\nprint('Hello, World!')\n```",
      execution_context: "测试脚本执行"
    }
  },
  
  // 测试7: execute_claude_script缺少claude_response
  {
    name: "execute_claude_script - 缺少claude_response",
    tool: "execute_claude_script", 
    args: {
      execution_context: "测试脚本执行"
    }
  }
];

console.log("测试用例准备完成，共", testCases.length, "个测试");
console.log("\n请在Claude Desktop中逐一测试这些参数组合：");

testCases.forEach((test, idx) => {
  console.log(`\n--- 测试 ${idx + 1}: ${test.name} ---`);
  console.log("工具:", test.tool);
  console.log("参数:", JSON.stringify(test.args, null, 2));
});

console.log("\n预期结果:");
console.log("- 测试1, 6: 应该正常执行");
console.log("- 测试2, 3: 应该正常执行（使用默认空数组）");
console.log("- 测试4, 5, 7: 应该返回明确的错误信息，而不是'Cannot convert undefined or null to object'");
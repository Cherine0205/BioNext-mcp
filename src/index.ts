#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { handleAnalyzeTask } from './handlers/analyze-task.js';
import { handleDebugWorkflow } from './handlers/debug-workflow.js';
import { handleExecuteClaudeScript } from './handlers/execute-claude-script.js';

class BioinformaticsMCPServer {
  private server: Server;
  private projectPath: string;

  constructor() {
    this.projectPath = process.env.PROJECT_PATH || './analysis';
    this.server = new Server(
      {
        name: 'bioinformatics-workflow-server',
        version: '2.2.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_bioinformatics_task',
            description: '🧬 生物信息学分析任务规划器 - 分析用户意图并创建生物信息学工作流计划。支持单细胞RNA测序、基因表达、基因组学、蛋白质组学等多种数据类型。',
            inputSchema: {
              type: 'object',
              properties: {
                user_request: {
                  type: 'string',
                  description: '用户的生物信息学分析请求（中文描述）',
                },
                data_files: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: '输入数据文件路径列表（例如：["/path/to/data.h5ad", "/path/to/expression.csv"]）',
                },
                additional_context: {
                  type: 'string',
                  description: '额外的上下文信息或特定要求',
                },
              },
              required: ['user_request', 'data_files'],
            },
          },

          {
            name: 'debug_workflow',
            description: '🔧 工作流调试工具 - 分析工作流执行结果并提供调试建议',
            inputSchema: {
              type: 'object',
              properties: {
                workflow_id: {
                  type: 'string',
                  description: '要调试的工作流ID',
                },
                error_context: {
                  type: 'string',
                  description: '关于错误或问题的额外上下文',
                },
              },
              required: ['workflow_id'],
            },
          },
          {
            name: 'execute_claude_script',
            description: '🚀 生物信息学脚本执行器 - 自动检测并执行Claude生成的Python脚本。功能包括：✅ 自动检测Python环境 ✅ 自动安装所需包（pandas, numpy, scanpy等） ✅ 完整的执行日志和错误处理 ✅ HTML报告生成和自动浏览器打开',
            inputSchema: {
              type: 'object',
              properties: {
                claude_response: {
                  type: 'string',
                  description: '包含Python脚本的Claude响应内容',
                },
                workflow_id: {
                  type: 'string',
                  description: '可选的工作流ID，用于关联此执行',
                },
                execution_context: {
                  type: 'string',
                  description: '脚本执行上下文说明',
                },
              },
              required: ['claude_response'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        console.error(`收到工具请求: ${name}`);
        console.error(`参数:`, JSON.stringify(args, null, 2));
        
        switch (name) {
          case 'analyze_bioinformatics_task':
            return await handleAnalyzeTask(args, this.projectPath);

          case 'debug_workflow':
            return await handleDebugWorkflow(args, this.projectPath);
            
          case 'execute_claude_script':
            return await handleExecuteClaudeScript(args, this.projectPath);
            
          default:
            throw new Error(`未知工具: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '发生未知错误';
        const stackTrace = error instanceof Error ? error.stack : '无堆栈跟踪';
        console.error(`工具执行错误:`, error);
        console.error(`堆栈跟踪:`, stackTrace);
        
        return {
          content: [
            {
              type: 'text',
              text: `❌ 错误: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🧬 生物信息学MCP服务器 v2.2.0 正在运行');
  }
}

// 启动服务器
const server = new BioinformaticsMCPServer();
server.run().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});
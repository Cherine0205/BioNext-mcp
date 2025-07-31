#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { OpenAIClient } from './openai-client.js';
import { loadConfig } from './config.js';
import { GeneratePlanRequest, GenerateScriptRequest, Step } from './types.js';

class BioinformaticsMCPServer {
  private server: Server;
  private openaiClient: OpenAIClient;
  private config: any;

  constructor() {
    this.config = loadConfig();
    this.server = new Server(
      {
        name: 'bioinformatics-workflow-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.openaiClient = new OpenAIClient(this.config.openai);
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_plan',
            description: 'Generate a detailed bioinformatics analysis plan based on the goal and data files',
            inputSchema: {
              type: 'object',
              properties: {
                goal: {
                  type: 'string',
                  description: 'The analysis goal or objective (e.g., "进行RNA-seq差异表达分析")',
                },
                datalist: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: 'List of input data files with descriptions',
                },
                id: {
                  type: 'string',
                  description: 'Project ID (optional, will generate random if not provided)',
                },
                project_path: {
                  type: 'string',
                  description: 'Project path (optional, will use default if not provided)',
                },
              },
              required: ['goal', 'datalist'],
            },
          },
          {
            name: 'generate_script',
            description: 'Generate executable scripts based on the analysis plan',
            inputSchema: {
              type: 'object',
              properties: {
                plan: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      step_number: { type: 'number' },
                      description: { type: 'string' },
                      input_filename: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      output_filename: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      tools: { type: 'string' },
                    },
                    required: ['step_number', 'description', 'input_filename', 'output_filename'],
                  },
                  description: 'The analysis plan steps to generate scripts for',
                },
                id: {
                  type: 'string',
                  description: 'Project ID (optional, will generate random if not provided)',
                },
                project_path: {
                  type: 'string',
                  description: 'Project path (optional, will use default if not provided)',
                },
              },
              required: ['plan'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_plan':
            return await this.handleGeneratePlan(args as GeneratePlanRequest);
          case 'generate_script':
            return await this.handleGenerateScript(args as GenerateScriptRequest);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private async handleGeneratePlan(args: GeneratePlanRequest) {
    const { goal, datalist, id = this.generateId(), project_path = this.config.projectPath } = args;

    try {
      console.error(`Generating plan for goal: ${goal}`);
      console.error(`Data files: ${datalist.length} files`);

      const planResult = await this.openaiClient.generatePlan(goal, datalist, id, project_path);
      
      console.error(`Plan generated successfully with ${planResult.plan?.length || 0} steps`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(planResult, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Plan generation error: ${errorMessage}`);
      throw new Error(`Failed to generate plan: ${errorMessage}`);
    }
  }

  private async handleGenerateScript(args: GenerateScriptRequest) {
    const { plan, id = this.generateId(), project_path = this.config.projectPath } = args;

    try {
      console.error(`Generating scripts for ${plan.length} steps`);

      const scriptResults = [];

      for (const step of plan) {
        console.error(`Generating script for step ${step.step_number}`);
        
        const scriptResult = await this.openaiClient.generateScript(step, id, project_path);
        
        scriptResults.push({
          step_number: step.step_number,
          script: scriptResult.script || [],
          description: step.description,
        });
      }

      console.error(`All scripts generated successfully`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              scripts: scriptResults,
              total_steps: plan.length,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Script generation error: ${errorMessage}`);
      throw new Error(`Failed to generate scripts: ${errorMessage}`);
    }
  }

  private generateId(): string {
    return `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Bioinformatics MCP Server running on stdio');
  }
}

// 启动服务器
const server = new BioinformaticsMCPServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
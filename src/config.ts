import dotenv from 'dotenv';
import { ServerConfig } from './types.js';

// 加载环境变量
dotenv.config();

export function loadConfig(): ServerConfig {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  return {
    openai: {
      apiKey: apiKey,
      baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    },
    projectPath: process.env.PROJECT_PATH || '/tmp/bioinformatics_projects',
  };
}
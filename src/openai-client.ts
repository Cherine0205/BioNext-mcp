import axios, { AxiosInstance } from 'axios';
import { OpenAIConfig } from './types.js';

export class OpenAIClient {
  private client: AxiosInstance;
  private model: string;

  constructor(config: OpenAIConfig) {
    this.model = config.model;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60秒超时
    });
  }

  async createCompletion(messages: any[]): Promise<string> {
    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: messages,
        temperature: 0.1,
        max_tokens: 4000,
      });

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      return content.trim();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async generatePlan(goal: string, datalist: string[], id: string, projectPath: string): Promise<any> {
    const planPrompt = `
You are a professional bioinformatician tasked with creating detailed analysis plans. Follow these rules strictly:
## ROLE AND BEHAVIOR:
- Act exclusively as a bioinformatician throughout the entire interaction
- Never break character or stop acting as a bioinformatician
- Use your expertise to create comprehensive, scientifically sound analysis workflows

## TASK REQUIREMENTS:
- Analyze the provided input to write a detailed plan that accomplishes the specified goal
- Include specific tool names and describe their usage in each step
- Do NOT execute any scripts or commands - only plan the workflow
- Focus on analysis steps, not data loading or setup procedures

## OUTPUT FORMAT:
- Respond ONLY in valid JSON format
- Your entire response must be a valid JSON object starting with { and ending with }
- Do not include any text outside the JSON structure
- Do not wrap the JSON in code blocks, markdown formatting, or quotes

Remember: Your response will be directly parsed as JSON. Output a clean JSON object without any wrapper quotes or formatting.
`;

    const input = JSON.stringify({
      id: id,
      goal: goal,
      datalist: datalist,
      project_path: projectPath,
      related_docs: ""
    });

    const messages = [
      { role: 'system', content: planPrompt },
      { role: 'user', content: input }
    ];

    const response = await this.createCompletion(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Failed to parse plan JSON response: ${error.message}\\nResponse: ${response}`);
    }
  }

  async generateScript(step: any, id: string, projectPath: string): Promise<any> {
    const scriptPrompt = `
You are a professional bioinformatician and script scripting expert tasked with generating executable script commands. Follow these rules strictly:

## ROLE AND BEHAVIOR:
- Act exclusively as a bioinformatician throughout the entire interaction
- Never break character or stop acting as a bioinformatician
- Use your expertise to create accurate, executable script commands for bioinformatics workflows

## TASK REQUIREMENTS:
- Generate script commands based on the provided task description and input files
- Output all commands to work with files in the ./output/id/ directory structure
- Process each input file independently without using FOR loops
- Use file paths exactly as specified in input and historical context
- Apply default parameter values for all unspecified options

## OUTPUT FORMAT:
- Respond ONLY in valid JSON format
- Your entire response must be a valid JSON object starting with { and ending with }
- Do not include any text outside the JSON structure
- Do not wrap the JSON in code blocks, markdown formatting, or quotes

Remember: Your response will be directly executed as script commands. Any errors in syntax or logic will cause the analysis to fail.
`;

    const input = JSON.stringify({
      task: step,
      id: id,
      project_path: projectPath,
      related_docs: ""
    });

    const messages = [
      { role: 'system', content: scriptPrompt },
      { role: 'user', content: input }
    ];

    const response = await this.createCompletion(messages);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error(`Failed to parse script JSON response: ${error.message}\\nResponse: ${response}`);
    }
  }
}
// 类型定义文件
export interface Step {
  step_number: number;
  description: string;
  input_filename: string[];
  output_filename: string[];
  tools?: string;
}

export interface GeneratePlanRequest {
  goal: string;
  datalist: string[];
  id?: string;
  project_path?: string;
}

export interface GenerateScriptRequest {
  plan: Step[];
  id?: string;
  project_path?: string;
}
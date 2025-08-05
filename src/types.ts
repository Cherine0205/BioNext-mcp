export interface WorkflowInfo {
  id: string;
  user_request: string;
  data_files: string[];
  additional_context: string;
  created_at: string;
  status: 'planned' | 'executing' | 'completed' | 'failed';
  workflow_dir: string;
}

export interface PythonScript {
  code: string;
  description: string;
  dependencies: string[];
  lineCount?: number;
}

export interface ExecutionResult {
  script_number: number;
  script_name: string;
  description: string;
  dependencies: string[];
  status: 'success' | 'error';
  stdout: string;
  stderr: string;
  execution_time: string;
}

export interface PackageInstallResult {
  success: boolean;
  logs: string[];
}

export interface FullExecutionResult {
  workflow_id: string;
  execution_context: string;
  claude_response: string;
  scripts_found: number;
  dependencies_detected: string[];
  package_installation: PackageInstallResult;
  execution_results: ExecutionResult[];
  executed_at: string;
}


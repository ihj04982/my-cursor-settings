// Cursor 설정을 로드하는 유틸리티

export type AgentModel = 'opus' | 'sonnet' | 'haiku';
export type HookType = 'beforeShellExecution' | 'afterShellExecution' | 'afterFileEdit' | 'stop';

export interface Agent {
  name: string;
  description: string;
  model: AgentModel;
  tools: string[];
  content?: string;
}

export interface Hook {
  type: HookType;
  command: string;
  script?: string;
}

export interface Rule {
  title: string;
  content: string;
}

export interface CursorConfig {
  agents: Agent[];
  hooks: Hook[];
  rules: Rule[];
}

// 기본 샘플 데이터 (실제로는 파일에서 로드)
export async function loadCursorConfig(): Promise<CursorConfig> {
  // TODO: 실제 파일에서 로드
  // 현재는 샘플 데이터 반환
  
  return {
    agents: [
      {
        name: 'planner',
        description: 'Expert planning specialist for complex features and refactoring',
        model: 'opus',
        tools: ['Read', 'Grep', 'Glob'],
      },
      {
        name: 'code-reviewer',
        description: 'Expert code review specialist for quality, security, and maintainability',
        model: 'opus',
        tools: ['Read', 'Grep', 'Glob', 'Bash'],
      },
      {
        name: 'tdd-guide',
        description: 'Test-driven development specialist',
        model: 'sonnet',
        tools: ['Read', 'Grep', 'Bash'],
      },
      {
        name: 'security-reviewer',
        description: 'Security analysis specialist',
        model: 'opus',
        tools: ['Read', 'Grep', 'Glob'],
      },
      {
        name: 'architect',
        description: 'System design specialist',
        model: 'opus',
        tools: ['Read', 'Grep', 'Glob'],
      },
      {
        name: 'build-error-resolver',
        description: 'Build error fixing specialist',
        model: 'sonnet',
        tools: ['Read', 'Grep', 'Bash'],
      },
      {
        name: 'e2e-runner',
        description: 'E2E testing specialist',
        model: 'sonnet',
        tools: ['Read', 'Grep', 'Bash'],
      },
      {
        name: 'refactor-cleaner',
        description: 'Dead code cleanup specialist',
        model: 'sonnet',
        tools: ['Read', 'Grep', 'Glob'],
      },
      {
        name: 'doc-updater',
        description: 'Documentation specialist',
        model: 'sonnet',
        tools: ['Read', 'Grep'],
      },
    ],
    hooks: [
      {
        type: 'beforeShellExecution',
        command: 'bash .cursor/hooks/before_cmd.sh',
        script: 'Git push safety check, doc file blocker',
      },
      {
        type: 'afterShellExecution',
        command: 'bash .cursor/hooks/after_cmd.sh',
        script: 'PR creation logger',
      },
      {
        type: 'afterFileEdit',
        command: 'bash .cursor/hooks/after_edit.sh',
        script: 'Prettier auto-format, TypeScript check, console.log warning',
      },
      {
        type: 'stop',
        command: 'bash .cursor/hooks/on_stop.sh',
        script: 'console.log audit',
      },
    ],
    rules: [
      {
        title: 'Hooks System',
        content: 'Hook types: beforeShellExecution, afterShellExecution, afterFileEdit, stop',
      },
      {
        title: 'Testing Requirements',
        content: 'Minimum test coverage: 80%. All test types required.',
      },
      {
        title: 'Security Guidelines',
        content: 'No hardcoded secrets, input validation, SQL injection prevention',
      },
      {
        title: 'Coding Style',
        content: 'Immutability patterns, many small files, proper error handling',
      },
    ],
  };
}

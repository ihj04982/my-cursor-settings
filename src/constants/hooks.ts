import type { HookType } from '../utils/configLoader';

export interface HookConfig {
  icon: string;
  label: string;
  colorClasses: string;
}

export const HOOK_CONFIGS: Record<HookType, HookConfig> = {
  beforeShellExecution: {
    icon: '🔴',
    label: '명령 실행 전',
    colorClasses: 'border-red-500/30 bg-red-900/10',
  },
  afterShellExecution: {
    icon: '🟢',
    label: '명령 실행 후',
    colorClasses: 'border-green-500/30 bg-green-900/10',
  },
  afterFileEdit: {
    icon: '🟡',
    label: '파일 수정 후',
    colorClasses: 'border-yellow-500/30 bg-yellow-900/10',
  },
  stop: {
    icon: '⚫',
    label: '세션 종료 시',
    colorClasses: 'border-gray-500/30 bg-gray-900/10',
  },
};

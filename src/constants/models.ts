import type { AgentModel } from '../utils/configLoader';

export const MODEL_COLORS: Record<AgentModel, string> = {
  opus: 'bg-gradient-to-r from-purple-600 to-indigo-600',
  sonnet: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  haiku: 'bg-gradient-to-r from-green-600 to-emerald-600',
};

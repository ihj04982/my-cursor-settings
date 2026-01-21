import { memo } from 'react';
import { Bot } from 'lucide-react';
import type { Agent } from '../utils/configLoader';
import SectionHeader from './SectionHeader';
import { MODEL_COLORS } from '../constants/models';

interface AgentsViewProps {
  agents: Agent[];
}

const CARD_CLASSES =
  'bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20';

function AgentsView({ agents }: AgentsViewProps) {
  return (
    <div>
      <SectionHeader title="Agents" count={agents.length} itemLabel="에이전트" postfix="가" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.name} className={CARD_CLASSES}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Bot className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full text-white ${
                      MODEL_COLORS[agent.model] || 'bg-linear-to-r from-gray-600 to-slate-600'
                    }`}
                  >
                    {agent.model}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 mb-4 text-sm line-clamp-2">{agent.description}</p>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Tools</p>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-1 text-xs bg-slate-700/50 rounded-md text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(AgentsView);

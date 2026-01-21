import { Code, FileCode } from 'lucide-react';
import type { Hook } from '../utils/configLoader';
import SectionHeader from './SectionHeader';
import { HOOK_CONFIGS } from '../constants/hooks';

interface HooksViewProps {
  hooks: Hook[];
}

const CARD_BASE_CLASSES = 'bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border hover:shadow-lg transition-all';

export default function HooksView({ hooks }: HooksViewProps) {
  return (
    <div>
      <SectionHeader title="Hooks" count={hooks.length} itemLabel="훅" />

      <div className="space-y-4">
        {hooks.map((hook) => {
          const config = HOOK_CONFIGS[hook.type];
          return (
            <div key={`${hook.type}-${hook.command}`} className={`${CARD_BASE_CLASSES} ${config.colorClasses}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{config.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{config.label}</h3>
                    <p className="text-sm text-slate-400">{hook.type}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="h-4 w-4 text-slate-400" />
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Command</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <code className="text-sm text-green-400 font-mono">{hook.command}</code>
                  </div>
                </div>

                {hook.script && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FileCode className="h-4 w-4 text-slate-400" />
                      <p className="text-xs text-slate-400 uppercase tracking-wider">기능</p>
                    </div>
                    <p className="text-slate-300 text-sm">{hook.script}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

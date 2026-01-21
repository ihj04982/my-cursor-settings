import { FileText } from 'lucide-react';
import type { Rule } from '../utils/configLoader';
import SectionHeader from './SectionHeader';

interface RulesViewProps {
  rules: Rule[];
}

const CARD_CLASSES =
  'bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20';

export default function RulesView({ rules }: RulesViewProps) {
  return (
    <div>
      <SectionHeader title="Rules" count={rules.length} itemLabel="규칙" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <div key={rule.title} className={CARD_CLASSES}>
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{rule.title}</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{rule.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

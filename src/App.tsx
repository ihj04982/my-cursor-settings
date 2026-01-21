import { useState, useEffect } from 'react';
import { Settings, Upload } from 'lucide-react';
import AgentsView from './components/AgentsView';
import HooksView from './components/HooksView';
import RulesView from './components/RulesView';
import LoadingSpinner from './components/LoadingSpinner';
import { loadCursorConfig, type CursorConfig } from './utils/configLoader';
import { NAV_ITEMS, type View } from './constants/navigation';

function App() {
  const [activeView, setActiveView] = useState<View>('agents');
  const [config, setConfig] = useState<CursorConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCursorConfig()
      .then(setConfig)
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.error('설정 로드 실패:', err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Cursor 설정 시각화
                </h1>
                <p className="text-sm text-slate-400">Agents, Hooks, Rules 관리 대시보드</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <Upload className="h-4 w-4" />
              <span>설정 불러오기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/30 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all ${
                  activeView === id
                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'agents' && <AgentsView agents={config?.agents || []} />}
        {activeView === 'hooks' && <HooksView hooks={config?.hooks || []} />}
        {activeView === 'rules' && <RulesView rules={config?.rules || []} />}
      </main>
    </div>
  );
}

export default App;

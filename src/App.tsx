import type React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { Settings, Upload } from 'lucide-react';
import AgentsView from './components/AgentsView';
import HooksView from './components/HooksView';
import RulesView from './components/RulesView';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { useCursorConfig } from './hooks/useCursorConfig';
import { NAV_ITEMS, type View } from './constants/navigation';

function App() {
  const [activeView, setActiveView] = useState<View>('agents');
  const { config, loading, error, refetch } = useCursorConfig();

  const handleViewChange = useCallback((view: View) => {
    setActiveView(view);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, viewId: View) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveView(viewId);
      return;
    }

    // 화살표 키로 탭 간 이동
    const currentIndex = NAV_ITEMS.findIndex((item) => item.id === activeView);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % NAV_ITEMS.length;
      setActiveView(NAV_ITEMS[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? NAV_ITEMS.length - 1 : currentIndex - 1;
      setActiveView(NAV_ITEMS[prevIndex].id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveView(NAV_ITEMS[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveView(NAV_ITEMS[NAV_ITEMS.length - 1].id);
    }
  }, [activeView]);

  const currentView = useMemo(() => {
    if (activeView === 'agents') {
      return <AgentsView agents={config?.agents || []} />;
    }
    if (activeView === 'hooks') {
      return <HooksView hooks={config?.hooks || []} />;
    }
    if (activeView === 'rules') {
      return <RulesView rules={config?.rules || []} />;
    }
    return null;
  }, [activeView, config]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Cursor 설정 시각화
                </h1>
                <p className="text-sm text-slate-400">Agents, Hooks, Rules 관리 대시보드</p>
              </div>
            </div>
            <button
              onClick={refetch}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              aria-label="설정 불러오기"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span>설정 불러오기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/30 backdrop-blur-sm border-b border-purple-500/20" role="tablist" aria-label="메인 네비게이션">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeView === id}
                aria-controls={`panel-${id}`}
                id={`tab-${id}`}
                tabIndex={activeView === id ? 0 : -1}
                onClick={() => handleViewChange(id)}
                onKeyDown={(e) => handleKeyDown(e, id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  activeView === id
                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        id={`panel-${activeView}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeView}`}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {currentView}
      </main>
    </div>
  );
}

export default App;

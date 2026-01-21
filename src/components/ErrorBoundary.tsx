import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 바운더리 컴포넌트
 * 자식 컴포넌트에서 발생한 에러를 catch하고 사용자 친화적인 UI를 표시합니다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="max-w-md w-full mx-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-red-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <h2 className="text-2xl font-bold text-white">문제가 발생했습니다</h2>
              </div>

              <p className="text-slate-300 mb-6">
                애플리케이션에서 예기치 않은 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
              </p>

              {this.state.error && (
                <details className="mb-6">
                  <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 mb-2">
                    에러 상세 정보
                  </summary>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <code className="text-xs text-red-400 font-mono break-all">
                      {this.state.error.message}
                    </code>
                  </div>
                </details>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium"
                >
                  다시 시도
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white font-medium"
                >
                  페이지 새로고침
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

/**
 * 에러 표시 컴포넌트
 * 로딩 실패 등의 에러를 사용자에게 표시합니다.
 */
export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <h3 className="text-xl font-bold text-white">설정을 불러올 수 없습니다</h3>
          </div>

          <p className="text-slate-300 mb-4">{error.message}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

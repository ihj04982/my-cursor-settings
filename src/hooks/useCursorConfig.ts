import { useState, useEffect } from 'react';
import { loadCursorConfig, type CursorConfig } from '../utils/configLoader';

interface UseCursorConfigReturn {
  config: CursorConfig | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Cursor 설정을 로드하는 커스텀 훅
 * @returns {UseCursorConfigReturn} 설정 데이터, 로딩 상태, 에러 상태, 재로드 함수
 */
export function useCursorConfig(): UseCursorConfigReturn {
  const [config, setConfig] = useState<CursorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loadCursorConfig();
      setConfig(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('설정을 불러오는데 실패했습니다.');
      setError(error);
      if (import.meta.env.DEV) {
        console.error('설정 로드 실패:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    refetch: fetchConfig,
  };
}

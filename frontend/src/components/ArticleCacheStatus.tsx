'use client';

import { useArticleCache } from '@/contexts/ArticleCacheContext';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ArticleCacheStatus() {
  const { isInitialized, isLoading, cacheStats } = useArticleCache();

  if (!isLoading && !isInitialized) {
    return null; // Don't show anything if cache failed to initialize
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300
        ${isLoading 
          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
          : isInitialized 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }
      `}>
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Loading articles...</span>
            </>
          ) : isInitialized ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>{cacheStats.totalArticles} articles cached</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Cache failed</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

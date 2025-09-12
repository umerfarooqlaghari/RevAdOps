'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { articleCache, Article, ArticleMetadata } from '@/lib/articleCache';

interface ArticleCacheContextType {
  isInitialized: boolean;
  isLoading: boolean;
  articles: Article[];
  metadata: ArticleMetadata[];
  getArticle: (slug: string) => Article | null;
  getMetadata: (slug: string) => ArticleMetadata | null;
  getArticleWithFallback: (slug: string) => Promise<Article | null>;
  refreshCache: () => Promise<void>;
  cacheStats: {
    totalArticles: number;
    totalMetadata: number;
    isInitialized: boolean;
    articles: string[];
  };
}

const ArticleCacheContext = createContext<ArticleCacheContextType | undefined>(undefined);

interface ArticleCacheProviderProps {
  children: ReactNode;
}

export function ArticleCacheProvider({ children }: ArticleCacheProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [metadata, setMetadata] = useState<ArticleMetadata[]>([]);

  // Initialize cache on mount
  useEffect(() => {
    initializeCache();
  }, []);

  const initializeCache = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Initializing article cache...');
      
      await articleCache.initialize();
      
      // Update state with cached data
      setArticles(articleCache.getAllArticles());
      setMetadata(articleCache.getAllMetadata());
      setIsInitialized(true);
      
      console.log('✅ Article cache initialized successfully');
      console.log('📊 Cache stats:', articleCache.getStats());
    } catch (error) {
      console.error('❌ Failed to initialize article cache:', error);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getArticle = (slug: string): Article | null => {
    return articleCache.getArticle(slug);
  };

  const getMetadata = (slug: string): ArticleMetadata | null => {
    return articleCache.getArticleMetadata(slug);
  };

  const getArticleWithFallback = async (slug: string): Promise<Article | null> => {
    const article = await articleCache.getArticleWithFallback(slug);
    
    // Update state if new article was fetched
    if (article && !articleCache.hasArticle(slug)) {
      setArticles(articleCache.getAllArticles());
      setMetadata(articleCache.getAllMetadata());
    }
    
    return article;
  };

  const refreshCache = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Refreshing article cache...');
      
      await articleCache.refresh();
      
      setArticles(articleCache.getAllArticles());
      setMetadata(articleCache.getAllMetadata());
      setIsInitialized(true);
      
      console.log('✅ Article cache refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh article cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cacheStats = articleCache.getStats();

  const value: ArticleCacheContextType = {
    isInitialized,
    isLoading,
    articles,
    metadata,
    getArticle,
    getMetadata,
    getArticleWithFallback,
    refreshCache,
    cacheStats,
  };

  return (
    <ArticleCacheContext.Provider value={value}>
      {children}
    </ArticleCacheContext.Provider>
  );
}

export function useArticleCache(): ArticleCacheContextType {
  const context = useContext(ArticleCacheContext);
  if (context === undefined) {
    throw new Error('useArticleCache must be used within an ArticleCacheProvider');
  }
  return context;
}

// Hook for getting article metadata (useful for SEO)
export function useArticleMetadata(slug: string): ArticleMetadata | null {
  const { getMetadata } = useArticleCache();
  return getMetadata(slug);
}

// Hook for getting full article with fallback
export function useArticleWithFallback(slug: string): {
  article: Article | null;
  isLoading: boolean;
  error: string | null;
} {
  const { getArticleWithFallback } = useArticleCache();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedArticle = await getArticleWithFallback(slug);
        setArticle(fetchedArticle);
        
        if (!fetchedArticle) {
          setError('Article not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, getArticleWithFallback]);

  return { article, isLoading, error };
}

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContentContextType {
  content: any;
  loading: boolean;
  error: string | null;
  refetchContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }
      
      const data = await response.json();
      setContent(data);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const refetchContent = async () => {
    await fetchContent();
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const value: ContentContextType = {
    content,
    loading,
    error,
    refetchContent,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Calendar, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  tags: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BlogSearchProps {
  onSearchResults?: (results: BlogPost[], query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function BlogSearch({ 
  onSearchResults, 
  placeholder = "Search articles...",
  className = ""
}: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query.trim());
      } else {
        setResults([]);
        setShowResults(false);
        setHasSearched(false);
        onSearchResults?.([], '');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs?search=${encodeURIComponent(searchQuery)}&limit=20`
      );

      if (response.ok) {
        const data = await response.json();
        const searchResults = data.blogs || [];
        setResults(searchResults);
        setShowResults(true);
        onSearchResults?.(searchResults, searchQuery);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setHasSearched(false);
    onSearchResults?.([], '');
    inputRef.current?.focus();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
          placeholder={placeholder}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                Found {results.length} article{results.length !== 1 ? 's' : ''} for "{query}"
              </div>
              {results.map((article) => (
                <a
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => setShowResults(false)}
                >
                  <div className="flex items-start space-x-3">
                    {article.featuredImage && (
                      <div className="flex-shrink-0">
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          width={60}
                          height={40}
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {highlightText(article.title, query)}
                      </h4>
                      {article.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {highlightText(article.excerpt, query)}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {article.category && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {article.category.name}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {calculateReadTime(article.excerpt || '')}
                        </span>
                      </div>
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {highlightText(tag, query)}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : hasSearched && !isSearching ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No articles found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or check spelling</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

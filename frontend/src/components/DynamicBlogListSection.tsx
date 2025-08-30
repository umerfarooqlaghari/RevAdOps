'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  customUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  content: {
    title?: string;
    subtitle?: string;
    show_featured?: string;
    posts_per_page?: string;
  };
  searchResults?: BlogPost[];
  searchQuery?: string;
}

export default function DynamicBlogListSection({ content, searchResults, searchQuery }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const postsPerPage = 10; // Always show 10 articles initially and load 10 more
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs?page=${page}&limit=${postsPerPage}`
      );

      if (response.ok) {
        const data = await response.json();
        const newPosts = data.blogs || [];

        if (append) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }

        setTotalPages(data.pagination?.pages || 1);
        setHasMore(page < (data.pagination?.pages || 1));
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

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

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage, true);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  // Use search results if available, otherwise use fetched posts
  const displayPosts = searchResults || posts;
  const isSearchMode = !!searchResults;

  // Don't render the section if there are no posts and no search
  if (!loading && displayPosts.length === 0 && !isSearchMode) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {isSearchMode && searchQuery
              ? `Search Results for "${searchQuery}"`
              : (content.title || 'Articles')
            }
          </h2>
          {isSearchMode && (
            <p className="text-gray-600 mb-8">
              Found {displayPosts.length} article{displayPosts.length !== 1 ? 's' : ''} matching your search
            </p>
          )}
        </div>



        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.featuredImage || '/api/placeholder/400/250'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt || 'Read this article to learn more about this topic.'}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-3">{formatDate(post.publishedAt || post.createdAt)}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{calculateReadTime(post.excerpt || '')}</span>
                </div>

                {post.customUrl ? (
                  <a
                    href={post.customUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                ) : (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* No search results message */}
        {isSearchMode && displayPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No articles found</h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any articles matching &quot;{searchQuery}&quot;. Try different keywords or browse our categories.
              </p>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isSearchMode && (
          <div className="text-center mt-12">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'Load More Articles'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

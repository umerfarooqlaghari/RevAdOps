/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ArticleWidget {
  id: string;
  type: string;
  title: string;
  content: string;
  settings: any;
  position: number;
  isActive?: boolean;
}

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  author: string;
  metaDescription: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaCategory?: string;
  publishedAt: string;
  tags: string[];
  viewCount: number;
  advertisement1?: string;
  advertisement2?: string;
  htmlWidgetIds?: string[];
  category: {
    name: string;
    slug: string;
  } | null;
}

interface HtmlWidget {
  id: string;
  name: string;
  title?: string;
  htmlContent: string;
  description?: string;
  isActive: boolean;
}

interface ArticleSidebarProps {
  widgets: ArticleWidget[];
  article?: Article;
}

interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featuredImage: string;
}

export default function ArticleSidebar({ widgets, article }: ArticleSidebarProps) {
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [htmlWidgets, setHtmlWidgets] = useState<HtmlWidget[]>([]);

  useEffect(() => {
    // Fetch recent articles for the recent articles widget
    const fetchRecentArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?limit=5`);
        if (response.ok) {
          const data = await response.json();
          setRecentArticles(data.blogs || []);
        }
      } catch (error) {
        console.error('Error fetching recent articles:', error);
      }
    };

    // Fetch HTML widgets if article has htmlWidgetIds
    const fetchHtmlWidgets = async () => {
      if (article?.htmlWidgetIds && article.htmlWidgetIds.length > 0) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/html-widgets/by-ids`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ widgetIds: article.htmlWidgetIds })
          });
          if (response.ok) {
            const data = await response.json();
            setHtmlWidgets(data.widgets || []);
          }
        } catch (error) {
          console.error('Error fetching HTML widgets:', error);
        }
      }
    };

    fetchRecentArticles();
    fetchHtmlWidgets();
  }, [article?.htmlWidgetIds]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('loading');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
    }
  };

  const renderWidget = (widget: ArticleWidget) => {
    switch (widget.type) {
      case 'ad_slot':
        return (
          <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            {widget.title && (
              <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">
                {widget.title}
              </h3>
            )}
            <div
              className="flex items-center justify-center bg-gray-100 rounded-lg mx-auto"
              style={{
                width: '300px',
                height: '250px'
              }}
            >
              {widget.content ? (
                <div dangerouslySetInnerHTML={{ __html: widget.content }} />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-sm font-medium">Advertisement</div>
                  <div className="text-xs mt-1">300 x 250</div>
                </div>
              )}
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div key={widget.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {widget.title || 'Subscribe to Our Newsletter'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {widget.content || 'Stay updated with the latest insights in ad operations and revenue optimization.'}
              </p>
              
              {newsletterStatus === 'success' ? (
                <div className="text-green-600 font-medium">
                  Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={widget.settings?.placeholder || 'Enter your email address'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm disabled:opacity-50"
                  >
                    {newsletterStatus === 'loading' ? 'Subscribing...' : (widget.settings?.buttonText || 'Subscribe Now')}
                  </button>
                </form>
              )}
              
              {newsletterStatus === 'error' && (
                <div className="text-red-600 text-sm mt-2">
                  Something went wrong. Please try again.
                </div>
              )}
            </div>
          </div>
        );

      case 'recent_articles':
        return (
          <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {widget.title || 'Recent Articles'}
            </h3>
            <div className="space-y-4">
              {recentArticles.slice(0, widget.settings?.limit || 5).map((article) => (
                <div key={article.id} className="group">
                  <a href={`/blog/${article.slug}`} className="block">
                    <div className="flex space-x-3">
                      {article.featuredImage && (
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={article.featuredImage}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                              sizes="64px"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {article.title}
                        </h4>
                        {widget.settings?.showDate && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                        {widget.settings?.showExcerpt && article.excerpt && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                View all articles
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        );

      case 'custom':
        return (
          <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {widget.title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {widget.title}
              </h3>
            )}
            <div dangerouslySetInnerHTML={{ __html: widget.content || '' }} />
          </div>
        );

      case 'article_ad':
        return (
          <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            {widget.title && (
              <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">
                {widget.title}
              </h3>
            )}
            <div className="flex items-center justify-center rounded-lg mx-auto overflow-hidden">
              {widget.content ? (
                <Image
                  src={widget.content}
                  alt="Advertisement"
                  width={300}
                  height={250}
                  className="object-cover w-full h-auto max-w-[300px]"
                  sizes="300px"
                />
              ) : (
                <div className="text-center text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center" style={{ width: '300px', height: '250px' }}>
                  <div>
                    <div className="text-sm font-medium">Advertisement</div>
                    <div className="text-xs mt-1">300 x 250</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'html_widget':
        return (
          <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            {widget.title && (
              <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">
                {widget.title}
              </h3>
            )}
            <div
              className="html-widget-content"
              dangerouslySetInnerHTML={{ __html: widget.content }}
              style={{
                width: '100%',
                overflow: 'hidden'
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Create article-specific advertisement widgets
  const articleAdWidgets: ArticleWidget[] = [];

  // Add HTML widgets if available
  if (htmlWidgets.length > 0) {
    htmlWidgets.forEach((htmlWidget, index) => {
      articleAdWidgets.push({
        id: `html-widget-${htmlWidget.id}`,
        type: 'html_widget',
        title: htmlWidget.title || htmlWidget.name,
        content: htmlWidget.htmlContent,
        position: index + 1,
        settings: {}
      });
    });
  }

  // Fallback to legacy advertisement fields if no HTML widgets
  if (htmlWidgets.length === 0) {
    if (article?.advertisement1) {
      articleAdWidgets.push({
        id: 'article-ad-1',
        type: 'article_ad',
        title: 'Advertisement',
        content: article.advertisement1,
        position: 1,
        settings: { width: 300, height: 250 }
      });
    }

    if (article?.advertisement2) {
      articleAdWidgets.push({
        id: 'article-ad-2',
        type: 'article_ad',
        title: 'Advertisement',
        content: article.advertisement2,
        position: 2,
        settings: { width: 300, height: 250 }
      });
    }
  }

  // Default widgets if none are configured
  const defaultWidgets: ArticleWidget[] = [
    ...articleAdWidgets,
    {
      id: 'default-newsletter',
      type: 'newsletter',
      title: 'Subscribe to Our Newsletter',
      content: 'Stay updated with the latest insights in ad operations and revenue optimization.',
      position: 3,
      settings: { buttonText: 'Subscribe Now', placeholder: 'Enter your email address' }
    },
    {
      id: 'default-recent',
      type: 'recent_articles',
      title: 'Article Archives',
      content: '',
      position: 4,
      settings: { limit: 5, showDate: true, showExcerpt: false }
    }
  ];

  // If no article ads, add default ad slots
  if (articleAdWidgets.length === 0) {
    defaultWidgets.unshift(
      {
        id: 'default-ad-1',
        type: 'ad_slot',
        title: 'Advertisement',
        content: '',
        position: 1,
        settings: { width: 300, height: 250 }
      },
      {
        id: 'default-ad-2',
        type: 'ad_slot',
        title: 'Advertisement',
        content: '',
        position: 2,
        settings: { width: 300, height: 250 }
      }
    );
  }

  // Use configured widgets or default widgets
  const widgetsToRender = widgets.length > 0 ? widgets : defaultWidgets;

  // Sort widgets by position
  const sortedWidgets = [...widgetsToRender].sort((a, b) => a.position - b.position);

  return (
    <div className="sticky top-8 space-y-6">
      {sortedWidgets.filter(widget => widget.isActive !== false).map(renderWidget)}
    </div>
  );
}

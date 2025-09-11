/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleHero from '@/components/ArticleHero';
import ArticleContent from '@/components/ArticleContent';
import ArticleSidebar from '@/components/ArticleSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Calendar, User, Eye, Tag } from 'lucide-react';

// Custom hook to update document head for SEO
const useDocumentHead = (article: Article | null) => {
  useEffect(() => {
    if (!article) return;

    // Update document title
    const originalTitle = document.title;
    const metaTitle = article.metaTitle || article.title;
    document.title = `${metaTitle} | RevAdOps Blog`;

    // Update or create meta description
    const updateOrCreateMeta = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic SEO meta tags
    updateOrCreateMeta('description', article.metaDescription || article.excerpt || '');

    // Keywords meta tag
    if (article.metaKeywords) {
      updateOrCreateMeta('keywords', article.metaKeywords);
    }

    // Author meta tag
    updateOrCreateMeta('author', article.author || 'RevAdOps Team');

    // Article meta tags
    updateOrCreateMeta('article:author', article.author || 'RevAdOps Team');
    updateOrCreateMeta('article:published_time', article.publishedAt);

    if (article.metaCategory || article.category?.name) {
      updateOrCreateMeta('article:section', article.metaCategory || article.category?.name || '');
    }

    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        const tagMeta = document.createElement('meta');
        tagMeta.setAttribute('property', 'article:tag');
        tagMeta.setAttribute('content', tag);
        document.head.appendChild(tagMeta);
      });
    }

    // Open Graph meta tags
    updateOrCreateMeta('', metaTitle, 'og:title');
    updateOrCreateMeta('', article.metaDescription || article.excerpt || '', 'og:description');
    updateOrCreateMeta('', 'article', 'og:type');
    updateOrCreateMeta('', window.location.href, 'og:url');

    if (article.featuredImage) {
      updateOrCreateMeta('', article.featuredImage, 'og:image');
      updateOrCreateMeta('', article.title, 'og:image:alt');
    }

    // Twitter Card meta tags
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    updateOrCreateMeta('twitter:title', metaTitle);
    updateOrCreateMeta('twitter:description', article.metaDescription || article.excerpt || '');

    if (article.featuredImage) {
      updateOrCreateMeta('twitter:image', article.featuredImage);
    }

    // Add structured data (JSON-LD) for better SEO
    const addStructuredData = () => {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const structuredData: any = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": metaTitle,
        "description": article.metaDescription || article.excerpt || '',
        "image": article.featuredImage || '',
        "author": {
          "@type": "Person",
          "name": article.author || 'RevAdOps Team'
        },
        "publisher": {
          "@type": "Organization",
          "name": "RevAdOps",
          "logo": {
            "@type": "ImageObject",
            "url": "https://revadops.com/logo.png"
          }
        },
        "datePublished": article.publishedAt,
        "dateModified": article.publishedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        }
      };

      if (article.metaKeywords) {
        structuredData.keywords = article.metaKeywords;
      }

      if (article.metaCategory || article.category?.name) {
        structuredData.articleSection = article.metaCategory || article.category?.name;
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    addStructuredData();

    // Cleanup function to restore original title
    return () => {
      document.title = originalTitle;

      // Remove article-specific meta tags on cleanup
      const articleTags = document.querySelectorAll('meta[property="article:tag"]');
      articleTags.forEach(tag => tag.remove());

      // Remove structured data
      const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
      if (structuredDataScript) {
        structuredDataScript.remove();
      }
    };
  }, [article]);
};

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

interface ArticleWidget {
  id: string;
  type: string;
  title: string;
  content: string;
  settings: any;
  position: number;
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [widgets, setWidgets] = useState<ArticleWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use custom hook to update document head for SEO
  useDocumentHead(article);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // Fetch article by slug
        const articleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/post/${slug}`);
        
        if (!articleResponse.ok) {
          if (articleResponse.status === 404) {
            setError('Article not found');
          } else {
            setError('Failed to load article');
          }
          return;
        }
        
        const articleData = await articleResponse.json();
        setArticle(articleData);

        // Fetch sidebar widgets
        const widgetsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/article-widgets`);
        if (widgetsResponse.ok) {
          const widgetsData = await widgetsResponse.json();
          setWidgets(widgetsData.widgets || []);
        }

        // Increment view count
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/post/${slug}/view`, {
          method: 'POST'
        });

      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {error || 'Article Not Found'}
            </h1>
            <p className="text-gray-600 mb-8">
              The article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: article.title, href: `/blog/${article.slug}` }
  ];

  return (
    <div className="min-h-screen">
        <Header />

      <main>
        {/* Article Hero */}
        <ArticleHero article={article} />

        {/* Article Content Layout */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content - 70% */}
              <div className="lg:w-[70%]">
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{article.author || 'RevAdOps Team'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>{article.viewCount} views</span>
                  </div>
                  {article.category && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      <span>{article.category.name}</span>
                    </div>
                  )}
                </div>

                {/* Featured Image */}
                {article.featuredImage && (
                  <div className="mb-8">
                    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                        priority
                      />
                    </div>
                  </div>
                )}

                {/* Article Content */}
                <ArticleContent content={article.content} />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - 30% */}
              <div className="lg:w-[30%]">
                <ArticleSidebar widgets={widgets} article={article} />
              </div>
            </div>
          </div>
        </section>
      </main>

        <Footer />
      </div>
  );
}

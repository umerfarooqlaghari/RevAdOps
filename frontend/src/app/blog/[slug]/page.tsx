/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleHero from '@/components/ArticleHero';
import ArticleContent from '@/components/ArticleContent';
import ArticleSidebar from '@/components/ArticleSidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Calendar, User, Eye, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  author: string;
  metaDescription: string;
  publishedAt: string;
  tags: string[];
  viewCount: number;
  advertisement1?: string;
  advertisement2?: string;
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
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{article.title} | RevAdOps Blog</title>
        <meta name="description" content={article.metaDescription || article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.metaDescription || article.excerpt} />
        <meta property="og:image" content={article.featuredImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.metaDescription || article.excerpt} />
        <meta name="twitter:image" content={article.featuredImage} />
      </Head>

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
    </>
  );
}

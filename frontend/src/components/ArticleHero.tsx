'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, User, Clock } from 'lucide-react';

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
  category: {
    name: string;
    slug: string;
  } | null;
}

interface ArticleHeroProps {
  article: Article;
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <section className="relative bg-gradient-to-br pt-10 pb-10  from-gray-900 via-gray-800 to-gray-700 text-white">
      {/* Background Image Overlay */}
      {article.featuredImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover opacity-20"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-700/80"></div>
        </div>
      )}

      <div className="relative z-10 container-custom py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          {article.category && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                {article.category.name}
              </span>
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Article Excerpt */}
          {article.excerpt && (
            <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Article Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{article.author || 'RevAdOps Team'}</span>
            </div>

            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>

            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{readingTime} min read</span>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}

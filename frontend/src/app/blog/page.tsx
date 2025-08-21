'use client';

import { useState, useEffect } from 'react';
import DynamicBlogHeroSection from '@/components/DynamicBlogHeroSection';
import DynamicBlogCategoriesSection from '@/components/DynamicBlogCategoriesSection';
import DynamicBlogListSection from '@/components/DynamicBlogListSection';
import DynamicBlogCTASection from '@/components/DynamicBlogCTASection';

interface ContentSection {
  [key: string]: string;
}

interface BlogContent {
  hero: ContentSection;
  categories: ContentSection;
  blog_list: ContentSection;
  cta: ContentSection;
}

export default function BlogPage() {
  const [content, setContent] = useState<BlogContent>({
    hero: {},
    categories: {},
    blog_list: {},
    cta: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
        const data = await response.json();

        // Extract blog-related content
        const blogContent = {
          hero: data.blog_hero || {},
          categories: data.blog_categories || {},
          blog_list: data.blog_list || {},
          cta: data.blog_cta || {}
        };

        setContent(blogContent);
      } catch (error) {
        console.error('Error fetching blog content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Available</h1>
          <p className="text-gray-600">Unable to load blog content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DynamicBlogHeroSection content={content.hero} />
      <DynamicBlogCategoriesSection content={content.categories} />
      <DynamicBlogListSection content={content.blog_list} />
      <DynamicBlogCTASection content={content.cta} />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicHeroSection from '@/components/DynamicHeroSection';
import DynamicWhatWeDoSection from '@/components/DynamicWhatWeDoSection';
import DynamicWhyChooseSection from '@/components/DynamicWhyChooseSection';
import DynamicHowItWorksSection from '@/components/DynamicHowItWorksSection';
import DynamicExpertiseSection from '@/components/DynamicExpertiseSection';
import DynamicTestimonialsSection from '@/components/DynamicTestimonialsSection';
import DynamicFinalCTASection from '@/components/DynamicFinalCTASection';
import { useArticleCache } from '@/contexts/ArticleCacheContext';
import ArticleCacheStatus from '@/components/ArticleCacheStatus';

interface ContentSection {
  [key: string]: string;
}

interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface TestimonialItem {
  id: string;
  text: string;
  author: string;
  company: string;
  avatar?: string;
  order: number;
}

interface ContentData {
  hero?: ContentSection;
  what_we_do?: ContentSection;
  why_choose_us?: ContentSection;
  how_it_works?: ContentSection;
  our_expertise?: ContentSection;
  testimonials?: ContentSection;
  final_cta?: ContentSection;
  [key: string]: ContentSection | undefined;
}

export default function Home() {
  const [content, setContent] = useState<ContentData>({});
  const [expertiseItems, setExpertiseItems] = useState<ExpertiseItem[]>([]);
  const [testimonialItems, setTestimonialItems] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use article cache to pre-load all articles
  const { isInitialized: articlesLoaded, isLoading: articlesLoading, cacheStats } = useArticleCache();

  useEffect(() => {
    fetchContent();
  }, []);

  // Log cache status when articles are loaded
  useEffect(() => {
    if (articlesLoaded) {
      console.log('🎉 Homepage: Articles cache loaded!', cacheStats);
    }
  }, [articlesLoaded, cacheStats]);

  const fetchContent = async () => {
    try {
      // Fetch regular content
      const contentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      if (contentResponse.ok) {
        const data = await contentResponse.json();
        setContent(data);
      }

      // Fetch expertise items
      const expertiseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/expertise`);
      if (expertiseResponse.ok) {
        const expertiseData = await expertiseResponse.json();
        setExpertiseItems(expertiseData.items || []);
      }

      // Fetch testimonials
      const testimonialsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials`);
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        setTestimonialItems(testimonialsData.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while content or articles are loading
  if (isLoading || articlesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {isLoading ? 'Loading content...' : 'Pre-loading articles for optimal SEO...'}
          </p>
          {articlesLoading && (
            <p className="text-gray-500 text-sm mt-2">
              Caching {cacheStats.totalArticles} articles for instant access
            </p>
          )}
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <DynamicHeroSection content={content.hero || {}} />
        <DynamicWhatWeDoSection content={content.what_we_do || {}} />
        <DynamicWhyChooseSection content={content.why_choose_us || {}} />
        <DynamicHowItWorksSection content={content.how_it_works || {}} />
        <DynamicExpertiseSection content={content.our_expertise || {}} items={expertiseItems} />
        <DynamicTestimonialsSection content={content.testimonials || {}} items={testimonialItems} />

        <DynamicFinalCTASection content={content.final_cta || {}} />
      </main>
      <Footer />

      {/* Show cache status during development */}
      {process.env.NODE_ENV === 'development' && <ArticleCacheStatus />}
    </div>
  );
}

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
import DynamicPartnersSection from '@/components/DynamicPartnersSection';
import DynamicFinalCTASection from '@/components/DynamicFinalCTASection';

interface ContentSection {
  [key: string]: string;
}

interface ContentData {
  hero?: ContentSection;
  what_we_do?: ContentSection;
  why_choose_us?: ContentSection;
  how_it_works?: ContentSection;
  our_expertise?: ContentSection;
  testimonials?: ContentSection;
  partners?: ContentSection;
  final_cta?: ContentSection;
  [key: string]: ContentSection | undefined;
}

export default function Home() {
  const [content, setContent] = useState<ContentData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <DynamicExpertiseSection content={content.our_expertise || {}} />
        <DynamicTestimonialsSection content={content.testimonials || {}} />
        <DynamicPartnersSection content={content.partners || {}} />
        <DynamicFinalCTASection content={content.final_cta || {}} />
      </main>
      <Footer />
    </div>
  );
}

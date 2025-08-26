'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicAboutHeroSection from '@/components/DynamicAboutHeroSection';
import DynamicDirectorSection from '@/components/DynamicDirectorSection';
import DynamicAboutContentSection from '@/components/DynamicAboutContentSection';


interface AboutContent {
  hero: Record<string, string>;
  director: Record<string, string>;
  about_content: Record<string, string>;
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>({
    hero: {},
    director: {},
    about_content: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
        const data = await response.json();

        // Extract about-related content
        const aboutContent = {
          hero: data.about_hero || {},
          director: data.about_director || {},
          about_content: data.about_content || {}
        };

        setContent(aboutContent);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
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
        <DynamicAboutHeroSection content={content.hero} />
        
        {/* Two Column Layout */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
              {/* Left Column - Director Photo (30%) */}
              <div className="lg:col-span-3">
                <DynamicDirectorSection content={content.director} />
              </div>
              
              {/* Right Column - About Content (70%) */}
              <div className="lg:col-span-7">
                <DynamicAboutContentSection content={content.about_content} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

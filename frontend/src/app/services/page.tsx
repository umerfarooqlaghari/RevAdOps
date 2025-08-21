'use client';

import DynamicServicesHeroSection from '@/components/DynamicServicesHeroSection';
import DynamicServicesListSection from '@/components/DynamicServicesListSection';
import DynamicServicesFeaturesSection from '@/components/DynamicServicesFeaturesSection';
import DynamicServicesProcessSection from '@/components/DynamicServicesProcessSection';
import DynamicServicesCTASection from '@/components/DynamicServicesCTASection';
import { useState, useEffect } from 'react';

interface ContentSection {
  [key: string]: string;
}

interface ServicesContent {
  hero: ContentSection;
  services_list: ContentSection;
  features: ContentSection;
  process: ContentSection;
  cta: ContentSection;
}

export default function ServicesPage() {
  const [content, setContent] = useState<ServicesContent>({
    hero: {},
    services_list: {},
    features: {},
    process: {},
    cta: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
        const data = await response.json();

        // Extract services-related content
        const servicesContent = {
          hero: data.services_hero || {},
          services_list: data.services_list || {},
          features: data.services_features || {},
          process: data.services_process || {},
          cta: data.services_cta || {}
        };

        setContent(servicesContent);
      } catch (error) {
        console.error('Error fetching services content:', error);
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
          <p className="text-gray-600">Unable to load services content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DynamicServicesHeroSection content={content.hero} />
      <DynamicServicesListSection content={content.services_list} />
      <DynamicServicesFeaturesSection content={content.features} />
      <DynamicServicesProcessSection content={content.process} />
      <DynamicServicesCTASection content={content.cta} />
    </div>
  );
}

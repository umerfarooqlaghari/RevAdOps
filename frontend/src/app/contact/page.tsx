'use client';

import DynamicContactHeroSection from '@/components/DynamicContactHeroSection';
import DynamicContactInfoSection from '@/components/DynamicContactInfoSection';
import { useState, useEffect } from 'react';

interface ContactContent {
  hero: Record<string, string>;
  info: Record<string, string>;
}

export default function ContactPage() {
  const [content, setContent] = useState<ContactContent>({
    hero: {},
    info: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
        const data = await response.json();

        // Extract contact-related content
        const contactContent = {
          hero: data.contact_hero || {},
          info: data.contact_info || {}
        };

        setContent(contactContent);
      } catch (error) {
        console.error('Error fetching contact content:', error);
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
          <p className="text-gray-600">Unable to load contact content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DynamicContactHeroSection content={content.hero} />
      <DynamicContactInfoSection content={content.info} />
    </div>
  );
}

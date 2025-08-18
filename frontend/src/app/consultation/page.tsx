'use client';

import { useState, useEffect } from 'react';
import DynamicConsultationHeroSection from '@/components/DynamicConsultationHeroSection';
import DynamicConsultationBenefitsSection from '@/components/DynamicConsultationBenefitsSection';
import DynamicConsultationFormSection from '@/components/DynamicConsultationFormSection';

interface ConsultationContent {
  hero: any;
  benefits: any;
  form: any;
}

export default function ConsultationPage() {
  const [content, setContent] = useState<ConsultationContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
        const data = await response.json();
        
        // Extract consultation-related content
        const consultationContent = {
          hero: data.consultation_hero || {},
          benefits: data.consultation_benefits || {},
          form: data.consultation_form || {}
        };
        
        setContent(consultationContent);
      } catch (error) {
        console.error('Error fetching consultation content:', error);
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
          <p className="text-gray-600">Unable to load consultation content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DynamicConsultationHeroSection content={content.hero} />
      <DynamicConsultationBenefitsSection content={content.benefits} />
      <DynamicConsultationFormSection content={content.form} />
    </div>
  );
}

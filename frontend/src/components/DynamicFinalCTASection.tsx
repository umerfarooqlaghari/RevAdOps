'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FinalCTAContent {
  title?: string;
  description?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
}

interface DynamicFinalCTASectionProps {
  content: FinalCTAContent;
}

const DynamicFinalCTASection = ({ content }: DynamicFinalCTASectionProps) => {
  const defaultContent = {
    title: "Ready to Maximize Your Ad Revenue?",
    description: "Join hundreds of publishers who have increased their revenue with RevAdOps. Get started with a free consultation today.",
    cta_primary_text: "Get Free Consultation",
    cta_primary_link: "/consultation",
    cta_secondary_text: "Contact Us",
    cta_secondary_link: "/contact"
  };

  const sectionData = { ...defaultContent, ...content };

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {sectionData.title}
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          {sectionData.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={sectionData.cta_primary_link || '/consultation'}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            {sectionData.cta_primary_text}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          {sectionData.cta_secondary_text && (
            <Link
              href={sectionData.cta_secondary_link || '/contact'}
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              {sectionData.cta_secondary_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicFinalCTASection;

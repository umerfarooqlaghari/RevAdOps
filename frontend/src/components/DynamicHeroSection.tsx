'use client';


import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HeroContent {
  title?: string;
  subtitle?: string;
  background_image?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
}

interface DynamicHeroSectionProps {
  content: HeroContent;
}

const DynamicHeroSection = ({ content }: DynamicHeroSectionProps) => {
  // Default content fallback
  const defaultContent = {
    title: "Unlock Your Ad Revenue Potential with Intelligent Ad Operations",
    subtitle: "RevAdOps helps publishers and app developers maximize revenue, improve fill rates, and maintain healthy traffic quality through advanced AdTech solutions and data-driven optimization.",
    background_image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    cta_primary_text: "Get a Free Consultation",
    cta_primary_link: "/consultation",
    cta_secondary_text: "Learn More",
    cta_secondary_link: "/about"
  };

  // Merge content with defaults
  const heroData = { ...defaultContent, ...content };



  return (
    <section className="relative min-h-screen bg-white">
      {/* Hero Banner Image - ITAO Style */}
      <div className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gradient-to-br from-blue-900 to-purple-900"
          style={{
            backgroundImage: heroData.background_image ? `url(${heroData.background_image})` : 'none'
          }}
        >

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {heroData.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
                {heroData.subtitle}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={heroData.cta_primary_link || '/consultation'}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {heroData.cta_primary_text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                
                {heroData.cta_secondary_text && (
                  <Link
                    href={heroData.cta_secondary_link || '/about'}
                    className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
                  >
                    {heroData.cta_secondary_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default DynamicHeroSection;

'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';

interface ServicesHeroProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    background_image?: string;
    cta_text?: string;
    cta_link?: string;
    features?: string;
  };
}

export default function DynamicServicesHeroSection({ content }: ServicesHeroProps) {
  const features = content.features ? content.features.split(',').map(f => f.trim()) : [];

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-32"
      style={{
        backgroundImage: content.background_image ? `linear-gradient(rgba(30, 58, 138, 0.8), rgba(67, 56, 202, 0.8)), url(${content.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {content.subtitle && (
              <p className="text-blue-200 text-lg font-medium mb-4">
                {content.subtitle}
              </p>
            )}
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {content.title || 'Our Services'}
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {content.description || 'Comprehensive digital marketing solutions to grow your business.'}
            </p>

            {features.length > 0 && (
              <div className="mb-8">
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-blue-100">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {content.cta_text && (
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={content.cta_link || '#services'}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                >
                  {content.cta_text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white rounded-2xl p-8 transform -rotate-3 shadow-2xl">
                <div className="text-gray-900">
                  <h3 className="text-2xl font-bold mb-4">Why Choose Our Services?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span>Expert Team</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span>Proven Results</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

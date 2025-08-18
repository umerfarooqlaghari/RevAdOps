'use client';

import { ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react';

interface ServicesCTAProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
    secondary_cta_text?: string;
    secondary_cta_link?: string;
    background_image?: string;
    phone?: string;
    email?: string;
    features?: string;
  };
}

export default function DynamicServicesCTASection({ content }: ServicesCTAProps) {
  const features = content.features ? content.features.split(',').map(f => f.trim()) : [
    'Free Consultation',
    'Custom Strategy',
    'Proven Results'
  ];

  return (
    <section 
      className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white"
      style={{
        backgroundImage: content.background_image ? `linear-gradient(rgba(30, 58, 138, 0.9), rgba(67, 56, 202, 0.9)), url(${content.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-200 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {content.title || 'Ready to Grow Your Business?'}
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            {content.description || 'Let\'s discuss how our services can help you achieve your digital marketing goals.'}
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center bg-white bg-opacity-10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-blue-100">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href={content.primary_cta_link || '#contact'}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
            >
              {content.primary_cta_text || 'Get Started Now'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            
            {content.secondary_cta_text && (
              <a
                href={content.secondary_cta_link || '#consultation'}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200 group"
              >
                {content.secondary_cta_text}
                <MessageCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </a>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {content.phone && (
              <a
                href={`tel:${content.phone}`}
                className="flex items-center text-blue-200 hover:text-white transition-colors duration-200"
              >
                <Phone className="h-5 w-5 mr-2" />
                {content.phone}
              </a>
            )}
            
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="flex items-center text-blue-200 hover:text-white transition-colors duration-200"
              >
                <Mail className="h-5 w-5 mr-2" />
                {content.email}
              </a>
            )}
          </div>
        </div>

        {/* Stats or Additional Info */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Successful Projects</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-blue-200">Client Satisfaction</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-blue-200">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}

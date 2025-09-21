'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface ServiceImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular: boolean;
  order: number;
  ctaText: string;
  ctaLink?: string;
  isActive: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  shortDesc?: string;
  icon?: string;
  image?: string;
  slug: string;
  isActive: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  images: ServiceImage[];
  packages: ServicePackage[];
}

interface ServiceDetailHeroProps {
  service: Service;
}

export default function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  // Extract key benefits from description or use default ones
  const benefits = [
    'Expert consultation and strategy',
    'Proven results and ROI improvement',
    'Dedicated support team',
    'Custom solutions for your business'
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="mb-6">
              <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                Professional Service
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {service.shortDesc || service.description}
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={service.ctaLink || 'https://calendly.com/silviasam91/30min'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
              >
                {service.ctaText || 'Get Started Today'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              
              <a
                href="#learn-more"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200"
              >
                Learn More
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-blue-700">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-blue-200 text-sm">Projects Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-blue-200 text-sm">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-blue-200 text-sm">Support Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            {service.image ? (
              <div className="relative">
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl"></div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Professional {service.title}
                </h3>
                <p className="text-blue-100">
                  Expert solutions tailored to your business needs
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

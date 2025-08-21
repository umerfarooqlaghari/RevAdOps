'use client';

import Image from 'next/image';

import { TrendingUp, Target, BarChart3, Shield } from 'lucide-react';

interface WhatWeDoContent {
  title?: string;
  description?: string;
  service_1_title?: string;
  service_1_description?: string;
  service_1_icon?: string;
  service_2_title?: string;
  service_2_description?: string;
  service_2_icon?: string;
  service_3_title?: string;
  service_3_description?: string;
  service_3_icon?: string;
  service_4_title?: string;
  service_4_description?: string;
  service_4_icon?: string;
}

interface DynamicWhatWeDoSectionProps {
  content: WhatWeDoContent;
}

const DynamicWhatWeDoSection = ({ content }: DynamicWhatWeDoSectionProps) => {
  // Default content fallback
  const defaultContent = {
    title: "What We Do",
    description: "We provide comprehensive ad revenue optimization solutions that help publishers and app developers maximize their earnings while maintaining excellent user experience.",
    service_1_title: "Revenue Optimization",
    service_1_description: "Advanced algorithms and real-time bidding strategies to maximize your ad revenue potential.",
    service_2_title: "Ad Quality Control",
    service_2_description: "Comprehensive filtering and monitoring to ensure only high-quality ads reach your audience.",
    service_3_title: "Performance Analytics",
    service_3_description: "Detailed insights and reporting to track performance and identify optimization opportunities.",
    service_4_title: "Traffic Protection",
    service_4_description: "Advanced fraud detection and prevention to protect your traffic quality and advertiser relationships."
  };

  // Merge content with defaults
  const sectionData = { ...defaultContent, ...content };

  const services = [
    {
      icon: sectionData.service_1_icon || TrendingUp,
      title: sectionData.service_1_title,
      description: sectionData.service_1_description,
      color: "bg-blue-500"
    },
    {
      icon: sectionData.service_2_icon || Target,
      title: sectionData.service_2_title,
      description: sectionData.service_2_description,
      color: "bg-green-500"
    },
    {
      icon: sectionData.service_3_icon || BarChart3,
      title: sectionData.service_3_title,
      description: sectionData.service_3_description,
      color: "bg-purple-500"
    },
    {
      icon: sectionData.service_4_icon || Shield,
      title: sectionData.service_4_title,
      description: sectionData.service_4_description,
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {sectionData.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const isImageIcon = typeof service.icon === 'string';
            const Icon = isImageIcon ? null : service.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center mb-6 mx-auto`}>
                  {isImageIcon ? (
                    <Image
                      src={service.icon as string}
                      alt={service.title}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    Icon && <Icon className="h-8 w-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Optimize Your Ad Revenue?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of publishers who have increased their revenue by up to 40% with our proven optimization strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Start Free Analysis
              </button>
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicWhatWeDoSection;

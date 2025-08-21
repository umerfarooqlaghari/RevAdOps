'use client';

import { 
  Search, 
  Target, 
  TrendingUp, 
  Users, 
  Mail, 
  Smartphone,
  BarChart3,
  Globe,
  ArrowRight
} from 'lucide-react';

interface ServicesListProps {
  content: {
    title?: string;
    subtitle?: string;
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
    service_5_title?: string;
    service_5_description?: string;
    service_5_icon?: string;
    service_6_title?: string;
    service_6_description?: string;
    service_6_icon?: string;
  };
}

const iconMap: { [key: string]: React.ComponentType<{className?: string}> } = {
  search: Search,
  target: Target,
  trending: TrendingUp,
  users: Users,
  mail: Mail,
  smartphone: Smartphone,
  chart: BarChart3,
  globe: Globe,
};

export default function DynamicServicesListSection({ content }: ServicesListProps) {
  const services = [
    {
      title: content.service_1_title || 'SEO Optimization',
      description: content.service_1_description || 'Improve your search engine rankings and drive organic traffic.',
      icon: content.service_1_icon || 'search',
    },
    {
      title: content.service_2_title || 'PPC Advertising',
      description: content.service_2_description || 'Targeted advertising campaigns that deliver results.',
      icon: content.service_2_icon || 'target',
    },
    {
      title: content.service_3_title || 'Social Media Marketing',
      description: content.service_3_description || 'Build your brand presence across social platforms.',
      icon: content.service_3_icon || 'users',
    },
    {
      title: content.service_4_title || 'Email Marketing',
      description: content.service_4_description || 'Engage your audience with personalized email campaigns.',
      icon: content.service_4_icon || 'mail',
    },
    {
      title: content.service_5_title || 'Content Marketing',
      description: content.service_5_description || 'Create compelling content that converts visitors into customers.',
      icon: content.service_5_icon || 'trending',
    },
    {
      title: content.service_6_title || 'Analytics & Reporting',
      description: content.service_6_description || 'Track performance and optimize your marketing strategy.',
      icon: content.service_6_icon || 'chart',
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Our Services'}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Search;
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <a
                  href="#contact"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
}

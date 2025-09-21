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
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
  ctaText?: string;
  ctaLink?: string;
}

interface ServicesGridProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    add_service_text?: string;
  };
  services: Service[];
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

export default function DynamicServicesGridSection({ content, services }: ServicesGridProps) {
  // Group services into rows of 3
  const serviceRows = [];
  for (let i = 0; i < services.length; i += 3) {
    serviceRows.push(services.slice(i, i + 3));
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Our Core Services'}
          </h2>
          {content.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.description}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {serviceRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {row.map((service) => {
                const IconComponent = service.icon ? iconMap[service.icon] || Search : Search;
                
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:-translate-y-2"
                  >
                    {/* Service Image or Icon */}
                    <div className="mb-6">
                      {service.image ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                          <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.shortDesc || service.description}
                    </p>

                    {/* CTA */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                    >
                      {service.ctaText || 'Learn More'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                );
              })}
              

            </div>
          ))}
          
          {/* If no services exist, show empty state */}
          {services.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl p-12 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Our Services</h3>
                <p className="text-gray-500">
                  We&apos;re currently updating our services. Please check back soon or contact us for more information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

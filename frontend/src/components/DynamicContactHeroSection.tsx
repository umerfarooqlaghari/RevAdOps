'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactHeroProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
}

export default function DynamicContactHeroSection({ content }: ContactHeroProps) {
  const contactDetails = [
    {
      icon: Phone,
      label: 'Phone',
      value: content?.phone || '+1 (555) 123-4567',
      href: `tel:${content?.phone?.replace(/\D/g, '') || '15551234567'}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: content?.email || 'hello@revadops.com',
      href: `mailto:${content?.email || 'hello@revadops.com'}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: content?.address || '123 Business St, Suite 100, City, State 12345',
      href: null,
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: content?.hours || 'Mon-Fri: 9AM-6PM EST',
      href: null,
    }
  ];

  return (
    
    <section className="py-20 bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Title & Description */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {content?.title || 'Contact Us'}
            </h1>
            {content?.description && (
              <p className="text-lg text-blue-100 leading-relaxed">
                {content.description}
              </p>
            )}
          </div>

          {/* Right Side - Single Contact Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-6">
              {contactDetails.map((detail, index) => {
                const Icon = detail.icon;
                const content = (
                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        {detail.label}
                      </p>
                      <p className="text-gray-900 font-medium break-words">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                );

                return detail.href ? (
                  <a key={index} href={detail.href}>
                    {content}
                  </a>
                ) : (
                  <div key={index}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

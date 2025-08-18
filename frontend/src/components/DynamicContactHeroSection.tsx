'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactHeroProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    background_image?: string;
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
}

export default function DynamicContactHeroSection({ content }: ContactHeroProps) {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: content.phone || '+1 (555) 123-4567',
      href: `tel:${content.phone || '+15551234567'}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: content.email || 'hello@revadops.com',
      href: `mailto:${content.email || 'hello@revadops.com'}`,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: content.address || '123 Business St, Suite 100, City, State 12345',
      href: '#map',
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: content.hours || 'Mon-Fri: 9AM-6PM EST',
      href: null,
    },
  ];

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
              {content.title || 'Get in Touch'}
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {content.description || 'Ready to take your digital marketing to the next level? We\'d love to hear from you.'}
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                const content = (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-200 mb-1">{item.label}</div>
                      <div className="text-white font-medium">{item.value}</div>
                    </div>
                  </div>
                );

                return (
                  <div key={index}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="block hover:bg-white hover:bg-opacity-5 rounded-lg p-2 -m-2 transition-colors duration-200"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="p-2 -m-2">
                        {content}
                      </div>
                    )}
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

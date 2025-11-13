'use client';

import { Phone, Mail, MapPin, Building2 } from 'lucide-react';

interface ContactInfoProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    office_1_name?: string;
    office_1_address?: string;
    office_1_phone?: string;
    office_1_email?: string;
    office_2_name?: string;
    office_2_address?: string;
    office_2_phone?: string;
    office_2_email?: string;
    office_3_name?: string;
    office_3_address?: string;
    office_3_phone?: string;
    office_3_email?: string;
  };
}

export default function DynamicContactInfoSection({ content }: ContactInfoProps) {
  const offices = [
    {
      name: content?.office_1_name || 'Main Office',
      address: content?.office_1_address || '123 Business Street, Suite 100\nNew York, NY 10001',
      phone: content?.office_1_phone || '+1 (555) 123-4567',
      email: content?.office_1_email || 'ny@revadops.com',
    },
    {
      name: content?.office_2_name || 'West Coast Office',
      address: content?.office_2_address || '456 Innovation Ave, Floor 5\nSan Francisco, CA 94105',
      phone: content?.office_2_phone || '+1 (555) 987-6543',
      email: content?.office_2_email || 'sf@revadops.com',
    },
    {
      name: content?.office_3_name || 'European Office',
      address: content?.office_3_address || '789 Tech Park, Building C\nLondon, UK EC1A 1BB',
      phone: content?.office_3_phone || '+44 20 1234 5678',
      email: content?.office_3_email || 'london@revadops.com',
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content?.title || 'Our Offices'}
          </h2>
          {content?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.description}
            </p>
          )}
        </div>

        {/* Office Cards - 3 in a row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offices.map((office, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
              {/* Office Name with Icon */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{office.name}</h3>
              </div>

              {/* Office Details */}
              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-white-100 rounded-lg flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">{office.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-white-100 rounded-lg flex items-center justify-center mr-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <a href={`tel:${office.phone.replace(/\D/g, '')}`} className="text-sm text-gray-900 hover:text-blue-600 transition-colors font-medium">
                      {office.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-white-100 rounded-lg flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${office.email}`} className="text-sm text-gray-900 hover:text-blue-600 transition-colors font-medium break-all">
                      {office.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

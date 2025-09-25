'use client';

import { Check } from 'lucide-react';

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

interface PackagesContent {
  packages_header_title?: string;
  packages_header_description?: string;
  packages_info_line_1?: string;
  packages_info_line_2?: string;
  packages_info_link_text?: string;
  packages_info_link_href?: string;
  packages_info_link_suffix?: string;
}

interface ServicePackagesSectionProps {
  packages: ServicePackage[];
  content?: PackagesContent;
}

export default function ServicePackagesSection({ packages, content = {} }: ServicePackagesSectionProps) {
  // Filter active packages and sort by order
  const activePackages = packages
    .filter(pkg => pkg.isActive)
    .sort((a, b) => a.order - b.order);

  if (activePackages.length === 0) {
    return null; // Don't render section if no packages
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.packages_header_title || 'Flexible Plans'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.packages_header_description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever"}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 ${
                pkg.isPopular
                  ? 'ring-2 ring-purple-500 transform scale-105'
                  : 'hover:-translate-y-2'
              }`}
            >
              {/* Popular Badge */}
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pkg.title}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {pkg.price.split('/')[0]}
                  </span>
                  {pkg.price.includes('/') && (
                    <span className="text-gray-600">
                      /{pkg.price.split('/')[1]}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  {pkg.description}
                </p>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <a
                  href={pkg.ctaLink || '#contact'}
                  className={`inline-block w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    pkg.isPopular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {pkg.ctaText}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            {content.packages_info_line_1 || 'All plans include 24/7 support and a 30-day money-back guarantee.'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {content.packages_info_line_2 ? (
              <>
                {content.packages_info_line_2} <a href={content.packages_info_link_href || '#contact'} className="text-blue-600 hover:text-blue-800">{content.packages_info_link_text || 'Contact us'}</a> {content.packages_info_link_suffix || 'for enterprise pricing.'}
              </>
            ) : (
              <>Need a custom solution? <a href={content.packages_info_link_href || '#contact'} className="text-blue-600 hover:text-blue-800">{content.packages_info_link_text || 'Contact us'}</a> {content.packages_info_link_suffix || 'for enterprise pricing.'}</>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

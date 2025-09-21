'use client';

import { ArrowRight, Calendar, Phone, Mail, CheckCircle } from 'lucide-react';

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

interface ServiceDetailCTAProps {
  service: Service;
}

export default function ServiceDetailCTA({ service }: ServiceDetailCTAProps) {
  const benefits = [
    'Free initial consultation',
    'Custom strategy development',
    'Dedicated project manager',
    'Regular progress updates',
    '30-day satisfaction guarantee'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Started with {service.title}?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Take the next step towards achieving your business goals. Our expert team is ready to help you succeed with our {service.title.toLowerCase()} solutions.
            </p>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">What You Get:</h3>
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
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={service.ctaLink || 'https://calendly.com/silviasam91/30min'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
              >
                <Calendar className="mr-3 h-5 w-5" />
                {service.ctaText || 'Schedule Consultation'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200"
              >
                <Phone className="mr-3 h-5 w-5" />
                Call Now
              </a>
            </div>

            {/* Contact Info */}
            <div className="text-blue-200 text-sm">
              <p>Questions? Email us at <a href="mailto:hello@revadops.com" className="text-white hover:text-blue-100">hello@revadops.com</a></p>
              <p className="mt-1">Or call us at <a href="tel:+1234567890" className="text-white hover:text-blue-100">+1 (234) 567-8900</a></p>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get Started Today
                </h3>
                <p className="text-blue-100">
                  Book your free consultation in just a few clicks
                </p>
              </div>

              {/* Process Steps */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-medium">Schedule your consultation</p>
                    <p className="text-blue-200 text-sm">Choose a time that works for you</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-medium">Discuss your needs</p>
                    <p className="text-blue-200 text-sm">Tell us about your goals and challenges</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-medium">Get your custom plan</p>
                    <p className="text-blue-200 text-sm">Receive a tailored strategy proposal</p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-blue-200 text-sm">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-blue-200 text-sm">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

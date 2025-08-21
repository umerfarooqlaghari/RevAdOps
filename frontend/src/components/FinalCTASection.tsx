'use client';

import { ArrowRight, Mail, Phone } from 'lucide-react';

const FinalCTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="cta-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Start Maximizing Your Ad Revenue Today
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
            Whether you&apos;re running a website, mobile app, or video platform, RevAdOps has
            the tools and expertise to take your monetization to the next level.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a
              href="/consultation"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center gap-3 group hover:scale-105"
            >
              Get a Free Consultation
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>

            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center gap-3 group hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </a>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {/* Quick Response */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
              <p className="text-sm opacity-80">Get a response within 24 hours</p>
            </div>

            {/* Free Audit */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Revenue Audit</h3>
              <p className="text-sm opacity-80">Comprehensive analysis at no cost</p>
            </div>

            {/* Expert Support */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-sm opacity-80">Direct access to AdTech specialists</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white border-opacity-20">
            <p className="text-sm opacity-80 mb-4">Trusted by leading publishers worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Placeholder for client logos */}
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-sm font-medium">
                300+ Publishers
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-sm font-medium">
                $50M+ Revenue Optimized
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-sm font-medium">
                50+ Countries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400 bg-opacity-20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400 bg-opacity-20 rounded-full blur-lg"></div>
    </section>
  );
};

export default FinalCTASection;

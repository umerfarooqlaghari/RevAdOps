'use client';

import { ArrowRight, Mail, Bell, BookOpen, Users } from 'lucide-react';
import { useState } from 'react';

interface BlogCTAProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    newsletter_title?: string;
    newsletter_description?: string;
    newsletter_placeholder?: string;
    newsletter_button_text?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
    secondary_cta_text?: string;
    secondary_cta_link?: string;
    background_image?: string;
    stats_1_number?: string;
    stats_1_label?: string;
    stats_2_number?: string;
    stats_2_label?: string;
    stats_3_number?: string;
    stats_3_label?: string;
  };
}

export default function DynamicBlogCTASection({ content }: BlogCTAProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setEmail('');
  };

  const stats = [
    {
      number: content.stats_1_number || '50K+',
      label: content.stats_1_label || 'Newsletter Subscribers',
    },
    {
      number: content.stats_2_number || '200+',
      label: content.stats_2_label || 'Articles Published',
    },
    {
      number: content.stats_3_number || '1M+',
      label: content.stats_3_label || 'Monthly Readers',
    },
  ];

  return (
    <section 
      className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white"
      style={{
        backgroundImage: content.background_image ? `linear-gradient(rgba(30, 58, 138, 0.9), rgba(67, 56, 202, 0.9)), url(${content.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Main CTA Content */}
          <div>
            {content.subtitle && (
              <p className="text-blue-200 font-semibold text-lg mb-4">
                {content.subtitle}
              </p>
            )}
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {content.title || 'Stay Updated with Our Latest Insights'}
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {content.description || 'Get the latest digital marketing tips, strategies, and industry insights delivered straight to your inbox.'}
            </p>

            {/* Newsletter Signup */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <Bell className="h-6 w-6 text-blue-200 mr-3" />
                <h3 className="text-xl font-bold">
                  {content.newsletter_title || 'Subscribe to Our Newsletter'}
                </h3>
              </div>
              
              <p className="text-blue-100 mb-6">
                {content.newsletter_description || 'Join thousands of marketers who trust our insights.'}
              </p>

              {!isSubscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.newsletter_placeholder || 'Enter your email address'}
                    className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    {content.newsletter_button_text || 'Subscribe'}
                    <Mail className="ml-2 h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center text-green-300">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>Thank you for subscribing! Check your email for confirmation.</span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={content.primary_cta_link || '/services'}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
              >
                {content.primary_cta_text || 'Explore Our Services'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              
              {content.secondary_cta_text && (
                <a
                  href={content.secondary_cta_link || '/contact'}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200 group"
                >
                  {content.secondary_cta_text}
                  <BookOpen className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </a>
              )}
            </div>
          </div>

          {/* Stats and Features */}
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3" />
                What You'll Get
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-blue-100">Weekly marketing insights</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-blue-100">Exclusive industry reports</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-blue-100">Early access to new content</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-blue-100">Free marketing templates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

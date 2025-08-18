'use client';

import { Calendar, Clock, CheckCircle, ArrowRight, Users, Award } from 'lucide-react';

interface ConsultationHeroProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    background_image?: string;
    cta_text?: string;
    cta_link?: string;
    duration?: string;
    price?: string;
    features?: string;
    testimonial_text?: string;
    testimonial_author?: string;
    testimonial_company?: string;
  };
}

export default function DynamicConsultationHeroSection({ content }: ConsultationHeroProps) {
  const features = content.features ? content.features.split(',').map(f => f.trim()) : [
    'Free 30-minute consultation',
    'Custom strategy roadmap',
    'Expert recommendations',
    'No obligation'
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
              {content.title || 'Free Marketing Consultation'}
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {content.description || 'Get expert insights and a custom strategy to grow your business. Book your free consultation today.'}
            </p>

            {/* Features */}
            <div className="mb-8">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-blue-100">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Consultation Details */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                <Clock className="h-5 w-5 text-blue-200 mr-2" />
                <span className="text-blue-100">{content.duration || '30 minutes'}</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                <Calendar className="h-5 w-5 text-blue-200 mr-2" />
                <span className="text-blue-100">Available 7 days a week</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                <Award className="h-5 w-5 text-blue-200 mr-2" />
                <span className="text-blue-100">{content.price || 'Completely Free'}</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={content.cta_link || '#consultation-form'}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
              >
                {content.cta_text || 'Book Free Consultation'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>

          <div className="relative">
            {/* Testimonial Card */}
            {content.testimonial_text && (
              <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8">
                <div className="text-gray-900">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-4">
                    "{content.testimonial_text}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{content.testimonial_author}</div>
                      <div className="text-gray-600">{content.testimonial_company}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Why Choose Our Consultation?</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-blue-200 text-sm">Consultations Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <div className="text-blue-200 text-sm">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24h</div>
                  <div className="text-blue-200 text-sm">Average Response</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10+</div>
                  <div className="text-blue-200 text-sm">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

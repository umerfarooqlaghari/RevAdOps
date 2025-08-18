'use client';

import { CheckCircle, Award, Clock, Users } from 'lucide-react';

interface ServicesFeaturesProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    feature_1_title?: string;
    feature_1_description?: string;
    feature_1_icon?: string;
    feature_2_title?: string;
    feature_2_description?: string;
    feature_2_icon?: string;
    feature_3_title?: string;
    feature_3_description?: string;
    feature_3_icon?: string;
    feature_4_title?: string;
    feature_4_description?: string;
    feature_4_icon?: string;
    image?: string;
  };
}

const iconMap: { [key: string]: any } = {
  check: CheckCircle,
  award: Award,
  clock: Clock,
  users: Users,
};

export default function DynamicServicesFeaturesSection({ content }: ServicesFeaturesProps) {
  const features = [
    {
      title: content.feature_1_title || 'Expert Team',
      description: content.feature_1_description || 'Our experienced professionals deliver exceptional results.',
      icon: content.feature_1_icon || 'users',
    },
    {
      title: content.feature_2_title || 'Proven Results',
      description: content.feature_2_description || 'Track record of successful campaigns and satisfied clients.',
      icon: content.feature_2_icon || 'award',
    },
    {
      title: content.feature_3_title || 'Fast Delivery',
      description: content.feature_3_description || 'Quick turnaround times without compromising quality.',
      icon: content.feature_3_icon || 'clock',
    },
    {
      title: content.feature_4_title || 'Quality Assurance',
      description: content.feature_4_description || 'Rigorous testing and optimization for best performance.',
      icon: content.feature_4_icon || 'check',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            {content.subtitle && (
              <p className="text-blue-600 font-semibold text-lg mb-4">
                {content.subtitle}
              </p>
            )}
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {content.title || 'Why Choose Our Services'}
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {content.description || 'We deliver exceptional digital marketing services that drive real results for your business.'}
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || CheckCircle;
                
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            {content.image ? (
              <img
                src={content.image}
                alt="Services Features"
                className="rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
                    <p className="text-blue-100">
                      We're dedicated to helping your business succeed in the digital landscape.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white bg-opacity-20 rounded-lg p-4">
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-sm text-blue-100">Projects Completed</div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-4">
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-sm text-blue-100">Client Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

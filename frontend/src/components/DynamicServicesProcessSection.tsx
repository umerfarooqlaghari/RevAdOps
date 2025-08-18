'use client';

import { ArrowRight, Search, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface ServicesProcessProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    step_1_title?: string;
    step_1_description?: string;
    step_1_icon?: string;
    step_2_title?: string;
    step_2_description?: string;
    step_2_icon?: string;
    step_3_title?: string;
    step_3_description?: string;
    step_3_icon?: string;
    step_4_title?: string;
    step_4_description?: string;
    step_4_icon?: string;
  };
}

const iconMap: { [key: string]: any } = {
  search: Search,
  target: Target,
  trending: TrendingUp,
  check: CheckCircle,
};

export default function DynamicServicesProcessSection({ content }: ServicesProcessProps) {
  const steps = [
    {
      title: content.step_1_title || 'Discovery & Analysis',
      description: content.step_1_description || 'We analyze your business, competitors, and target audience to create a tailored strategy.',
      icon: content.step_1_icon || 'search',
      number: '01',
    },
    {
      title: content.step_2_title || 'Strategy Development',
      description: content.step_2_description || 'Based on our analysis, we develop a comprehensive marketing strategy.',
      icon: content.step_2_icon || 'target',
      number: '02',
    },
    {
      title: content.step_3_title || 'Implementation',
      description: content.step_3_description || 'We execute the strategy with precision and attention to detail.',
      icon: content.step_3_icon || 'trending',
      number: '03',
    },
    {
      title: content.step_4_title || 'Optimization',
      description: content.step_4_description || 'Continuous monitoring and optimization to maximize results.',
      icon: content.step_4_icon || 'check',
      number: '04',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Our Process'}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description || 'We follow a proven methodology to ensure your digital marketing success.'}
          </p>
        </div>

        <div className="relative">
          {/* Process Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || Search;
              
              return (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-blue-200 z-0">
                      <ArrowRight className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                    </div>
                  )}
                  
                  <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 z-10">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                        <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      
                      <div className="text-4xl font-bold text-blue-600 mb-4">
                        {step.number}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16">
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 group"
          >
            Start Your Project
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
}

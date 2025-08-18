'use client';

import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  CheckCircle, 
  Clock,
  Award,
  Lightbulb
} from 'lucide-react';

interface ConsultationBenefitsProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    // Benefits
    benefit_1_title?: string;
    benefit_1_description?: string;
    benefit_1_icon?: string;
    benefit_2_title?: string;
    benefit_2_description?: string;
    benefit_2_icon?: string;
    benefit_3_title?: string;
    benefit_3_description?: string;
    benefit_3_icon?: string;
    benefit_4_title?: string;
    benefit_4_description?: string;
    benefit_4_icon?: string;
    benefit_5_title?: string;
    benefit_5_description?: string;
    benefit_5_icon?: string;
    benefit_6_title?: string;
    benefit_6_description?: string;
    benefit_6_icon?: string;
    // Process steps
    process_title?: string;
    process_description?: string;
    step_1_title?: string;
    step_1_description?: string;
    step_2_title?: string;
    step_2_description?: string;
    step_3_title?: string;
    step_3_description?: string;
    step_4_title?: string;
    step_4_description?: string;
  };
}

const iconMap: { [key: string]: any } = {
  target: Target,
  trending: TrendingUp,
  users: Users,
  chart: BarChart3,
  check: CheckCircle,
  clock: Clock,
  award: Award,
  lightbulb: Lightbulb,
};

export default function DynamicConsultationBenefitsSection({ content }: ConsultationBenefitsProps) {
  const benefits = [
    {
      title: content.benefit_1_title || 'Custom Strategy Development',
      description: content.benefit_1_description || 'Get a tailored marketing strategy designed specifically for your business goals.',
      icon: content.benefit_1_icon || 'target',
    },
    {
      title: content.benefit_2_title || 'Expert Analysis',
      description: content.benefit_2_description || 'Receive professional insights from experienced digital marketing specialists.',
      icon: content.benefit_2_icon || 'chart',
    },
    {
      title: content.benefit_3_title || 'Competitive Research',
      description: content.benefit_3_description || 'Understand your competitive landscape and identify opportunities.',
      icon: content.benefit_3_icon || 'trending',
    },
    {
      title: content.benefit_4_title || 'Actionable Recommendations',
      description: content.benefit_4_description || 'Walk away with clear, actionable steps to improve your marketing.',
      icon: content.benefit_4_icon || 'lightbulb',
    },
    {
      title: content.benefit_5_title || 'No Pressure Approach',
      description: content.benefit_5_description || 'Honest advice with no obligation to purchase our services.',
      icon: content.benefit_5_icon || 'check',
    },
    {
      title: content.benefit_6_title || 'Quick Turnaround',
      description: content.benefit_6_description || 'Get insights and recommendations within 24-48 hours.',
      icon: content.benefit_6_icon || 'clock',
    },
  ];

  const processSteps = [
    {
      title: content.step_1_title || 'Book Your Consultation',
      description: content.step_1_description || 'Schedule a convenient time that works for your schedule.',
      number: '01',
    },
    {
      title: content.step_2_title || 'Discovery Call',
      description: content.step_2_description || 'We discuss your business, goals, and current marketing efforts.',
      number: '02',
    },
    {
      title: content.step_3_title || 'Analysis & Research',
      description: content.step_3_description || 'Our team analyzes your market, competitors, and opportunities.',
      number: '03',
    },
    {
      title: content.step_4_title || 'Strategy Presentation',
      description: content.step_4_description || 'Receive a custom strategy with actionable recommendations.',
      number: '04',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits Section */}
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'What You\'ll Get from Your Consultation'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description || 'Our free consultation provides valuable insights and actionable strategies to help grow your business.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon] || Target;
            
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="bg-gray-50 rounded-3xl p-8 lg:p-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {content.process_title || 'Our Consultation Process'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.process_description || 'A simple, straightforward process designed to maximize value for your time.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-blue-200 z-0"></div>
                )}
                
                <div className="relative bg-white rounded-xl p-8 shadow-lg z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-xl font-bold mb-6">
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
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-blue-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-blue-100 mb-6">
              Book your free consultation today and take the first step towards growing your business.
            </p>
            <a
              href="#consultation-form"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Schedule Your Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

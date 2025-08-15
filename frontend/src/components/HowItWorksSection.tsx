'use client';

import { Search, Settings, TrendingUp, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Audit & Strategy",
      description: "We review your current monetization setup, ad stack, Ad placements as per MRC and traffic sources.",
      color: "bg-blue-500"
    },
    {
      step: "02",
      icon: Settings,
      title: "Implementation",
      description: "We suggest required changes to be involved, configure and optimize your ad serving setup with proven strategies.",
      color: "bg-green-500"
    },
    {
      step: "03",
      icon: TrendingUp,
      title: "Sales Forecasting Monitoring & Growth",
      description: "We track performance in real-time and make continuous improvements to boost your Direct sold sales and programmatic earnings.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our proven 3-step process ensures maximum revenue optimization 
            with minimal disruption to your operations.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines - Hidden on mobile */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-4 border-gray-200 rounded-full mb-6 group-hover:border-blue-500 transition-colors duration-300">
                    <span className="text-xl font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                      {step.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow - Only show between steps on desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 right-0 transform translate-x-6">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of publishers who have already optimized their ad revenue 
              with our proven methodology. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/consultation" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2"
              >
                Start Free Audit
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

'use client';

import { TrendingUp, Shield, Settings, Handshake } from 'lucide-react';

const WhyChooseSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenue Growth Focus",
      description: "Continuous optimization for better CPM, CTR, and fill rates",
      color: "bg-blue-500"
    },
    {
      icon: Shield,
      title: "Compliance First",
      description: "Stay protected from policy violations and ad fraud risks",
      color: "bg-green-500"
    },
    {
      icon: Settings,
      title: "Smooth Operations",
      description: "Systemized and efficiency towards the growth of Digital Publications",
      color: "bg-purple-500"
    },
    {
      icon: Handshake,
      title: "Trusted Partnership",
      description: "Transparent reporting and dedicated support",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Data-Driven, Transparent, and Results-Oriented
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe in measurable results and clear communication. Our team combines over
            a decade of AdTech expertise with powerful analytics tools to help you scale revenue
            without compromising traffic quality or advertiser trust.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Ad Servers & Tools Expertise - ITAO Style */}
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Ad Servers & Tools Expertise
              </h3>

              {/* Skill Bars */}
              <div className="space-y-6">
                {[
                  { skill: "Ad Campaign Setup and Management", percentage: 99 },
                  { skill: "Ad Inventory Optimization", percentage: 98 },
                  { skill: "Ad Trafficking and Scheduling", percentage: 100 },
                  { skill: "Audience Targeting and Segmentation", percentage: 99 },
                  { skill: "Performance Tracking and Reporting", percentage: 100 },
                  { skill: "Ad Technology Integration", percentage: 98 },
                  { skill: "Client Support and Communication", percentage: 100 }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                      <span className="text-sm font-medium text-blue-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4">
                {/* AdTech Tool logos */}
                {[
                  { name: "Google", logo: "https://logo.clearbit.com/google.com" },
                  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
                  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
                  { name: "Adobe", logo: "https://logo.clearbit.com/adobe.com" },
                  { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" },
                  { name: "Oracle", logo: "https://logo.clearbit.com/oracle.com" },
                  { name: "IBM", logo: "https://logo.clearbit.com/ibm.com" },
                  { name: "Shopify", logo: "https://logo.clearbit.com/shopify.com" },
                  { name: "HubSpot", logo: "https://logo.clearbit.com/hubspot.com" }
                ].map((tool, index) => (
                  <div key={index} className="w-20 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-3">
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Proven Results Across the Industry
            </h3>
            <p className="text-lg text-gray-600">
              Our collaboration benefits speak for themselves
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-gray-600 text-sm">Average Revenue Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600 text-sm">Fill Rate Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">300+</div>
              <div className="text-gray-600 text-sm">Publishers Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600 text-sm">Dedicated Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;

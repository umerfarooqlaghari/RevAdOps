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
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Who We Are Section - ITAO Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Who we are
            </h2>
            <p className="text-gray-600 leading-relaxed">
              RevAdOps is committed to delivering exceptional results through experienced hands.
              We possess in-depth knowledge of the digital advertising landscape starting from ad
              trafficking to campaign management through our Skilled experts in all aspects of ad
              operations. When you choose RevAdOps, you gain access to a team that values
              collaboration, creativity, and continuous learning. Together, we work diligently to
              help you navigate the ever-evolving world of online advertising.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt="Who We Are"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
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

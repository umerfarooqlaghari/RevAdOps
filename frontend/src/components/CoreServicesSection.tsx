'use client';

import { Target, TrendingUp, Server, Shield, Users, Lightbulb, Zap } from 'lucide-react';

const CoreServicesSection = () => {
  const coreServices = [
    {
      icon: Target,
      title: "Direct Sales Ad Operations",
      description: "Our dedicated team provides end-to-end support for direct sales ad operations, ensuring a smooth and efficient process from campaign setup to performance analysis. We optimize your direct sales strategy to enhance revenue streams and improve overall ad campaign effectiveness."
    },
    {
      icon: TrendingUp,
      title: "Programmatic Ad Revenue Management",
      description: "Harness the power of programmatic advertising with our expertise in ad revenue management. We employ cutting-edge Hybrid header bidding solutions to elevate your programmatic ad performance, driving increased competition and higher CPMs for your inventory."
    },
    {
      icon: Server,
      title: "White Label Ad Server Management",
      description: "Simplify your ad tech stack with our white label ad server management services. We handle the technical complexities, allowing you to focus on content creation and audience engagement while ensuring seamless ad delivery."
    },
    {
      icon: Shield,
      title: "MCM MA/MI Google AdX Services",
      description: "Navigate the complexities of Google Ad Exchange (AdX) with confidence. Our team specializes in managing Multiple Customer Management (MCM) Manage Account (MA), and Manage Inventory (MI) on Google AdX to optimize your monetization strategy."
    }
  ];

  const strengths = [
    {
      icon: Users,
      title: "Expertise and Dedication",
      description: "Our team consists of seasoned professionals with a wealth of experience in the digital advertising landscape. We are committed to providing expertise-driven solutions tailored to meet your specific needs."
    },
    {
      icon: Lightbulb,
      title: "End-to-End Support",
      description: "From strategy development to implementation and ongoing optimization, we offer comprehensive support throughout the ad operations lifecycle. You can trust us to be your reliable partner in achieving your revenue goals."
    },
    {
      icon: Zap,
      title: "Innovation and Technology",
      description: "Stay ahead in the dynamic digital media landscape with our commitment to innovation. We leverage the latest technologies and industry best practices to ensure your ad operations are at the forefront of the market."
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Core Services
          </h2>
          <p className="text-lg text-gray-600">
            Our Strengths
          </p>
        </div>

        {/* Two Column Layout - ITAO Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Core Services Column */}
          <div className="space-y-8">
            {coreServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strengths Column */}
          <div className="space-y-8">
            {strengths.map((strength, index) => {
              const Icon = strength.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {strength.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {strength.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreServicesSection;

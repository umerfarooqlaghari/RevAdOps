'use client';

import { Target, TrendingUp, Zap, BarChart3 } from 'lucide-react';

const WhatWeDoSection = () => {
  const services = [
    {
      icon: Target,
      title: "Direct Sale Ad Operations",
      description: "A multifaceted process that requires careful planning, tracking, and optimization",
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Supply Side Programmatic Ad Operations",
      description: "A suite of services and practices aimed at efficiently managing",
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Demand Side Programmatic Ad Operations",
      description: "Involves a set of services and strategies designed to effectively plan",
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Three Column Services - ITAO Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <a
                  href="/services"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More
                </a>
              </div>
            );
          })}
        </div>

        {/* Our Services Section - ITAO Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
              alt="Our Services"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Services
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our Service solutions offer to manage and deliver all aspects of online advertising
              campaigns and ad-related processes to achieve specific goals and objectives for
              publishers, advertisers, and other stakeholders precisely and efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;

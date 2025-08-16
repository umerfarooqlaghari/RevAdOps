'use client';

import { Target, TrendingUp, Zap, BarChart3 } from 'lucide-react';

const WhatWeDoSection = () => {
  const highlights = [
    {
      icon: Target,
      title: "Direct-Sold Ad Inventory Management",
      description: "Maximize the value of your premium placements through efficient direct deal execution and reporting.",
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Programmatic Deals",
      description: "Unlock new revenue streams with high-yield PMP, PD, and programmatic guaranteed deals.",
      color: "bg-green-500"
    },
    {
      icon: Zap,
      title: "Header Bidding Solutions",
      description: "Implement both client-side and server-side header bidding to increase competition and boost CPMs.",
      color: "bg-purple-500"
    },
    {
      icon: BarChart3,
      title: "Customized ROI Strategies for Brand Publishers",
      description: "Develop tailored monetization plans that align with your audience, content, and brand objectives.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Your Partner in Smarter Ad Monetization
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            At RevAdOps, we specialize in optimizing web, app, and video monetization strategies
            for publishers worldwide. From Direct sold campaigns, header bidding and programmatic
            deals to traffic quality monitoring and revenue analytics, we handle the complexity
            so you can focus on growing your audience.
          </p>
        </div>

        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${highlight.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
};

export default WhatWeDoSection;

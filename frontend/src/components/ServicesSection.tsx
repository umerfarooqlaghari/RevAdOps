'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Target, Users, TrendingUp, Globe } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Zap,
      title: "Digital Transformation",
      description: "Modernize your business with cutting-edge technology solutions that drive efficiency and growth.",
      features: ["Cloud Migration", "Process Automation", "Digital Strategy"],
      color: "bg-blue-500"
    },
    {
      icon: Shield,
      title: "Cybersecurity Solutions",
      description: "Protect your business with comprehensive security measures and risk management strategies.",
      features: ["Security Audits", "Threat Detection", "Compliance"],
      color: "bg-green-500"
    },
    {
      icon: Target,
      title: "Business Consulting",
      description: "Strategic guidance to optimize operations and achieve sustainable business growth.",
      features: ["Strategy Planning", "Market Analysis", "Performance Optimization"],
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Team Development",
      description: "Build high-performing teams with our comprehensive training and development programs.",
      features: ["Leadership Training", "Skill Development", "Team Building"],
      color: "bg-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Data-driven insights to identify opportunities and accelerate business growth.",
      features: ["Data Analysis", "Performance Metrics", "Growth Strategies"],
      color: "bg-red-500"
    },
    {
      icon: Globe,
      title: "Global Expansion",
      description: "Navigate international markets with our expertise in global business strategies.",
      features: ["Market Entry", "Cultural Adaptation", "Regulatory Compliance"],
      color: "bg-indigo-500"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Professional Services
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We offer comprehensive solutions designed to help your business thrive in today's 
            competitive landscape. Our expert team delivers results that matter.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <Link
                  href="/services"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-2 transition-all duration-200"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss how our services can help you achieve your goals. 
              Get a free consultation with our experts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/services" className="btn-secondary">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

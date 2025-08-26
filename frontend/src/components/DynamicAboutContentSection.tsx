'use client';

import React from 'react';
import { CheckCircle, Target, Users, TrendingUp, Shield } from 'lucide-react';

interface AboutContentProps {
  content: Record<string, string>;
}

export default function DynamicAboutContentSection({ content }: AboutContentProps) {
  const services = [
    {
      icon: Target,
      title: content.service_1_title || 'AdOps for Publishers',
      description: content.service_1_desc || 'Streamlining ad trafficking, campaign management, and reporting.'
    },
    {
      icon: TrendingUp,
      title: content.service_2_title || 'Revenue Optimization',
      description: content.service_2_desc || 'Maximizing yield with data-driven strategies.'
    },
    {
      icon: Shield,
      title: content.service_3_title || 'Programmatic Solutions',
      description: content.service_3_desc || 'Expertise in MCM, GAM, SSPs, and header bidding.'
    },
    {
      icon: Users,
      title: content.service_4_title || 'Publisher Relations',
      description: content.service_4_desc || 'Supporting sustainable, policy-compliant inventory growth.'
    }
  ];

  const achievements = [
    {
      number: content.achievement_1_number || '9000+',
      label: content.achievement_1_label || 'hours worked as a freelancer alongside with AdOps Industry experience'
    },
    {
      number: content.achievement_2_number || '130+',
      label: content.achievement_2_label || 'global clients served with outstanding delivery and long-term partnerships'
    },
    {
      number: content.achievement_3_number || '10+',
      label: content.achievement_3_label || 'years of specialized expertise in Google Ad Manager, Programmatic Monetization, and Publisher AdOps solutions'
    }
  ];

  return (
    <div className="space-y-12">
      {/* About RevAdOps Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {content.about_title || 'About RevAdOps'}
        </h2>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p className="mb-6">
            {content.about_description || 'At RevAdOps, we specialize in providing end-to-end Ad Operations solutions tailored for publishers in the digital media space. Our mission is to empower publishers with seamless ad management, revenue optimization, and transparent reporting to maximize yield from their digital inventory.'}
          </p>
          <p className="mb-6">
            {content.about_expertise || 'We understand the complexities of today\'s programmatic ecosystem—whether it\'s display, video, mobile, or header bidding—and we bring the expertise to simplify operations, safeguard compliance, and ensure sustainable revenue growth. With a focus on quality, performance, and strategic execution, RevAdOps serves as a trusted partner for publishers across the globe.'}
          </p>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {content.services_title || 'Our Services Include:'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h4>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meet Silvia Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {content.director_section_title || 'Meet Silvia – Director of RevAdOps'}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {content.director_description || 'Silvia, the Director of RevAdOps, has been dedicated to Ad Operations for Publishers in Digital Media since 2013. With over a decade of hands-on experience, she has successfully managed operations for publishers of all sizes, ensuring compliance, efficiency, and consistent revenue growth.'}
        </p>
        
        <h4 className="text-xl font-semibold text-gray-900 mb-4">
          {content.achievements_title || 'Her proven track record includes:'}
        </h4>
        
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-600">{achievement.number}</span>
                <span className="text-gray-600 ml-2">{achievement.label}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-600 mt-6 leading-relaxed">
          {content.director_conclusion || 'Silvia\'s leadership is built on a blend of technical expertise and client-first thinking. She is passionate about helping publishers navigate the ever-changing digital advertising landscape while maintaining quality, transparency, and growth.'}
        </p>
      </div>
    </div>
  );
}

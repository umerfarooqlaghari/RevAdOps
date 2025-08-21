'use client';

import Image from 'next/image';

import { CheckCircle, Users, Award, Clock } from 'lucide-react';

interface WhyChooseContent {
  title?: string;
  description?: string;
  reason_1_title?: string;
  reason_1_description?: string;
  reason_1_icon?: string;
  reason_2_title?: string;
  reason_2_description?: string;
  reason_2_icon?: string;
  reason_3_title?: string;
  reason_3_description?: string;
  reason_3_icon?: string;
  reason_4_title?: string;
  reason_4_description?: string;
  reason_4_icon?: string;
}

interface DynamicWhyChooseSectionProps {
  content: WhyChooseContent;
}

const DynamicWhyChooseSection = ({ content }: DynamicWhyChooseSectionProps) => {
  const defaultContent = {
    title: "Why Choose RevAdOps?",
    description: "We combine cutting-edge technology with industry expertise to deliver exceptional results for our clients.",
    reason_1_title: "Proven Results",
    reason_1_description: "Average 40% revenue increase within 90 days of implementation.",
    reason_2_title: "Expert Team",
    reason_2_description: "Dedicated AdTech specialists with 10+ years of industry experience.",
    reason_3_title: "Award-Winning",
    reason_3_description: "Recognized as a leading ad optimization platform by industry experts.",
    reason_4_title: "24/7 Support",
    reason_4_description: "Round-the-clock monitoring and support to ensure optimal performance."
  };

  const sectionData = { ...defaultContent, ...content };

  const reasons = [
    {
      icon: sectionData.reason_1_icon || CheckCircle,
      title: sectionData.reason_1_title,
      description: sectionData.reason_1_description,
      color: "bg-green-500"
    },
    {
      icon: sectionData.reason_2_icon || Users,
      title: sectionData.reason_2_title,
      description: sectionData.reason_2_description,
      color: "bg-blue-500"
    },
    {
      icon: sectionData.reason_3_icon || Award,
      title: sectionData.reason_3_title,
      description: sectionData.reason_3_description,
      color: "bg-purple-500"
    },
    {
      icon: sectionData.reason_4_icon || Clock,
      title: sectionData.reason_4_title,
      description: sectionData.reason_4_description,
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const isImageIcon = typeof reason.icon === 'string';
            const Icon = isImageIcon ? null : reason.icon;

            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${reason.color} rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  {isImageIcon ? (
                    <Image
                      src={reason.icon as string}
                      alt={reason.title}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    Icon && <Icon className="h-8 w-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {reason.title}
                </h3>
                <p className="text-gray-600">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DynamicWhyChooseSection;

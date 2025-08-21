'use client';

import Image from 'next/image';

interface ExpertiseContent {
  title?: string;
  description?: string;
  expertise_1_title?: string;
  expertise_1_description?: string;
  expertise_1_icon?: string;
  expertise_2_title?: string;
  expertise_2_description?: string;
  expertise_2_icon?: string;
  expertise_3_title?: string;
  expertise_3_description?: string;
  expertise_3_icon?: string;
}

interface DynamicExpertiseSectionProps {
  content: ExpertiseContent;
}

const DynamicExpertiseSection = ({ content }: DynamicExpertiseSectionProps) => {
  const defaultContent = {
    title: "Our Expertise",
    description: "Deep knowledge across all major ad platforms and technologies.",
    expertise_1_title: "Programmatic Advertising",
    expertise_1_description: "Advanced programmatic strategies and real-time bidding optimization.",
    expertise_2_title: "Header Bidding",
    expertise_2_description: "Implementation and optimization of header bidding solutions.",
    expertise_3_title: "Ad Quality & Fraud Prevention",
    expertise_3_description: "Comprehensive ad quality control and fraud detection systems."
  };

  const sectionData = { ...defaultContent, ...content };

  const expertiseAreas = [
    {
      title: sectionData.expertise_1_title,
      description: sectionData.expertise_1_description,
      icon: sectionData.expertise_1_icon
    },
    {
      title: sectionData.expertise_2_title,
      description: sectionData.expertise_2_description,
      icon: sectionData.expertise_2_icon
    },
    {
      title: sectionData.expertise_3_title,
      description: sectionData.expertise_3_description,
      icon: sectionData.expertise_3_icon
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseAreas.map((area, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 text-center">
              {area.icon && (
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 mx-auto">
                  <Image
                    src={area.icon}
                    alt={area.title}
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {area.title}
              </h3>
              <p className="text-gray-600">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicExpertiseSection;

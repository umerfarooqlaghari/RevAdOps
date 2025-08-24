'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Target, TrendingUp, Shield } from 'lucide-react';

interface ExpertiseItem {
  title: string;
  description: string;
  icon?: string;
}

interface ExpertiseContent {
  title?: string;
  description?: string;
  items?: ExpertiseItem[];
  // Legacy support for existing data structure
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
  items?: ExpertiseItem[];
}

const DynamicExpertiseSection = ({ content, items }: DynamicExpertiseSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  // Default fallback icons
  const defaultIcons = [Target, TrendingUp, Shield];

  // Build expertise areas from either new format or legacy format
  const expertiseAreas: ExpertiseItem[] = items || content.items || [
    {
      title: sectionData.expertise_1_title || "Programmatic Advertising",
      description: sectionData.expertise_1_description || "Advanced programmatic strategies and real-time bidding optimization.",
      icon: sectionData.expertise_1_icon
    },
    {
      title: sectionData.expertise_2_title || "Header Bidding",
      description: sectionData.expertise_2_description || "Implementation and optimization of header bidding solutions.",
      icon: sectionData.expertise_2_icon
    },
    {
      title: sectionData.expertise_3_title || "Ad Quality & Fraud Prevention",
      description: sectionData.expertise_3_description || "Comprehensive ad quality control and fraud detection systems.",
      icon: sectionData.expertise_3_icon
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(expertiseAreas.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

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

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 group"
                aria-label="Previous expertise items"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 group"
                aria-label="Next expertise items"
              >
                <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </button>
            </>
          )}

          {/* Slider Content */}
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {expertiseAreas
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((area, index) => {
                        const globalIndex = slideIndex * itemsPerSlide + index;
                        const DefaultIcon = defaultIcons[globalIndex % defaultIcons.length];

                        return (
                          <div key={globalIndex} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 mx-auto">
                              {area.icon ? (
                                <Image
                                  src={area.icon}
                                  alt={area.title}
                                  width={32}
                                  height={32}
                                  className="h-8 w-8 object-contain"
                                />
                              ) : (
                                <DefaultIcon className="h-8 w-8 text-white" />
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                              {area.title}
                            </h3>
                            <p className="text-gray-600">
                              {area.description}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicExpertiseSection;

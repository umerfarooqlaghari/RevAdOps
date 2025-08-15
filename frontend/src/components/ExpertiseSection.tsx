'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe, Smartphone, Monitor, Video, BarChart3, Shield, Zap, Target } from 'lucide-react';

const ExpertiseSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const expertise = [
    {
      icon: Globe,
      title: "Web Monetization",
      description: "Optimize display ads, native advertising, and video monetization for websites",
      color: "bg-blue-500"
    },
    {
      icon: Smartphone,
      title: "Mobile App Revenue",
      description: "Maximize in-app advertising revenue with advanced mediation strategies",
      color: "bg-green-500"
    },
    {
      icon: Monitor,
      title: "Programmatic Advertising",
      description: "Advanced programmatic deals, PMPs, and real-time bidding optimization",
      color: "bg-purple-500"
    },
    {
      icon: Video,
      title: "Video Monetization",
      description: "VAST/VPAID implementation, video header bidding, and player optimization",
      color: "bg-red-500"
    },
    {
      icon: BarChart3,
      title: "Revenue Analytics",
      description: "Advanced reporting, forecasting, and performance optimization tools",
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Ad Fraud Protection",
      description: "Comprehensive traffic quality monitoring and fraud prevention systems",
      color: "bg-indigo-500"
    },
    {
      icon: Zap,
      title: "Header Bidding",
      description: "Client-side and server-side header bidding implementation and optimization",
      color: "bg-yellow-500"
    },
    {
      icon: Target,
      title: "Direct Sales Support",
      description: "Campaign management, trafficking, and direct advertiser relationship management",
      color: "bg-pink-500"
    }
  ];

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(expertise.length / itemsPerSlide);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return expertise.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Expertise
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Comprehensive AdTech solutions across all platforms and formats. 
            We bring deep expertise in every aspect of digital advertising monetization.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Expertise Cards */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {expertise.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                        >
                          {/* Icon */}
                          <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>

                          {/* Content */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            With over a decade of experience in AdTech, our team has the knowledge and tools 
            to optimize every aspect of your ad monetization strategy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;

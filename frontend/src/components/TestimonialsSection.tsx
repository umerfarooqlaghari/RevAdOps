'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Mitchell",
      position: "Publisher, TechNews Daily",
      company: "TechNews Daily",
      content: "RevAdOps transformed our ad revenue completely. Their header bidding implementation increased our CPMs by 45% and fill rates improved dramatically. The team's expertise in programmatic advertising is unmatched."
    },
    {
      name: "Michael Rodriguez",
      position: "Head of Monetization, GameHub",
      company: "GameHub",
      content: "Working with RevAdOps was a game-changer for our mobile app monetization. They optimized our mediation setup and implemented advanced bidding strategies that boosted our revenue by 60% within 3 months."
    },
    {
      name: "Emily Chen",
      position: "Digital Director, ContentCorp",
      company: "ContentCorp",
      content: "The programmatic deals and direct sales support from RevAdOps helped us secure premium advertisers and increase our direct sold inventory value by 80%. Their transparent reporting is exceptional."
    },
    {
      name: "David Park",
      position: "CEO, VideoStream Pro",
      company: "VideoStream Pro",
      content: "RevAdOps video monetization expertise helped us implement VAST/VPAID solutions that increased our video ad revenue by 120%. Their fraud protection also improved our traffic quality significantly."
    },
    {
      name: "Lisa Thompson",
      position: "Publisher, LifestyleBlog Network",
      company: "LifestyleBlog Network",
      content: "The revenue analytics and optimization strategies provided by RevAdOps gave us insights we never had before. We optimized our ad placements and increased overall revenue by 55% while maintaining user experience."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Client Feedback
          </h2>
        </div>

        {/* Testimonial Slider - ITAO Style */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12">
            {/* Testimonial Text */}
            <blockquote className="text-lg text-gray-700 leading-relaxed mb-8 italic">
              &ldquo;{currentData.content}&rdquo;
            </blockquote>

            {/* Client Info */}
            <div className="text-right">
              <div className="font-semibold text-gray-900">{currentData.name}</div>
              <div className="text-gray-600">{currentData.position}</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
            </button>

            {/* Indicators */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">300+</div>
            <div className="text-gray-600">Publishers Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">45%</div>
            <div className="text-gray-600">Avg Revenue Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Fill Rate Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Expert Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote, User } from 'lucide-react';

interface TestimonialItem {
  id?: string;
  text: string;
  clientName: string;
  companyName?: string;
  clientImage?: string;
  // Legacy support for existing data structure
  author?: string;
  company?: string;
  logo?: string;
  avatar?: string;
}

interface TestimonialsContent {
  title?: string;
  description?: string;
  items?: TestimonialItem[];
  // Legacy support for existing data structure
  testimonial_1_text?: string;
  testimonial_1_author?: string;
  testimonial_1_company?: string;
  testimonial_1_logo?: string;
  testimonial_1_avatar?: string;
  testimonial_2_text?: string;
  testimonial_2_author?: string;
  testimonial_2_company?: string;
  testimonial_2_logo?: string;
  testimonial_2_avatar?: string;
  testimonial_3_text?: string;
  testimonial_3_author?: string;
  testimonial_3_company?: string;
  testimonial_3_logo?: string;
  testimonial_3_avatar?: string;
}

interface DynamicTestimonialsSectionProps {
  content: TestimonialsContent;
  items?: TestimonialItem[];
  source?: 'homepage' | 'services'; // Determines which API endpoint to use
}

const DynamicTestimonialsSection = ({ content, items, source = 'homepage' }: DynamicTestimonialsSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [apiTestimonials, setApiTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${source}`);
        if (response.ok) {
          const data = await response.json();
          setApiTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [source]);

  const defaultContent = {
    title: "What Our Clients Say",
    description: "Hear from publishers who have transformed their ad revenue with RevAdOps.",
    testimonial_1_text: "RevAdOps increased our ad revenue by 45% in just 3 months. Their team is incredibly knowledgeable and responsive.",
    testimonial_1_author: "Sarah Johnson",
    testimonial_1_company: "TechNews Daily",
    testimonial_2_text: "The fraud detection capabilities saved us thousands in invalid traffic. Highly recommend their services.",
    testimonial_2_author: "Mike Chen",
    testimonial_2_company: "Gaming Hub",
    testimonial_3_text: "Professional service and outstanding results. Our fill rates improved dramatically.",
    testimonial_3_author: "Lisa Rodriguez",
    testimonial_3_company: "Mobile App Co."
  };

  const sectionData = { ...defaultContent, ...content };

  // Build testimonials from API data, passed items, or legacy format
  const testimonials: TestimonialItem[] = apiTestimonials.length > 0
    ? apiTestimonials
    : items || content.items || [
        {
          text: sectionData.testimonial_1_text || "RevAdOps increased our ad revenue by 45% in just 3 months. Their team is incredibly knowledgeable and responsive.",
          clientName: sectionData.testimonial_1_author || "Sarah Johnson",
          companyName: sectionData.testimonial_1_company || "TechNews Daily",
          clientImage: sectionData.testimonial_1_avatar,
          // Legacy support
          author: sectionData.testimonial_1_author || "Sarah Johnson",
          company: sectionData.testimonial_1_company || "TechNews Daily",
          logo: sectionData.testimonial_1_logo,
          avatar: sectionData.testimonial_1_avatar
        },
        {
          text: sectionData.testimonial_2_text || "The fraud detection capabilities saved us thousands in invalid traffic. Highly recommend their services.",
          clientName: sectionData.testimonial_2_author || "Mike Chen",
          companyName: sectionData.testimonial_2_company || "Gaming Hub",
          clientImage: sectionData.testimonial_2_avatar,
          // Legacy support
          author: sectionData.testimonial_2_author || "Mike Chen",
          company: sectionData.testimonial_2_company || "Gaming Hub",
          logo: sectionData.testimonial_2_logo,
          avatar: sectionData.testimonial_2_avatar
        },
        {
          text: sectionData.testimonial_3_text || "Professional service and outstanding results. Our fill rates improved dramatically.",
          clientName: sectionData.testimonial_3_author || "Lisa Rodriguez",
          companyName: sectionData.testimonial_3_company || "Mobile App Co.",
          clientImage: sectionData.testimonial_3_avatar,
          // Legacy support
          author: sectionData.testimonial_3_author || "Lisa Rodriguez",
          company: sectionData.testimonial_3_company || "Mobile App Co.",
          logo: sectionData.testimonial_3_logo,
          avatar: sectionData.testimonial_3_avatar
        }
      ];

  const totalSlides = testimonials.length;

  // Auto-advance slides
  useEffect(() => {
    if (totalSlides > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 6000); // Change slide every 6 seconds

      return () => clearInterval(timer);
    }
  }, [totalSlides]);

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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionData.description}
          </p>
        </div>
      </div>
        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No testimonials available.</p>
            </div>
          ) : (
            <>
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </button>
            </>
          )}

          {/* Slider Content */}
          <div className="overflow-hidden rounded-2xl">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg relative">
                    {/* Quote Icon */}
                    <div className="absolute top-6 left-6 text-blue-600 opacity-20">
                      <Quote className="h-12 w-12" />
                    </div>

                    {/* Company Logo */}
                    {testimonial.logo && (
                      <div className="mb-8 flex justify-center">
                        <Image
                          src={testimonial.logo}
                          alt={`${testimonial.company} logo`}
                          width={150}
                          height={40}
                          className="h-10 object-contain"
                        />
                      </div>
                    )}

                    {/* Testimonial Text */}
                    <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 text-center italic relative z-10">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center justify-center space-x-4">
                      {(testimonial.clientImage || testimonial.avatar) ? (
                        <Image
                          src={testimonial.clientImage || testimonial.avatar || ''}
                          alt={testimonial.clientName || testimonial.author || ''}
                          width={60}
                          height={60}
                          className="w-15 h-15 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div className="text-center">
                        <p className="font-semibold text-gray-900 text-lg">
                          {testimonial.clientName || testimonial.author}
                        </p>
                        {(testimonial.companyName || testimonial.company) && (
                          <p className="text-gray-600">
                            {testimonial.companyName || testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
            </>
          )}
        </div>
      </section>
  );
};

export default DynamicTestimonialsSection;

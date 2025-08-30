'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Target,
  Users,
  TrendingUp,
  Mail,
  BarChart3,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  _count: {
    blogs: number;
  };
}

interface BlogCategoriesProps {
  content: {
    title?: string;
    subtitle?: string;
  };
}

const iconMap: { [key: string]: React.ComponentType<{className?: string}> } = {
  search: Search,
  target: Target,
  users: Users,
  trending: TrendingUp,
  mail: Mail,
  chart: BarChart3,
};

export default function DynamicBlogCategoriesSection({ content }: BlogCategoriesProps) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/categories/all`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayCategories = categories;
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(displayCategories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Don't render the section if there are no categories
  if (!loading && displayCategories.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Browse by Category'}
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 group"
                aria-label="Previous categories"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 group"
                aria-label="Next categories"
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
                    {displayCategories
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((category, index) => {
                        const globalIndex = slideIndex * itemsPerSlide + index;
                        const iconKeys = Object.keys(iconMap);
                        const iconKey = iconKeys[globalIndex % iconKeys.length];
                        const IconComponent = iconMap[iconKey];

                        return (
                          <a
                            key={category.id}
                            href={`/blog/category/${category.slug}`}
                            className="block bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                                <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">{category._count.blogs}</div>
                                <div className="text-sm text-gray-500">Articles</div>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                              {category.name}
                            </h3>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                              Explore articles about {category.name.toLowerCase()} and related topics.
                            </p>

                            <div className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group">
                              View Articles
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </a>
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
}

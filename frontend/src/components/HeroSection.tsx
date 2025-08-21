'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';


const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Unlock Your Ad Revenue Potential with Intelligent Ad Operations",
      subtitle: "RevAdOps helps publishers and app developers maximize revenue, improve fill rates, and maintain healthy traffic quality through advanced AdTech solutions and data-driven optimization.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Get a Free Consultation",
      ctaLink: "/consultation"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-screen bg-white">
      {/* Hero Banner Image - ITAO Style */}
      <div className="relative h-screen">
        <Image
          src={slides[currentSlide].image}
          alt="Hero Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto text-white">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto opacity-90">
                    {slides[currentSlide].subtitle}
                  </p>
                </div>

                {/* Two CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/consultation"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    Get a Free Consultation
                  </Link>
                  <Link
                    href="/solutions"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-md font-semibold transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    Explore Our Solutions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

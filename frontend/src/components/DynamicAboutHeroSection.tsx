'use client';

import React from 'react';

interface AboutHeroProps {
  content: Record<string, string>;
}

export default function DynamicAboutHeroSection({ content }: AboutHeroProps) {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {content.title || 'About RevAdOps'}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
            {content.subtitle || 'Your trusted partner in ad revenue optimization and traffic quality management'}
          </p>
          <div className="w-24 h-1 bg-blue-300 mx-auto"></div>
        </div>
      </div>
    </section>
  );
}

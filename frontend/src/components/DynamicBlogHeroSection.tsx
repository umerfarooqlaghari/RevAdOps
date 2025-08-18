'use client';

import { Search, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface BlogHeroProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    background_image?: string;
    search_placeholder?: string;
    featured_categories?: string;
  };
}

export default function DynamicBlogHeroSection({ content }: BlogHeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = content.featured_categories ? 
    content.featured_categories.split(',').map(c => c.trim()) : 
    ['SEO', 'PPC', 'Social Media', 'Content Marketing'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 lg:py-32"
      style={{
        backgroundImage: content.background_image ? `linear-gradient(rgba(30, 58, 138, 0.8), rgba(67, 56, 202, 0.8)), url(${content.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {content.subtitle && (
            <p className="text-blue-200 text-lg font-medium mb-4">
              {content.subtitle}
            </p>
          )}
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            {content.title || 'Our Blog'}
          </h1>
          
          <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            {content.description || 'Stay updated with the latest digital marketing trends, tips, and insights.'}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={content.search_placeholder || 'Search articles...'}
                  className="w-full pl-12 pr-32 py-4 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Featured Categories */}
          <div className="flex flex-wrap justify-center gap-4">
            <span className="text-blue-200 mr-4">Popular topics:</span>
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white bg-opacity-10 text-blue-100 rounded-full hover:bg-opacity-20 transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

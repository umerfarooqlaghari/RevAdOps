'use client';


import BlogSearch from './BlogSearch';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  tags: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  customUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogHeroProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    background_image?: string;
    search_placeholder?: string;
    featured_categories?: string;
    onSearchResults?: (results: BlogPost[], query: string) => void;
  };
}

export default function DynamicBlogHeroSection({ content }: BlogHeroProps) {

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
          <div className="max-w-2xl mx-auto">
            <BlogSearch
              placeholder={content.search_placeholder || 'Search articles...'}
              onSearchResults={content.onSearchResults || ((results, query) => {
                // Default handling if no onSearchResults provided
                console.log(`Found ${results.length} results for "${query}"`);
              })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

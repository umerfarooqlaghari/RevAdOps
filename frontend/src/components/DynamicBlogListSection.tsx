'use client';

import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';

interface BlogListProps {
  content: {
    title?: string;
    subtitle?: string;
    show_featured?: string;
    posts_per_page?: string;
    // Featured post
    featured_title?: string;
    featured_excerpt?: string;
    featured_image?: string;
    featured_author?: string;
    featured_date?: string;
    featured_category?: string;
    featured_read_time?: string;
    // Regular posts
    post_1_title?: string;
    post_1_excerpt?: string;
    post_1_image?: string;
    post_1_author?: string;
    post_1_date?: string;
    post_1_category?: string;
    post_1_read_time?: string;
    post_2_title?: string;
    post_2_excerpt?: string;
    post_2_image?: string;
    post_2_author?: string;
    post_2_date?: string;
    post_2_category?: string;
    post_2_read_time?: string;
    post_3_title?: string;
    post_3_excerpt?: string;
    post_3_image?: string;
    post_3_author?: string;
    post_3_date?: string;
    post_3_category?: string;
    post_3_read_time?: string;
    post_4_title?: string;
    post_4_excerpt?: string;
    post_4_image?: string;
    post_4_author?: string;
    post_4_date?: string;
    post_4_category?: string;
    post_4_read_time?: string;
    post_5_title?: string;
    post_5_excerpt?: string;
    post_5_image?: string;
    post_5_author?: string;
    post_5_date?: string;
    post_5_category?: string;
    post_5_read_time?: string;
  };
}

export default function DynamicBlogListSection({ content }: BlogListProps) {
  const featuredPost = {
    title: content.featured_title || '10 SEO Strategies That Actually Work in 2024',
    excerpt: content.featured_excerpt || 'Discover the latest SEO techniques that are driving real results for businesses in 2024.',
    image: content.featured_image || '/api/placeholder/800/400',
    author: content.featured_author || 'John Smith',
    date: content.featured_date || '2024-01-15',
    category: content.featured_category || 'SEO',
    readTime: content.featured_read_time || '8 min read',
  };

  const posts = [
    {
      title: content.post_1_title || 'How to Optimize Your PPC Campaigns for Better ROI',
      excerpt: content.post_1_excerpt || 'Learn proven strategies to improve your pay-per-click advertising performance.',
      image: content.post_1_image || '/api/placeholder/400/250',
      author: content.post_1_author || 'Sarah Johnson',
      date: content.post_1_date || '2024-01-12',
      category: content.post_1_category || 'PPC',
      readTime: content.post_1_read_time || '6 min read',
    },
    {
      title: content.post_2_title || 'Social Media Trends to Watch This Year',
      excerpt: content.post_2_excerpt || 'Stay ahead of the curve with these emerging social media marketing trends.',
      image: content.post_2_image || '/api/placeholder/400/250',
      author: content.post_2_author || 'Mike Davis',
      date: content.post_2_date || '2024-01-10',
      category: content.post_2_category || 'Social Media',
      readTime: content.post_2_read_time || '5 min read',
    },
    {
      title: content.post_3_title || 'Email Marketing Best Practices for 2024',
      excerpt: content.post_3_excerpt || 'Boost your email campaign performance with these proven techniques.',
      image: content.post_3_image || '/api/placeholder/400/250',
      author: content.post_3_author || 'Emily Chen',
      date: content.post_3_date || '2024-01-08',
      category: content.post_3_category || 'Email Marketing',
      readTime: content.post_3_read_time || '7 min read',
    },
    {
      title: content.post_4_title || 'Content Marketing Strategy Guide',
      excerpt: content.post_4_excerpt || 'Build a content strategy that drives engagement and conversions.',
      image: content.post_4_image || '/api/placeholder/400/250',
      author: content.post_4_author || 'David Wilson',
      date: content.post_4_date || '2024-01-05',
      category: content.post_4_category || 'Content Marketing',
      readTime: content.post_4_read_time || '9 min read',
    },
    {
      title: content.post_5_title || 'Analytics and Data-Driven Marketing',
      excerpt: content.post_5_excerpt || 'Use data to make smarter marketing decisions and improve results.',
      image: content.post_5_image || '/api/placeholder/400/250',
      author: content.post_5_author || 'Lisa Brown',
      date: content.post_5_date || '2024-01-03',
      category: content.post_5_category || 'Analytics',
      readTime: content.post_5_read_time || '6 min read',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Latest Articles'}
          </h2>
        </div>

        {/* Featured Post */}
        {content.show_featured !== 'false' && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="ml-3 text-blue-600 font-medium">{featuredPost.category}</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center text-gray-500 mb-6">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{featuredPost.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="mr-4">{featuredPost.date}</span>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                  
                  <a
                    href="#"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group"
                  >
                    Read Full Article
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
                
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, parseInt(content.posts_per_page || '6')).map((post, index) => (
            <article key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-3">{post.date}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                
                <a
                  href="#"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
}

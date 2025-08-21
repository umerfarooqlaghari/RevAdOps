'use client';

import { 
  Search, 
  Target, 
  Users, 
  TrendingUp, 
  Mail, 
  BarChart3,
  ArrowRight 
} from 'lucide-react';

interface BlogCategoriesProps {
  content: {
    title?: string;
    subtitle?: string;
    category_1_name?: string;
    category_1_description?: string;
    category_1_icon?: string;
    category_1_count?: string;
    category_2_name?: string;
    category_2_description?: string;
    category_2_icon?: string;
    category_2_count?: string;
    category_3_name?: string;
    category_3_description?: string;
    category_3_icon?: string;
    category_3_count?: string;
    category_4_name?: string;
    category_4_description?: string;
    category_4_icon?: string;
    category_4_count?: string;
    category_5_name?: string;
    category_5_description?: string;
    category_5_icon?: string;
    category_5_count?: string;
    category_6_name?: string;
    category_6_description?: string;
    category_6_icon?: string;
    category_6_count?: string;
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
  const categories = [
    {
      name: content.category_1_name || 'SEO & Search Marketing',
      description: content.category_1_description || 'Learn about search engine optimization and search marketing strategies.',
      icon: content.category_1_icon || 'search',
      count: content.category_1_count || '24',
    },
    {
      name: content.category_2_name || 'PPC & Advertising',
      description: content.category_2_description || 'Discover paid advertising strategies and campaign optimization tips.',
      icon: content.category_2_icon || 'target',
      count: content.category_2_count || '18',
    },
    {
      name: content.category_3_name || 'Social Media Marketing',
      description: content.category_3_description || 'Social media strategies, trends, and best practices.',
      icon: content.category_3_icon || 'users',
      count: content.category_3_count || '32',
    },
    {
      name: content.category_4_name || 'Content Marketing',
      description: content.category_4_description || 'Content creation, strategy, and distribution insights.',
      icon: content.category_4_icon || 'trending',
      count: content.category_4_count || '28',
    },
    {
      name: content.category_5_name || 'Email Marketing',
      description: content.category_5_description || 'Email campaign strategies and automation techniques.',
      icon: content.category_5_icon || 'mail',
      count: content.category_5_count || '15',
    },
    {
      name: content.category_6_name || 'Analytics & Data',
      description: content.category_6_description || 'Data analysis, reporting, and performance optimization.',
      icon: content.category_6_icon || 'chart',
      count: content.category_6_count || '21',
    },
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon] || Search;
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                    <div className="text-sm text-gray-500">Articles</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 group">
                  View Articles
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

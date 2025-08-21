'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Save, Eye, Image as ImageIcon, Type, Video, Link, Hash, Clock } from 'lucide-react';

interface ServicesContent {
  services_hero: ContentItem[];
  services_list: ContentItem[];
  services_features: ContentItem[];
  services_process: ContentItem[];
  services_cta: ContentItem[];
}

interface ContentItem {
  section: string;
  key: string;
  value: string;
  type: string;
  metadata?: Record<string, unknown>;
  order?: number;
}

export default function ServicesAdminPage() {
  const [content, setContent] = useState<ServicesContent>({
    services_hero: [],
    services_list: [],
    services_features: [],
    services_process: [],
    services_cta: []
  });
  const [activeSection, setActiveSection] = useState('services_hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Default content structure for services
  const defaultContent: ServicesContent = useMemo(() => ({
    services_hero: [
      { section: 'services_hero', key: 'title', value: 'Our Services', type: 'text', order: 1 },
      { section: 'services_hero', key: 'subtitle', value: 'Digital Marketing Solutions', type: 'text', order: 2 },
      { section: 'services_hero', key: 'description', value: 'Comprehensive digital marketing solutions to grow your business.', type: 'textarea', order: 3 },
      { section: 'services_hero', key: 'background_image', value: '', type: 'image', order: 4 },
      { section: 'services_hero', key: 'cta_text', value: 'View Our Services', type: 'text', order: 5 },
      { section: 'services_hero', key: 'cta_link', value: '#services', type: 'text', order: 6 },
      { section: 'services_hero', key: 'features', value: 'Expert Team, Proven Results, 24/7 Support', type: 'text', order: 7 },
    ],
    services_list: [
      { section: 'services_list', key: 'title', value: 'Our Services', type: 'text', order: 1 },
      { section: 'services_list', key: 'subtitle', value: 'What We Offer', type: 'text', order: 2 },
      { section: 'services_list', key: 'service_1_title', value: 'SEO Optimization', type: 'text', order: 3 },
      { section: 'services_list', key: 'service_1_description', value: 'Improve your search engine rankings and drive organic traffic.', type: 'textarea', order: 4 },
      { section: 'services_list', key: 'service_1_icon', value: 'search', type: 'text', order: 5 },
      { section: 'services_list', key: 'service_2_title', value: 'PPC Advertising', type: 'text', order: 6 },
      { section: 'services_list', key: 'service_2_description', value: 'Targeted advertising campaigns that deliver results.', type: 'textarea', order: 7 },
      { section: 'services_list', key: 'service_2_icon', value: 'target', type: 'text', order: 8 },
      { section: 'services_list', key: 'service_3_title', value: 'Social Media Marketing', type: 'text', order: 9 },
      { section: 'services_list', key: 'service_3_description', value: 'Build your brand presence across social platforms.', type: 'textarea', order: 10 },
      { section: 'services_list', key: 'service_3_icon', value: 'users', type: 'text', order: 11 },
      { section: 'services_list', key: 'service_4_title', value: 'Email Marketing', type: 'text', order: 12 },
      { section: 'services_list', key: 'service_4_description', value: 'Engage your audience with personalized email campaigns.', type: 'textarea', order: 13 },
      { section: 'services_list', key: 'service_4_icon', value: 'mail', type: 'text', order: 14 },
      { section: 'services_list', key: 'service_5_title', value: 'Content Marketing', type: 'text', order: 15 },
      { section: 'services_list', key: 'service_5_description', value: 'Create compelling content that converts visitors into customers.', type: 'textarea', order: 16 },
      { section: 'services_list', key: 'service_5_icon', value: 'trending', type: 'text', order: 17 },
      { section: 'services_list', key: 'service_6_title', value: 'Analytics & Reporting', type: 'text', order: 18 },
      { section: 'services_list', key: 'service_6_description', value: 'Track performance and optimize your marketing strategy.', type: 'textarea', order: 19 },
      { section: 'services_list', key: 'service_6_icon', value: 'chart', type: 'text', order: 20 },
    ],
    services_features: [
      { section: 'services_features', key: 'title', value: 'Why Choose Our Services', type: 'text', order: 1 },
      { section: 'services_features', key: 'subtitle', value: 'Our Advantages', type: 'text', order: 2 },
      { section: 'services_features', key: 'description', value: 'We deliver exceptional digital marketing services that drive real results for your business.', type: 'textarea', order: 3 },
      { section: 'services_features', key: 'feature_1_title', value: 'Expert Team', type: 'text', order: 4 },
      { section: 'services_features', key: 'feature_1_description', value: 'Our experienced professionals deliver exceptional results.', type: 'textarea', order: 5 },
      { section: 'services_features', key: 'feature_1_icon', value: 'users', type: 'text', order: 6 },
      { section: 'services_features', key: 'feature_2_title', value: 'Proven Results', type: 'text', order: 7 },
      { section: 'services_features', key: 'feature_2_description', value: 'Track record of successful campaigns and satisfied clients.', type: 'textarea', order: 8 },
      { section: 'services_features', key: 'feature_2_icon', value: 'award', type: 'text', order: 9 },
      { section: 'services_features', key: 'feature_3_title', value: 'Fast Delivery', type: 'text', order: 10 },
      { section: 'services_features', key: 'feature_3_description', value: 'Quick turnaround times without compromising quality.', type: 'textarea', order: 11 },
      { section: 'services_features', key: 'feature_3_icon', value: 'clock', type: 'text', order: 12 },
      { section: 'services_features', key: 'feature_4_title', value: 'Quality Assurance', type: 'text', order: 13 },
      { section: 'services_features', key: 'feature_4_description', value: 'Rigorous testing and optimization for best performance.', type: 'textarea', order: 14 },
      { section: 'services_features', key: 'feature_4_icon', value: 'check', type: 'text', order: 15 },
      { section: 'services_features', key: 'image', value: '', type: 'image', order: 16 },
    ],
    services_process: [
      { section: 'services_process', key: 'title', value: 'Our Process', type: 'text', order: 1 },
      { section: 'services_process', key: 'subtitle', value: 'How We Work', type: 'text', order: 2 },
      { section: 'services_process', key: 'description', value: 'We follow a proven methodology to ensure your digital marketing success.', type: 'textarea', order: 3 },
      { section: 'services_process', key: 'step_1_title', value: 'Discovery & Analysis', type: 'text', order: 4 },
      { section: 'services_process', key: 'step_1_description', value: 'We analyze your business, competitors, and target audience to create a tailored strategy.', type: 'textarea', order: 5 },
      { section: 'services_process', key: 'step_1_icon', value: 'search', type: 'text', order: 6 },
      { section: 'services_process', key: 'step_2_title', value: 'Strategy Development', type: 'text', order: 7 },
      { section: 'services_process', key: 'step_2_description', value: 'Based on our analysis, we develop a comprehensive marketing strategy.', type: 'textarea', order: 8 },
      { section: 'services_process', key: 'step_2_icon', value: 'target', type: 'text', order: 9 },
      { section: 'services_process', key: 'step_3_title', value: 'Implementation', type: 'text', order: 10 },
      { section: 'services_process', key: 'step_3_description', value: 'We execute the strategy with precision and attention to detail.', type: 'textarea', order: 11 },
      { section: 'services_process', key: 'step_3_icon', value: 'trending', type: 'text', order: 12 },
      { section: 'services_process', key: 'step_4_title', value: 'Optimization', type: 'text', order: 13 },
      { section: 'services_process', key: 'step_4_description', value: 'Continuous monitoring and optimization to maximize results.', type: 'textarea', order: 14 },
      { section: 'services_process', key: 'step_4_icon', value: 'check', type: 'text', order: 15 },
    ],
    services_cta: [
      { section: 'services_cta', key: 'title', value: 'Ready to Grow Your Business?', type: 'text', order: 1 },
      { section: 'services_cta', key: 'subtitle', value: 'Get Started Today', type: 'text', order: 2 },
      { section: 'services_cta', key: 'description', value: 'Let\'s discuss how our services can help you achieve your digital marketing goals.', type: 'textarea', order: 3 },
      { section: 'services_cta', key: 'primary_cta_text', value: 'Get Started Now', type: 'text', order: 4 },
      { section: 'services_cta', key: 'primary_cta_link', value: '#contact', type: 'text', order: 5 },
      { section: 'services_cta', key: 'secondary_cta_text', value: 'Free Consultation', type: 'text', order: 6 },
      { section: 'services_cta', key: 'secondary_cta_link', value: '#consultation', type: 'text', order: 7 },
      { section: 'services_cta', key: 'background_image', value: '', type: 'image', order: 8 },
      { section: 'services_cta', key: 'phone', value: '+1 (555) 123-4567', type: 'text', order: 9 },
      { section: 'services_cta', key: 'email', value: 'hello@revadops.com', type: 'text', order: 10 },
      { section: 'services_cta', key: 'features', value: 'Free Consultation, Custom Strategy, Proven Results', type: 'text', order: 11 },
    ],
  }), []);

  const fetchServicesContent = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      const data = await response.json();
      
      // Extract services content and merge with defaults
      const apiContent = {
        services_hero: data.services_hero || {},
        services_list: data.services_list || {},
        services_features: data.services_features || {},
        services_process: data.services_process || {},
        services_cta: data.services_cta || {}
      };

      // Merge API content with defaults
      const mergedContent: ServicesContent = {} as ServicesContent;
      Object.keys(defaultContent).forEach(section => {
        mergedContent[section as keyof ServicesContent] = defaultContent[section as keyof ServicesContent].map(item => ({
          ...item,
          value: apiContent[section as keyof typeof apiContent]?.[item.key] || item.value
        }));
      });

      setContent(mergedContent);
    } catch (error) {
      console.error('Error fetching services content:', error);
      setContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  }, [defaultContent]);

  useEffect(() => {
    fetchServicesContent();
  }, [fetchServicesContent]);

  const handleContentChange = (section: string, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: prev[section as keyof ServicesContent].map(item =>
        item.key === key ? { ...item, value } : item
      )
    }));
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');

      // Prepare updates for bulk update API
      const updates: Array<{section: string; key: string; value: string; type: string; metadata?: Record<string, unknown>; order?: number}> = [];

      Object.entries(content).forEach(([section, items]) => {
        items.forEach((item: ContentItem) => {
          updates.push({
            section: section,
            key: item.key,
            value: item.value,
            type: item.type,
            metadata: item.metadata || {},
            order: item.order || 0
          });
        });
      });

      // Use the bulk update API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/homepage/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });

      if (response.ok) {
        alert('Services content saved successfully!');
        
        // Refresh content to show updated values
        await fetchServicesContent();
      } else {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        alert('Failed to save content: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'services_hero', name: 'Hero Section', icon: ImageIcon },
    { id: 'services_list', name: 'Services List', icon: Type },
    { id: 'services_features', name: 'Features', icon: Hash },
    { id: 'services_process', name: 'Process', icon: Clock },
    { id: 'services_cta', name: 'Call to Action', icon: Link },
  ];

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'textarea': return Type;
      default: return Type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Services Page Management</h1>
          <p className="mt-2 text-gray-600">Manage content for the services page sections</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {section.name}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={saveContent}
                disabled={isSaving}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save All Changes'}
              </button>

              <a
                href="/services"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Page
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {sections.find(s => s.id === activeSection)?.name} Settings
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {content[activeSection as keyof ServicesContent]?.map((item) => {
                const FieldIcon = getFieldIcon(item.type);
                
                return (
                  <div key={`${item.section}-${item.key}`} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      <FieldIcon className="inline mr-2 h-4 w-4" />
                      {item.key.replace(/_/g, ' ')}
                    </label>
                    
                    {item.type === 'textarea' ? (
                      <textarea
                        value={item.value}
                        onChange={(e) => handleContentChange(activeSection, item.key, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter ${item.key.replace(/_/g, ' ')}`}
                      />
                    ) : item.type === 'image' ? (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={item.value}
                          onChange={(e) => handleContentChange(activeSection, item.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter image URL"
                        />
                        {item.value && (
                          <div className="mt-2">
                            <Image
                              src={item.value}
                              alt="Preview"
                              width={200}
                              height={128}
                              className="max-w-xs h-32 object-cover rounded-md border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleContentChange(activeSection, item.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter ${item.key.replace(/_/g, ' ')}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

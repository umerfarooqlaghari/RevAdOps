'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Upload,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  Type,
  Video
} from 'lucide-react';
import DragDropUpload from '@/components/DragDropUpload';

interface ContentItem {
  id?: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'video' | 'json';
  metadata?: any;
  order?: number;
}

interface HomepageContent {
  [key: string]: ContentItem[];
  header: ContentItem[];
  hero: ContentItem[];
  what_we_do: ContentItem[];
  why_choose_us: ContentItem[];
  how_it_works: ContentItem[];
  our_expertise: ContentItem[];
  testimonials: ContentItem[];
  partners: ContentItem[];
  final_cta: ContentItem[];
  footer: ContentItem[];
}

export default function HomepageAdmin() {
  const [content, setContent] = useState<HomepageContent>({
    header: [],
    hero: [],
    what_we_do: [],
    why_choose_us: [],
    how_it_works: [],
    our_expertise: [],
    testimonials: [],
    partners: [],
    final_cta: [],
    footer: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      // Try to fetch existing content from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let apiContent = {};
      if (response.ok) {
        apiContent = await response.json();
      }

      // Default content structure
      const defaultContent: HomepageContent = {
        header: [
          { section: 'header', key: 'logo', value: '/logo-placeholder.svg', type: 'image' },
          { section: 'header', key: 'logo_alt', value: 'RevAdOps Logo', type: 'text' },
          { section: 'header', key: 'company_name', value: 'RevAdOps', type: 'text' }
        ],
        hero: [
          { section: 'hero', key: 'title', value: 'Unlock Your Ad Revenue Potential with Intelligent Ad Operations', type: 'text' },
          { section: 'hero', key: 'subtitle', value: 'RevAdOps helps publishers and app developers maximize revenue, improve fill rates, and maintain healthy traffic quality through advanced AdTech solutions and data-driven optimization.', type: 'text' },
          { section: 'hero', key: 'background_image', value: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', type: 'image' },
          { section: 'hero', key: 'cta_primary_text', value: 'Get a Free Consultation', type: 'text' },
          { section: 'hero', key: 'cta_primary_link', value: '/consultation', type: 'text' },
          { section: 'hero', key: 'cta_secondary_text', value: 'Explore Our Solutions', type: 'text' },
          { section: 'hero', key: 'cta_secondary_link', value: '/solutions', type: 'text' }
        ],
        what_we_do: [
          { section: 'what_we_do', key: 'title', value: 'Your Partner in Smarter Ad Monetization', type: 'text' },
          { section: 'what_we_do', key: 'description', value: 'At RevAdOps, we specialize in optimizing web, app, and video monetization strategies for publishers worldwide. From Direct sold campaigns, header bidding and programmatic deals to traffic quality monitoring and revenue analytics, we handle the complexity so you can focus on growing your audience.', type: 'text' },
          { section: 'what_we_do', key: 'service_1_title', value: 'Revenue Optimization', type: 'text' },
          { section: 'what_we_do', key: 'service_1_description', value: 'Advanced algorithms and real-time bidding strategies to maximize your ad revenue potential.', type: 'text' },
          { section: 'what_we_do', key: 'service_1_icon', value: '', type: 'image' },
          { section: 'what_we_do', key: 'service_2_title', value: 'Ad Quality Control', type: 'text' },
          { section: 'what_we_do', key: 'service_2_description', value: 'Comprehensive filtering and monitoring to ensure only high-quality ads reach your audience.', type: 'text' },
          { section: 'what_we_do', key: 'service_2_icon', value: '', type: 'image' },
          { section: 'what_we_do', key: 'service_3_title', value: 'Performance Analytics', type: 'text' },
          { section: 'what_we_do', key: 'service_3_description', value: 'Detailed insights and reporting to track performance and identify optimization opportunities.', type: 'text' },
          { section: 'what_we_do', key: 'service_3_icon', value: '', type: 'image' },
          { section: 'what_we_do', key: 'service_4_title', value: 'Traffic Protection', type: 'text' },
          { section: 'what_we_do', key: 'service_4_description', value: 'Advanced fraud detection and prevention to protect your traffic quality and advertiser relationships.', type: 'text' },
          { section: 'what_we_do', key: 'service_4_icon', value: '', type: 'image' }
        ],
        why_choose_us: [
          { section: 'why_choose_us', key: 'title', value: 'Why Choose RevAdOps?', type: 'text' },
          { section: 'why_choose_us', key: 'description', value: 'We combine cutting-edge technology with industry expertise to deliver exceptional results for our clients.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_1_title', value: 'Proven Results', type: 'text' },
          { section: 'why_choose_us', key: 'reason_1_description', value: 'Average 40% revenue increase within 90 days of implementation.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_1_icon', value: '', type: 'image' },
          { section: 'why_choose_us', key: 'reason_2_title', value: 'Expert Team', type: 'text' },
          { section: 'why_choose_us', key: 'reason_2_description', value: 'Dedicated AdTech specialists with 10+ years of industry experience.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_2_icon', value: '', type: 'image' },
          { section: 'why_choose_us', key: 'reason_3_title', value: 'Award-Winning', type: 'text' },
          { section: 'why_choose_us', key: 'reason_3_description', value: 'Recognized as a leading ad optimization platform by industry experts.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_3_icon', value: '', type: 'image' },
          { section: 'why_choose_us', key: 'reason_4_title', value: '24/7 Support', type: 'text' },
          { section: 'why_choose_us', key: 'reason_4_description', value: 'Round-the-clock monitoring and support to ensure optimal performance.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_4_icon', value: '', type: 'image' }
        ],
        how_it_works: [
          { section: 'how_it_works', key: 'title', value: 'How It Works', type: 'text' },
          { section: 'how_it_works', key: 'description', value: 'Our streamlined process ensures quick implementation and immediate results.', type: 'text' },
          { section: 'how_it_works', key: 'step_1_title', value: 'Analysis', type: 'text' },
          { section: 'how_it_works', key: 'step_1_description', value: 'We analyze your current ad setup and identify optimization opportunities.', type: 'text' },
          { section: 'how_it_works', key: 'step_1_icon', value: '', type: 'image' },
          { section: 'how_it_works', key: 'step_2_title', value: 'Strategy', type: 'text' },
          { section: 'how_it_works', key: 'step_2_description', value: 'Develop a customized optimization strategy based on your specific needs.', type: 'text' },
          { section: 'how_it_works', key: 'step_2_icon', value: '', type: 'image' },
          { section: 'how_it_works', key: 'step_3_title', value: 'Implementation', type: 'text' },
          { section: 'how_it_works', key: 'step_3_description', value: 'Deploy our solutions with minimal disruption to your current operations.', type: 'text' },
          { section: 'how_it_works', key: 'step_3_icon', value: '', type: 'image' },
          { section: 'how_it_works', key: 'step_4_title', value: 'Optimization', type: 'text' },
          { section: 'how_it_works', key: 'step_4_description', value: 'Continuous monitoring and optimization to maximize your revenue potential.', type: 'text' },
          { section: 'how_it_works', key: 'step_4_icon', value: '', type: 'image' }
        ],
        our_expertise: [
          { section: 'our_expertise', key: 'title', value: 'Our Expertise', type: 'text' },
          { section: 'our_expertise', key: 'description', value: 'Deep knowledge across all major ad platforms and technologies.', type: 'text' },
          { section: 'our_expertise', key: 'expertise_1_title', value: 'Programmatic Advertising', type: 'text' },
          { section: 'our_expertise', key: 'expertise_1_description', value: 'Advanced programmatic strategies and real-time bidding optimization.', type: 'text' },
          { section: 'our_expertise', key: 'expertise_1_icon', value: '', type: 'image' },
          { section: 'our_expertise', key: 'expertise_2_title', value: 'Header Bidding', type: 'text' },
          { section: 'our_expertise', key: 'expertise_2_description', value: 'Implementation and optimization of header bidding solutions.', type: 'text' },
          { section: 'our_expertise', key: 'expertise_2_icon', value: '', type: 'image' },
          { section: 'our_expertise', key: 'expertise_3_title', value: 'Ad Quality & Fraud Prevention', type: 'text' },
          { section: 'our_expertise', key: 'expertise_3_description', value: 'Comprehensive ad quality control and fraud detection systems.', type: 'text' },
          { section: 'our_expertise', key: 'expertise_3_icon', value: '', type: 'image' }
        ],
        testimonials: [
          { section: 'testimonials', key: 'title', value: 'What Our Clients Say', type: 'text' },
          { section: 'testimonials', key: 'description', value: 'Hear from publishers who have transformed their ad revenue with RevAdOps.', type: 'text' },
          { section: 'testimonials', key: 'testimonial_1_text', value: 'RevAdOps increased our ad revenue by 45% in just 3 months. Their team is incredibly knowledgeable and responsive.', type: 'text' },
          { section: 'testimonials', key: 'testimonial_1_author', value: 'Sarah Johnson', type: 'text' },
          { section: 'testimonials', key: 'testimonial_1_company', value: 'TechNews Daily', type: 'text' },
          { section: 'testimonials', key: 'testimonial_1_logo', value: '', type: 'image' },
          { section: 'testimonials', key: 'testimonial_1_avatar', value: '', type: 'image' },
          { section: 'testimonials', key: 'testimonial_2_text', value: 'The fraud detection capabilities saved us thousands in invalid traffic. Highly recommend their services.', type: 'text' },
          { section: 'testimonials', key: 'testimonial_2_author', value: 'Mike Chen', type: 'text' },
          { section: 'testimonials', key: 'testimonial_2_company', value: 'Gaming Hub', type: 'text' },
          { section: 'testimonials', key: 'testimonial_2_logo', value: '', type: 'image' },
          { section: 'testimonials', key: 'testimonial_2_avatar', value: '', type: 'image' },
          { section: 'testimonials', key: 'testimonial_3_text', value: 'Professional service and outstanding results. Our fill rates improved dramatically.', type: 'text' },
          { section: 'testimonials', key: 'testimonial_3_author', value: 'Lisa Rodriguez', type: 'text' },
          { section: 'testimonials', key: 'testimonial_3_company', value: 'Mobile App Co.', type: 'text' },
          { section: 'testimonials', key: 'testimonial_3_logo', value: '', type: 'image' },
          { section: 'testimonials', key: 'testimonial_3_avatar', value: '', type: 'image' }
        ],
        partners: [
          { section: 'partners', key: 'title', value: 'Trusted by Leading Publishers', type: 'text' },
          { section: 'partners', key: 'description', value: 'Join hundreds of successful publishers who trust RevAdOps for their ad revenue optimization.', type: 'text' },
          { section: 'partners', key: 'partner_1_logo', value: '', type: 'image' },
          { section: 'partners', key: 'partner_1_name', value: 'Partner 1', type: 'text' },
          { section: 'partners', key: 'partner_2_logo', value: '', type: 'image' },
          { section: 'partners', key: 'partner_2_name', value: 'Partner 2', type: 'text' },
          { section: 'partners', key: 'partner_3_logo', value: '', type: 'image' },
          { section: 'partners', key: 'partner_3_name', value: 'Partner 3', type: 'text' },
          { section: 'partners', key: 'partner_4_logo', value: '', type: 'image' },
          { section: 'partners', key: 'partner_4_name', value: 'Partner 4', type: 'text' },
          { section: 'partners', key: 'partner_5_logo', value: '', type: 'image' },
          { section: 'partners', key: 'partner_5_name', value: 'Partner 5', type: 'text' },
          { section: 'partners', key: 'partner_6_logo', value: '', type: 'image' },
          { section: 'partners', key: 'partner_6_name', value: 'Partner 6', type: 'text' }
        ],
        final_cta: [
          { section: 'final_cta', key: 'title', value: 'Ready to Maximize Your Ad Revenue?', type: 'text' },
          { section: 'final_cta', key: 'description', value: 'Join hundreds of publishers who have increased their revenue with RevAdOps. Get started with a free consultation today.', type: 'text' },
          { section: 'final_cta', key: 'cta_primary_text', value: 'Get Free Consultation', type: 'text' },
          { section: 'final_cta', key: 'cta_primary_link', value: '/consultation', type: 'text' },
          { section: 'final_cta', key: 'cta_secondary_text', value: 'Contact Us', type: 'text' },
          { section: 'final_cta', key: 'cta_secondary_link', value: '/contact', type: 'text' }
        ],
        footer: [
          { section: 'footer', key: 'logo', value: '/logo-placeholder.svg', type: 'image' },
          { section: 'footer', key: 'logo_alt', value: 'RevAdOps Logo', type: 'text' },
          { section: 'footer', key: 'company_description', value: 'RevAdOps - Your trusted partner in ad revenue optimization and traffic quality management.', type: 'text' },
          { section: 'footer', key: 'facebook_icon', value: '', type: 'image' },
          { section: 'footer', key: 'facebook_link', value: '#', type: 'text' },
          { section: 'footer', key: 'twitter_icon', value: '', type: 'image' },
          { section: 'footer', key: 'twitter_link', value: '#', type: 'text' },
          { section: 'footer', key: 'linkedin_icon', value: '', type: 'image' },
          { section: 'footer', key: 'linkedin_link', value: '#', type: 'text' },
          { section: 'footer', key: 'instagram_icon', value: '', type: 'image' },
          { section: 'footer', key: 'instagram_link', value: '#', type: 'text' },
          { section: 'footer', key: 'copyright_text', value: '© 2024 RevAdOps. All rights reserved.', type: 'text' }
        ]
      };

      // Merge API content with defaults
      const mergedContent: HomepageContent = {};
      Object.keys(defaultContent).forEach(section => {
        mergedContent[section] = defaultContent[section].map(item => ({
          ...item,
          value: apiContent[section]?.[item.key] || item.value
        }));
      });

      setContent(mergedContent);
    } catch (error) {
      console.error('Failed to fetch homepage content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (section: string, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: prev[section as keyof HomepageContent].map(item =>
        item.key === key ? { ...item, value } : item
      )
    }));
  };

  const handleImageUpload = async (section: string, key: string, file: File) => {
    setUploadingImage(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', section);
      formData.append('key', key);
      formData.append('maxWidth', '2000');
      formData.append('maxHeight', '2000');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        handleContentChange(section, key, data.url);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');

      // Prepare updates for bulk update API
      const updates: any[] = [];

      Object.entries(content).forEach(([section, items]) => {
        items.forEach(item => {
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

      // Use the existing bulk update API (PUT method)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/homepage/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });

      if (response.ok) {
        alert('Content saved successfully!');

        // Refresh content to show updated values
        await fetchHomepageContent();
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
    { id: 'header', name: 'Header & Logo', icon: ImageIcon },
    { id: 'hero', name: 'Hero Section', icon: ImageIcon },
    { id: 'what_we_do', name: 'What We Do', icon: Type },
    { id: 'why_choose_us', name: 'Why Choose Us', icon: Type },
    { id: 'how_it_works', name: 'How It Works', icon: Type },
    { id: 'our_expertise', name: 'Our Expertise', icon: Type },
    { id: 'testimonials', name: 'Testimonials', icon: Type },
    { id: 'partners', name: 'Partners & Clients', icon: ImageIcon },
    { id: 'final_cta', name: 'Final CTA', icon: Type },
    { id: 'footer', name: 'Footer & Social', icon: ImageIcon }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
          <p className="text-gray-600">Manage your homepage content and images</p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </a>
          <button
            onClick={saveContent}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
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
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Edit {sections.find(s => s.id === activeSection)?.name}
            </h3>

            <div className="space-y-6">
              {content[activeSection as keyof HomepageContent]?.map((item, index) => (
                <div key={`${item.section}-${item.key}`} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {item.key.replace(/_/g, ' ')}
                  </label>
                  
                  {item.type === 'text' && (
                    item.key.includes('description') || item.key.includes('subtitle') ? (
                      <textarea
                        value={item.value}
                        onChange={(e) => handleContentChange(item.section, item.key, e.target.value)}
                        rows={4}
                        className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                        placeholder={`Enter ${item.key.replace(/_/g, ' ')}`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleContentChange(item.section, item.key, e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                        placeholder={`Enter ${item.key.replace(/_/g, ' ')}`}
                      />
                    )
                  )}

                  {item.type === 'image' && (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={item.value}
                        onChange={(e) => handleContentChange(item.section, item.key, e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                        placeholder="Enter image URL or upload from computer below"
                      />

                      <div className="text-center text-sm text-gray-500 py-2">
                        OR
                      </div>

                      <DragDropUpload
                        onUpload={(file) => handleImageUpload(item.section, item.key, file)}
                        currentImage={item.value}
                        onRemove={() => handleContentChange(item.section, item.key, '')}
                        disabled={uploadingImage}
                        maxSize={5}
                        className="w-full"
                      />

                      {uploadingImage && (
                        <div className="flex items-center justify-center space-x-2 text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm">Uploading image...</span>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Recommended: Max 2000x2000px, under 5MB. Images will be optimized automatically.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

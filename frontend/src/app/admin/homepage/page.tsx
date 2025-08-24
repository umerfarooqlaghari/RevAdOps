'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Type, Upload, Image as ImageIcon, Plus, Trash2, Target, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface ContentItem {
  id?: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'image';
  metadata?: Record<string, unknown>;
  order?: number;
}

interface ExpertiseItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface TestimonialItem {
  id?: string;
  text: string;
  author: string;
  company: string;
  avatar?: string;
  order: number;
}

interface HomepageContent {
  [key: string]: ContentItem[];
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
    final_cta: [],
    footer: []
  });
  const [originalContent, setOriginalContent] = useState<HomepageContent>({});
  const [expertiseItems, setExpertiseItems] = useState<ExpertiseItem[]>([]);
  const [testimonialItems, setTestimonialItems] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      // Fetch regular content
      const contentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      let apiContent: Record<string, Record<string, string>> = {};
      if (contentResponse.ok) {
        apiContent = await contentResponse.json();
      }

      // Fetch expertise items
      const expertiseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/expertise`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      let expertiseData: ExpertiseItem[] = [];
      if (expertiseResponse.ok) {
        const expertiseResult = await expertiseResponse.json();
        expertiseData = expertiseResult.items || [];
      }

      // Fetch testimonials
      const testimonialsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      let testimonialsData: TestimonialItem[] = [];
      if (testimonialsResponse.ok) {
        const testimonialsResult = await testimonialsResponse.json();
        testimonialsData = testimonialsResult.items || [];
      }

      // Default content structure (text only, no images)
      const defaultContent: HomepageContent = {
        header: [
          { section: 'header', key: 'company_name', value: 'RevAdOps', type: 'text' }
        ],
        hero: [
          { section: 'hero', key: 'title', value: 'Unlock Your Ad Revenue Potential with Intelligent Ad Operations', type: 'text' },
          { section: 'hero', key: 'subtitle', value: 'RevAdOps helps publishers and app developers maximize revenue, improve fill rates, and maintain healthy traffic quality through advanced AdTech solutions and data-driven optimization.', type: 'text' },
          { section: 'hero', key: 'background_image', value: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80', type: 'image' },
          { section: 'hero', key: 'cta_primary_text', value: 'Get a Free Consultation', type: 'text' },
          { section: 'hero', key: 'cta_primary_link', value: '/consultation', type: 'text' },
          { section: 'hero', key: 'cta_secondary_text', value: 'Explore Our Solutions', type: 'text' },
          { section: 'hero', key: 'cta_secondary_link', value: '/solutions', type: 'text' }
        ],
        what_we_do: [
          { section: 'what_we_do', key: 'title', value: 'Your Partner in Smarter Ad Monetization', type: 'text' },
          { section: 'what_we_do', key: 'description', value: 'At RevAdOps, we specialize in optimizing web, app, and video monetization strategies for publishers worldwide.', type: 'text' },
          { section: 'what_we_do', key: 'service_1_title', value: 'Revenue Optimization', type: 'text' },
          { section: 'what_we_do', key: 'service_1_description', value: 'Advanced algorithms and real-time bidding strategies to maximize your ad revenue potential.', type: 'text' },
          { section: 'what_we_do', key: 'service_2_title', value: 'Ad Quality Control', type: 'text' },
          { section: 'what_we_do', key: 'service_2_description', value: 'Comprehensive filtering and monitoring to ensure only high-quality ads reach your audience.', type: 'text' },
          { section: 'what_we_do', key: 'service_3_title', value: 'Performance Analytics', type: 'text' },
          { section: 'what_we_do', key: 'service_3_description', value: 'Detailed insights and reporting to track performance and identify optimization opportunities.', type: 'text' },
          { section: 'what_we_do', key: 'service_4_title', value: 'Traffic Protection', type: 'text' },
          { section: 'what_we_do', key: 'service_4_description', value: 'Advanced fraud detection and prevention to protect your traffic quality and advertiser relationships.', type: 'text' }
        ],
        why_choose_us: [
          { section: 'why_choose_us', key: 'title', value: 'Why Choose RevAdOps?', type: 'text' },
          { section: 'why_choose_us', key: 'description', value: 'We combine cutting-edge technology with industry expertise to deliver exceptional results for our clients.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_1_title', value: 'Proven Results', type: 'text' },
          { section: 'why_choose_us', key: 'reason_1_description', value: 'Average 40% revenue increase within 90 days of implementation.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_2_title', value: 'Expert Team', type: 'text' },
          { section: 'why_choose_us', key: 'reason_2_description', value: 'Dedicated AdTech specialists with 10+ years of industry experience.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_3_title', value: 'Award-Winning', type: 'text' },
          { section: 'why_choose_us', key: 'reason_3_description', value: 'Recognized as a leading ad optimization platform by industry experts.', type: 'text' },
          { section: 'why_choose_us', key: 'reason_4_title', value: '24/7 Support', type: 'text' },
          { section: 'why_choose_us', key: 'reason_4_description', value: 'Round-the-clock monitoring and support to ensure optimal performance.', type: 'text' }
        ],
        how_it_works: [
          { section: 'how_it_works', key: 'title', value: 'How It Works', type: 'text' },
          { section: 'how_it_works', key: 'description', value: 'Our streamlined process ensures quick implementation and immediate results.', type: 'text' },
          { section: 'how_it_works', key: 'step_1_title', value: 'Analysis', type: 'text' },
          { section: 'how_it_works', key: 'step_1_description', value: 'We analyze your current ad setup and identify optimization opportunities.', type: 'text' },
          { section: 'how_it_works', key: 'step_2_title', value: 'Strategy', type: 'text' },
          { section: 'how_it_works', key: 'step_2_description', value: 'Develop a customized optimization strategy based on your specific needs.', type: 'text' },
          { section: 'how_it_works', key: 'step_3_title', value: 'Implementation', type: 'text' },
          { section: 'how_it_works', key: 'step_3_description', value: 'Deploy our solutions with minimal disruption to your current operations.', type: 'text' },
          { section: 'how_it_works', key: 'step_4_title', value: 'Optimization', type: 'text' },
          { section: 'how_it_works', key: 'step_4_description', value: 'Continuous monitoring and optimization to maximize your revenue potential.', type: 'text' }
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
          { section: 'testimonials', key: 'testimonial_2_text', value: 'The fraud detection capabilities saved us thousands in invalid traffic. Highly recommend their services.', type: 'text' },
          { section: 'testimonials', key: 'testimonial_2_author', value: 'Mike Chen', type: 'text' },
          { section: 'testimonials', key: 'testimonial_2_company', value: 'Gaming Hub', type: 'text' },
          { section: 'testimonials', key: 'testimonial_3_text', value: 'Professional service and outstanding results. Our fill rates improved dramatically.', type: 'text' },
          { section: 'testimonials', key: 'testimonial_3_author', value: 'Lisa Rodriguez', type: 'text' },
          { section: 'testimonials', key: 'testimonial_3_company', value: 'Mobile App Co.', type: 'text' }
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
          { section: 'footer', key: 'company_description', value: 'RevAdOps - Your trusted partner in ad revenue optimization and traffic quality management.', type: 'text' },
          { section: 'footer', key: 'linkedin_link', value: 'https://linkedin.com/company/revadops', type: 'text' },
          { section: 'footer', key: 'upwork_link', value: 'https://upwork.com/agencies/revadops', type: 'text' },
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
      setOriginalContent(JSON.parse(JSON.stringify(mergedContent))); // Deep copy for comparison
      setExpertiseItems(expertiseData);
      setTestimonialItems(testimonialsData);
    } catch (error) {
      console.error('Failed to fetch homepage content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (section: string, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.key === key ? { ...item, value } : item
      )
    }));
  };

  // Expertise management functions
  const addExpertiseItem = () => {
    const newItem: ExpertiseItem = {
      title: '',
      description: '',
      icon: '',
      order: expertiseItems.length + 1
    };
    setExpertiseItems(prev => [...prev, newItem]);
  };

  const updateExpertiseItem = (index: number, field: keyof ExpertiseItem, value: string | number) => {
    setExpertiseItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const deleteExpertiseItem = (index: number) => {
    setExpertiseItems(prev => prev.filter((_, i) => i !== index));
  };

  // Testimonials management functions
  const addTestimonialItem = () => {
    const newItem: TestimonialItem = {
      text: '',
      author: '',
      company: '',
      avatar: '',
      order: testimonialItems.length + 1
    };
    setTestimonialItems(prev => [...prev, newItem]);
  };

  const updateTestimonialItem = (index: number, field: keyof TestimonialItem, value: string | number) => {
    setTestimonialItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const deleteTestimonialItem = (index: number) => {
    setTestimonialItems(prev => prev.filter((_, i) => i !== index));
  };

  // Handle expertise icon upload
  const handleExpertiseImageUpload = async (index: number, file: File) => {
    const uploadKey = `expertise-${index}-icon`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', 'expertise');
      formData.append('key', `expertise_${index}_icon`);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        updateExpertiseItem(index, 'icon', result.url);
      } else {
        console.error('Image upload failed');
        alert('Image upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Handle testimonial avatar upload
  const handleTestimonialImageUpload = async (index: number, file: File) => {
    const uploadKey = `testimonial-${index}-avatar`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', 'testimonials');
      formData.append('key', `testimonial_${index}_avatar`);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        updateTestimonialItem(index, 'avatar', result.url);
      } else {
        console.error('Image upload failed');
        alert('Image upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const handleImageUpload = async (section: string, key: string, file: File) => {
    const uploadKey = `${section}-${key}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', section);
      formData.append('key', key);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        handleContentChange(section, key, result.url);
      } else {
        console.error('Image upload failed');
        alert('Image upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');

      // Save regular content updates
      const updates: Array<{section: string; key: string; value: string; type: string; metadata?: Record<string, unknown>; order?: number}> = [];

      // Only save items that have changed
      Object.entries(content).forEach(([section, items]) => {
        items.forEach(item => {
          const originalItem = originalContent[section]?.find(orig => orig.key === item.key);
          if (!originalItem || originalItem.value !== item.value) {
            updates.push({
              section: item.section,
              key: item.key,
              value: item.value,
              type: item.type,
              metadata: item.metadata || {},
              order: item.order || 0
            });
          }
        });
      });

      // Save regular content if there are updates
      if (updates.length > 0) {
        const contentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/homepage/bulk`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ updates }),
        });

        if (!contentResponse.ok) {
          const errorData = await contentResponse.json();
          console.error('Content save error:', errorData);
          alert('Failed to save content: ' + (errorData.message || 'Unknown error'));
          return;
        }
      }

      // Save expertise items
      const expertiseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/expertise/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items: expertiseItems }),
      });

      if (!expertiseResponse.ok) {
        const errorData = await expertiseResponse.json();
        console.error('Expertise save error:', errorData);
        alert('Failed to save expertise: ' + (errorData.message || 'Unknown error'));
        return;
      }

      // Save testimonials
      const testimonialsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items: testimonialItems }),
      });

      if (!testimonialsResponse.ok) {
        const errorData = await testimonialsResponse.json();
        console.error('Testimonials save error:', errorData);
        alert('Failed to save testimonials: ' + (errorData.message || 'Unknown error'));
        return;
      }

      alert('All content saved successfully!');
      await fetchHomepageContent();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'header', name: 'Header', icon: Type },
    { id: 'hero', name: 'Hero Section', icon: Type },
    { id: 'what_we_do', name: 'What We Do', icon: Type },
    { id: 'why_choose_us', name: 'Why Choose Us', icon: Type },
    { id: 'how_it_works', name: 'How It Works', icon: Type },
    { id: 'our_expertise', name: 'Our Expertise', icon: Target },
    { id: 'testimonials', name: 'Testimonials', icon: MessageSquare },
    { id: 'final_cta', name: 'Final CTA', icon: Type },
    { id: 'footer', name: 'Footer & Social', icon: Type }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
          <p className="text-gray-600">Manage your homepage content (images are now static)</p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </a>
          <button
            onClick={saveContent}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {section.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {sections.find(s => s.id === activeSection)?.name}
            </h3>

            {/* Special handling for Our Expertise section */}
            {activeSection === 'our_expertise' ? (
              <div className="space-y-6">
                {/* Section Title and Description */}
                {content.our_expertise?.filter(item => item.key === 'title' || item.key === 'description').map((item) => (
                  <div key={`${item.section}-${item.key}`} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {item.key.replace(/_/g, ' ')}
                    </label>
                    {item.key.includes('description') ? (
                      <textarea
                        value={item.value}
                        onChange={(e) => handleContentChange(item.section, item.key, e.target.value)}
                        rows={3}
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
                    )}
                  </div>
                ))}

                {/* Dynamic Expertise Items */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Expertise Items</h4>
                    <button
                      onClick={addExpertiseItem}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New
                    </button>
                  </div>

                  <div className="space-y-4">
                    {expertiseItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium text-gray-700">Expertise Item {index + 1}</h5>
                          <button
                            onClick={() => deleteExpertiseItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateExpertiseItem(index, 'title', e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                              placeholder="Enter expertise title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateExpertiseItem(index, 'description', e.target.value)}
                              rows={2}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                              placeholder="Enter expertise description"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Icon</label>

                            {/* Current Icon Preview */}
                            {item.icon && (
                              <div className="mt-2 mb-3">
                                <div className="relative w-16 h-16 border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                                  <Image
                                    src={item.icon}
                                    alt="Expertise icon"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Upload and URL Input */}
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                  <Upload className="h-4 w-4 mr-2" />
                                  {uploadingImages[`expertise-${index}-icon`] ? 'Uploading...' : 'Upload Icon'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleExpertiseImageUpload(index, file);
                                      }
                                    }}
                                    disabled={uploadingImages[`expertise-${index}-icon`]}
                                  />
                                </label>
                                <span className="text-sm text-gray-500">or</span>
                              </div>

                              <input
                                type="url"
                                value={item.icon}
                                onChange={(e) => updateExpertiseItem(index, 'icon', e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Enter icon URL (64x64 pixels recommended)"
                              />

                              <p className="text-xs text-gray-500">
                                Recommended: 64x64 pixels, PNG with transparent background, under 50KB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeSection === 'testimonials' ? (
              <div className="space-y-6">
                {/* Section Title and Description */}
                {content.testimonials?.filter(item => item.key === 'title' || item.key === 'description').map((item) => (
                  <div key={`${item.section}-${item.key}`} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {item.key.replace(/_/g, ' ')}
                    </label>
                    {item.key.includes('description') ? (
                      <textarea
                        value={item.value}
                        onChange={(e) => handleContentChange(item.section, item.key, e.target.value)}
                        rows={3}
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
                    )}
                  </div>
                ))}

                {/* Dynamic Testimonial Items */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Testimonial Items</h4>
                    <button
                      onClick={addTestimonialItem}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New
                    </button>
                  </div>

                  <div className="space-y-4">
                    {testimonialItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium text-gray-700">Testimonial {index + 1}</h5>
                          <button
                            onClick={() => deleteTestimonialItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Testimonial Text</label>
                            <textarea
                              value={item.text}
                              onChange={(e) => updateTestimonialItem(index, 'text', e.target.value)}
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                              placeholder="Enter testimonial text"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Author Name</label>
                              <input
                                type="text"
                                value={item.author}
                                onChange={(e) => updateTestimonialItem(index, 'author', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Enter author name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">Company</label>
                              <input
                                type="text"
                                value={item.company}
                                onChange={(e) => updateTestimonialItem(index, 'company', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Enter company name"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Author Avatar (Optional)</label>

                            {/* Current Avatar Preview */}
                            {item.avatar && (
                              <div className="mt-2 mb-3">
                                <div className="relative w-16 h-16 border border-gray-300 rounded-full overflow-hidden bg-gray-50">
                                  <Image
                                    src={item.avatar}
                                    alt="Author avatar"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Upload and URL Input */}
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                  <Upload className="h-4 w-4 mr-2" />
                                  {uploadingImages[`testimonial-${index}-avatar`] ? 'Uploading...' : 'Upload Avatar'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleTestimonialImageUpload(index, file);
                                      }
                                    }}
                                    disabled={uploadingImages[`testimonial-${index}-avatar`]}
                                  />
                                </label>
                                <span className="text-sm text-gray-500">or</span>
                              </div>

                              <input
                                type="url"
                                value={item.avatar || ''}
                                onChange={(e) => updateTestimonialItem(index, 'avatar', e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Enter avatar URL (optional)"
                              />

                              <p className="text-xs text-gray-500">
                                Recommended: 100x100 pixels, square image, under 100KB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular content sections */
              <div className="space-y-6">
                {content[activeSection as keyof HomepageContent]?.map((item) => (
                  <div key={`${item.section}-${item.key}`} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {item.key.replace(/_/g, ' ')}
                    </label>

                    {item.type === 'image' ? (
                      <div className="space-y-3">
                        {/* Current Image Preview */}
                        {item.value && (
                          <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                            <Image
                              src={item.value}
                              alt={item.key.replace(/_/g, ' ')}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Image Upload */}
                        <div className="flex items-center space-x-3">
                          <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImages[`${item.section}-${item.key}`] ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(item.section, item.key, file);
                                }
                              }}
                              disabled={uploadingImages[`${item.section}-${item.key}`]}
                            />
                          </label>

                          {/* Image URL Input */}
                          <input
                            type="url"
                            value={item.value}
                            onChange={(e) => handleContentChange(item.section, item.key, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                            placeholder="Or enter image URL"
                          />
                        </div>

                        {/* Recommended Dimensions */}
                        {item.key === 'background_image' && (
                          <p className="text-xs text-gray-500">
                            Recommended: 1920x1080 pixels (16:9 aspect ratio), under 500KB
                          </p>
                        )}
                        {item.key === 'logo' && (
                          <p className="text-xs text-gray-500">
                            Recommended: 300x100 pixels (3:1 aspect ratio), PNG with transparent background, under 100KB
                          </p>
                        )}
                      </div>
                    ) : item.key.includes('description') || item.key.includes('subtitle') ? (
                      <textarea
                        value={item.value}
                        onChange={(e) => handleContentChange(item.section, item.key, e.target.value)}
                        rows={3}
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
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

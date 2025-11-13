/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Type, Upload, Image as ImageIcon, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ContentItem {
  id?: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'image';
  metadata?: Record<string, unknown>;
  order?: number;
}

interface ContactContent {
  [key: string]: ContentItem[];
}

export default function ContactAdmin() {
  const [content, setContent] = useState<ContactContent>({
    hero: [],
    info: [],
    form: []
  });
  const [originalContent, setOriginalContent] = useState<ContactContent>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      // Fetch content
      const contentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      let apiContent: Record<string, Record<string, string>> = {};
      if (contentResponse.ok) {
        apiContent = await contentResponse.json();
      }

      // Default content structure
      const defaultContent: ContactContent = {
        hero: [
          { section: 'contact_hero', key: 'title', value: 'Get in Touch', type: 'text' },
          { section: 'contact_hero', key: 'subtitle', value: 'Contact Us', type: 'text' },
          { section: 'contact_hero', key: 'description', value: 'Ready to maximize your ad revenue? Let\'s discuss your specific needs and how we can help.', type: 'text' },
          { section: 'contact_hero', key: 'phone', value: '+1 (555) 123-4567', type: 'text' },
          { section: 'contact_hero', key: 'email', value: 'hello@revadops.com', type: 'text' },
          { section: 'contact_hero', key: 'address', value: '123 Business St, Suite 100, City, State 12345', type: 'text' },
          { section: 'contact_hero', key: 'hours', value: 'Mon-Fri: 9AM-6PM EST', type: 'text' },
          { section: 'contact_hero', key: 'background_image', value: '', type: 'image' }
        ],
        info: [
          { section: 'contact_info', key: 'title', value: 'Multiple Ways to Reach Us', type: 'text' },
          { section: 'contact_info', key: 'subtitle', value: 'Contact Information', type: 'text' },
          { section: 'contact_info', key: 'description', value: 'Choose the most convenient way to get in touch with our team.', type: 'text' },
          // Office 1
          { section: 'contact_info', key: 'office_1_name', value: 'Main Office', type: 'text' },
          { section: 'contact_info', key: 'office_1_address', value: '123 Business Street, Suite 100\nNew York, NY 10001', type: 'text' },
          { section: 'contact_info', key: 'office_1_phone', value: '+1 (555) 123-4567', type: 'text' },
          { section: 'contact_info', key: 'office_1_email', value: 'ny@revadops.com', type: 'text' },
          // Office 2
          { section: 'contact_info', key: 'office_2_name', value: 'West Coast Office', type: 'text' },
          { section: 'contact_info', key: 'office_2_address', value: '456 Innovation Ave, Floor 5\nSan Francisco, CA 94105', type: 'text' },
          { section: 'contact_info', key: 'office_2_phone', value: '+1 (555) 987-6543', type: 'text' },
          { section: 'contact_info', key: 'office_2_email', value: 'sf@revadops.com', type: 'text' },
          // Office 3
          { section: 'contact_info', key: 'office_3_name', value: 'European Office', type: 'text' },
          { section: 'contact_info', key: 'office_3_address', value: '789 Tech Park, Building C\nLondon, UK EC1A 1BB', type: 'text' },
          { section: 'contact_info', key: 'office_3_phone', value: '+44 20 1234 5678', type: 'text' },
          { section: 'contact_info', key: 'office_3_email', value: 'london@revadops.com', type: 'text' },
          // Support
          { section: 'contact_info', key: 'support_title', value: 'Need Help?', type: 'text' },
          { section: 'contact_info', key: 'support_description', value: 'Our support team is here to assist you with any questions or concerns.', type: 'text' },
          { section: 'contact_info', key: 'support_hours', value: 'Mon-Fri: 9AM-6PM EST', type: 'text' },
          { section: 'contact_info', key: 'support_phone', value: '+1 (555) 123-4567', type: 'text' },
          { section: 'contact_info', key: 'support_email', value: 'support@revadops.com', type: 'text' },
          // Features
          { section: 'contact_info', key: 'feature_1_title', value: '24/7 Support', type: 'text' },
          { section: 'contact_info', key: 'feature_1_description', value: 'Round-the-clock assistance for all your needs.', type: 'text' },
          { section: 'contact_info', key: 'feature_2_title', value: 'Expert Team', type: 'text' },
          { section: 'contact_info', key: 'feature_2_description', value: 'Experienced professionals ready to help.', type: 'text' },
          { section: 'contact_info', key: 'feature_3_title', value: 'Quick Response', type: 'text' },
          { section: 'contact_info', key: 'feature_3_description', value: 'Fast response times to your inquiries.', type: 'text' },
          { section: 'contact_info', key: 'feature_4_title', value: 'Proven Results', type: 'text' },
          { section: 'contact_info', key: 'feature_4_description', value: 'Track record of successful partnerships.', type: 'text' }
        ],
        form: [
          { section: 'contact_form', key: 'title', value: 'Send Us a Message', type: 'text' },
          { section: 'contact_form', key: 'subtitle', value: 'Get in Touch', type: 'text' },
          { section: 'contact_form', key: 'description', value: 'Fill out the form below and we\'ll get back to you as soon as possible.', type: 'text' },
          { section: 'contact_form', key: 'form_title', value: 'Get in Touch', type: 'text' },
          { section: 'contact_form', key: 'form_description', value: 'Tell us about your project and how we can help.', type: 'text' },
          { section: 'contact_form', key: 'name_placeholder', value: 'Your full name', type: 'text' },
          { section: 'contact_form', key: 'email_placeholder', value: 'your@email.com', type: 'text' },
          { section: 'contact_form', key: 'phone_placeholder', value: '+1 (555) 123-4567', type: 'text' },
          { section: 'contact_form', key: 'company_placeholder', value: 'Your company name', type: 'text' },
          { section: 'contact_form', key: 'subject_placeholder', value: 'What can we help you with?', type: 'text' },
          { section: 'contact_form', key: 'message_placeholder', value: 'Tell us more about your project...', type: 'text' },
          { section: 'contact_form', key: 'submit_button_text', value: 'Send Message', type: 'text' },
          { section: 'contact_form', key: 'success_message', value: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.', type: 'text' }
        ]
      };

      // Merge API content with defaults
      const mergedContent: ContactContent = {};
      Object.keys(defaultContent).forEach(section => {
        mergedContent[section] = defaultContent[section].map(item => ({
          ...item,
          value: apiContent[item.section]?.[item.key] || item.value
        }));
      });

      setContent(mergedContent);
      setOriginalContent(JSON.parse(JSON.stringify(mergedContent)));
    } catch (error) {
      console.error('Error fetching contact content:', error);
      toast.error('Failed to load contact content');
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

  const handleImageUpload = async (section: string, key: string, file: File) => {
    const uploadKey = `${section}-${key}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      handleContentChange(section, key, data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const hasChanges = () => {
    return JSON.stringify(content) !== JSON.stringify(originalContent);
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      toast.success('No changes to save');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const updates: any[] = [];

      // Collect all changes
      Object.keys(content).forEach(section => {
        content[section].forEach(item => {
          const originalItem = originalContent[section]?.find(i => i.key === item.key);
          if (!originalItem || originalItem.value !== item.value) {
            updates.push({
              section: item.section,
              key: item.key,
              value: item.value,
              type: item.type
            });
          }
        });
      });

      // Send updates to backend
      for (const update of updates) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/${update.section}/${update.key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            value: update.value,
            type: update.type
          })
        });
      }

      setOriginalContent(JSON.parse(JSON.stringify(content)));
      toast.success('Contact page content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (hasChanges() && confirm('Are you sure you want to discard all changes?')) {
      setContent(JSON.parse(JSON.stringify(originalContent)));
      toast.success('Changes discarded');
    }
  };

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: Type },
    { id: 'info', name: 'Contact Info', icon: Phone },
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Page Management</h1>
          <p className="text-gray-700">Manage content for the Contact Us page</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              const timestamp = new Date().getTime();
              window.open(`/contact?t=${timestamp}`, '_blank');
            }}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges() || isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
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

            <div className="space-y-6">
              {content[activeSection]?.map((item) => (
                <div key={`${item.section}-${item.key}`} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {item.key.replace(/_/g, ' ')}
                  </label>

                  {item.type === 'text' ? (
                    item.key.includes('description') || item.key.includes('address') || item.key.includes('message') ? (
                      <textarea
                        value={item.value}
                        onChange={(e) => handleContentChange(activeSection, item.key, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleContentChange(activeSection, item.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    )
                  ) : (
                    <div className="space-y-2">
                      {item.value && (
                        <div className="relative w-full h-48 rounded-md overflow-hidden">
                          <Image
                            src={item.value}
                            alt={item.key}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(activeSection, item.key, file);
                          }}
                          className="hidden"
                          id={`upload-${item.section}-${item.key}`}
                        />
                        <label
                          htmlFor={`upload-${item.section}-${item.key}`}
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingImages[`${activeSection}-${item.key}`] ? 'Uploading...' : 'Upload Image'}
                        </label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => handleContentChange(activeSection, item.key, e.target.value)}
                          placeholder="Or enter image URL"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>
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

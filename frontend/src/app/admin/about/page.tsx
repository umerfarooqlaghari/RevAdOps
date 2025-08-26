/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Type, Upload, Image as ImageIcon, User, FileText } from 'lucide-react';
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

interface AboutContent {
  [key: string]: ContentItem[];
}

export default function AboutAdmin() {
  const [content, setContent] = useState<AboutContent>({
    hero: [],
    director: [],
    about_content: []
  });
  const [originalContent, setOriginalContent] = useState<AboutContent>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
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
      const defaultContent: AboutContent = {
        hero: [
          { section: 'about_hero', key: 'title', value: 'About RevAdOps', type: 'text' },
          { section: 'about_hero', key: 'subtitle', value: 'Your trusted partner in ad revenue optimization and traffic quality management', type: 'text' }
        ],
        director: [
          { section: 'about_director', key: 'name', value: 'Silvia', type: 'text' },
          { section: 'about_director', key: 'title', value: 'Director of RevAdOps', type: 'text' },
          { section: 'about_director', key: 'brief', value: 'Dedicated to Ad Operations for Publishers in Digital Media since 2013', type: 'text' },
          { section: 'about_director', key: 'photo', value: '/placeholder-director.jpg', type: 'image' },
          { section: 'about_director', key: 'experience', value: '9000+ hours', type: 'text' },
          { section: 'about_director', key: 'clients', value: '130+ global clients', type: 'text' },
          { section: 'about_director', key: 'specialization', value: 'GAM & Programmatic', type: 'text' }
        ],
        about_content: [
          { section: 'about_content', key: 'about_title', value: 'About RevAdOps', type: 'text' },
          { section: 'about_content', key: 'about_description', value: 'At RevAdOps, we specialize in providing end-to-end Ad Operations solutions tailored for publishers in the digital media space. Our mission is to empower publishers with seamless ad management, revenue optimization, and transparent reporting to maximize yield from their digital inventory.', type: 'text' },
          { section: 'about_content', key: 'about_expertise', value: 'We understand the complexities of today\'s programmatic ecosystem—whether it\'s display, video, mobile, or header bidding—and we bring the expertise to simplify operations, safeguard compliance, and ensure sustainable revenue growth. With a focus on quality, performance, and strategic execution, RevAdOps serves as a trusted partner for publishers across the globe.', type: 'text' },
          { section: 'about_content', key: 'services_title', value: 'Our Services Include:', type: 'text' },
          { section: 'about_content', key: 'service_1_title', value: 'AdOps for Publishers', type: 'text' },
          { section: 'about_content', key: 'service_1_desc', value: 'Streamlining ad trafficking, campaign management, and reporting.', type: 'text' },
          { section: 'about_content', key: 'service_2_title', value: 'Revenue Optimization', type: 'text' },
          { section: 'about_content', key: 'service_2_desc', value: 'Maximizing yield with data-driven strategies.', type: 'text' },
          { section: 'about_content', key: 'service_3_title', value: 'Programmatic Solutions', type: 'text' },
          { section: 'about_content', key: 'service_3_desc', value: 'Expertise in MCM, GAM, SSPs, and header bidding.', type: 'text' },
          { section: 'about_content', key: 'service_4_title', value: 'Publisher Relations', type: 'text' },
          { section: 'about_content', key: 'service_4_desc', value: 'Supporting sustainable, policy-compliant inventory growth.', type: 'text' },
          { section: 'about_content', key: 'director_section_title', value: 'Meet Silvia – Director of RevAdOps', type: 'text' },
          { section: 'about_content', key: 'director_description', value: 'Silvia, the Director of RevAdOps, has been dedicated to Ad Operations for Publishers in Digital Media since 2013. With over a decade of hands-on experience, she has successfully managed operations for publishers of all sizes, ensuring compliance, efficiency, and consistent revenue growth.', type: 'text' },
          { section: 'about_content', key: 'achievements_title', value: 'Her proven track record includes:', type: 'text' },
          { section: 'about_content', key: 'achievement_1_number', value: '9000+', type: 'text' },
          { section: 'about_content', key: 'achievement_1_label', value: 'hours worked as a freelancer alongside with AdOps Industry experience', type: 'text' },
          { section: 'about_content', key: 'achievement_2_number', value: '130+', type: 'text' },
          { section: 'about_content', key: 'achievement_2_label', value: 'global clients served with outstanding delivery and long-term partnerships', type: 'text' },
          { section: 'about_content', key: 'achievement_3_number', value: '10+', type: 'text' },
          { section: 'about_content', key: 'achievement_3_label', value: 'years of specialized expertise in Google Ad Manager, Programmatic Monetization, and Publisher AdOps solutions', type: 'text' },
          { section: 'about_content', key: 'director_conclusion', value: 'Silvia\'s leadership is built on a blend of technical expertise and client-first thinking. She is passionate about helping publishers navigate the ever-changing digital advertising landscape while maintaining quality, transparency, and growth.', type: 'text' }
        ]
      };

      // Merge API content with defaults
      const mergedContent: AboutContent = {};
      Object.keys(defaultContent).forEach(section => {
        mergedContent[section] = defaultContent[section].map(item => ({
          ...item,
          value: apiContent[item.section]?.[item.key] || item.value
        }));
      });

      setContent(mergedContent);
      setOriginalContent(JSON.parse(JSON.stringify(mergedContent))); // Deep copy for comparison
    } catch (error) {
      console.error('Failed to fetch about content:', error);
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
    const uploadKey = `${section}_${key}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', section);
      formData.append('key', key);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        handleContentChange(section, key, data.url);
        alert('Image uploaded successfully!');
      } else {
        console.error('Failed to upload image');
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const hasChanges = () => {
    return JSON.stringify(content) !== JSON.stringify(originalContent);
  };

  const handleSave = async () => {
    if (!hasChanges()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const updates: any[] = [];

      // Collect all changes
      Object.keys(content).forEach(section => {
        content[section].forEach(item => {
          const originalItem = originalContent[section]?.find(orig => orig.key === item.key);
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
      alert('About page content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: Type },
    { id: 'director', name: 'Director Section', icon: User },
    { id: 'about_content', name: 'About Content', icon: FileText }
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
          <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
          <p className="text-gray-700">Manage content for the About Us page</p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Preview</span>
          </a>
          <button
            onClick={handleSave}
            disabled={!hasChanges() || isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
              !hasChanges() || isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {content[activeSection]?.map((item, index) => (
            <div key={item.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 capitalize">
                {item.key.replace(/_/g, ' ')}
              </label>
              
              {item.type === 'text' ? (
                item.key.includes('description') || item.key.includes('label') || item.key.includes('conclusion') ? (
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
                <div className="space-y-3">
                  {/* Image Upload Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Image Upload Guidelines</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {item.key === 'photo' ? (
                        <>
                          <li>• Recommended: 400x400px (square format)</li>
                          <li>• Maximum: 2000x2000px</li>
                          <li>• File size: Up to 5MB</li>
                          <li>• Formats: JPG, PNG, GIF</li>
                        </>
                      ) : (
                        <>
                          <li>• Recommended: 1200x800px (landscape)</li>
                          <li>• Maximum: 2000x2000px</li>
                          <li>• File size: Up to 5MB</li>
                          <li>• Formats: JPG, PNG, GIF</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleContentChange(activeSection, item.key, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                    />
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
                      <Upload className="h-4 w-4 mr-2" />
                      <span>{uploadingImages[`${activeSection}_${item.key}`] ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(activeSection, item.key, file);
                          }
                        }}
                        className="hidden"
                        disabled={uploadingImages[`${activeSection}_${item.key}`]}
                      />
                    </label>
                  </div>

                  {item.value && (
                    <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                      <Image
                        src={item.value}
                        alt={item.key}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  )}

                  {uploadingImages[`${activeSection}_${item.key}`] && (
                    <div className="text-sm text-blue-600 flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, Package, Save, X, Type } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ServicePackages from './packages';

interface Service {
  id: string;
  title: string;
  description: string;
  shortDesc?: string;
  icon?: string;
  image?: string;
  slug: string;
  isActive: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  images: ServiceImage[];
  packages: ServicePackage[];
}

interface ServiceImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular: boolean;
  order: number;
  ctaText: string;
  ctaLink?: string;
  isActive: boolean;
}

interface ServiceFormData {
  title: string;
  description: string;
  shortDesc: string;
  icon: string;
  image: string;
  slug: string;
  isActive: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ctaText: string;
  ctaLink: string;
  images: Array<{ url: string; alt: string; order: number }>;
}

interface PageContentItem {
  section: string;
  key: string;
  value: string;
  type: string;
  order?: number;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'packages' | 'page-content'>('services');
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    shortDesc: '',
    icon: '',
    image: '',
    slug: '',
    isActive: true,
    order: 0,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ctaText: '',
    ctaLink: '',
    images: []
  });
  const [pageContent, setPageContent] = useState<PageContentItem[]>([]);
  const [originalPageContent, setOriginalPageContent] = useState<PageContentItem[]>([]);
  const [isLoadingPageContent, setIsLoadingPageContent] = useState(false);
  const [isSavingPageContent, setIsSavingPageContent] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchPageContent();
  }, []);

  const fetchPageContent = useCallback(async () => {
    try {
      setIsLoadingPageContent(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/services_page_content`);
      const data = await response.json();

      // Define default content structure if no content exists
      const defaultContentKeys = [
        { key: 'transform_title', type: 'text', value: 'Ready to Transform Your Business?' },
        { key: 'transform_subtitle', type: 'textarea', value: 'Discover how our services can help you achieve your goals.' },
        { key: 'transform_button_text', type: 'text', value: 'Get Started Today' },
        { key: 'transform_button_link', type: 'text', value: '/contact' },
        { key: 'packages_title', type: 'text', value: 'Our Service Packages' },
        { key: 'packages_subtitle', type: 'textarea', value: 'Choose the perfect package for your needs.' },
        { key: 'packages_description', type: 'textarea', value: 'We offer flexible packages designed to meet your specific requirements.' }
      ];

      // Convert API response to PageContentItem array
      let contentItems: PageContentItem[] = Object.entries(data).map(([key, item]: [string, any]) => ({
        section: 'services_page_content',
        key,
        value: item.value || '',
        type: item.type || 'text',
        order: 0
      }));

      // If no content exists, create default content structure
      if (contentItems.length === 0) {
        contentItems = defaultContentKeys.map(item => ({
          section: 'services_page_content',
          key: item.key,
          value: item.value,
          type: item.type,
          order: 0
        }));
      }

      setPageContent(contentItems);
      setOriginalPageContent(JSON.parse(JSON.stringify(contentItems))); // Deep copy for change detection
    } catch (error) {
      console.error('Error fetching page content:', error);
      toast.error('Failed to load page content');
    } finally {
      setIsLoadingPageContent(false);
    }
  }, []);

  const handlePageContentChange = (key: string, value: string) => {
    setPageContent(prev =>
      prev.map(item =>
        item.key === key ? { ...item, value } : item
      )
    );
  };

  const savePageContent = async () => {
    try {
      setIsSavingPageContent(true);
      const token = localStorage.getItem('adminToken');

      // Only save items that have changed
      const changedItems: { [key: string]: { value: string; type: string } } = {};

      pageContent.forEach(item => {
        const originalItem = originalPageContent.find(orig => orig.key === item.key);
        if (!originalItem || originalItem.value !== item.value) {
          changedItems[item.key] = {
            value: item.value,
            type: item.type
          };
        }
      });

      // Only make API call if there are changes
      if (Object.keys(changedItems).length === 0) {
        toast.success('No changes to save');
        return;
      }

      console.log('Saving changed items:', changedItems);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/services_page_content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: changedItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        toast.error('Failed to save content: ' + (errorData.message || 'Unknown error'));
        return;
      }

      toast.success('Page content saved successfully!');
      await fetchPageContent(); // Refresh to get updated data
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSavingPageContent(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        toast.error('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingService 
        ? `${process.env.NEXT_PUBLIC_API_URL}/services/${editingService.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/services`;
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Service ${editingService ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        setEditingService(null);
        resetForm();
        fetchServices();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Error saving service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      shortDesc: service.shortDesc || '',
      icon: service.icon || '',
      image: service.image || '',
      slug: service.slug,
      isActive: service.isActive,
      order: service.order,
      metaTitle: service.metaTitle || '',
      metaDescription: service.metaDescription || '',
      metaKeywords: service.metaKeywords || '',
      ctaText: service.ctaText || '',
      ctaLink: service.ctaLink || '',
      images: service.images.map(img => ({
        url: img.url,
        alt: img.alt || '',
        order: img.order
      }))
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Service deleted successfully');
        fetchServices();
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error deleting service');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDesc: '',
      icon: '',
      image: '',
      slug: '',
      isActive: true,
      order: 0,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ctaText: '',
      ctaLink: '',
      images: []
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', order: prev.images.length }]
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageField = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="mt-2 text-gray-600">Manage your services and service packages</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingService(null);
              setShowModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'packages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Service Packages
            </button>
            <button
              onClick={() => setActiveTab('page-content')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'page-content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Page Content
            </button>
          </nav>
        </div>

        {activeTab === 'services' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Services ({services.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Packages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {service.image && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                src={service.image}
                                alt={service.title}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            </div>
                          )}
                          <div className={service.image ? 'ml-4' : ''}>
                            <div className="text-sm font-medium text-gray-900">{service.title}</div>
                            <div className="text-sm text-gray-500">{service.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          service.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.images.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.packages.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/services/${service.slug}`}
                            target="_blank"
                            className="text-green-600 hover:text-green-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <ServicePackages services={services.map(s => ({ id: s.id, title: s.title, slug: s.slug }))} />
        )}

        {activeTab === 'page-content' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Services Page Content</h2>
              <button
                onClick={savePageContent}
                disabled={isSavingPageContent}
                className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSavingPageContent ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>

            {isLoadingPageContent ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Transform Business Section */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Ready to Transform Your Business? Section</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pageContent.filter(item => item.key.startsWith('transform_')).map((item) => (
                      <div key={item.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          <Type className="inline mr-2 h-4 w-4" />
                          {item.key.replace(/transform_|_/g, ' ').trim()}
                        </label>
                        {item.type === 'textarea' ? (
                          <textarea
                            value={item.value}
                            onChange={(e) => handlePageContentChange(item.key, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                            placeholder={`Enter ${item.key.replace(/transform_|_/g, ' ').trim()}`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handlePageContentChange(item.key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                            placeholder={`Enter ${item.key.replace(/transform_|_/g, ' ').trim()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packages Section */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Packages Section Content</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pageContent.filter(item => item.key.startsWith('packages_')).map((item) => (
                      <div key={item.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          <Type className="inline mr-2 h-4 w-4" />
                          {item.key.replace(/packages_|_/g, ' ').trim()}
                        </label>
                        {item.type === 'textarea' ? (
                          <textarea
                            value={item.value}
                            onChange={(e) => handlePageContentChange(item.key, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                            placeholder={`Enter ${item.key.replace(/packages_|_/g, ' ').trim()}`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handlePageContentChange(item.key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                            placeholder={`Enter ${item.key.replace(/packages_|_/g, ' ').trim()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Service Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Basic Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            title: e.target.value,
                            slug: generateSlug(e.target.value)
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                      </label>
                      <textarea
                        value={formData.shortDesc}
                        onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon (Lucide icon name)
                      </label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="e.g., search, target, users"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Image
                      </label>
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                          placeholder="Enter image URL or upload below"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // For now, we'll just show a placeholder URL
                                // In a real implementation, you'd upload to a service like Cloudinary
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setFormData(prev => ({ ...prev, image: event.target?.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Upload Image
                          </label>
                          <span className="text-xs text-gray-500">JPG, PNG up to 5MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SEO & CTA */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">SEO & Call-to-Action</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        value={formData.metaKeywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CTA Text
                      </label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="Learn More"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CTA Link
                      </label>
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        placeholder="https://calendly.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, Upload, X } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  metaDescription: string;
  status: string;
  categoryId: string;
  tags: string[];
  customUrl: string;
  advertisement1: string;
  advertisement2: string;
}

export default function NewArticle() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAd1, setUploadingAd1] = useState(false);
  const [uploadingAd2, setUploadingAd2] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'RevAdOps Team',
    metaDescription: '',
    status: 'draft',
    categoryId: '',
    tags: [],
    customUrl: '',
    advertisement1: '',
    advertisement2: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-generate slug from title
    if (form.title && !form.slug) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setForm(prev => ({ ...prev, slug }));
    }
  }, [form.title]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/categories/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', 'articles');
      formData.append('key', 'featured_image');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, featuredImage: data.url }));
        alert('Image uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdvertisement1Upload = async (file: File) => {
    setUploadingAd1(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', 'articles');
      formData.append('key', 'advertisement1');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, advertisement1: data.url }));
        alert('Advertisement 1 uploaded successfully!');
      } else {
        alert('Failed to upload advertisement 1');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload advertisement 1');
    } finally {
      setUploadingAd1(false);
    }
  };

  const handleAdvertisement2Upload = async (file: File) => {
    setUploadingAd2(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', 'articles');
      formData.append('key', 'advertisement2');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/admin/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, advertisement2: data.url }));
        alert('Advertisement 2 uploaded successfully!');
      } else {
        alert('Failed to upload advertisement 2');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload advertisement 2');
    } finally {
      setUploadingAd2(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          isPublished: form.status === 'published',
          publishedAt: form.status === 'published' ? new Date().toISOString() : null
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Article created successfully!');
        router.push('/admin/articles');
      } else {
        const errorData = await response.json();
        alert(`Failed to create article: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab (you might want to implement a preview route)
    window.open(`/blog/${form.slug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
          <p className="text-gray-600">Write and publish a new blog article</p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!form.slug}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:opacity-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            type="submit"
            form="article-form"
            disabled={loading || !form.title || !form.content}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Enter article title..."
                required
              />
            </div>

            {/* Slug */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="article-url-slug"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /blog/{form.slug}
              </p>
            </div>

            {/* Custom URL */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Custom Article URL
              </label>
              <input
                type="url"
                value={form.customUrl}
                onChange={(e) => setForm(prev => ({ ...prev, customUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="https://example.com/custom-article-url"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional: If provided, clicking on this article will redirect to this URL instead of the default article page.
              </p>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Excerpt
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Brief description of the article..."
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Article Content *
              </label>
              <RichTextEditor
                value={form.content}
                onChange={(content) => setForm(prev => ({ ...prev, content }))}
                placeholder="Start writing your article..."
                height="500px"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={form.featuredImage}
                    onChange={(e) => setForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="Image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full justify-center">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>

                {form.featuredImage && (
                  <div className="relative w-full h-32 border border-gray-300 rounded-md overflow-hidden">
                    <Image
                      src={form.featuredImage}
                      alt="Featured image preview"
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Advertisement 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Advertisement 1</h3>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={form.advertisement1}
                    onChange={(e) => setForm(prev => ({ ...prev, advertisement1: e.target.value }))}
                    placeholder="Advertisement 1 Image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full justify-center">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingAd1 ? 'Uploading...' : 'Upload Advertisement 1'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAdvertisement1Upload(file);
                    }}
                    className="hidden"
                    disabled={uploadingAd1}
                  />
                </label>

                {form.advertisement1 && (
                  <div className="relative w-full h-32 border border-gray-300 rounded-md overflow-hidden">
                    <Image
                      src={form.advertisement1}
                      alt="Advertisement 1 preview"
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Advertisement 2 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Advertisement 2</h3>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={form.advertisement2}
                    onChange={(e) => setForm(prev => ({ ...prev, advertisement2: e.target.value }))}
                    placeholder="Advertisement 2 Image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>

                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 w-full justify-center">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingAd2 ? 'Uploading...' : 'Upload Advertisement 2'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAdvertisement2Upload(file);
                    }}
                    className="hidden"
                    disabled={uploadingAd2}
                  />
                </label>

                {form.advertisement2 && (
                  <div className="relative w-full h-32 border border-gray-300 rounded-md overflow-hidden">
                    <Image
                      src={form.advertisement2}
                      alt="Advertisement 2 preview"
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Brief description for search engines..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {form.metaDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

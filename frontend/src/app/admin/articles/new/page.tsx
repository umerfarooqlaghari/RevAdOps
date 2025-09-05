/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, Upload, X } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HtmlWidget {
  id: string;
  name: string;
  title?: string;
  htmlContent: string;
  description?: string;
  isActive: boolean;
}

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  metaDescription: string;
  metaTitle: string;
  metaKeywords: string;
  metaCategory: string;
  status: string;
  categoryId: string;
  tags: string[];
  customUrl: string;
  advertisement1: string;
  advertisement2: string;
  htmlWidgetIds: string[];
}

export default function NewArticle() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [htmlWidgets, setHtmlWidgets] = useState<HtmlWidget[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'RevAdOps Team',
    metaDescription: '',
    metaTitle: '',
    metaKeywords: '',
    metaCategory: '',
    status: 'draft',
    categoryId: '',
    tags: [],
    customUrl: '',
    advertisement1: '',
    advertisement2: '',
    htmlWidgetIds: []
  });

  useEffect(() => {
    fetchCategories();
    fetchHtmlWidgets();
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

  const fetchHtmlWidgets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/html-widgets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHtmlWidgets(data.widgets?.filter((w: HtmlWidget) => w.isActive) || []);
      }
    } catch (error) {
      console.error('Error fetching HTML widgets:', error);
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

            {/* HTML Widgets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Advertisement Widgets</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select HTML widgets to display with this article. You can select multiple widgets.
              </p>

              <div className="space-y-4">
                {htmlWidgets.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No active HTML widgets available.</p>
                    <Link
                      href="/admin/html-widgets/new"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Create a new widget
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {htmlWidgets.map((widget) => (
                      <label key={widget.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.htmlWidgetIds.includes(widget.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm(prev => ({
                                ...prev,
                                htmlWidgetIds: [...prev.htmlWidgetIds, widget.id]
                              }));
                            } else {
                              setForm(prev => ({
                                ...prev,
                                htmlWidgetIds: prev.htmlWidgetIds.filter(id => id !== widget.id)
                              }));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{widget.name}</div>
                          {widget.title && (
                            <div className="text-sm text-gray-600">Title: {widget.title}</div>
                          )}
                          {widget.description && (
                            <div className="text-sm text-gray-500">{widget.description}</div>
                          )}
                        </div>
                      </label>
                    ))}
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

            {/* Meta Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Meta Information</h3>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.metaTitle}
                    onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                    maxLength={60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="SEO title for search engines..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {form.metaTitle.length}/60 characters
                  </p>
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={form.metaKeywords}
                    onChange={(e) => setForm(prev => ({ ...prev, metaKeywords: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Comma-separated keywords..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>

                {/* Meta Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Meta Category
                  </label>
                  <input
                    type="text"
                    value={form.metaCategory}
                    onChange={(e) => setForm(prev => ({ ...prev, metaCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Article category for organization..."
                  />
                </div>

                {/* Article Slug (Auto-generated but editable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Article Slug / Post ID
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="URL-friendly identifier..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be used in the article URL. Auto-generated from title but can be customized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

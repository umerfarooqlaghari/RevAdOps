'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Trash2, Edit, FileText, Tag, Calendar } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  _count: {
    blogs: number;
  };
}

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  tags: string[];
  categoryId?: string;
  category?: BlogCategory;
  createdAt: string;
  updatedAt: string;
}

export default function BlogAdmin() {
  const [activeTab, setActiveTab] = useState<'categories' | 'articles'>('categories');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: ''
  });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // Article form state
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    slug: '',
    featuredImage: '',
    categoryId: '',
    tags: '',
    isPublished: false
  });
  const [editingArticle, setEditingArticle] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch categories
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/categories/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }

      // Fetch articles
      const articlesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.blogs || []);
      }
    } catch (error) {
      console.error('Failed to fetch blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingCategory
        ? `${process.env.NEXT_PUBLIC_API_URL}/blogs/categories/${editingCategory}`
        : `${process.env.NEXT_PUBLIC_API_URL}/blogs/categories`;

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        await fetchData();
        setCategoryForm({ name: '', slug: '' });
        setEditingCategory(null);
        alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save category'}`);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleEditCategory = (category: BlogCategory) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug
    });
    setEditingCategory(category.id);
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingArticle
        ? `${process.env.NEXT_PUBLIC_API_URL}/blogs/${editingArticle}`
        : `${process.env.NEXT_PUBLIC_API_URL}/blogs`;

      const method = editingArticle ? 'PUT' : 'POST';

      const articleData = {
        ...articleForm,
        tags: articleForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        content: articleForm.excerpt || 'Article content goes here...',
        featuredImage: articleForm.featuredImage || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        await fetchData();
        setArticleForm({
          title: '',
          excerpt: '',
          slug: '',
          featuredImage: '',
          categoryId: '',
          tags: '',
          isPublished: false
        });
        setEditingArticle(null);
        alert(editingArticle ? 'Article updated successfully!' : 'Article created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save article'}`);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handleEditArticle = (article: BlogPost) => {
    setArticleForm({
      title: article.title,
      excerpt: article.excerpt || '',
      slug: article.slug,
      featuredImage: article.featuredImage || '',
      categoryId: article.categoryId || '',
      tags: article.tags.join(', '),
      isPublished: article.isPublished
    });
    setEditingArticle(article.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-700">Manage blog categories and articles</p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span>Preview</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'articles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Articles ({articles.length})
          </button>
        </nav>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Add/Edit Category Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setCategoryForm({
                        name,
                        slug: generateSlug(name)
                      });
                    }}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="category-slug"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryForm({ name: '', slug: '' });
                      setEditingCategory(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                    <p className="text-xs text-gray-400">{category._count.blogs} articles</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={category._count.blogs > 0}
                      className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No categories found. Add your first category above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Add/Edit Article Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingArticle ? 'Edit Article' : 'Add New Article'}
            </h3>
            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setArticleForm({
                        ...articleForm,
                        title,
                        slug: generateSlug(title)
                      });
                    }}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="Enter article title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                    placeholder="article-slug"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  rows={3}
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="Brief description of the article"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={articleForm.categoryId}
                    onChange={(e) => setArticleForm({ ...articleForm, categoryId: e.target.value })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <ImageUpload
                    value={articleForm.featuredImage}
                    onChange={(url) => setArticleForm({ ...articleForm, featuredImage: url })}
                    label="Featured Image"
                    placeholder="Enter image URL or drag and drop an image"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={articleForm.tags}
                  onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={articleForm.isPublished}
                  onChange={(e) => setArticleForm({ ...articleForm, isPublished: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : editingArticle ? 'Update Article' : 'Add Article'}
                </button>
                {editingArticle && (
                  <button
                    type="button"
                    onClick={() => {
                      setArticleForm({
                        title: '',
                        excerpt: '',
                        slug: '',
                        featuredImage: '',
                        categoryId: '',
                        tags: '',
                        isPublished: false
                      });
                      setEditingArticle(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Articles List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Articles</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {articles.map((article) => (
                <div key={article.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          article.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Slug: {article.slug}</span>
                        {article.category && <span>Category: {article.category.name}</span>}
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {article.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {article.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No articles found. Add your first article above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

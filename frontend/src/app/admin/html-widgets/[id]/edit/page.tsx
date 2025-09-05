'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

interface WidgetForm {
  name: string;
  title: string;
  htmlContent: string;
  description: string;
  isActive: boolean;
}

export default function EditHtmlWidget() {
  const params = useParams();
  const router = useRouter();
  const widgetId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  
  const [form, setForm] = useState<WidgetForm>({
    name: '',
    title: '',
    htmlContent: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchWidget();
  }, [widgetId]);

  const fetchWidget = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/html-widgets/${widgetId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const widget = data.widget;
        setForm({
          name: widget.name || '',
          title: widget.title || '',
          htmlContent: widget.htmlContent || '',
          description: widget.description || '',
          isActive: widget.isActive
        });
      } else {
        alert('Widget not found');
        router.push('/admin/html-widgets');
      }
    } catch (error) {
      console.error('Error fetching widget:', error);
      alert('Error loading widget');
      router.push('/admin/html-widgets');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.htmlContent.trim()) {
      alert('Please fill in the required fields (Name and HTML Content)');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/html-widgets/${widgetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.trim(),
          title: form.title.trim() || null,
          htmlContent: form.htmlContent.trim(),
          description: form.description.trim() || null,
          isActive: form.isActive
        })
      });

      if (response.ok) {
        alert('Widget updated successfully!');
        router.push('/admin/html-widgets');
      } else {
        const error = await response.json();
        alert(`Failed to update widget: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating widget:', error);
      alert('Error updating widget');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/html-widgets"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit HTML Widget</h1>
            <p className="text-gray-600">Update the HTML advertisement widget</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            type="submit"
            form="widget-form"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Updating...' : 'Update Widget'}
          </button>
        </div>
      </div>

      <form id="widget-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Widget Name */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Widget Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Enter widget name for admin reference..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This name is for admin reference only and won&apos;t be displayed publicly.
              </p>
            </div>

            {/* Widget Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Display Title (Optional)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Optional title to display with the widget..."
              />
            </div>

            {/* HTML Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                HTML Content *
              </label>
              <textarea
                value={form.htmlContent}
                onChange={(e) => setForm(prev => ({ ...prev, htmlContent: e.target.value }))}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white font-mono text-sm"
                placeholder="Enter your HTML, CSS, and JavaScript code here..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You can include HTML, CSS (in &lt;style&gt; tags), and JavaScript (in &lt;script&gt; tags).
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Widget Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Only active widgets can be selected for articles.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Optional description for admin reference..."
              />
            </div>

            {/* Preview */}
            {showPreview && form.htmlContent && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
                <div 
                  className="border rounded-lg p-4 bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: form.htmlContent }}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

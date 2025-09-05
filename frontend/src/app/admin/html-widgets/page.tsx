'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Code } from 'lucide-react';
import Link from 'next/link';

interface HtmlWidget {
  id: string;
  name: string;
  title?: string;
  htmlContent: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HtmlWidgets() {
  const [widgets, setWidgets] = useState<HtmlWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/html-widgets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWidgets(data.widgets || []);
      }
    } catch (error) {
      console.error('Error fetching widgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWidget = async (id: string) => {
    if (!confirm('Are you sure you want to delete this widget?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/html-widgets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setWidgets(widgets.filter(w => w.id !== id));
        alert('Widget deleted successfully!');
      } else {
        alert('Failed to delete widget');
      }
    } catch (error) {
      console.error('Error deleting widget:', error);
      alert('Error deleting widget');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/html-widgets/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setWidgets(widgets.map(w => 
          w.id === id ? { ...w, isActive: !isActive } : w
        ));
      } else {
        alert('Failed to update widget status');
      }
    } catch (error) {
      console.error('Error updating widget:', error);
      alert('Error updating widget');
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">HTML Widgets</h1>
          <p className="text-gray-600">Create and manage HTML advertisement widgets</p>
        </div>
        <Link
          href="/admin/html-widgets/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Widget
        </Link>
      </div>

      {/* Widgets List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {widgets.length === 0 ? (
          <div className="text-center py-12">
            <Code className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No widgets</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new HTML widget.</p>
            <div className="mt-6">
              <Link
                href="/admin/html-widgets/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Widget
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {widgets.map((widget) => (
              <li key={widget.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">{widget.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        widget.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {widget.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {widget.title && (
                      <p className="text-sm text-gray-600 mt-1">Title: {widget.title}</p>
                    )}
                    {widget.description && (
                      <p className="text-sm text-gray-500 mt-1">{widget.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {new Date(widget.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowPreview(showPreview === widget.id ? null : widget.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/admin/html-widgets/${widget.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => toggleActive(widget.id, widget.isActive)}
                      className={`text-sm px-2 py-1 rounded ${
                        widget.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={widget.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {widget.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteWidget(widget.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Preview */}
                {showPreview === widget.id && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
                    <div 
                      className="border rounded-lg p-4 bg-gray-50"
                      dangerouslySetInnerHTML={{ __html: widget.htmlContent }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

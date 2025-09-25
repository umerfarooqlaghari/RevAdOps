'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Code, Save, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Script, ScriptFormData, ScriptsListResponse } from '@/types';
import { endpoints } from '@/lib/api';

export default function ScriptsManagementPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [formData, setFormData] = useState<ScriptFormData>({
    code: '',
    locations: ['head'],
    enabled: true,
    title: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoints.scripts.getAll()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scripts');
      }

      const data: ScriptsListResponse = await response.json();
      setScripts(data.items);
    } catch (error) {
      console.error('Error fetching scripts:', error);
      toast.error('Failed to load scripts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error('Script code is required');
      return;
    }

    if (formData.locations.length === 0) {
      toast.error('Please select at least one location');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('adminToken');
      
      const url = editingScript
        ? `${process.env.NEXT_PUBLIC_API_URL}${endpoints.scripts.update(editingScript.id)}`
        : `${process.env.NEXT_PUBLIC_API_URL}${endpoints.scripts.create()}`;
      
      const method = editingScript ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save script');
      }

      toast.success(editingScript ? 'Script updated successfully' : 'Script created successfully');
      setShowModal(false);
      resetForm();
      fetchScripts();
    } catch (error) {
      console.error('Error saving script:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save script');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (script: Script) => {
    setEditingScript(script);
    setFormData({
      code: script.code,
      locations: script.locations,
      enabled: script.enabled,
      title: script.title || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this script?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoints.scripts.delete(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete script');
      }

      toast.success('Script deleted successfully');
      fetchScripts();
    } catch (error) {
      console.error('Error deleting script:', error);
      toast.error('Failed to delete script');
    }
  };

  const toggleEnabled = async (script: Script) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoints.scripts.update(script.id)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !script.enabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to update script');
      }

      toast.success(`Script ${!script.enabled ? 'enabled' : 'disabled'} successfully`);
      fetchScripts();
    } catch (error) {
      console.error('Error updating script:', error);
      toast.error('Failed to update script');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      locations: ['head'],
      enabled: true,
      title: ''
    });
    setEditingScript(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scripts Management</h1>
          <p className="text-gray-600">Manage header and footer scripts for your website</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Script
        </button>
      </div>

      {/* Scripts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Scripts</h2>
          
          {scripts.length === 0 ? (
            <div className="text-center py-8">
              <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No scripts found. Add your first script to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scripts.map((script) => (
                <div key={script.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {script.title || `Script ${script.id.slice(-8)}`}
                        </h3>
                        {script.locations.map((location) => (
                          <span key={location} className={`px-2 py-1 text-xs rounded-full mr-1 ${
                            location === 'head'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {location}
                          </span>
                        ))}
                        <button
                          onClick={() => toggleEnabled(script)}
                          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                            script.enabled
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {script.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {script.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded p-3 mb-2">
                        <code className="text-sm text-gray-700 break-all">
                          {script.code.length > 200 ? `${script.code.substring(0, 200)}...` : script.code}
                        </code>
                      </div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(script.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(script)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit script"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(script.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete script"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingScript ? 'Edit Script' : 'Add New Script'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  placeholder="e.g., Google Analytics, Facebook Pixel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locations * (Select one or both)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="location-head"
                      checked={formData.locations.includes('head')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, locations: [...formData.locations, 'head'] });
                        } else {
                          setFormData({ ...formData, locations: formData.locations.filter(loc => loc !== 'head') });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="location-head" className="ml-2 block text-sm text-gray-700">
                      Head (before &lt;/head&gt;) - Loads before page content
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="location-footer"
                      checked={formData.locations.includes('footer')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, locations: [...formData.locations, 'footer'] });
                        } else {
                          setFormData({ ...formData, locations: formData.locations.filter(loc => loc !== 'footer') });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="location-footer" className="ml-2 block text-sm text-gray-700">
                      Footer (before &lt;/body&gt;) - Loads after page content
                    </label>
                  </div>
                </div>
                {formData.locations.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">Please select at least one location.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Script Code *
                </label>
                <textarea
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm text-gray-900 bg-white"
                  rows={10}
                  placeholder="Enter your script code here..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can paste complete script tags or just the script URL for external scripts.
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
                  Enable this script
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? 'Saving...' : (editingScript ? 'Update Script' : 'Add Script')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Image,
  Users,
  Eye,
  Phone
} from 'lucide-react';

interface DashboardStats {
  totalLeads: number;
  totalContent: number;
  totalMedia: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalContent: 0,
    totalMedia: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls for now
      // In real implementation, you would fetch actual data
      setStats({
        totalLeads: 45,
        totalContent: 28,
        totalMedia: 156,
        recentActivity: [
          {
            id: '1',
            type: 'content',
            description: 'Homepage hero section updated',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'lead',
            description: 'New lead from contact form',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            type: 'media',
            description: 'New image uploaded to media library',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/leads'
    },
    {
      name: 'Content Pieces',
      value: stats.totalContent,
      icon: FileText,
      color: 'bg-green-500',
      href: '/admin/homepage'
    },
    {
      name: 'Media Assets',
      value: stats.totalMedia,
      icon: Image,
      color: 'bg-purple-500',
      href: '/admin/media'
    },
    {
      name: 'Page Views',
      value: '12.5K',
      icon: Eye,
      color: 'bg-orange-500',
      href: '/admin/analytics'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your RevAdOps admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/homepage"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <FileText className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Edit Homepage</p>
                <p className="text-sm text-gray-600">Update homepage content and images</p>
              </div>
            </a>

            <a
              href="/admin/about"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <FileText className="h-5 w-5 text-orange-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Edit About Page</p>
                <p className="text-sm text-gray-600">Update about us content and director info</p>
              </div>
            </a>

            <a
              href="/admin/contact"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <Phone className="h-5 w-5 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Edit Contact Page</p>
                <p className="text-sm text-gray-600">Update contact information and form settings</p>
              </div>
            </a>

            <a
              href="/admin/media"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <Image className="h-5 w-5 text-green-500 mr-3" aria-label="Upload Media" />
              <div>
                <p className="font-medium text-gray-900">Upload Media</p>
                <p className="text-sm text-gray-600">Add new images and videos</p>
              </div>
            </a>
            
            <a
              href="/admin/leads"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <Users className="h-5 w-5 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Leads</p>
                <p className="text-sm text-gray-600">Manage customer inquiries</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === 'content' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {activity.type === 'lead' && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {activity.type === 'media' && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Image className="h-4 w-4 text-purple-600" aria-label="Media Activity" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Website Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Website Preview</h2>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Live Site
          </a>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-gray-600 text-center">
            Preview your website changes here. Click &quot;View Live Site&quot; to see the current website.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  deviceBreakdown: Array<{ device: string; percentage: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Simulate API call with dummy data
      const dummyData: AnalyticsData = {
        pageViews: 12547,
        uniqueVisitors: 8932,
        avgSessionDuration: '2m 34s',
        bounceRate: 42.3,
        topPages: [
          { page: '/', views: 5234 },
          { page: '/services', views: 2156 },
          { page: '/blog', views: 1876 },
          { page: '/contact', views: 1432 },
          { page: '/about', views: 987 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', percentage: 58.2 },
          { device: 'Mobile', percentage: 35.7 },
          { device: 'Tablet', percentage: 6.1 }
        ],
        trafficSources: [
          { source: 'Organic Search', percentage: 45.2 },
          { source: 'Direct', percentage: 28.7 },
          { source: 'Social Media', percentage: 15.3 },
          { source: 'Referral', percentage: 10.8 }
        ]
      };

      setData(dummyData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Website performance and visitor insights</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Page Views',
            value: data.pageViews.toLocaleString(),
            icon: Eye,
            color: 'bg-blue-500',
            change: '+12.5%'
          },
          {
            label: 'Unique Visitors',
            value: data.uniqueVisitors.toLocaleString(),
            icon: Users,
            color: 'bg-green-500',
            change: '+8.2%'
          },
          {
            label: 'Avg. Session Duration',
            value: data.avgSessionDuration,
            icon: Clock,
            color: 'bg-purple-500',
            change: '+5.7%'
          },
          {
            label: 'Bounce Rate',
            value: `${data.bounceRate}%`,
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: '-3.1%'
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Pages</h2>
          <div className="space-y-4">
            {data.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(page.views / data.topPages[0].views) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Device Breakdown</h2>
          <div className="space-y-4">
            {data.deviceBreakdown.map((device, index) => {
              const icons = {
                Desktop: Monitor,
                Mobile: Smartphone,
                Tablet: Smartphone
              };
              const Icon = icons[device.device as keyof typeof icons];
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {device.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {data.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {source.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Homepage content updated', time: '2 hours ago' },
              { action: 'New lead from contact form', time: '4 hours ago' },
              { action: 'Blog post published', time: '1 day ago' },
              { action: 'Media uploaded to library', time: '2 days ago' },
              { action: 'Services page updated', time: '3 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-900">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Analytics Integration</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Connect Google Analytics or other analytics services for real-time data. 
              Current data is simulated for demonstration purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

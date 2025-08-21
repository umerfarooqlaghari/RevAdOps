'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Building,
  Eye,
  Trash2,
  Download
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
  status: string;
  createdAt: string;
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // Simulate API call with dummy data for now
      const dummyLeads: Lead[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          company: 'TechCorp Inc.',
          message: 'Interested in your ad optimization services for our mobile app.',
          source: 'Contact Form',
          status: 'new',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@publisherco.com',
          phone: '+1 (555) 987-6543',
          company: 'Publisher Co.',
          message: 'Looking to improve our header bidding setup and increase CPMs.',
          source: 'Homepage CTA',
          status: 'contacted',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike@adnetwork.com',
          company: 'AdNetwork Solutions',
          message: 'Want to discuss programmatic deals and revenue optimization.',
          source: 'Blog',
          status: 'qualified',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      setLeads(dummyLeads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      // Simulate API call
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      // Simulate API call
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      setSelectedLead(null);
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => 
    statusFilter === 'all' || lead.status === statusFilter
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600">Manage customer inquiries and leads</p>
        </div>
        
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: leads.length, color: 'bg-blue-500' },
          { label: 'New', value: leads.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
          { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: 'bg-yellow-500' },
          { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: 'bg-green-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <Mail className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Leads</h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    selectedLead?.id === lead.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{lead.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                      {lead.company && (
                        <p className="text-xs text-gray-400 truncate">{lead.company}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Lead Details</h2>
            </div>

            {selectedLead ? (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedLead.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created {new Date(selectedLead.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedLead.email}</span>
                  </div>
                  
                  {selectedLead.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedLead.phone}</span>
                    </div>
                  )}
                  
                  {selectedLead.company && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedLead.company}</span>
                    </div>
                  )}
                </div>

                {selectedLead.message && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {selectedLead.message}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => deleteLead(selectedLead.id)}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Lead
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No lead selected</h3>
                <p className="text-sm text-gray-600">Select a lead from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

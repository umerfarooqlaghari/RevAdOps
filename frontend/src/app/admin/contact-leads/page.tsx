/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from 'react';

interface Lead {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  websiteUrl?: string | null;
  message?: string | null;
  source?: string | null;
  status?: string | null;
  createdAt: string;
}

export default function ContactLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  const fetchLeads = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      const auth = getAuthHeaders();
      if (auth.Authorization) (headers as any).Authorization = auth.Authorization;

      const res = await fetch(`${apiBase}/leads/admin/all?page=${pageNumber}&limit=${limit}`, {
        headers,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch leads (${res.status})`);
      }

      const data = await res.json();
      setLeads(data.leads || []);
      const pages = data.pagination?.pages || 1;
      setTotalPages(pages);
    } catch (err: unknown) {
      console.error('Fetch leads error:', err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [apiBase, limit]);

  useEffect(() => {
    fetchLeads(page);
  }, [page, fetchLeads]);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  

  const viewLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const closeModal = () => setSelectedLead(null);

  const updateStatus = async (id: string, status: string) => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      const auth = getAuthHeaders();
      if (auth.Authorization) (headers as any).Authorization = auth.Authorization;

      const res = await fetch(`${apiBase}/leads/admin/${id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      await fetchLeads(page);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert(message || 'Could not update status');
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const headers: HeadersInit = {};
      const auth = getAuthHeaders();
      if (auth.Authorization) (headers as any).Authorization = auth.Authorization;

      const res = await fetch(`${apiBase}/leads/admin/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) throw new Error('Delete failed');

      await fetchLeads(page);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert(message || 'Failed to delete lead');
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Contact Form Leads</h2>
      </div>

      {error && (
        <div className="mb-4 text-red-700 bg-red-50 border border-red-100 rounded-md px-4 py-2">Failed to fetch leads ({error})</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">No leads found</td>
                  </tr>
                )}

                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 align-top text-base text-gray-800">{lead.firstName || (lead.name?.split(' ')[0]) || '-'}</td>
                    <td className="px-6 py-4 align-top text-base text-gray-800">{lead.lastName || (lead.name?.split(' ').slice(1).join(' ')) || '-'}</td>
                    <td className="px-6 py-4 align-top text-base text-gray-800">{lead.email}</td>
                    <td className="px-6 py-4 align-top text-base text-blue-600">
                      {(
                        lead.websiteUrl ||
                        (lead.message && typeof lead.message === 'string' && lead.message.trim().toLowerCase().startsWith('website:')
                          ? lead.message.replace(/^Website:\s*/i, '').trim()
                          : null)
                      ) ? (
                        (() => {
                          const raw = lead.websiteUrl || (lead.message || '').replace(/^Website:\s*/i, '').trim();
                          const href = raw?.toLowerCase().startsWith('http') ? raw : `https://${raw}`;
                          return (
                            <a href={href} target="_blank" rel="noreferrer" className="underline break-words">
                              {raw}
                            </a>
                          );
                        })()
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 align-top text-base text-gray-800">{lead.phone || '-'}</td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' : lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : lead.status === 'converted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-gray-500">{new Date(lead.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 align-top text-sm text-gray-700 space-x-2">
                      <button onClick={() => viewLead(lead)} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md border">View</button>
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="px-2 py-1 text-sm border rounded-md"
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="converted">converted</option>
                        <option value="closed">closed</option>
                      </select>
                      <button onClick={() => deleteLead(lead.id)} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md border">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
        <div className="space-x-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-white border rounded disabled:opacity-50">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 bg-white border rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-40" onClick={closeModal} />
          <div className="bg-white rounded-md shadow-lg max-w-xl w-full z-70 p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium">Lead Details</h3>
              <button onClick={closeModal} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div><strong>First Name:</strong> {selectedLead.firstName || (selectedLead.name?.split(' ')[0]) || '-'}</div>
              <div><strong>Last Name:</strong> {selectedLead.lastName || (selectedLead.name?.split(' ').slice(1).join(' ')) || '-'}</div>
              <div><strong>Email:</strong> {selectedLead.email}</div>
              <div><strong>Phone:</strong> {selectedLead.phone || '-'}</div>
              <div><strong>Website:</strong> {(() => {
                const raw = selectedLead.websiteUrl || (selectedLead.message || '').replace(/^Website:\s*/i, '').trim();
                if (raw) {
                  const href = raw.toLowerCase().startsWith('http') ? raw : `https://${raw}`;
                  return (
                    <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      {raw}
                    </a>
                  );
                }
                return '-';
              })()}</div>
              <div><strong>Source:</strong> {selectedLead.source || '-'}</div>
              <div><strong>Status:</strong> {selectedLead.status || 'new'}</div>
              <div><strong>Received:</strong> {new Date(selectedLead.createdAt).toLocaleString()}</div>
              <div className="pt-2"><strong>Message:</strong>
                <div className="mt-1 p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap">{selectedLead.message || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

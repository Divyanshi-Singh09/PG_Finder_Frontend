import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Building2, User, Clock, Search } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import { getAdminVisits } from '../../services/visitService';

export default function AdminVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await getAdminVisits({ status: statusFilter, page, limit: 20 });
      if (res.data) {
        setVisits(res.data.visits || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [statusFilter, page]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">CONFIRMED</Badge>;
      case 'REQUESTED':
        return <Badge variant="warning">REQUESTED</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">REJECTED</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">CANCELLED</Badge>;
      case 'COMPLETED':
        return <Badge variant="primary">COMPLETED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#2563EB]" />
              Platform Visit Monitoring Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Admin audit log and monitoring of physical PG visit requests across the platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Visit Statuses', value: '' },
                { label: 'REQUESTED', value: 'REQUESTED' },
                { label: 'CONFIRMED', value: 'CONFIRMED' },
                { label: 'COMPLETED', value: 'COMPLETED' },
                { label: 'CANCELLED', value: 'CANCELLED' },
                { label: 'REJECTED', value: 'REJECTED' },
              ]}
            />
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading visit logs...</div>
        ) : visits.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No visit records found matching status filter.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">Seeker</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
                  {visits.map((visit) => {
                    const visitId = visit._id || visit.id;
                    const pgName = visit.pg?.name || 'Property Listing';
                    const seekerName = visit.seeker?.name || 'Seeker';
                    const ownerName = visit.owner?.name || 'Owner';

                    return (
                      <tr key={visitId} className="hover:bg-slate-50/60">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          {pgName}
                        </td>
                        <td className="p-4">{seekerName}</td>
                        <td className="p-4">{ownerName}</td>
                        <td className="p-4 text-slate-600">
                          {new Date(visit.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} at {visit.startTime}
                        </td>
                        <td className="p-4">{getStatusBadge(visit.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </Container>
  );
}

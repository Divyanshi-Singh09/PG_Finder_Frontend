import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Building2, User, Bed as BedIcon } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import { getAdminBookings } from '../../services/bookingService';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchAdminBookings = async () => {
    setLoading(true);
    try {
      const res = await getAdminBookings({ status: statusFilter, page, limit: 20 });
      if (res.data) {
        setBookings(res.data.bookings || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast('Failed to load platform bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminBookings();
  }, [statusFilter, page]);

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#2563EB]" />
              Platform Room Bookings Monitor
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit booking requests, monitor room occupancy, and review seeker-landlord transactions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'PENDING', value: 'PENDING' },
                { label: 'ACCEPTED', value: 'ACCEPTED' },
                { label: 'REJECTED', value: 'REJECTED' },
                { label: 'CANCELLED', value: 'CANCELLED' },
              ]}
            />
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading booking records...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No booking requests found.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Property & Room</th>
                    <th className="p-4">Seeker</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Move-in Date</th>
                    <th className="p-4">Rent Quote</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
                  {bookings.map((b) => {
                    const bId = b._id || b.id;

                    return (
                      <tr key={bId} className="hover:bg-slate-50/60">
                        <td className="p-4 font-black text-blue-600">{b.bookingReference}</td>
                        <td className="p-4">
                          <span className="font-bold block text-slate-900">{b.pg?.name || 'PG'}</span>
                          <span className="text-slate-500 text-[11px]">
                            Rm {b.room?.roomNumber || '101'} - {b.bed?.bedNumber || 'Bed 1'}
                          </span>
                        </td>
                        <td className="p-4">{b.seeker?.name || 'Seeker'}</td>
                        <td className="p-4">{b.owner?.name || 'Owner'}</td>
                        <td className="p-4 text-slate-500">
                          {b.moveInDate ? new Date(b.moveInDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 font-bold text-emerald-600">₹{b.rentAtBooking?.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              b.status === 'ACCEPTED'
                                ? 'success'
                                : b.status === 'REJECTED'
                                ? 'danger'
                                : b.status === 'PENDING'
                                ? 'warning'
                                : 'neutral'
                            }
                          >
                            {b.status}
                          </Badge>
                        </td>
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

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

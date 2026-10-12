import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock, User, Building2, Bed as BedIcon, Filter, MessageSquare } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import { getOwnerBookings, acceptBooking, rejectBooking } from '../../services/bookingService';

export default function OwnerBookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Confirmation Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'ACCEPT' | 'REJECT'
  const [ownerResponse, setOwnerResponse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getOwnerBookings({ status: statusFilter });
      if (res.data?.bookings) setBookings(res.data.bookings);
    } catch (err) {
      showToast('Failed to load booking requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setSubmitting(true);
    try {
      const bId = selectedBooking._id || selectedBooking.id;
      if (modalAction === 'ACCEPT') {
        await acceptBooking(bId);
        showToast(`Booking ${selectedBooking.bookingReference} accepted! Bed is now occupied.`, 'success');
      } else if (modalAction === 'REJECT') {
        await rejectBooking(bId, ownerResponse);
        showToast(`Booking ${selectedBooking.bookingReference} rejected.`, 'info');
      }

      setIsModalOpen(false);
      setOwnerResponse('');
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.', 'error');
    } finally {
      setSubmitting(false);
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
              Room Booking Requests Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review seeker room requests, verify move-in dates, and manage bed approvals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

        {/* Content List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading booking requests...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No booking requests found matching filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => {
              const bId = b._id || b.id;
              const pgName = b.pg?.name || 'PG Property';
              const rmNum = b.room?.roomNumber || '101';
              const bedNum = b.bed?.bedNumber || 'Bed 1';
              const seekerName = b.seeker?.name || 'Seeker';

              return (
                <div
                  key={bId}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black text-[#2563EB] tracking-wider uppercase block">
                          Ref: {b.bookingReference}
                        </span>
                        <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          {pgName}
                        </h3>
                      </div>

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
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px]">ROOM & BED</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <BedIcon className="w-3.5 h-3.5 text-blue-600" />
                          Rm {rmNum} - {bedNum}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px]">MOVE-IN DATE</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          {b.moveInDate ? new Date(b.moveInDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px]">APPLICANT</span>
                        <span className="font-bold text-slate-900">{seekerName}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px]">RENT</span>
                        <span className="font-bold text-emerald-600">₹{b.rentAtBooking?.toLocaleString('en-IN')}/mo</span>
                      </div>
                    </div>

                    {b.seekerMessage && (
                      <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900">
                        <span className="font-bold block">Seeker Message:</span>
                        <p className="italic mt-0.5">"{b.seekerMessage}"</p>
                      </div>
                    )}
                  </div>

                  {b.status === 'PENDING' && (
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        icon={Check}
                        onClick={() => {
                          setSelectedBooking(b);
                          setModalAction('ACCEPT');
                          setIsModalOpen(true);
                        }}
                      >
                        Accept Request
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        icon={X}
                        onClick={() => {
                          setSelectedBooking(b);
                          setModalAction('REJECT');
                          setIsModalOpen(true);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Accept / Reject Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalAction === 'ACCEPT' ? 'Accept Booking Request' : 'Reject Booking Request'}
      >
        <form onSubmit={handleActionSubmit} className="space-y-4 font-sans text-xs">
          {modalAction === 'ACCEPT' ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
              <p className="font-bold">Accept this room booking request?</p>
              <p>
                Accepting will transition <strong>{selectedBooking?.bed?.bedNumber || 'Bed'}</strong> to <strong>OCCUPIED</strong> and notify seeker <strong>{selectedBooking?.seeker?.name}</strong>.
              </p>
            </div>
          ) : (
            <Textarea
              label="Rejection Reason (Optional)"
              placeholder="e.g. Bed was assigned offline or move-in date mismatch..."
              rows={3}
              value={ownerResponse}
              onChange={(e) => setOwnerResponse(e.target.value)}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={modalAction === 'ACCEPT' ? 'primary' : 'danger'}
              type="submit"
              loading={submitting}
            >
              {modalAction === 'ACCEPT' ? 'Confirm Acceptance' : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

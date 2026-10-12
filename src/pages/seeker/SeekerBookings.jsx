import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, Building2, Bed as BedIcon, AlertCircle, X, Star, CheckCircle2 } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import { getMyBookings, cancelBooking } from '../../services/bookingService';

export default function SeekerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Cancel Modal
  const [cancelBookingItem, setCancelBookingItem] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
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
      const res = await getMyBookings({ status: statusFilter });
      if (res.data?.bookings) setBookings(res.data.bookings);
    } catch (err) {
      showToast('Failed to load your booking requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelBookingItem) return;

    setSubmitting(true);
    try {
      const bId = cancelBookingItem._id || cancelBookingItem.id;
      await cancelBooking(bId, cancellationReason);
      showToast(`Booking ${cancelBookingItem.bookingReference} cancelled.`, 'info');
      setIsCancelModalOpen(false);
      setCancellationReason('');
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking.', 'error');
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
              My Room Booking Requests
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track landlord request approvals and manage move-in schedules.
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

        {/* Content Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No booking requests found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => {
              const bId = b._id || b.id;
              const pgName = b.pg?.name || 'PG Property';
              const rmNum = b.room?.roomNumber || '101';
              const bedNum = b.bed?.bedNumber || 'Bed 1';
              const isEligibleForReview = ['ACCEPTED', 'COMPLETED'].includes(b.status);

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
                        <span className="text-slate-400 block font-semibold text-[10px]">MONTHLY RENT</span>
                        <span className="font-bold text-emerald-600">₹{b.rentAtBooking?.toLocaleString('en-IN')}/mo</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px]">LANDLORD</span>
                        <span className="font-bold text-slate-900">{b.owner?.name || 'Owner'}</span>
                      </div>
                    </div>

                    {b.ownerResponse && (
                      <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-700">
                        <span className="font-bold block">Landlord Note:</span>
                        <p className="italic mt-0.5">"{b.ownerResponse}"</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {isEligibleForReview && (
                      <Link to={`/seeker/reviews/new/${bId}`}>
                        <Button variant="primary" size="xs" icon={Star}>
                          Leave a Review
                        </Button>
                      </Link>
                    )}

                    {['PENDING', 'ACCEPTED'].includes(b.status) && (
                      <Button
                        variant="outline"
                        size="xs"
                        icon={X}
                        onClick={() => {
                          setCancelBookingItem(b);
                          setIsCancelModalOpen(true);
                        }}
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Cancel Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Cancel Booking Request">
        <form onSubmit={handleCancelSubmit} className="space-y-4 font-sans text-xs">
          <Textarea
            label="Reason for Cancellation (Optional)"
            placeholder="e.g. Found alternative accommodation..."
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsCancelModalOpen(false)}>
              Back
            </Button>
            <Button variant="danger" type="submit" loading={submitting}>
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

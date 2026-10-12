import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Building2, AlertCircle, XCircle } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import EmptyState from '../../components/common/EmptyState';
import { getMyVisits, cancelVisit } from '../../services/visitService';

export default function SeekerVisits() {
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState('UPCOMING'); // 'UPCOMING' | 'PAST' | 'CANCELLED'
  const [loading, setLoading] = useState(true);

  // Cancellation Modal
  const [selectedVisit, setSelectedVisit] = useState(null);
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

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await getMyVisits();
      if (res.data?.visits) setVisits(res.data.visits);
    } catch (err) {
      showToast('Failed to load your visit requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVisit) return;

    setSubmitting(true);
    try {
      const visitId = selectedVisit._id || selectedVisit.id;
      await cancelVisit(visitId, cancellationReason);
      showToast('Visit request cancelled', 'info');
      setIsCancelModalOpen(false);
      setCancellationReason('');
      fetchVisits();
    } catch (err) {
      showToast('Failed to cancel visit', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredVisits = visits.filter((v) => {
    const vDate = new Date(v.date);
    if (activeTab === 'UPCOMING') {
      return (v.status === 'REQUESTED' || v.status === 'CONFIRMED') && vDate >= today;
    }
    if (activeTab === 'PAST') {
      return v.status === 'COMPLETED' || v.status === 'NO_SHOW' || (vDate < today && v.status !== 'CANCELLED' && v.status !== 'REJECTED');
    }
    if (activeTab === 'CANCELLED') {
      return v.status === 'CANCELLED' || v.status === 'REJECTED';
    }
    return true;
  });

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
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#2563EB]" />
                My Scheduled PG Visits
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Track status of physical visit requests submitted to property owners.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 border-t border-slate-100 pt-3">
            {[
              { id: 'UPCOMING', label: 'Upcoming Visits' },
              { id: 'PAST', label: 'Past Visits' },
              { id: 'CANCELLED', label: 'Cancelled / Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading your visits...</div>
        ) : filteredVisits.length === 0 ? (
          <EmptyState
            title="No Scheduled Visits Found"
            description="You have no visits scheduled in this category."
            actionText="Search PGs & Schedule Visit"
            actionTo="/search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisits.map((visit) => {
              const visitId = visit._id || visit.id;
              const pgName = visit.pg?.name || 'Property Listing';
              const locationText = visit.pg?.address?.locality
                ? `${visit.pg.address.locality}, ${visit.pg.address.city}`
                : visit.pg?.address?.city || 'Location available';

              return (
                <div
                  key={visitId}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-base text-[#0F172A] line-clamp-1 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          {pgName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{locationText}</span>
                        </p>
                      </div>
                      {getStatusBadge(visit.status)}
                    </div>

                    <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between text-xs font-bold text-[#0F172A]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(visit.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-blue-700">
                        {visit.startTime} – {visit.endTime}
                      </span>
                    </div>

                    {visit.ownerNote && (
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-900 space-y-1">
                        <span className="font-bold block">Owner Note:</span>
                        <p className="italic">"{visit.ownerNote}"</p>
                      </div>
                    )}
                  </div>

                  {(visit.status === 'REQUESTED' || visit.status === 'CONFIRMED') && (
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVisit(visit);
                          setIsCancelModalOpen(true);
                        }}
                        className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel Visit Request
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Cancel Visit Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Cancel Visit Request">
        <form onSubmit={handleCancelSubmit} className="space-y-4">
          <Textarea
            label="Reason for Cancellation"
            placeholder="e.g. My plans changed or I found another accommodation..."
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsCancelModalOpen(false)}>
              Keep Visit
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

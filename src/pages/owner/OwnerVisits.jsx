import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, X, User, Phone, Mail, Building2, MessageSquare, AlertCircle } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import EmptyState from '../../components/common/EmptyState';
import { getOwnerVisits, confirmVisit, rejectVisit, updateVisitStatus } from '../../services/visitService';

export default function OwnerVisits() {
  const [visits, setVisits] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
  const [loading, setLoading] = useState(true);

  // Reject Modal
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
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
      const res = await getOwnerVisits();
      if (res.data?.visits) setVisits(res.data.visits);
    } catch (err) {
      showToast('Failed to load visit requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleConfirm = async (visitId) => {
    try {
      await confirmVisit(visitId);
      showToast('Visit request confirmed!', 'success');
      fetchVisits();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to confirm visit', 'error');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVisit) return;

    setSubmitting(true);
    try {
      const visitId = selectedVisit._id || selectedVisit.id;
      await rejectVisit(visitId, rejectReason);
      showToast('Visit request rejected', 'info');
      setIsRejectModalOpen(false);
      setRejectReason('');
      fetchVisits();
    } catch (err) {
      showToast('Failed to reject visit', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (visitId, status) => {
    try {
      await updateVisitStatus(visitId, status);
      showToast(`Visit status updated to ${status}`, 'success');
      fetchVisits();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const filteredVisits = visits.filter((v) => {
    if (activeTab === 'ALL') return true;
    return v.status === activeTab;
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
      case 'NO_SHOW':
        return <Badge variant="danger">NO SHOW</Badge>;
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
                Scheduled PG Visits
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage and confirm physical visit requests from seekers.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
            {[
              { id: 'ALL', label: 'All Visits' },
              { id: 'REQUESTED', label: 'Pending Requests' },
              { id: 'CONFIRMED', label: 'Confirmed' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'CANCELLED', label: 'Cancelled' },
              { id: 'REJECTED', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
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
          <div className="p-12 text-center text-xs text-slate-400">Loading scheduled visits...</div>
        ) : filteredVisits.length === 0 ? (
          <EmptyState
            title="No Scheduled Visits Found"
            description="You currently have no visit requests in this category."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVisits.map((visit) => {
              const visitId = visit._id || visit.id;
              const seekerName = visit.seeker?.name || 'Seeker';
              const seekerEmail = visit.seeker?.email || '';
              const seekerPhone = visit.seeker?.mobile || '+91 98765 43210';
              const pgName = visit.pg?.name || 'Property Listing';

              return (
                <div
                  key={visitId}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* Header Banner */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          {pgName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{seekerName}</span>
                        </p>
                      </div>
                      {getStatusBadge(visit.status)}
                    </div>

                    {/* Date & Time */}
                    <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between text-xs font-bold text-[#0F172A]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(visit.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-blue-700">
                        <Clock className="w-4 h-4" />
                        {visit.startTime} – {visit.endTime}
                      </span>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-1 text-xs text-slate-600 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="flex items-center gap-2 font-semibold text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        {seekerPhone}
                      </p>
                      {seekerEmail && (
                        <p className="flex items-center gap-2 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          {seekerEmail}
                        </p>
                      )}
                    </div>

                    {/* Notes */}
                    {visit.seekerNote && (
                      <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 text-xs space-y-1">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Seeker Note:
                        </span>
                        <p className="text-amber-800 italic">"{visit.seekerNote}"</p>
                      </div>
                    )}

                    {visit.cancellationReason && (
                      <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-xs text-rose-700 space-y-1">
                        <span className="font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Cancellation Reason:
                        </span>
                        <p>"{visit.cancellationReason}"</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {visit.status === 'REQUESTED' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          icon={Check}
                          onClick={() => handleConfirm(visitId)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          icon={X}
                          onClick={() => {
                            setSelectedVisit(visit);
                            setIsRejectModalOpen(true);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {visit.status === 'CONFIRMED' && (
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="success"
                          size="sm"
                          fullWidth
                          onClick={() => handleStatusUpdate(visitId, 'COMPLETED')}
                        >
                          Mark Completed
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          fullWidth
                          onClick={() => handleStatusUpdate(visitId, 'NO_SHOW')}
                        >
                          No Show
                        </Button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Visit Request">
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <Textarea
            label="Reason for Rejection (Optional)"
            placeholder="e.g. The requested time slot is unavailable due to maintenance..."
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={submitting}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

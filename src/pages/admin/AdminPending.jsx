import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import { getPendingPGs, approvePG, rejectPG } from '../../services/adminService';

export default function AdminPending() {
  const [pendingPgs, setPendingPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  // Modals state
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await getPendingPGs();
      if (res.data?.pgs) setPendingPgs(res.data.pgs);
    } catch (err) {
      showToast('Failed to fetch pending listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    setActionLoading(true);
    try {
      await approvePG(approveTarget._id || approveTarget.id);
      showToast('PG property approved successfully!');
      fetchPending();
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed', 'error');
    } finally {
      setActionLoading(false);
      setApproveTarget(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    if (!rejectionReasonInput.trim()) {
      showToast('Please provide a clear reason for rejection.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await rejectPG(rejectTarget._id || rejectTarget.id, rejectionReasonInput.trim());
      showToast('PG property rejected successfully.');
      setRejectionReasonInput('');
      fetchPending();
    } catch (err) {
      showToast(err.response?.data?.message || 'Rejection failed', 'error');
    } finally {
      setActionLoading(false);
      setRejectTarget(null);
    }
  };

  if (loading) {
    return <Loader center text="Loading pending verification queue..." size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-amber-500" />
            Pending Verification Submissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review property submissions, verify images & contact details, and approve for public seeker view.
          </p>
        </div>
        <Badge variant="warning" className="w-fit text-sm px-3 py-1">
          {pendingPgs.length} Submissions Waiting
        </Badge>
      </div>

      {pendingPgs.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          description="There are no pending PG property submissions waiting for review."
          actionLabel="View All Properties"
          onAction={() => (window.location.href = '/admin/pgs')}
        />
      ) : (
        <div className="space-y-4">
          {pendingPgs.map((pg) => {
            const pgId = pg._id || pg.id;
            const coverImg = pg.images?.find((i) => i.isCover)?.url || pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

            return (
              <div key={pgId} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <img src={coverImg} alt={pg.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-[#0F172A]">{pg.name}</h3>
                      <Badge variant="primary">{pg.pgType}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Location: {pg.address?.locality ? `${pg.address.locality}, ${pg.address.city}` : pg.address?.city || 'Noida'}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      Owner: <span className="font-bold">{pg.owner?.name || 'Property Owner'}</span> ({pg.owner?.phone || pg.contact?.phone || 'Contact provided'})
                    </p>
                    <p className="text-xs font-extrabold text-[#0F172A]">
                      Rent Range: ₹{(pg.rent?.min || 8000).toLocaleString('en-IN')}/mo
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <Link to={`/admin/pgs/${pgId}`}>
                    <Button variant="outline" size="sm" icon={Eye}>
                      Inspect Details
                    </Button>
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={() => setApproveTarget(pg)}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={XCircle}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => { setRejectTarget(pg); setRejectionReasonInput(''); }}
                  >
                    Reject
                  </Button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApprove}
        title="Approve Property Submission?"
        message={`Are you sure you want to approve "${approveTarget?.name}"? It will immediately become live for seekers.`}
        confirmText="Approve Property"
        loading={actionLoading}
      />

      {/* Reject Modal with Reason Input */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Property Submission"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Please specify why this listing cannot be approved. The owner will see this reason on their dashboard.
          </p>

          <Textarea
            label="Rejection Reason"
            placeholder="e.g. Property images are unclear, or pincode does not match locality..."
            required
            rows={4}
            value={rejectionReasonInput}
            onChange={(e) => setRejectionReasonInput(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" loading={actionLoading} onClick={handleReject} className="bg-rose-600 hover:bg-rose-700">
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

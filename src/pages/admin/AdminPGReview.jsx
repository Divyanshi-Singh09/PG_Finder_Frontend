import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Users, 
  Utensils, 
  History,
  Clock
} from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import { 
  getPGById, 
  approvePG, 
  rejectPG, 
  suspendPG, 
  reactivatePG, 
  getModerationHistory 
} from '../../services/adminService';

export default function AdminPGReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isReactivateOpen, setIsReactivateOpen] = useState(false);

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [pgRes, logRes] = await Promise.all([
        getPGById(id),
        getModerationHistory(id),
      ]);
      if (pgRes.data?.pg) setPg(pgRes.data.pg);
      if (logRes.data?.logs) setHistoryLogs(logRes.data.logs);
    } catch (err) {
      showToast('Failed to load property inspection details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approvePG(id);
      showToast('PG property approved successfully!');
      fetchDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed', 'error');
    } finally {
      setActionLoading(false);
      setIsApproveOpen(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showToast('Rejection reason cannot be empty.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await rejectPG(id, rejectReason.trim());
      showToast('PG property rejected successfully.');
      setRejectReason('');
      fetchDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Rejection failed', 'error');
    } finally {
      setActionLoading(false);
      setIsRejectOpen(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      showToast('Suspension reason cannot be empty.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await suspendPG(id, suspendReason.trim());
      showToast('PG property suspended successfully.');
      setSuspendReason('');
      fetchDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Suspension failed', 'error');
    } finally {
      setActionLoading(false);
      setIsSuspendOpen(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      await reactivatePG(id);
      showToast('PG property reactivated successfully!');
      fetchDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Reactivation failed', 'error');
    } finally {
      setActionLoading(false);
      setIsReactivateOpen(false);
    }
  };

  if (loading) {
    return <Loader center text="Loading property inspection data..." size="lg" />;
  }

  if (!pg) {
    return (
      <EmptyState
        title="Property Listing Not Found"
        description="The requested PG property could not be found or has been deleted."
        actionLabel="Back to Admin Dashboard"
        onAction={() => navigate('/admin/dashboard')}
      />
    );
  }

  const coverImg = pg.images?.[activeImageIndex]?.url || pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const getStatusBadge = (status) => {
    if (status === 'APPROVED') return 'success';
    if (status === 'PENDING') return 'warning';
    if (status === 'REJECTED') return 'danger';
    if (status === 'SUSPENDED') return 'danger';
    return 'secondary';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb Nav */}
      <Link to="/admin/pgs" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
        <ChevronLeft className="w-4 h-4" />
        Back to Property Management
      </Link>

      {/* Title & Action Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0F172A]">{pg.name}</h1>
            <Badge variant={getStatusBadge(pg.status)}>{pg.status}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submitted by: <span className="font-bold text-slate-700">{pg.owner?.name || 'Property Owner'}</span> ({pg.owner?.email || 'email@example.com'})
          </p>
        </div>

        {/* Contextual Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {pg.status === 'PENDING' && (
            <>
              <Button variant="primary" icon={CheckCircle2} onClick={() => setIsApproveOpen(true)}>
                Approve Listing
              </Button>
              <Button
                variant="outline"
                icon={XCircle}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => setIsRejectOpen(true)}
              >
                Reject Listing
              </Button>
            </>
          )}

          {pg.status === 'APPROVED' && (
            <Button
              variant="outline"
              icon={AlertOctagon}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
              onClick={() => setIsSuspendOpen(true)}
            >
              Suspend Property
            </Button>
          )}

          {pg.status === 'SUSPENDED' && (
            <Button variant="primary" icon={ShieldCheck} onClick={() => setIsReactivateOpen(true)}>
              Reactivate Property
            </Button>
          )}
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Full Inspection */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Photo Gallery Inspection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-[#0F172A]">Uploaded Property Images ({pg.images?.length || 0})</h3>
            <div className="aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
              <img src={coverImg} alt={pg.name} className="w-full h-full object-cover" />
            </div>

            {pg.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {pg.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#2563EB]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-[#0F172A]">Property Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{pg.description}</p>
          </div>

          {/* Address & Coordinates */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-[#0F172A]">Complete Address Details</h3>
            <p className="text-xs text-slate-700">
              {pg.address?.houseNumber} {pg.address?.street}, {pg.address?.locality}, {pg.address?.city}, {pg.address?.state} - {pg.address?.pincode}
            </p>
            {pg.address?.landmark && <p className="text-xs text-slate-500"><span className="font-bold">Landmark:</span> {pg.address.landmark}</p>}
          </div>

          {/* Room Types Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-[#0F172A]">Room Options & Rent Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pg.roomTypes?.map((room, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold text-[#0F172A]">
                    <span>{room.type} Sharing</span>
                    <span className="text-[#2563EB]">₹{room.rent?.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <p className="text-slate-500">Deposit: ₹{room.deposit?.toLocaleString('en-IN')}</p>
                  <p className="text-emerald-600 font-bold">{room.availableRooms} of {room.totalRooms} Available</p>
                </div>
              ))}
            </div>
          </div>

          {/* Moderation History Audit Trail */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#2563EB]" />
              Moderation Audit History
            </h3>

            {historyLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No moderation history recorded yet.</p>
            ) : (
              <div className="space-y-3 border-l-2 border-slate-200 pl-4">
                {historyLogs.map((log, idx) => (
                  <div key={idx} className="relative space-y-1 text-xs">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A]">{log.action}</span>
                      <span className="text-slate-400">({new Date(log.createdAt).toLocaleString()})</span>
                    </div>
                    {log.reason && <p className="text-rose-600 font-medium bg-rose-50 p-2 rounded-lg">{log.reason}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Owner Contact Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider">Owner & Contact Details</h3>
            
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#2563EB]" />
                <span className="font-bold">{pg.owner?.name || 'Property Owner'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2563EB]" />
                <span>{pg.owner?.email || pg.contact?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2563EB]" />
                <span>{pg.contact?.phone || pg.owner?.mobile || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Property Listing?"
        message={`Are you sure you want to approve "${pg.name}"? It will become visible to seekers immediately.`}
        confirmText="Approve Property"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={isReactivateOpen}
        onClose={() => setIsReactivateOpen(false)}
        onConfirm={handleReactivate}
        title="Reactivate Property Listing?"
        message={`Reactivate "${pg.name}" so it becomes live in seeker search again?`}
        confirmText="Reactivate Listing"
        loading={actionLoading}
      />

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onClose={() => setIsRejectOpen(false)} title="Reject PG Property">
        <div className="space-y-4">
          <Textarea
            label="Reason for Rejection"
            placeholder="Explain what information or photos are missing..."
            required
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={actionLoading} onClick={handleReject} className="bg-rose-600 hover:bg-rose-700">
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Suspend Modal */}
      <Modal isOpen={isSuspendOpen} onClose={() => setIsSuspendOpen(false)} title="Suspend PG Property">
        <div className="space-y-4">
          <Textarea
            label="Reason for Suspension"
            placeholder="Explain why this approved listing is being suspended..."
            required
            rows={4}
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={actionLoading} onClick={handleSuspend} className="bg-rose-600 hover:bg-rose-700">
              Confirm Suspension
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

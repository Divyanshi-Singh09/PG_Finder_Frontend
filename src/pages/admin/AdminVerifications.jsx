import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Ban, Eye, FileText, Filter, AlertTriangle } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import { getAdminOwnerVerifications, approveOwnerVerification, rejectOwnerVerification, suspendPGListing, unsuspendPGListing } from '../../services/verificationService';
import { getPGs as getAdminPGList } from '../../services/adminService';

export default function AdminVerifications() {
  const [activeTab, setActiveTab] = useState('OWNER'); // 'OWNER' | 'PG'
  const [ownerVerifications, setOwnerVerifications] = useState([]);
  const [pgList, setPgList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Reject / Suspend Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(null); // 'REJECT_OWNER' | 'SUSPEND_PG'
  const [reason, setReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Inspect Documents Modal
  const [inspectRecord, setInspectRecord] = useState(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'OWNER') {
        const res = await getAdminOwnerVerifications({ status: statusFilter });
        if (res.data?.records) setOwnerVerifications(res.data.records);
      } else {
        const res = await getAdminPGList({ status: statusFilter });
        if (res.data?.pgs) setPgList(res.data.pgs);
      }
    } catch (err) {
      showToast('Failed to load verification records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, statusFilter]);

  const handleApproveOwner = async (id) => {
    try {
      await approveOwnerVerification(id);
      showToast('Owner verification approved! User given Verified Owner status.', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to approve verification', 'error');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || !reason) return;

    setSubmitting(true);
    try {
      const itemId = selectedItem._id || selectedItem.id;
      if (actionType === 'REJECT_OWNER') {
        await rejectOwnerVerification(itemId, reason);
        showToast('Owner verification rejected.', 'info');
      } else if (actionType === 'SUSPEND_PG') {
        await suspendPGListing(itemId, reason);
        showToast('PG listing suspended and hidden from public search.', 'warning');
      }

      setIsModalOpen(false);
      setReason('');
      loadData();
    } catch (err) {
      showToast('Action failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnsuspendPG = async (pgId) => {
    try {
      await unsuspendPGListing(pgId);
      showToast('PG listing unsuspended and reactivated.', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to unsuspend PG', 'error');
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
                <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
                Verification & Moderation Panel
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Audit landlord identity documents and manage PG property listing suspensions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'SUBMITTED', value: 'SUBMITTED' },
                  { label: 'APPROVED', value: 'APPROVED' },
                  { label: 'REJECTED', value: 'REJECTED' },
                  { label: 'SUSPENDED', value: 'SUSPENDED' },
                ]}
              />
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => { setActiveTab('OWNER'); setStatusFilter(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'OWNER' ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Landlord Identity Verifications
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('PG'); setStatusFilter(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'PG' ? 'bg-[#2563EB] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              PG Property Moderation & Suspensions
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading records...</div>
        ) : activeTab === 'OWNER' ? (
          ownerVerifications.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
              No owner verification submissions found.
            </div>
          ) : (
            <div className="bg-[#FFFFFF] rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                    <tr>
                      <th className="p-4">Owner Name</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Documents</th>
                      <th className="p-4">Submitted Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
                    {ownerVerifications.map((rec) => {
                      const recId = rec._id || rec.id;
                      const ownerName = rec.owner?.name || rec.fullName || 'Landlord';

                      return (
                        <tr key={recId} className="hover:bg-slate-50/60">
                          <td className="p-4 font-bold text-slate-900">{ownerName}</td>
                          <td className="p-4">{rec.phone || rec.owner?.mobile || '+91 98765 43210'}</td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => {
                                setInspectRecord(rec);
                                setIsInspectOpen(true);
                              }}
                              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Inspect ({rec.documents?.length || 0})
                            </button>
                          </td>
                          <td className="p-4 text-slate-500">
                            {rec.submittedAt ? new Date(rec.submittedAt).toLocaleDateString() : 'Pending'}
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                rec.verificationStatus === 'APPROVED'
                                  ? 'success'
                                  : rec.verificationStatus === 'REJECTED'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {rec.verificationStatus}
                            </Badge>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {rec.verificationStatus !== 'APPROVED' && (
                              <Button
                                variant="primary"
                                size="xs"
                                icon={Check}
                                onClick={() => handleApproveOwner(recId)}
                              >
                                Approve
                              </Button>
                            )}
                            {rec.verificationStatus !== 'REJECTED' && (
                              <Button
                                variant="outline"
                                size="xs"
                                icon={X}
                                onClick={() => {
                                  setSelectedItem(rec);
                                  setActionType('REJECT_OWNER');
                                  setIsModalOpen(true);
                                }}
                              >
                                Reject
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          pgList.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
              No PG listings found.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                    <tr>
                      <th className="p-4">PG Property</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
                    {pgList.map((pg) => {
                      const pgId = pg._id || pg.id;
                      const ownerName = pg.owner?.name || 'Landlord';

                      return (
                        <tr key={pgId} className="hover:bg-slate-50/60">
                          <td className="p-4 font-bold text-slate-900">{pg.name}</td>
                          <td className="p-4">{pg.address?.city || 'Noida'}</td>
                          <td className="p-4">{ownerName}</td>
                          <td className="p-4">
                            <Badge
                              variant={
                                pg.status === 'SUSPENDED'
                                  ? 'danger'
                                  : pg.status === 'APPROVED'
                                  ? 'success'
                                  : 'warning'
                              }
                            >
                              {pg.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            {pg.status === 'SUSPENDED' ? (
                              <Button
                                variant="primary"
                                size="xs"
                                onClick={() => handleUnsuspendPG(pgId)}
                              >
                                Reactivate PG
                              </Button>
                            ) : (
                              <Button
                                variant="danger"
                                size="xs"
                                icon={Ban}
                                onClick={() => {
                                  setSelectedItem(pg);
                                  setActionType('SUSPEND_PG');
                                  setIsModalOpen(true);
                                }}
                              >
                                Suspend PG
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

      </div>

      {/* Action Modal (Reject / Suspend) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={actionType === 'REJECT_OWNER' ? 'Reject Owner Verification' : 'Suspend PG Property Listing'}
      >
        <form onSubmit={handleModalSubmit} className="space-y-4">
          <Textarea
            label="Reason for Action (Required)"
            placeholder={
              actionType === 'REJECT_OWNER'
                ? 'e.g. Identity document uploaded is unclear or invalid...'
                : 'e.g. Property listing requires investigation due to report...'
            }
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={submitting}>
              Confirm Action
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inspect Documents Modal */}
      <Modal isOpen={isInspectOpen} onClose={() => setIsInspectOpen(false)} title="Inspect Landlord Documents">
        <div className="space-y-4 text-xs font-sans">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <p className="font-bold text-[#0F172A]">Landlord: {inspectRecord?.fullName}</p>
            <p className="text-slate-500">Phone: {inspectRecord?.phone}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-700 uppercase">Uploaded Private Documents:</h4>
            {inspectRecord?.documents?.length === 0 ? (
              <p className="text-slate-400 italic">No documents uploaded.</p>
            ) : (
              <div className="space-y-2">
                {inspectRecord?.documents?.map((d, idx) => (
                  <div key={idx} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-900 block">{d.type}</span>
                      <span className="text-slate-500 text-[11px]">{d.fileName || 'Document File'}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Verified Stream URL
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" onClick={() => setIsInspectOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

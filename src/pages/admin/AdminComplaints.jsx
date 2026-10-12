import React, { useState, useEffect } from 'react';
import { AlertOctagon, Filter, CheckCircle2, MessageSquare, ShieldAlert, User, Building2 } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import { getAdminComplaints, updateComplaintStatus } from '../../services/adminService';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Update Status Modal
  const [targetComplaint, setTargetComplaint] = useState(null);
  const [targetStatus, setTargetStatus] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolutionReason, setResolutionReason] = useState('');
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

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getAdminComplaints({
        status: statusFilter,
        priority: priorityFilter,
        page,
        limit: 20,
      });
      if (res.data) {
        setComplaints(res.data.complaints || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast('Failed to load support complaints queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter, page]);

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!targetComplaint) return;

    setSubmitting(true);
    try {
      const cId = targetComplaint._id || targetComplaint.id;
      await updateComplaintStatus(cId, targetStatus, adminNotes, resolutionReason);
      showToast(`Complaint status updated to ${targetStatus}!`, 'success');
      setIsModalOpen(false);
      setAdminNotes('');
      setResolutionReason('');
      fetchComplaints();
    } catch (err) {
      showToast(err.response?.data?.message || 'Status update failed.', 'error');
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
              <AlertOctagon className="w-6 h-6 text-rose-600" />
              Platform Support & Complaints Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Investigate seeker and owner support tickets, prioritize safety issues, and log admin resolution notes.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'OPEN', value: 'OPEN' },
                { label: 'UNDER_REVIEW', value: 'UNDER_REVIEW' },
                { label: 'RESOLVED', value: 'RESOLVED' },
                { label: 'DISMISSED', value: 'DISMISSED' },
              ]}
            />
            <Select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Priorities', value: '' },
                { label: 'URGENT', value: 'URGENT' },
                { label: 'HIGH', value: 'HIGH' },
                { label: 'MEDIUM', value: 'MEDIUM' },
                { label: 'LOW', value: 'LOW' },
              ]}
            />
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No support complaints found matching filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.map((c) => {
              const cId = c._id || c.id;
              const complainantName = c.complainantName || c.complainant?.name || 'User';

              return (
                <div
                  key={cId}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={c.priority === 'URGENT' ? 'danger' : c.priority === 'HIGH' ? 'warning' : 'neutral'}>
                            {c.priority} PRIORITY
                          </Badge>
                          <span className="text-[10px] font-black text-blue-600 uppercase">{c.category}</span>
                        </div>
                        <h3 className="font-extrabold text-base text-[#0F172A] mt-1">{c.subject}</h3>
                      </div>

                      <Badge
                        variant={
                          c.status === 'RESOLVED'
                            ? 'success'
                            : c.status === 'OPEN'
                            ? 'danger'
                            : c.status === 'UNDER_REVIEW'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {c.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                      "{c.description}"
                    </p>

                    <div className="flex justify-between items-center text-xs text-slate-500 font-semibold pt-1">
                      <span>Complainant: {complainantName}</span>
                      <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently'}</span>
                    </div>

                    {c.adminNotes && (
                      <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900">
                        <span className="font-bold block">Internal Admin Note:</span>
                        <p className="italic">{c.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <Button
                      variant="primary"
                      size="xs"
                      icon={CheckCircle2}
                      onClick={() => {
                        setTargetComplaint(c);
                        setTargetStatus(c.status === 'OPEN' ? 'UNDER_REVIEW' : 'RESOLVED');
                        setAdminNotes(c.adminNotes || '');
                        setIsModalOpen(true);
                      }}
                    >
                      Update Status / Notes
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Update Complaint Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Support Complaint Ticket">
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 font-sans text-xs">
          <Select
            label="Ticket Status"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value)}
            options={[
              { label: 'UNDER_REVIEW', value: 'UNDER_REVIEW' },
              { label: 'RESOLVED', value: 'RESOLVED' },
              { label: 'DISMISSED', value: 'DISMISSED' },
            ]}
          />

          <Textarea
            label="Internal Admin Notes (Private)"
            placeholder="Document internal investigation, actions taken, or landlord contact..."
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Save Updates
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

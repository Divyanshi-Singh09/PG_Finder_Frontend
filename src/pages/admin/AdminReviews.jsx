import React, { useState, useEffect } from 'react';
import { Star, Filter, ShieldCheck, EyeOff, CheckCircle2, AlertOctagon, Trash2 } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import { getAdminReviews, moderateReviewStatus } from '../../services/reviewService';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Moderation Modal
  const [targetReview, setTargetReview] = useState(null);
  const [targetStatus, setTargetStatus] = useState('PUBLISHED');
  const [reasonInput, setReasonInput] = useState('');
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

  const fetchAdminReviews = async () => {
    setLoading(true);
    try {
      const res = await getAdminReviews({ status: statusFilter, page, limit: 20 });
      if (res.data) {
        setReviews(res.data.reviews || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast('Failed to load review moderation queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReviews();
  }, [statusFilter, page]);

  const handleModerationSubmit = async (e) => {
    e.preventDefault();
    if (!targetReview) return;

    setSubmitting(true);
    try {
      const rId = targetReview._id || targetReview.id;
      await moderateReviewStatus(rId, targetStatus, reasonInput);
      showToast(`Review status updated to ${targetStatus}!`, 'success');
      setIsModalOpen(false);
      setReasonInput('');
      fetchAdminReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Moderation action failed.', 'error');
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
              <Star className="w-6 h-6 text-amber-500 fill-current" />
              Platform Review Moderation Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit guest reviews, inspect flagged profanity, and hide or restore abusive content.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'PUBLISHED', value: 'PUBLISHED' },
                { label: 'PENDING_REVIEW', value: 'PENDING_REVIEW' },
                { label: 'HIDDEN', value: 'HIDDEN' },
                { label: 'REMOVED', value: 'REMOVED' },
              ]}
            />
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No reviews found matching filter criteria.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                  <tr>
                    <th className="p-4">PG Property</th>
                    <th className="p-4">Seeker</th>
                    <th className="p-4">Rating & Comment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Helpful</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
                  {reviews.map((r) => {
                    const rId = r._id || r.id;
                    const seekerName = r.seekerName || r.seeker?.name || 'Seeker';
                    const pgName = r.pg?.name || 'PG';

                    return (
                      <tr key={rId} className="hover:bg-slate-50/60">
                        <td className="p-4 font-bold text-slate-900">{pgName}</td>
                        <td className="p-4">{seekerName}</td>
                        <td className="p-4 max-w-xs space-y-1">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <span>{r.rating}★</span>
                            {r.title && <span className="text-slate-900 font-extrabold truncate">"{r.title}"</span>}
                          </div>
                          <p className="text-slate-600 line-clamp-2">{r.comment}</p>
                          {r.moderationReason && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold block">
                              Flag: {r.moderationReason}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              r.status === 'PUBLISHED'
                                ? 'success'
                                : r.status === 'PENDING_REVIEW'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {r.status || 'PUBLISHED'}
                          </Badge>
                        </td>
                        <td className="p-4 font-bold text-slate-600">{r.helpfulCount || 0}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            {r.status === 'PUBLISHED' ? (
                              <Button
                                variant="outline"
                                size="xs"
                                icon={EyeOff}
                                onClick={() => {
                                  setTargetReview(r);
                                  setTargetStatus('HIDDEN');
                                  setIsModalOpen(true);
                                }}
                              >
                                Hide
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="xs"
                                icon={CheckCircle2}
                                onClick={() => {
                                  setTargetReview(r);
                                  setTargetStatus('PUBLISHED');
                                  setIsModalOpen(true);
                                }}
                              >
                                Publish
                              </Button>
                            )}
                          </div>
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

      {/* Moderation Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Moderate Review Status to ${targetStatus}`}>
        <form onSubmit={handleModerationSubmit} className="space-y-4 font-sans text-xs">
          <p className="text-slate-600">
            You are setting status of review by <strong>{targetReview?.seekerName || targetReview?.seeker?.name}</strong> to <strong>{targetStatus}</strong>.
          </p>

          <Textarea
            label="Moderation Reason (Optional)"
            placeholder="e.g. Contains abusive language or verified safe content..."
            rows={3}
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant={targetStatus === 'PUBLISHED' ? 'primary' : 'danger'} type="submit" loading={submitting}>
              Confirm Action
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { Flag, Check, X, Filter, Building2, User, AlertTriangle } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import { getAdminReports, updateReportStatus } from '../../services/verificationService';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Resolve / Dismiss Modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionStatus, setActionStatus] = useState('RESOLVED'); // 'RESOLVED' | 'DISMISSED'
  const [resolutionNote, setResolutionNote] = useState('');
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

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getAdminReports({ status: statusFilter, page, limit: 20 });
      if (res.data) {
        setReports(res.data.reports || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast('Failed to load user flag reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, page]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    setSubmitting(true);
    try {
      const reportId = selectedReport._id || selectedReport.id;
      await updateReportStatus(reportId, {
        status: actionStatus,
        resolutionNote,
      });

      showToast(`Report marked as ${actionStatus}.`, 'success');
      setIsModalOpen(false);
      setResolutionNote('');
      fetchReports();
    } catch (err) {
      showToast('Failed to update report status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="warning">OPEN</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">RESOLVED</Badge>;
      case 'DISMISSED':
        return <Badge variant="neutral">DISMISSED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Flag className="w-6 h-6 text-rose-600" />
              User Flag & Abuse Reports
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Investigate and resolve reported property listings submitted by seekers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'OPEN', value: 'OPEN' },
                { label: 'RESOLVED', value: 'RESOLVED' },
                { label: 'DISMISSED', value: 'DISMISSED' },
              ]}
            />
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading user reports...</div>
        ) : reports.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No flag reports found matching filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => {
              const repId = report._id || report.id;
              const pgName = report.targetId?.name || 'Reported Property Listing';
              const reporterName = report.reporter?.name || 'Seeker';

              return (
                <div
                  key={repId}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          {pgName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Reported by: {reporterName}</span>
                        </p>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-1 text-xs text-rose-900">
                      <span className="font-bold block">Reason: {report.reason}</span>
                      <p className="italic">"{report.description}"</p>
                    </div>

                    {report.resolutionNote && (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                        <span className="font-bold block">Admin Resolution:</span>
                        <p>"{report.resolutionNote}"</p>
                      </div>
                    )}
                  </div>

                  {report.status === 'OPEN' && (
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        icon={Check}
                        onClick={() => {
                          setSelectedReport(report);
                          setActionStatus('RESOLVED');
                          setIsModalOpen(true);
                        }}
                      >
                        Resolve Report
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        icon={X}
                        onClick={() => {
                          setSelectedReport(report);
                          setActionStatus('DISMISSED');
                          setIsModalOpen(true);
                        }}
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Action Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Mark Report as ${actionStatus}`}>
        <form onSubmit={handleActionSubmit} className="space-y-4">
          <Textarea
            label="Resolution Note (Optional)"
            placeholder="e.g. Verified information with landlord or updated property details..."
            rows={3}
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Confirm Action
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

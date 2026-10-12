import React, { useEffect, useState } from 'react';
import { MessageSquare, Clock, CheckCircle2, User, Phone, Mail, Send } from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import { getOwnerEnquiries, respondToEnquiry } from '../../services/enquiryService';

export default function OwnerEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, responded: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  const [responseTarget, setResponseTarget] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await getOwnerEnquiries();
      if (res.data) {
        setEnquiries(res.data.enquiries || []);
        setStats(res.data.stats || { total: 0, pending: 0, responded: 0, closed: 0 });
      }
    } catch (err) {
      showToast('Failed to fetch enquiries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleSendResponse = async () => {
    if (!responseTarget) return;
    if (!replyInput.trim()) {
      showToast('Please enter a response message.', 'error');
      return;
    }

    setReplyLoading(true);
    try {
      await respondToEnquiry(responseTarget._id || responseTarget.id, replyInput.trim());
      showToast('Response sent to tenant successfully!');
      setReplyInput('');
      setResponseTarget(null);
      fetchEnquiries();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send response', 'error');
    } finally {
      setReplyLoading(false);
    }
  };

  const getBadgeVariant = (status) => {
    if (status === 'RESPONDED') return 'success';
    if (status === 'PENDING') return 'warning';
    return 'secondary';
  };

  if (loading) {
    return <Loader center text="Loading tenant enquiries..." size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#2563EB]" />
            Tenant Enquiries & Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review questions submitted by prospective tenants for your PG listings.
          </p>
        </div>
        
        {stats.pending > 0 && (
          <Badge variant="warning" className="w-fit text-sm px-3 py-1">
            {stats.pending} Pending Replies
          </Badge>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Enquiries</p>
            <h3 className="text-2xl font-black text-[#0F172A] mt-1">{stats.total}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Reply</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Responded</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.responded}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <EmptyState
          title="No Tenant Enquiries Yet"
          description="When seekers view your approved PG properties, their enquiries will appear here."
        />
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const enqId = enq._id || enq.id;
            const pgName = enq.pg?.name || 'Your PG Property';
            const seekerName = enq.seeker?.name || 'Prospective Tenant';
            const seekerContact = enq.seeker?.mobile || enq.seeker?.email || '';

            return (
              <div key={enqId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#0F172A]">{pgName}</h3>
                      <Badge variant={getBadgeVariant(enq.status)}>{enq.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{seekerName}</span>
                      {seekerContact && <span className="text-slate-400">({seekerContact})</span>}
                    </p>
                  </div>

                  {enq.status === 'PENDING' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Send}
                      onClick={() => { setResponseTarget(enq); setReplyInput(''); }}
                    >
                      Reply to Tenant
                    </Button>
                  )}
                </div>

                {/* Subject & Message */}
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#0F172A]">Subject: {enq.subject}</h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    "{enq.message}"
                  </p>
                </div>

                {/* Owner Reply if exists */}
                {enq.ownerReply && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Your Sent Reply:
                    </span>
                    <p className="font-medium">"{enq.ownerReply}"</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Response Modal */}
      <Modal
        isOpen={!!responseTarget}
        onClose={() => setResponseTarget(null)}
        title={`Respond to ${responseTarget?.seeker?.name || 'Tenant'}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600">
            <span className="font-bold text-[#0F172A]">Question:</span> "{responseTarget?.message}"
          </div>

          <Textarea
            label="Your Response Message"
            placeholder="e.g. Yes, double sharing is available! Please call us at..."
            required
            rows={4}
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setResponseTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" loading={replyLoading} onClick={handleSendResponse} icon={Send}>
              Send Reply
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle2, XCircle, ArrowRight, Building2, User } from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { getMyEnquiries, closeEnquiry } from '../../services/enquiryService';

export default function SeekerEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await getMyEnquiries();
      if (res.data?.enquiries) {
        setEnquiries(res.data.enquiries);
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

  const handleCloseEnquiry = async (id) => {
    try {
      await closeEnquiry(id);
      showToast('Enquiry closed successfully.');
      fetchEnquiries();
    } catch (err) {
      showToast('Failed to close enquiry', 'error');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'RESPONDED') return 'success';
    if (status === 'PENDING') return 'warning';
    return 'secondary';
  };

  if (loading) {
    return <Loader center text="Loading your submitted enquiries..." size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#2563EB]" />
            My Sent Property Enquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track questions sent to PG property owners and view their replies.
          </p>
        </div>
        <Link to="/search">
          <Button variant="primary" size="sm">
            Send New Enquiry
          </Button>
        </Link>
      </div>

      {enquiries.length === 0 ? (
        <EmptyState
          title="No Enquiries Submitted Yet"
          description="Send an enquiry on any approved PG property details page to ask about availability, rent, or moving dates."
          actionLabel="Browse Available PGs"
          onAction={() => (window.location.href = '/search')}
        />
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const enqId = enq._id || enq.id;
            const pgName = enq.pg?.name || 'PG Property';
            const pgId = enq.pg?._id || enq.pg?.id || enq.pg;

            return (
              <div key={enqId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link to={`/pg/${pgId}`} className="font-extrabold text-base text-[#0F172A] hover:text-[#2563EB]">
                        {pgName}
                      </Link>
                      <Badge variant={getStatusBadge(enq.status)}>{enq.status}</Badge>
                    </div>
                    <span className="text-xs text-slate-400">
                      Sent on {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {enq.status !== 'CLOSED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCloseEnquiry(enqId)}
                      className="w-fit text-slate-600"
                    >
                      Close Enquiry
                    </Button>
                  )}
                </div>

                {/* Seeker Message */}
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#0F172A]">{enq.subject}</h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    "{enq.message}"
                  </p>
                </div>

                {/* Owner Reply Section */}
                {enq.ownerReply ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                    <span className="font-bold text-xs text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Owner Response ({enq.owner?.name || 'PG Owner'})
                    </span>
                    <p className="text-xs text-emerald-900 font-medium">
                      "{enq.ownerReply}"
                    </p>
                  </div>
                ) : enq.status === 'PENDING' ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Waiting for owner response...</span>
                  </div>
                ) : null}

              </div>
            );
          })}
        </div>
      )}

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

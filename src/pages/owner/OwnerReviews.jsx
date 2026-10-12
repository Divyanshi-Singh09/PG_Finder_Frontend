import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, CheckCircle2, User, Send, ShieldCheck } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import { getOwnerReviews, replyToReview } from '../../services/reviewService';

export default function OwnerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [replyTarget, setReplyTarget] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getOwnerReviews();
      if (res.data?.reviews) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      showToast('Failed to fetch property reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleSendResponse = async () => {
    if (!replyTarget) return;
    if (!replyInput.trim()) {
      showToast('Please enter a response message.', 'error');
      return;
    }

    setReplyLoading(true);
    try {
      await replyToReview(replyTarget._id || replyTarget.id, replyInput.trim());
      showToast('Response posted to guest review successfully!');
      setReplyInput('');
      setReplyTarget(null);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post reply', 'error');
    } finally {
      setReplyLoading(false);
    }
  };

  const count = reviews.length;
  const avg = count > 0 ? (reviews.reduce((a, b) => a + (b.rating || 5), 0) / count).toFixed(1) : 'N/A';

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500 fill-current" />
              Tenant Reviews & Feedback Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Read tenant reviews and post single official responses to guest feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center px-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Average Score</span>
              <span className="text-lg font-black text-[#0F172A]">{avg} ★</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center px-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Reviews</span>
              <span className="text-lg font-black text-blue-600">{count}</span>
            </div>
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <Loader text="Loading property reviews..." />
        ) : reviews.length === 0 ? (
          <EmptyState
            title="No Reviews Received Yet"
            description="Tenant reviews will appear here once verified guests submit feedback after their stay."
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const rId = rev._id || rev.id;
              const reviewerName = rev.seekerName || rev.seeker?.name || 'Aarav P.';
              const pgName = rev.pg?.name || 'My PG';
              const dateStr = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Recently';
              
              const ownerReplyText = typeof rev.ownerReply === 'object' ? rev.ownerReply?.text : rev.ownerReply;

              return (
                <div key={rId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 tracking-wider uppercase">{pgName}</span>
                      <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {reviewerName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Stay
                      </span>

                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-current' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-amber-900 ml-1">{rev.rating}.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {rev.title && <h4 className="font-bold text-sm text-[#0F172A]">{rev.title}</h4>}
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>

                  {ownerReplyText ? (
                    <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs space-y-1 text-blue-900">
                      <span className="font-bold flex items-center gap-1 text-blue-950">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        Your Response:
                      </span>
                      <p className="italic">"{ownerReplyText}"</p>
                    </div>
                  ) : (
                    <div className="pt-2 flex justify-end">
                      <Button
                        variant="secondary"
                        size="xs"
                        icon={Send}
                        onClick={() => {
                          setReplyTarget(rev);
                          setReplyInput('');
                        }}
                      >
                        Reply to Review
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={Boolean(replyTarget)}
        onClose={() => setReplyTarget(null)}
        title="Post Official Landlord Response"
      >
        <div className="space-y-4 font-sans text-xs">
          <p className="text-slate-500">
            Replying to tenant <strong>{replyTarget?.seekerName || replyTarget?.seeker?.name}</strong> for <strong>{replyTarget?.pg?.name}</strong>.
          </p>

          <Textarea
            label="Your Response"
            placeholder="Thank you for your feedback! We are glad you enjoyed your stay..."
            rows={4}
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setReplyTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" loading={replyLoading} onClick={handleSendResponse}>
              Post Response
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

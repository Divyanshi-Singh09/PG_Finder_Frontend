import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ArrowLeft, Send, ShieldCheck, ThumbsUp } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import { getReviewEligibility, createReview } from '../../services/reviewService';

export default function ReviewFormPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [categories, setCategories] = useState({
    cleanliness: 5,
    location: 5,
    facilities: 5,
    valueForMoney: 5,
    management: 5,
    safety: 5,
  });
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  useEffect(() => {
    getReviewEligibility(bookingId)
      .then((res) => {
        if (res.data?.booking) setBooking(res.data.booking);
        if (res.data && !res.data.eligible) {
          if (res.data.alreadyReviewed) setErrorMsg('You have already submitted a review for this stay.');
          else setErrorMsg('You are not eligible to review this booking.');
        }
      })
      .catch(() => setErrorMsg('Failed to verify review eligibility.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleCategoryChange = (key, val) => {
    setCategories((prev) => ({ ...prev, [key]: parseInt(val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 10) {
      setErrorMsg('Please write a detailed comment (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await createReview({
        bookingId,
        rating,
        categories,
        title,
        comment,
      });

      showToast('Review submitted successfully! Thank you for your feedback.', 'success');
      setTimeout(() => navigate('/seeker/bookings'), 1200);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Container className="py-12 text-center text-xs text-slate-400">Verifying stay eligibility...</Container>;

  return (
    <Container className="py-8 font-sans max-w-2xl mx-auto">
      <div className="space-y-6">
        
        {/* Back Link */}
        <Link to="/seeker/bookings" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" />
          Back to My Bookings
        </Link>

        {/* Form Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Rate Your Stay</h1>
              <p className="text-xs text-slate-500 mt-1">
                Ref: {booking?.bookingReference || 'Stay'} • {booking?.pg?.name || 'PG Property'}
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Stay
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Overall Rating Stars */}
            <div className="space-y-2 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Overall Stay Experience</span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-amber-500 fill-current' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-extrabold text-[#0F172A] block">
                {rating === 5 && 'Outstanding (5/5)'}
                {rating === 4 && 'Very Good (4/5)'}
                {rating === 3 && 'Average (3/5)'}
                {rating === 2 && 'Below Expectation (2/5)'}
                {rating === 1 && 'Poor (1/5)'}
              </span>
            </div>

            {/* Optional Category Rating Sliders */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Category Ratings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                {[
                  { key: 'cleanliness', label: 'Cleanliness' },
                  { key: 'location', label: 'Location' },
                  { key: 'facilities', label: 'Facilities' },
                  { key: 'valueForMoney', label: 'Value for Money' },
                  { key: 'management', label: 'Management' },
                  { key: 'safety', label: 'Safety' },
                ].map((cat) => (
                  <div key={cat.key} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span>{cat.label}</span>
                    <select
                      value={categories[cat.key]}
                      onChange={(e) => handleCategoryChange(cat.key, e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-[#0F172A]"
                    >
                      <option value={5}>5 ★★★★★</option>
                      <option value={4}>4 ★★★★</option>
                      <option value={3}>3 ★★★</option>
                      <option value={2}>2 ★★</option>
                      <option value={1}>1 ★</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <Input
              label="Review Title (Optional)"
              placeholder="e.g. Clean rooms and friendly landlord"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              label="Detailed Experience Comment"
              placeholder="Describe your stay, cleanliness, location convenience, and overall comfort..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <div className="pt-2 flex justify-end gap-3">
              <Link to="/seeker/bookings">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button variant="primary" type="submit" icon={Send} loading={submitting}>
                Submit Review
              </Button>
            </div>
          </form>
        </div>

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

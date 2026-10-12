import React, { useState } from 'react';
import { Star, ShieldCheck, User, ThumbsUp, MessageSquare, Flag } from 'lucide-react';
import Badge from '../common/Badge';
import { toggleHelpful } from '../../services/reviewService';

export default function ReviewCard({ review, onEdit, onDelete, isAuthor = false, onReport }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [voted, setVoted] = useState(review.userVotedHelpful || false);
  const [voting, setVoting] = useState(false);

  const reviewerName = review.seekerName || review.seeker?.name || 'Aarav P.';
  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  const handleHelpfulClick = async () => {
    setVoting(true);
    try {
      const res = await toggleHelpful(review._id || review.id);
      if (res.data) {
        setHelpfulCount(res.data.helpfulCount);
        setVoted(res.data.voted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  const ownerReplyText = typeof review.ownerReply === 'object' ? review.ownerReply?.text : review.ownerReply;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3.5 font-sans">
      
      {/* Header Row: Reviewer Name & Star Rating */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm text-[#0F172A]">{reviewerName}</h4>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Stay
              </span>
            </div>
            <span className="text-[11px] text-slate-400">{dateStr}</span>
          </div>
        </div>

        {/* Star Rating Display */}
        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
          <div className="flex text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-current' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-amber-900 ml-1">{review.rating}.0</span>
        </div>
      </div>

      {/* Review Title & Content */}
      <div className="space-y-1">
        {review.title && <h5 className="font-bold text-sm text-[#0F172A]">{review.title}</h5>}
        <p className="text-xs text-slate-600 leading-relaxed">{review.comment}</p>
      </div>

      {/* Category Breakdown (If Present) */}
      {review.categories && (
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(review.categories).map(([catKey, score]) => (
            <span key={catKey} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {catKey}: {score}★
            </span>
          ))}
        </div>
      )}

      {/* Owner Response Bubble */}
      {ownerReplyText && (
        <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs space-y-1 text-blue-900">
          <span className="font-bold flex items-center gap-1 text-blue-950">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            Response from Property Owner
          </span>
          <p className="italic">"{ownerReplyText}"</p>
        </div>
      )}

      {/* Footer Bar: Helpful Counter & Report Trigger */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <button
          type="button"
          disabled={voting}
          onClick={handleHelpfulClick}
          className={`flex items-center gap-1.5 font-bold transition-all px-2.5 py-1 rounded-xl ${
            voted ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${voted ? 'fill-current' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>

        {onReport && (
          <button
            type="button"
            onClick={onReport}
            className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1"
          >
            <Flag className="w-3 h-3" />
            Report
          </button>
        )}
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

export default function ReviewFormModal({ isOpen, onClose, onSubmit, initialData = null, loading = false }) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [comment, setComment] = useState(initialData?.comment || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 0);
      setTitle(initialData.title || '');
      setComment(initialData.comment || '');
    } else {
      setRating(0);
      setTitle('');
      setComment('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Please select a star rating (1 to 5 stars).';
    }

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = 'Please enter a title of at least 3 characters.';
    }

    if (!comment.trim() || comment.trim().length < 10) {
      newErrors.comment = 'Please write about your experience (at least 10 characters).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ rating, title: title.trim(), comment: comment.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Your Review' : 'Write a Verified Review'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Star Rating Hover Selector */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">Your Rating</label>
          <div className="flex items-center gap-1.5 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => { setRating(star); setErrors((prev) => ({ ...prev, rating: null })); }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-slate-200 focus:outline-hidden transition-transform hover:scale-110"
                aria-label={`${star} star`}
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= (hoverRating || rating)
                      ? 'text-amber-400 fill-current'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-slate-500 ml-2">
              {hoverRating || rating ? `${hoverRating || rating} Stars` : 'Select stars'}
            </span>
          </div>
          {errors.rating && <p className="text-xs text-rose-500 font-medium">{errors.rating}</p>}
        </div>

        <Input
          label="Review Title"
          placeholder="e.g. Great location & clean rooms"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: null })); }}
          error={errors.title}
          required
        />

        <Textarea
          label="Your Experience"
          placeholder="Share details about food quality, owner behavior, hygiene, or room ventilation..."
          rows={4}
          value={comment}
          onChange={(e) => { setComment(e.target.value); setErrors((prev) => ({ ...prev, comment: null })); }}
          error={errors.comment}
          required
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" loading={loading} type="submit">
            {initialData ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>

      </form>
    </Modal>
  );
}

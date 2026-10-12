import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Check, Users, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { getPublicPGAvailability, requestVisit } from '../../services/visitService';

export default function ScheduleVisitModal({ isOpen, onClose, pg, onSuccess }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [seekerNote, setSeekerNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && pg) {
      setLoading(true);
      setErrorMsg('');
      const pgId = pg._id || pg.id;

      getPublicPGAvailability(pgId)
        .then((res) => {
          if (res.data?.slots) {
            setSlots(res.data.slots);
            if (res.data.slots.length > 0) {
              setSelectedSlot(res.data.slots[0]);
            }
          }
        })
        .catch(() => setErrorMsg('Failed to load visit availability slots.'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, pg]);

  if (!isOpen || !pg) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg('Please select a visit time slot.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const pgId = pg._id || pg.id;
      const slotId = selectedSlot._id || selectedSlot.id;

      await requestVisit({
        pgId,
        availabilitySlotId: slotId,
        seekerNote,
      });

      if (onSuccess) onSuccess('Visit request submitted successfully!');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to request visit. Please try again.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Schedule Physical PG Visit
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1">{pg.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading visit availability...</div>
          ) : slots.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700">No Visit Slots Available</p>
              <p className="text-xs text-slate-500">
                The owner has not published any open visit slots for this property yet. You can still send an enquiry.
              </p>
            </div>
          ) : (
            <>
              {/* Slots Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Available Date & Time Slot
                </label>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {slots.map((slot) => {
                    const slotId = slot._id || slot.id;
                    const isSelected = selectedSlot && (selectedSlot._id || selectedSlot.id) === slotId;
                    const spotsLeft = slot.maxVisitors - slot.bookedVisitors;

                    return (
                      <div
                        key={slotId}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/60 border-[#2563EB] ring-2 ring-blue-100'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-[#0F172A] block">
                              {new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-xs text-slate-500">
                              {slot.startTime} – {slot.endTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={spotsLeft > 1 ? 'success' : 'warning'}>
                            {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left
                          </Badge>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seeker Note Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Optional Note for Owner
                </label>
                <textarea
                  rows={3}
                  value={seekerNote}
                  onChange={(e) => setSeekerNote(e.target.value)}
                  placeholder="e.g. I am looking to inspect single occupancy rooms starting next month..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={slots.length === 0 || !selectedSlot}
              loading={submitting}
            >
              Confirm Visit Request
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}

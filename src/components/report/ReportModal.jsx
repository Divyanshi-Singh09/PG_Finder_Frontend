import React, { useState } from 'react';
import { Flag, X, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import { createReport } from '../../services/verificationService';

export default function ReportModal({ isOpen, onClose, pg, onSuccess }) {
  const [reason, setReason] = useState('Incorrect information');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !pg) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !description || description.trim().length < 5) {
      setErrorMsg('Please provide a valid report description (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const pgId = pg._id || pg.id;
      await createReport({
        pgId,
        reason,
        description,
      });

      if (onSuccess) onSuccess('Report submitted successfully! Thank you for helping keep PGFinder safe.');
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit report. Please try again.');
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
              <Flag className="w-5 h-5 text-rose-400" />
              Report PG Listing
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Reports are reviewed by PGFinder administrators. False or abusive reporting may result in account restrictions.
            </p>
          </div>

          <Select
            label="Reason for Report"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={[
              { label: 'Incorrect Information or Rent', value: 'Incorrect information' },
              { label: 'Fake Listing or Non-Existent Address', value: 'Fake listing' },
              { label: 'Misleading or Outdated Photos', value: 'Wrong photos' },
              { label: 'PG Permanently Unavailable', value: 'Unavailable PG' },
              { label: 'Suspicious Activity or Payment Demands', value: 'Suspicious activity' },
              { label: 'Other Concern', value: 'Other' },
            ]}
            required
          />

          <Textarea
            label="Detailed Description"
            placeholder="Please provide specific details about the issue..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="danger" fullWidth type="submit" loading={submitting}>
              Submit Report
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}

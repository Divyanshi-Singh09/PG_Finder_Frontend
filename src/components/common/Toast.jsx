import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({
  isOpen,
  onClose,
  message,
  type = 'info', // success, error, info, warning
  duration = 4000,
}) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    error: 'bg-rose-800 text-white border-rose-700',
    info: 'bg-[#0F172A] text-white border-slate-700',
    warning: 'bg-amber-800 text-white border-amber-700',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-sm ${styles[type] || styles.info}`}>
        {icons[type]}
        <span className="text-sm font-medium pr-2">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-slate-300 hover:text-white p-1 rounded-md"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

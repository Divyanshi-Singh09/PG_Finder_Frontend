import React from 'react';
import { SearchX } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No PGs Found',
  description = "We couldn't find any listings matching your current criteria.",
  icon: Icon = SearchX,
  actionLabel = '',
  onAction = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

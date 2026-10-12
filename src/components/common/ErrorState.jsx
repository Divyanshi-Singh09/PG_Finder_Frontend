import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this content. Please check your internet connection or try again.",
  onRetry = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-200 max-w-md mx-auto my-6 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
}

import React from 'react';
import Loader from './Loader';

/**
 * Reusable Button component matching PGFinder design system
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  icon: Icon = null,
  fullWidth = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary: 'bg-[#2563EB] hover:bg-blue-700 text-white focus:ring-blue-500 shadow-xs active:scale-[0.98]',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-700 shadow-xs active:scale-[0.98]',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-[#0F172A] focus:ring-blue-500 shadow-xs active:scale-[0.98]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-xs active:scale-[0.98]',
    ghost: 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 focus:ring-slate-300',
    text: 'text-[#2563EB] hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm gap-1.5 min-h-[36px]',
    md: 'px-4 py-2 text-sm sm:text-base gap-2 min-h-[42px]',
    lg: 'px-6 py-3 text-base sm:text-lg gap-2.5 min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader size="sm" className="mr-1.5" />
      ) : Icon ? (
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}

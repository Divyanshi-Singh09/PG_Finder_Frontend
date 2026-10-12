import React from 'react';

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon = null,
}) {
  const variants = {
    primary: 'bg-blue-50 text-[#2563EB] border-blue-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    dark: 'bg-[#0F172A] text-white border-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-md border',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-full border',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-full border',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

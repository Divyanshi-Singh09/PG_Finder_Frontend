import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function Avatar({ src, name = 'User', size = 'md', className = '' }) {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-slate-200 text-[#0F172A] font-semibold overflow-hidden shrink-0 border border-slate-300 ${sizes[size] || sizes.md} ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span>{getInitials(name)}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-slate-500" />
      )}
    </div>
  );
}

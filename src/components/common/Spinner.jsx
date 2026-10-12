import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', className = '', color = 'text-current' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <Loader2 className={`animate-spin ${sizes[size] || sizes.md} ${color} ${className}`} />
  );
}

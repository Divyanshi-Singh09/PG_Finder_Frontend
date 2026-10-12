import React from 'react';
import Spinner from './Spinner';

export default function Loader({ text = '', size = 'md', center = false, className = '' }) {
  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <Spinner size={size} />
      {text && <span className="text-sm text-[#64748B] font-medium">{text}</span>}
    </div>
  );

  if (center) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] w-full p-8 text-center">
        {content}
      </div>
    );
  }

  return content;
}

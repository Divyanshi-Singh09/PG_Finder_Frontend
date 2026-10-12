import React from 'react';

export default function Divider({ label = '', className = '', vertical = false }) {
  if (vertical) {
    return <div className={`w-[1px] bg-slate-200 self-stretch my-1 ${className}`} />;
  }

  if (label) {
    return (
      <div className={`relative flex py-3 items-center ${className}`}>
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>
    );
  }

  return <hr className={`border-t border-slate-200 my-4 ${className}`} />;
}

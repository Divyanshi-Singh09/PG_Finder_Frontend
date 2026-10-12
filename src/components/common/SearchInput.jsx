import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search by name, location or facility...',
  className = '',
  ...props
}) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Clear search input"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

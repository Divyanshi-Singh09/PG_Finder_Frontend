import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
  trigger,
  label = 'Select',
  items = [],
  align = 'right',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div>
        {trigger ? (
          <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-medium text-[#0F172A] bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          >
            <span>{label}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-200/80 py-1.5 z-40 focus:outline-none animate-in fade-in duration-150`}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0F172A] flex items-center gap-2 transition-colors ${
                item.active ? 'bg-blue-50 text-[#2563EB] font-semibold' : ''
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 text-slate-400" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';

export default function Radio({
  label,
  id,
  name,
  value,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  description = '',
  ...props
}) {
  const radioId = id || `rad-${name}-${value}`;

  return (
    <label 
      htmlFor={radioId} 
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <input
        id={radioId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 mt-0.5 border-slate-300 text-[#2563EB] focus:ring-blue-500 accent-[#2563EB] cursor-pointer"
        {...props}
      />
      <div className="text-sm">
        {label && <span className="font-medium text-[#0F172A]">{label}</span>}
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
    </label>
  );
}

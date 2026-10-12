import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs sm:text-sm font-semibold text-[#0F172A]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all outline-none text-[#0F172A] bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
          }`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}

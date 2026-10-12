import React from 'react';

/**
 * Reusable SectionHeading for consistent section headers across pages
 */
export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  className = '',
}) {
  return (
    <div className={`mb-8 sm:mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base lg:text-lg text-[#64748B] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

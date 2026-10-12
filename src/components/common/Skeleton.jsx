import React from 'react';

export default function Skeleton({
  variant = 'text', // text, card, avatar, rect
  className = '',
  width,
  height,
  count = 1,
}) {
  const baseClass = 'animate-pulse bg-slate-200 rounded-md';

  const variants = {
    text: 'h-4 w-full rounded',
    avatar: 'h-10 w-10 rounded-full',
    rect: 'h-32 w-full rounded-xl',
    card: 'h-64 w-full rounded-2xl',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${baseClass} ${variants[variant] || variants.text} ${className}`}
          style={style}
        />
      ))}
    </>
  );
}

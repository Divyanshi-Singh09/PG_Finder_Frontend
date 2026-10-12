import React from 'react';

export default function RangeSlider({
  min = 2000,
  max = 50000,
  step = 500,
  value = { min: 4000, max: 25000 },
  onChange,
}) {
  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), value.max - step);
    onChange({ ...value, min: newMin });
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), value.min + step);
    onChange({ ...value, max: newMax });
  };

  const minPercent = Math.max(0, Math.min(100, ((value.min - min) / (max - min)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((value.max - min) / (max - min)) * 100));

  return (
    <div className="space-y-3 font-sans">
      
      {/* Price Header Display */}
      <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
        <span>₹{value.min.toLocaleString('en-IN')}</span>
        <span className="text-slate-400 font-normal">to</span>
        <span>₹{value.max.toLocaleString('en-IN')}{value.max >= max ? '+' : ''}</span>
      </div>

      {/* Dual Slider Track */}
      <div className="relative w-full h-2 rounded-full bg-slate-200">
        
        {/* Active Selected Track Segment */}
        <div
          className="absolute h-full bg-[#2563EB] rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Thumb Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer focus:outline-none z-20 opacity-0"
        />

        {/* Max Thumb Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer focus:outline-none z-30 opacity-0"
        />

        {/* Visual Knobs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-5 bg-white border-2 border-[#2563EB] rounded-full shadow-md pointer-events-none z-10"
          style={{ left: `${minPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-5 bg-white border-2 border-[#2563EB] rounded-full shadow-md pointer-events-none z-10"
          style={{ left: `${maxPercent}%` }}
        />

      </div>

      {/* Quick Select Preset Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {[
          { label: '< ₹8k', min: min, max: 8000 },
          { label: '₹8k–15k', min: 8000, max: 15000 },
          { label: '₹15k–25k', min: 15000, max: 25000 },
          { label: '₹25k+', min: 25000, max: max },
        ].map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChange({ min: preset.min, max: preset.max })}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              value.min === preset.min && value.max === preset.max
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

    </div>
  );
}

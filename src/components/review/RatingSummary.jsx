import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

export default function RatingSummary({ ratingSummary }) {
  const average = ratingSummary?.average || 0;
  const count = ratingSummary?.count || 0;
  const dist = ratingSummary?.distribution || { one: 0, two: 0, three: 0, four: 0, five: 0 };
  const catAvg = ratingSummary?.categoryAverages || null;

  const getPercent = (val) => (count > 0 ? Math.round((val / count) * 100) : 0);

  const starBars = [
    { stars: 5, val: dist.five },
    { stars: 4, val: dist.four },
    { stars: 3, val: dist.three },
    { stars: 2, val: dist.two },
    { stars: 1, val: dist.one },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 font-sans">
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        {/* Left Col: Big Score */}
        <div className="text-center sm:border-r border-slate-100 sm:pr-6 space-y-1">
          <div className="text-5xl font-black text-[#0F172A] tracking-tight">{average > 0 ? average.toFixed(1) : 'N/A'}</div>
          <div className="flex justify-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(average) ? 'fill-current' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-semibold">{count} Verified {count === 1 ? 'Review' : 'Reviews'}</p>
        </div>

        {/* Right Cols: Distribution Bars */}
        <div className="sm:col-span-2 space-y-2">
          {starBars.map(({ stars, val }) => {
            const percent = getPercent(val);
            return (
              <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="w-8 shrink-0 flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 text-amber-400 fill-current" />
                </span>

                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-10 text-right text-slate-400 text-[11px] font-bold">{val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Ratings Grid (If Present) */}
      {catAvg && count > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-3">Category Rating Scores</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {[
              { label: 'Cleanliness', score: catAvg.cleanliness },
              { label: 'Location', score: catAvg.location },
              { label: 'Facilities', score: catAvg.facilities },
              { label: 'Value for Money', score: catAvg.valueForMoney },
              { label: 'Management', score: catAvg.management },
              { label: 'Safety', score: catAvg.safety },
            ].map((c) => (
              <div key={c.label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-600">{c.label}</span>
                <span className="font-black text-[#0F172A] flex items-center gap-1">
                  {c.score?.toFixed(1)} <Star className="w-3 h-3 text-amber-400 fill-current" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function CompareBar({ comparePgs = [], onRemovePg, onClearAll }) {
  if (comparePgs.length === 0) return null;

  const compareIds = comparePgs.map((p) => p._id || p.id).join(',');

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[480px] z-40 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl border border-slate-700 shadow-2xl space-y-3 font-sans animate-slideUp">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
          <span className="text-xs font-black">Compare Side-by-Side ({comparePgs.length}/4)</span>
        </div>

        <button onClick={onClearAll} className="text-[11px] font-bold text-slate-400 hover:text-white">
          Clear
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {comparePgs.map((pg) => {
          const pgId = pg._id || pg.id;
          return (
            <div key={pgId} className="bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700 flex items-center gap-2 shrink-0 text-xs">
              <span className="font-bold truncate max-w-[110px]">{pg.name}</span>
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400 cursor-pointer" onClick={() => onRemovePg(pgId)} />
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <Link to={`/compare?ids=${compareIds}`}>
          <Button variant="primary" size="xs" icon={ArrowRight}>
            Compare Properties Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

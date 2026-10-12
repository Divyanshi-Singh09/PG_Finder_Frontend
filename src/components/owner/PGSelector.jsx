import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';

export default function PGSelector({ pgs = [], selectedPgId, onSelectPg }) {
  if (pgs.length === 0) return null;

  return (
    <div className="relative inline-block font-sans">
      <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
        <Building2 className="w-4 h-4 text-[#2563EB]" />
        <select
          value={selectedPgId || ''}
          onChange={(e) => onSelectPg(e.target.value)}
          className="bg-transparent font-extrabold text-xs text-[#0F172A] focus:outline-none cursor-pointer pr-4"
        >
          <option value="">All Managed Properties ({pgs.length})</option>
          {pgs.map((pg) => {
            const id = pg._id || pg.id;
            return (
              <option key={id} value={id}>
                {pg.name} ({pg.address?.locality || 'Noida'})
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Star, Building2, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function MapView({ pgs = [], selectedPgId, onSelectPg }) {
  const [activePg, setActivePg] = useState(pgs[0] || null);

  const handleMarkerClick = (pg) => {
    setActivePg(pg);
    if (onSelectPg) onSelectPg(pg._id || pg.id);
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-lg flex flex-col font-sans">
      
      {/* Decorative SVG Map Canvas */}
      <div className="relative flex-1 bg-[#0F172A] p-6 overflow-hidden flex items-center justify-center">
        
        {/* Map Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Decorative Grid Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/80" strokeWidth="1">
          <line x1="0" y1="20%" x2="100%" y2="20%" />
          <line x1="0" y1="50%" x2="100%" y2="50%" />
          <line x1="0" y1="80%" x2="100%" y2="80%" />
          <line x1="25%" y1="0" x2="25%" y2="100%" />
          <line x1="60%" y1="0" x2="60%" y2="100%" />
        </svg>

        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-bold flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-400" />
          <span>Interactive Location View ({pgs.length} PGs)</span>
        </div>

        {/* Interactive PG Markers */}
        <div className="relative w-full h-full max-w-2xl flex flex-wrap items-center justify-around p-8">
          {pgs.map((pg, idx) => {
            const pgId = pg._id || pg.id;
            const isSelected = activePg && (activePg._id || activePg.id) === pgId;
            const rentMin = pg.rent?.min || (pg.roomTypes && pg.roomTypes[0] ? pg.roomTypes[0].rent : 8000);

            return (
              <button
                key={pgId}
                type="button"
                onClick={() => handleMarkerClick(pg)}
                className={`relative group transition-transform duration-200 transform ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-10'
                }`}
                style={{
                  margin: '16px',
                }}
              >
                {/* Marker Pin Bubble */}
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-black shadow-xl flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-white ring-4 ring-blue-500/30'
                      : 'bg-white text-[#0F172A] border-slate-200 hover:bg-blue-50'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                  <span>₹{(rentMin / 1000).toFixed(0)}k</span>
                </div>

                {/* Pin Pointer Tail */}
                <div
                  className={`w-2 h-2 mx-auto -mt-1 transform rotate-45 ${
                    isSelected ? 'bg-[#2563EB]' : 'bg-white'
                  }`}
                />
              </button>
            );
          })}
        </div>

      </div>

      {/* Selected Property Preview Drawer */}
      {activePg && (
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-4">
            <img
              src={
                activePg.images && activePg.images[0]
                  ? activePg.images[0].url
                  : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
              }
              alt={activePg.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
            />
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-[#0F172A]">{activePg.name}</h4>
                <Badge variant="primary">{activePg.pgType}</Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {activePg.address?.locality ? `${activePg.address.locality}, ` : ''}{activePg.address?.city || 'Location available'}
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-black text-[#2563EB]">
                  ₹{(activePg.rent?.min || 8000).toLocaleString('en-IN')}/mo
                </span>
                {activePg.distanceText && (
                  <span className="text-emerald-600 font-semibold">{activePg.distanceText}</span>
                )}
                {activePg.ratingSummary?.average > 0 && (
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {activePg.ratingSummary.average}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to={`/pg/${activePg._id || activePg.id}`}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <span>View Full Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, DoorOpen, X, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function PGMap({ pgs = [], center = { lat: 28.6272, lng: 77.3726 } }) {
  const [selectedPG, setSelectedPG] = useState(pgs[0] || null);

  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-md font-sans">
      
      {/* Map Graphic Canvas / Background Simulation */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 bg-slate-950" />
      
      {/* Center Radar Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-blue-500/20 bg-blue-500/5 animate-pulse" />

      {/* Map Control Header */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-slate-700/80 text-xs font-bold flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#2563EB]" />
        <span>Interactive Map Discovery ({pgs.length} Properties Located)</span>
      </div>

      {/* Map Markers Overlay Grid */}
      <div className="absolute inset-0 p-12 flex flex-wrap items-center justify-around gap-8">
        {pgs.map((pg, idx) => {
          const pgId = pg._id || pg.id;
          const isSelected = (selectedPG?._id || selectedPG?.id) === pgId;
          const minRent = pg.rent?.min || (pg.roomTypes && pg.roomTypes[0] ? pg.roomTypes[0].rent : 8000);

          return (
            <button
              key={pgId || idx}
              type="button"
              onClick={() => setSelectedPG(pg)}
              className={`group relative px-3 py-1.5 rounded-full font-black text-xs transition-all flex items-center gap-1 shadow-lg ${
                isSelected
                  ? 'bg-[#2563EB] text-white ring-4 ring-blue-500/30 scale-110 z-20'
                  : 'bg-white text-slate-900 hover:bg-blue-50 hover:scale-105 z-10'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
              <span>₹{(minRent / 1000).toFixed(1)}k</span>
            </button>
          );
        })}
      </div>

      {/* Selected Property Floating Preview Card */}
      {selectedPG && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex gap-3">
              <img
                src={selectedPG.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                alt={selectedPG.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-[#0F172A] truncate max-w-[160px]">
                    {selectedPG.name}
                  </h4>
                  {selectedPG.isVerifiedPG && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-slate-500 truncate">
                  {selectedPG.address?.locality || 'Locality'}, {selectedPG.address?.city || 'City'}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-black text-[#0F172A]">
                    ₹{(selectedPG.rent?.min || 8000).toLocaleString('en-IN')}/mo
                  </span>
                  {selectedPG.ratingSummary?.average > 0 && (
                    <span className="text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-0.5 border border-amber-100">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      {selectedPG.ratingSummary.average}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPG(null)}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <Link to={`/pg/${selectedPG._id || selectedPG.id}`} className="flex-1">
              <Button variant="primary" size="xs" fullWidth icon={ChevronRight}>
                View Details
              </Button>
            </Link>

            {selectedPG.onlineBookingEnabled !== false && (
              <Link to={`/seeker/book/${selectedPG._id || selectedPG.id}`}>
                <Button variant="secondary" size="xs" icon={DoorOpen}>
                  Book
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

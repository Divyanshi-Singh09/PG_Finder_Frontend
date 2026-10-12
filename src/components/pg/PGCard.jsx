import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, ShieldCheck, Users, Navigation } from 'lucide-react';
import Badge from '../common/Badge';
import { savePG, removePG } from '../../services/favoriteService';
import { useAuth } from '../../context/AuthContext';

import { SlidersHorizontal } from 'lucide-react';

export default function PGCard({ pg, onFavoriteToggle, isFavorite = false, onToggleCompare, isCompared = false }) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'SEEKER') {
      return;
    }

    const previous = favorite;
    setFavorite(!previous);
    setLoading(true);

    try {
      const pgId = pg._id || pg.id;
      if (previous) {
        await removePG(pgId);
      } else {
        await savePG(pgId);
      }
      if (onFavoriteToggle) onFavoriteToggle(pgId, !previous);
    } catch (err) {
      setFavorite(previous);
    } finally {
      setLoading(false);
    }
  };

  const coverImg = pg.images?.find((img) => img.isCover)?.url || pg.images?.[0]?.url || pg.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
  const locationText = pg.address?.locality ? `${pg.address.locality}, ${pg.address.city}` : pg.address?.city || pg.location || 'Location available';
  const minRent = pg.rent?.min !== undefined ? pg.rent.min : (typeof pg.rent === 'number' ? pg.rent : 8000);
  const maxRent = pg.rent?.max !== undefined ? pg.rent.max : null;
  const pgCategory = pg.pgType || pg.type || 'CO_LIVING';

  const ratingAvg = pg.ratingSummary?.average || pg.rating || 0;
  const ratingCount = pg.ratingSummary?.count !== undefined ? pg.ratingSummary.count : (pg.reviewsCount || 0);

  const roomTypesText = pg.roomTypes?.length
    ? pg.roomTypes.map((r) => r.type.replace('_', ' ')).join(', ')
    : pg.sharingTypes?.join(', ') || 'Single, Double';

  const totalAvailableRooms = pg.roomTypes?.reduce((acc, r) => acc + (r.availableRooms || 0), 0) || 2;

  return (
    <Link
      to={`/pg/${pg._id || pg.id}`}
      className="group bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Image Banner */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          <img
            src={coverImg}
            alt={pg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category & Status Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <Badge variant="primary">
              {pgCategory === 'CO_LIVING' ? 'Co-living' : pgCategory === 'GIRLS' ? 'Girls PG' : 'Boys PG'}
            </Badge>
            {pg.status === 'APPROVED' && (
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
            {pg.distanceText && (
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Navigation className="w-3 h-3 text-blue-200" />
                {pg.distanceText}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(pg);
                }}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isCompared
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900/40 text-white hover:bg-slate-900/60'
                }`}
                title={isCompared ? 'Remove from compare' : 'Compare property'}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleFavoriteClick}
              disabled={loading}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                favorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-900/40 text-white hover:bg-slate-900/60'
              }`}
              aria-label={favorite ? 'Remove from saved PGs' : 'Save this PG'}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Rating Overlay Badge */}
          <div className="absolute bottom-3 left-3 z-10">
            {ratingCount > 0 ? (
              <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>{ratingAvg.toFixed(1)}</span>
                <span className="text-slate-300 font-normal text-[10px]">({ratingCount})</span>
              </div>
            ) : (
              <div className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                New
              </div>
            )}
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-extrabold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
              {pg.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{locationText}</span>
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#2563EB]" />
              {roomTypesText}
            </span>
            <span className="font-bold text-emerald-600">
              {totalAvailableRooms > 0 ? `${totalAvailableRooms} Beds Left` : 'Fully Booked'}
            </span>
          </div>

          {/* Facilities Badges */}
          {pg.facilities && pg.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
              {pg.facilities.slice(0, 4).map((fac, idx) => (
                <span key={idx} className="bg-slate-100 px-2.5 py-0.5 rounded-lg font-semibold text-slate-700">
                  {fac}
                </span>
              ))}
              {pg.facilities.length > 4 && (
                <span className="bg-slate-100 px-2 py-0.5 rounded-lg font-medium text-slate-400">
                  +{pg.facilities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Rent & CTA */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <div>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Starts From</span>
          <div className="text-lg font-black text-[#0F172A]">
            ₹{minRent.toLocaleString('en-IN')}
            {maxRent && maxRent > minRent ? ` - ₹${maxRent.toLocaleString('en-IN')}` : ''}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
        </div>

        <span className="text-xs font-bold text-[#2563EB] group-hover:underline">
          View Details →
        </span>
      </div>
    </Link>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Search, MapPin, Building2 } from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { getFavorites, removePG } from '../../services/favoriteService';

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const fetchSavedPGs = async () => {
    try {
      setLoading(true);
      const res = await getFavorites();
      if (res.data?.favorites) {
        setFavorites(res.data.favorites);
      }
    } catch (err) {
      showToast('Failed to fetch saved properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPGs();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleRemove = async (pgId) => {
    try {
      await removePG(pgId);
      setFavorites((prev) => prev.filter((p) => (p._id || p.id) !== pgId));
      showToast('PG removed from saved list.');
    } catch (err) {
      showToast('Failed to remove property', 'error');
    }
  };

  if (loading) {
    return <Loader center text="Loading your saved PGs..." size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-current" />
            Saved PG Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your personal shortlist of bookmarked PG listings.
          </p>
        </div>
        <Link to="/search">
          <Button variant="outline" size="sm" icon={Search}>
            Explore More PGs
          </Button>
        </Link>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="No Saved PGs Yet"
          description="Start exploring PG properties and click the heart icon to save listings for easy access later."
          actionLabel="Search PGs Now"
          onAction={() => (window.location.href = '/search')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((pg) => {
            const pgId = pg._id || pg.id;
            const coverImg = pg.images?.find((img) => img.isCover)?.url || pg.images?.[0]?.url || pg.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
            const isLive = pg.status === 'APPROVED';

            return (
              <div key={pgId} className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden group">
                
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img src={coverImg} alt={pg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-3 left-3">
                    {isLive ? (
                      <Badge variant="success">Approved</Badge>
                    ) : (
                      <Badge variant="danger">Currently Unavailable</Badge>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(pgId)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 text-white hover:bg-rose-600 transition-colors"
                    aria-label="Remove from Saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-[#0F172A] line-clamp-1">{pg.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pg.address?.city || pg.location}</span>
                  </p>
                  <div className="text-sm font-extrabold text-[#0F172A] pt-1">
                    ₹{(pg.rent?.min || 8000).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <Link to={`/pg/${pgId}`} className="flex-1">
                    <Button variant={isLive ? 'primary' : 'outline'} size="sm" fullWidth disabled={!isLive}>
                      {isLive ? 'View Property' : 'Unavailable'}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" icon={Trash2} onClick={() => handleRemove(pgId)}>
                    Remove
                  </Button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

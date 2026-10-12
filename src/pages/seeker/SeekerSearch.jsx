import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Heart, 
  Navigation,
  RotateCcw,
  Check
} from 'lucide-react';

import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Toast from '../../components/common/Toast';

import { searchPGs, getPGAutocomplete } from '../../services/pgService';
import { useAuth } from '../../context/AuthContext';

export default function SeekerSearch() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search Filters
  const [queryStr, setQueryStr] = useState(searchParams.get('q') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '5000');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '25000');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'relevance');

  // Results State
  const [pgs, setPgs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const params = {
        q: queryStr,
        minRent,
        maxRent,
        gender,
        roomType,
        verified: verifiedOnly ? 'true' : undefined,
        sort: sortOption,
      };

      const res = await searchPGs(params);
      if (res.data?.pgs) setPgs(res.data.pgs);

      // Fetch personalized recommendations
      const recRes = await fetch(`http://localhost:5000/api/pgs/recommendations?maxRent=${maxRent}&gender=${gender}`);
      const recData = await recRes.json();
      if (recData.data?.pgs) setRecommendations(recData.data.pgs);

    } catch (err) {
      showToast('Failed to load search results.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchParams]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (queryStr) params.set('q', queryStr);
    if (minRent) params.set('minRent', minRent);
    if (maxRent) params.set('maxRent', maxRent);
    if (gender) params.set('gender', gender);
    if (roomType) params.set('roomType', roomType);
    if (verifiedOnly) params.set('verified', 'true');
    if (sortOption) params.set('sort', sortOption);

    setSearchParams(params);
    setIsMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setQueryStr('');
    setMinRent('5000');
    setMaxRent('25000');
    setGender('');
    setRoomType('');
    setVerifiedOnly(false);
    setSortOption('relevance');
    setSearchParams(new URLSearchParams());
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const { latitude, longitude } = pos.coords;
        setQueryStr(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
        showToast('Location detected successfully!', 'success');
      },
      (err) => {
        setGeoLocating(false);
        showToast('Unable to detect location. Please search manually.', 'error');
      }
    );
  };

  return (
    <Container className="py-6 font-sans max-w-7xl mx-auto space-y-6">
      
      {/* Top Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <SearchIcon className="w-6 h-6 text-[#2563EB]" />
              Find Your Perfect PG Accommodation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search by city, locality, university, or landmark with real-time budget and amenity filters.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Navigation}
            loading={geoLocating}
            onClick={handleUseCurrentLocation}
          >
            Use my current location
          </Button>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          <div className="md:col-span-6 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search city, area, landmark, college..."
              value={queryStr}
              onChange={(e) => setQueryStr(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="relevance">Recommended</option>
              <option value="rent_asc">Lowest Rent</option>
              <option value="rent_desc">Highest Rent</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="md:col-span-3 flex gap-2">
            <Button variant="primary" className="flex-1" size="sm" onClick={handleApplyFilters}>
              Search PGs
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={SlidersHorizontal}
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Recommended for You Section */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100 space-y-4">
          <h2 className="text-base font-black text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Recommended for You
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec) => (
              <Link
                key={rec._id || rec.id}
                to={`/pg/${rec._id || rec.id}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#0F172A] group-hover:text-blue-600 transition-colors truncate">
                    {rec.name}
                  </span>
                  <Badge variant="primary">
                    {rec.recommendationScore ? `${rec.recommendationScore}% Match` : 'Popular'}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {rec.address?.locality || rec.address?.city || 'Location'}
                </div>
                <div className="font-black text-sm text-blue-600 pt-1">
                  ₹{(rec.rent?.min || 8000).toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-semibold">/mo</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-6 h-fit sticky top-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-blue-600" />
              Filter Results
            </h3>
            <button onClick={handleClearFilters} className="text-[11px] font-bold text-blue-600 hover:underline">
              Clear All
            </button>
          </div>

          {/* Budget Range Slider */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Monthly Budget (₹)</label>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span>₹{parseInt(minRent).toLocaleString()}</span>
              <input
                type="range"
                min="3000"
                max="50000"
                step="1000"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="w-full accent-blue-600"
              />
              <span>₹{parseInt(maxRent).toLocaleString()}</span>
            </div>
          </div>

          {/* Gender Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Gender Preference</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="">All Genders</option>
              <option value="MALE">Boys Only</option>
              <option value="FEMALE">Girls Only</option>
              <option value="UNISEX">Unisex / Co-ed</option>
            </select>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Room Occupancy</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="">Any Room Type</option>
              <option value="SINGLE">Single Occupancy</option>
              <option value="DOUBLE">Double Sharing</option>
              <option value="TRIPLE">Triple Sharing</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              Verified PGs Only
            </label>
          </div>

          <Button variant="primary" size="sm" className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>

        {/* Results Listings */}
        <div className="lg:col-span-9 space-y-4">
          {loading ? (
            <Loader text="Searching available PGs..." center size="lg" />
          ) : pgs.length === 0 ? (
            <EmptyState
              title="No matching PGs found"
              description="Try adjusting your budget slider or clearing location filters to see more results."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pgs.map((pg) => {
                const pgId = pg._id || pg.id;
                const startingRent = pg.rent?.min || (pg.roomTypes && pg.roomTypes[0] ? pg.roomTypes[0].rent : 8000);

                return (
                  <div key={pgId} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-base text-[#0F172A] truncate hover:text-blue-600 transition-colors">
                            <Link to={`/pg/${pgId}`}>{pg.name}</Link>
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {pg.address?.locality || pg.address?.city || 'Location'}
                          </p>
                        </div>
                        {pg.isVerifiedPG && (
                          <Badge variant="primary" icon={ShieldCheck}>
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                          {pg.genderPreference || 'Co-ed'}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{pg.ratingSummary?.average || '4.5'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting Rent</span>
                        <span className="font-black text-base text-blue-600">
                          ₹{startingRent.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-semibold">/mo</span>
                        </span>
                      </div>

                      <Link to={`/pg/${pgId}`}>
                        <Button variant="primary" size="xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />

    </Container>
  );
}

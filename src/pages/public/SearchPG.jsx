import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Grid, 
  Map as MapIcon, 
  Star, 
  ShieldCheck, 
  Heart, 
  DoorOpen, 
  Send, 
  Calendar, 
  Bookmark, 
  RotateCcw,
  Navigation
} from 'lucide-react';

import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

import PGMap from '../../components/search/PGMap';
import ScheduleVisitModal from '../../components/visit/ScheduleVisitModal';
import CompareBar from '../../components/pg/CompareBar';
import { getRecentlyViewed } from '../../utils/recentlyViewed';
import { searchPGs, getPGAutocomplete, saveSearch } from '../../services/pgService';
import { savePG, removePG, getFavorites } from '../../services/favoriteService';
import { useAuth } from '../../context/AuthContext';

export default function SearchPG() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Search State synced from URL params
  const [queryStr, setQueryStr] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [selectedRoomTypes, setSelectedRoomTypes] = useState(() => {
    const rt = searchParams.get('roomTypes') || searchParams.get('roomType');
    return rt ? rt.split(',') : [];
  });
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [selectedFacilities, setSelectedFacilities] = useState(() => {
    const fac = searchParams.get('facilities');
    return fac ? fac.split(',') : [];
  });
  const [facilityMatching, setFacilityMatching] = useState(searchParams.get('facilityMatching') || 'all');
  const [onlineBookingOnly, setOnlineBookingOnly] = useState(searchParams.get('onlineBooking') === 'true');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [radius, setRadius] = useState(searchParams.get('radius') || '10');
  const [userLat, setUserLat] = useState(searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null);
  const [userLng, setUserLng] = useState(searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null);
  const [sort, setSort] = useState(searchParams.get('sort') || 'relevance');
  const [page, setPage] = useState(searchParams.get('page') ? parseInt(searchParams.get('page')) : 1);

  // UI View Mode
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Autocomplete Suggestions State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  // Results State
  const [pgs, setPgs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Favorites Tracking State
  const [favoritePgIds, setFavoritePgIds] = useState(new Set());

  // Save Search Modal State
  const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Visit Modal State
  const [selectedPgForVisit, setSelectedPgForVisit] = useState(null);

  // Comparison State
  const [comparePgs, setComparePgs] = useState([]);
  const recentlyViewedPgs = getRecentlyViewed();

  const handleToggleCompare = (pg) => {
    const pgId = pg._id || pg.id;
    if (comparePgs.some((p) => (p._id || p.id) === pgId)) {
      setComparePgs((prev) => prev.filter((p) => (p._id || p.id) !== pgId));
    } else {
      if (comparePgs.length >= 3) {
        showToast('You can compare up to 3 properties at a time.', 'warning');
        return;
      }
      setComparePgs((prev) => [...prev, pg]);
    }
  };

  // Toast Feedback State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  // Sync state to URL Query Params
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    if (queryStr) params.set('q', queryStr);
    if (city) params.set('city', city);
    if (locality) params.set('locality', locality);
    if (minRent) params.set('minRent', minRent);
    if (maxRent) params.set('maxRent', maxRent);
    if (selectedRoomTypes.length > 0) params.set('roomTypes', selectedRoomTypes.join(','));
    if (gender) params.set('gender', gender);
    if (selectedFacilities.length > 0) params.set('facilities', selectedFacilities.join(','));
    if (facilityMatching !== 'all') params.set('facilityMatching', facilityMatching);
    if (onlineBookingOnly) params.set('onlineBooking', 'true');
    if (minRating) params.set('rating', minRating);
    if (userLat !== null && userLng !== null) {
      params.set('lat', userLat);
      params.set('lng', userLng);
      params.set('radius', radius);
    }
    if (sort !== 'relevance') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());

    setSearchParams(params, { replace: true });
  }, [queryStr, city, locality, minRent, maxRent, selectedRoomTypes, gender, selectedFacilities, facilityMatching, onlineBookingOnly, minRating, userLat, userLng, radius, sort, page, setSearchParams]);

  // Fetch PGs based on active parameters
  const executeSearch = useCallback(async () => {
    setLoading(true);
    try {
      const apiParams = {
        q: queryStr,
        city,
        locality,
        minRent: minRent || undefined,
        maxRent: maxRent || undefined,
        roomTypes: selectedRoomTypes.length > 0 ? selectedRoomTypes.join(',') : undefined,
        gender: gender || undefined,
        facilities: selectedFacilities.length > 0 ? selectedFacilities.join(',') : undefined,
        facilityMatching,
        onlineBooking: onlineBookingOnly ? 'true' : undefined,
        rating: minRating || undefined,
        lat: userLat || undefined,
        lng: userLng || undefined,
        radius: userLat ? radius : undefined,
        sort,
        page,
        limit: 12,
      };

      const res = await searchPGs(apiParams);
      if (res.data) {
        setPgs(res.data.pgs || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast('Unable to fetch search results.', 'error');
    } finally {
      setLoading(false);
    }
  }, [queryStr, city, locality, minRent, maxRent, selectedRoomTypes, gender, selectedFacilities, facilityMatching, onlineBookingOnly, minRating, userLat, userLng, radius, sort, page]);

  useEffect(() => {
    updateURLParams();
    executeSearch();
  }, [executeSearch, updateURLParams]);

  // Fetch seeker favorites
  useEffect(() => {
    if (isAuthenticated && user?.role === 'SEEKER') {
      getFavorites()
        .then((res) => {
          if (res.data?.favorites) {
            const favIds = new Set(res.data.favorites.map((f) => f.pg?._id || f.pg?.id || f.pg));
            setFavoritePgIds(favIds);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user]);

  // Debounced Autocomplete
  useEffect(() => {
    if (!queryStr || queryStr.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      getPGAutocomplete(queryStr).then((res) => {
        if (res.data?.suggestions) setSuggestions(res.data.suggestions);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [queryStr]);

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    showToast('Detecting current location...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setPage(1);
        showToast('Location detected! Showing nearby PGs.', 'success');
      },
      (err) => {
        showToast('Location permission unavailable. Search manually by area.', 'error');
      }
    );
  };

  // Favorite Toggle Handler
  const handleFavoriteClick = async (pgId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'SEEKER') return;

    const isFav = favoritePgIds.has(pgId);
    try {
      if (isFav) {
        await removePG(pgId);
        setFavoritePgIds((prev) => {
          const next = new Set(prev);
          next.delete(pgId);
          return next;
        });
        showToast('Removed from saved PGs', 'info');
      } else {
        await savePG(pgId);
        setFavoritePgIds((prev) => new Set(prev).add(pgId));
        showToast('Saved to your favorites!', 'success');
      }
    } catch (err) {
      showToast('Action failed.', 'error');
    }
  };

  // Toggle Checkboxes Helper
  const toggleArrayItem = (setter, currentArr, item) => {
    if (currentArr.includes(item)) {
      setter(currentArr.filter((i) => i !== item));
    } else {
      setter([...currentArr, item]);
    }
    setPage(1);
  };

  // Clear All Filters
  const handleClearAll = () => {
    setQueryStr('');
    setCity('');
    setLocality('');
    setMinRent('');
    setMaxRent('');
    setSelectedRoomTypes([]);
    setGender('');
    setSelectedFacilities([]);
    setOnlineBookingOnly(false);
    setMinRating('');
    setUserLat(null);
    setUserLng(null);
    setSort('relevance');
    setPage(1);
  };

  // Save Search Handler
  const handleSaveSearchSubmit = async (e) => {
    e.preventDefault();
    if (!saveSearchName) return;

    setSaveLoading(true);
    try {
      await saveSearch(saveSearchName, {
        q: queryStr,
        city,
        locality,
        minRent,
        maxRent,
        roomTypes: selectedRoomTypes.join(','),
        gender,
        facilities: selectedFacilities.join(','),
      });

      showToast('Search criteria saved!', 'success');
      setIsSaveSearchOpen(false);
      setSaveSearchName('');
    } catch (err) {
      showToast('Failed to save search.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Calculate active filter count
  const activeFilterCount = [
    city, locality, minRent, maxRent, gender, minRating,
    selectedRoomTypes.length > 0, selectedFacilities.length > 0,
    onlineBookingOnly, userLat !== null
  ].filter(Boolean).length;

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <Container className="space-y-6">
        
        {/* Top Search Bar & Autocomplete */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input with Autocomplete */}
            <div className="relative flex-1 w-full" ref={searchInputRef}>
              <div className="relative">
                <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, area, sector (e.g., Sector 62, Noida)..."
                  value={queryStr}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setQueryStr(e.target.value);
                    setShowSuggestions(true);
                    setPage(1);
                  }}
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                {queryStr && (
                  <button
                    onClick={() => { setQueryStr(''); setCity(''); setLocality(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQueryStr(sug.title);
                        if (sug.city) setCity(sug.city);
                        if (sug.locality) setLocality(sug.locality);
                        setShowSuggestions(false);
                        setPage(1);
                      }}
                      className="w-full p-3.5 text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#2563EB]" />
                        {sug.title}
                      </span>
                      <Badge variant="neutral">{sug.type}</Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Location Button */}
            <Button
              variant="outline"
              size="md"
              icon={Navigation}
              onClick={handleUseMyLocation}
              className="shrink-0 text-xs"
            >
              Use My Location
            </Button>

            {/* Save Search Button (Seekers Only) */}
            {isAuthenticated && user?.role === 'SEEKER' && (
              <Button
                variant="secondary"
                size="md"
                icon={Bookmark}
                onClick={() => setIsSaveSearchOpen(true)}
                className="shrink-0 text-xs"
              >
                Save Search
              </Button>
            )}

          </div>
        </div>

        {/* Action Header: Results Count, View Toggle & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
              {pagination.total} {pagination.total === 1 ? 'Property' : 'Properties'} Available
            </h2>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden bg-white px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
              <span>Filters ({activeFilterCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-xs">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                List View
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'map' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                Map View
              </button>
            </div>

            {/* Sort Selector */}
            <Select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              options={[
                { label: 'Recommended', value: 'relevance' },
                { label: 'Rent: Low to High', value: 'rent_asc' },
                { label: 'Rent: High to Low', value: 'rent_desc' },
                { label: 'Highest Rated', value: 'rating_desc' },
                { label: 'Nearest Location', value: 'distance_asc' },
                { label: 'Newest Additions', value: 'newest' },
              ]}
            />
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-400">Active Filters:</span>

            {queryStr && (
              <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                "{queryStr}"
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setQueryStr('')} />
              </span>
            )}

            {(minRent || maxRent) && (
              <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                Rent: ₹{minRent || 0} - ₹{maxRent || 'Max'}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => { setMinRent(''); setMaxRent(''); }} />
              </span>
            )}

            {selectedRoomTypes.map((rt) => (
              <span key={rt} className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                {rt}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => toggleArrayItem(setSelectedRoomTypes, selectedRoomTypes, rt)} />
              </span>
            ))}

            {gender && (
              <span className="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                Gender: {gender}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setGender('')} />
              </span>
            )}

            {onlineBookingOnly && (
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                Online Booking Available
                <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => setOnlineBookingOnly(false)} />
              </span>
            )}

            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid & Desktop Filter Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-[#0F172A] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
                  Refine Search Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button onClick={handleClearAll} className="text-xs font-bold text-rose-600 hover:underline">
                    Reset
                  </button>
                )}
              </div>

              {/* Budget Range presets */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Monthly Rent Budget</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Input placeholder="Min ₹" type="number" value={minRent} onChange={(e) => { setMinRent(e.target.value); setPage(1); }} />
                  <Input placeholder="Max ₹" type="number" value={maxRent} onChange={(e) => { setMaxRent(e.target.value); setPage(1); }} />
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    { label: '< ₹5k', min: 0, max: 5000 },
                    { label: '₹5k–₹8k', min: 5000, max: 8000 },
                    { label: '₹8k–₹12k', min: 8000, max: 12000 },
                    { label: '₹12k+', min: 12000, max: 100000 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => { setMinRent(preset.min); setMaxRent(preset.max); setPage(1); }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Sharing Type Multi-Select */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Room Sharing Type</span>
                {['SINGLE', 'DOUBLE', 'TRIPLE', 'FOUR_SHARING', 'DORMITORY'].map((type) => (
                  <label key={type} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRoomTypes.includes(type)}
                      onChange={() => toggleArrayItem(setSelectedRoomTypes, selectedRoomTypes, type)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>

              {/* Gender Preference */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Gender Preference</span>
                {['MALE', 'FEMALE', 'UNISEX'].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === g}
                      onChange={() => { setGender(g); setPage(1); }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>

              {/* Facilities & Matching Mode */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Facilities</span>
                  <select
                    value={facilityMatching}
                    onChange={(e) => setFacilityMatching(e.target.value)}
                    className="text-[10px] bg-slate-100 font-bold rounded px-1.5 py-0.5"
                  >
                    <option value="all">Match All</option>
                    <option value="any">Match Any</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  {['Wi-Fi', 'AC', 'Food', 'Laundry', 'Parking', 'Power Backup', 'CCTV', 'Hot Water'].map((fac) => (
                    <label key={fac} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(fac)}
                        onChange={() => toggleArrayItem(setSelectedFacilities, selectedFacilities, fac)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{fac}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Online Booking Checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlineBookingOnly}
                    onChange={(e) => { setOnlineBookingOnly(e.target.checked); setPage(1); }}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Online Booking Available</span>
                </label>
              </div>

            </div>
          </div>

          {/* Results Column (Map View or Cards Grid) */}
          <div className="lg:col-span-3 space-y-6">
            
            {loading ? (
              <Loader text="Finding properties matching your requirements..." />
            ) : viewMode === 'map' ? (
              <PGMap pgs={pgs} />
            ) : pgs.length === 0 ? (
              <EmptyState
                title="No PG Listings Found"
                description="Try increasing your budget range, clearing specific facility filters, or expanding your target location."
                actionText="Reset All Filters"
                onAction={handleClearAll}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pgs.map((pg) => {
                  const pgId = pg._id || pg.id;
                  const isSaved = favoritePgIds.has(pgId);
                  const minRentVal = pg.rent?.min || (pg.roomTypes && pg.roomTypes[0] ? pg.roomTypes[0].rent : 8000);
                  const isBookable = pg.status === 'APPROVED' && pg.onlineBookingEnabled !== false;

                  return (
                    <div
                      key={pgId}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Image Banner */}
                        <div className="relative aspect-[16/10] bg-slate-100">
                          <img
                            src={pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'}
                            alt={pg.name}
                            className="w-full h-full object-cover"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                            <Badge variant={pg.genderPreference === 'MALE' ? 'primary' : pg.genderPreference === 'FEMALE' ? 'danger' : 'neutral'}>
                              {pg.genderPreference}
                            </Badge>

                            <button
                              type="button"
                              onClick={() => handleFavoriteClick(pgId)}
                              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                                isSaved ? 'bg-rose-600 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Card Info Details */}
                        <div className="px-5 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-extrabold text-lg text-[#0F172A] leading-snug flex items-center gap-1.5">
                                {pg.name}
                                {pg.isVerifiedPG && (
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </h3>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                                {pg.address?.locality ? `${pg.address.locality}, ${pg.address.city}` : pg.address?.city || 'Noida'}
                              </p>
                            </div>

                            {pg.ratingSummary?.average > 0 && (
                              <div className="bg-amber-50 px-2 py-1 rounded-xl border border-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1 shrink-0">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                                {pg.ratingSummary.average}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                            <span className="text-slate-400 font-semibold">Starts From</span>
                            <span className="font-black text-[#0F172A] text-base">₹{minRentVal.toLocaleString('en-IN')}/mo</span>
                          </div>

                          {/* Facilities Pills */}
                          {pg.facilities && pg.facilities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {pg.facilities.slice(0, 4).map((fac, idx) => (
                                <span key={idx} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                  {fac}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                        <Link to={`/pg/${pgId}`} className="flex-1">
                          <Button variant="outline" size="sm" fullWidth>
                            View Details
                          </Button>
                        </Link>

                        {isBookable && (
                          <Link to={`/seeker/book/${pgId}`}>
                            <Button variant="primary" size="sm" icon={DoorOpen}>
                              Book Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-6 border-t border-slate-200 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}

          </div>

        </div>

      </Container>

      {/* Mobile Bottom Filter Drawer */}
      <Modal isOpen={isMobileFilterOpen} onClose={() => setIsMobileFilterOpen(false)} title="Refine Filters">
        <div className="space-y-5 font-sans text-xs">
          <div className="space-y-2">
            <span className="font-extrabold text-slate-700 uppercase">Budget</span>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Min ₹" type="number" value={minRent} onChange={(e) => setMinRent(e.target.value)} />
              <Input placeholder="Max ₹" type="number" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-extrabold text-slate-700 uppercase">Room Sharing</span>
            {['SINGLE', 'DOUBLE', 'TRIPLE', 'FOUR_SHARING', 'DORMITORY'].map((type) => (
              <label key={type} className="flex items-center gap-2 font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedRoomTypes.includes(type)}
                  onChange={() => toggleArrayItem(setSelectedRoomTypes, selectedRoomTypes, type)}
                  className="rounded text-blue-600"
                />
                <span>{type.replace('_', ' ')}</span>
              </label>
            ))}
          </div>

          <div className="pt-2 flex justify-between gap-2">
            <Button variant="outline" onClick={handleClearAll}>
              Clear All
            </Button>
            <Button variant="primary" onClick={() => setIsMobileFilterOpen(false)}>
              Apply Filters ({activeFilterCount})
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save Search Modal */}
      <Modal isOpen={isSaveSearchOpen} onClose={() => setIsSaveSearchOpen(false)} title="Save Custom Search Criteria">
        <form onSubmit={handleSaveSearchSubmit} className="space-y-4 font-sans text-xs">
          <Input
            label="Search Name"
            placeholder="e.g. Sector 62 Double Sharing under 10k"
            value={saveSearchName}
            onChange={(e) => setSaveSearchName(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsSaveSearchOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saveLoading}>
              Save Criteria
            </Button>
          </div>
        </form>
      </Modal>

      {/* Floating Compare Bar */}
      <CompareBar
        comparePgs={comparePgs}
        onRemovePg={(id) => setComparePgs((prev) => prev.filter((p) => (p._id || p.id) !== id))}
        onClearAll={() => setComparePgs([])}
      />

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

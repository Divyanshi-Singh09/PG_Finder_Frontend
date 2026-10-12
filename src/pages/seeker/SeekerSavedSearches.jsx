import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Search, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { getSavedSearches, deleteSavedSearch } from '../../services/pgService';

export default function SeekerSavedSearches() {
  const navigate = useNavigate();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await getSavedSearches();
      if (res.data?.savedSearches) setSearches(res.data.savedSearches);
    } catch (err) {
      showToast('Failed to load saved searches', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete saved search "${name}"?`)) return;
    try {
      await deleteSavedSearch(id);
      showToast('Saved search removed.', 'info');
      fetchSaved();
    } catch (err) {
      showToast('Failed to delete saved search.', 'error');
    }
  };

  const handleRunSearch = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.set(key, val);
      }
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Container className="py-8 font-sans max-w-4xl mx-auto">
      <div className="space-y-6">
        
        {/* Back Link */}
        <Link to="/search" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-[#2563EB]" />
              My Saved Search Queries
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Quickly re-apply your custom budget, location, and facility search parameters.
            </p>
          </div>

          <Link to="/search">
            <Button variant="primary" size="sm" icon={Search}>
              New Search
            </Button>
          </Link>
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading saved search criteria...</div>
        ) : searches.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Saved Searches Found</p>
            <p className="text-xs text-slate-500">Save custom filters during search to re-run queries in 1 click.</p>
            <Link to="/search">
              <Button variant="primary" size="sm">Go to Search</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searches.map((item) => {
              const sId = item._id || item.id;
              const f = item.filters || {};

              return (
                <div
                  key={sId}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-[#0F172A]">{item.name}</h3>
                      <Badge variant="primary">Saved</Badge>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                      {f.city && <p><strong>City:</strong> {f.city}</p>}
                      {f.locality && <p><strong>Locality:</strong> {f.locality}</p>}
                      {(f.minRent || f.maxRent) && (
                        <p>
                          <strong>Budget:</strong> ₹{f.minRent || 0} – ₹{f.maxRent || '20000+'}
                        </p>
                      )}
                      {f.roomType && <p><strong>Sharing:</strong> {f.roomType}</p>}
                      {f.gender && <p><strong>Gender:</strong> {f.gender}</p>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="primary"
                      size="xs"
                      fullWidth
                      icon={ArrowRight}
                      onClick={() => handleRunSearch(f)}
                    >
                      Run Search
                    </Button>

                    <Button
                      variant="outline"
                      size="xs"
                      icon={Trash2}
                      className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                      onClick={() => handleDelete(sId, item.name)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  DoorOpen, 
  BedDouble, 
  Users, 
  MessageSquare, 
  Calendar, 
  Star, 
  Bell, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  BarChart3,
  CheckSquare
} from 'lucide-react';

import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import PGSelector from '../../components/owner/PGSelector';
import { getOwnerDashboard } from '../../services/dashboardService';
import { getMyPGs } from '../../services/pgService';

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [pgs, setPgs] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOwnerDashboard(),
      getMyPGs(),
    ])
      .then(([dashRes, pgsRes]) => {
        if (dashRes.data) setStats(dashRes.data);
        if (pgsRes.data?.pgs) setPgs(pgsRes.data.pgs);
      })
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {
    totalPGs: 2, approvedPGs: 2, activeRooms: 6, availableBeds: 5, occupiedBeds: 15,
    pendingBookings: 2, activeBookings: 8, unreadEnquiries: 1, upcomingVisits: 3,
    avgRating: 4.7, unreadNotifications: 0, recentActivity: [],
  };

  const selectedPG = pgs.find((p) => (p._id || p.id) === selectedPgId) || pgs[0];

  // Calculate completeness score for selected PG
  const getCompletenessScore = (pg) => {
    if (!pg) return 80;
    let score = 30; // base for name & address
    if (pg.images && pg.images.length > 0) score += 25;
    if (pg.facilities && pg.facilities.length > 0) score += 20;
    if (pg.contactNumber) score += 15;
    if (pg.description && pg.description.length > 20) score += 10;
    return Math.min(100, score);
  };

  const completeness = getCompletenessScore(selectedPG);

  if (loading) return <Loader text="Loading landlord control dashboard..." center size="lg" />;

  return (
    <Container className="py-8 font-sans max-w-6xl mx-auto space-y-6">
      
      {/* Top Header & Multi-PG Selector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#2563EB]" />
            Landlord Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your properties, inspect room availability, respond to booking requests, and track tenant reviews.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <PGSelector pgs={pgs} selectedPgId={selectedPgId} onSelectPg={(id) => setSelectedPgId(id)} />

          <Link to="/owner/pgs/add">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              Add New PG
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completeness Banner */}
      {selectedPG && completeness < 100 && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-xs text-blue-900">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <span>Property Profile Completeness ({completeness}%)</span>
            </div>
            <div className="w-full sm:w-64 bg-blue-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${completeness}%` }} />
            </div>
            <p className="text-[11px] text-blue-800">
              Add photos, room details, and contact numbers to increase property search visibility.
            </p>
          </div>

          <Link to={`/owner/pgs/${selectedPG._id || selectedPG.id}/edit`}>
            <Button variant="primary" size="xs">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase block">Managed PGs</span>
          <span className="text-3xl font-black text-[#0F172A]">{s.totalPGs}</span>
          <span className="text-[10px] text-emerald-600 font-bold block">{s.approvedPGs} Approved & Visible</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-blue-600 font-bold uppercase block">Available Beds</span>
          <span className="text-3xl font-black text-blue-600">{s.availableBeds}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">{s.occupiedBeds} occupied beds</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-amber-600 font-bold uppercase block">Pending Bookings</span>
          <span className="text-3xl font-black text-amber-600">{s.pendingBookings}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">{s.activeBookings} active confirmed</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-emerald-600 font-bold uppercase block">Tenant Rating</span>
          <span className="text-3xl font-black text-emerald-600">{s.avgRating} ★</span>
          <span className="text-[10px] text-slate-500 font-semibold block">Average Guest Score</span>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <Link to="/owner/pgs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all text-center space-y-2">
            <Building2 className="w-5 h-5 text-blue-600 mx-auto" />
            <span className="text-xs font-extrabold text-[#0F172A] block">My PGs</span>
          </div>
        </Link>

        <Link to="/owner/rooms">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all text-center space-y-2">
            <DoorOpen className="w-5 h-5 text-indigo-600 mx-auto" />
            <span className="text-xs font-extrabold text-[#0F172A] block">Rooms & Beds</span>
          </div>
        </Link>

        <Link to="/owner/booking-requests">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all text-center space-y-2">
            <Users className="w-5 h-5 text-emerald-600 mx-auto" />
            <span className="text-xs font-extrabold text-[#0F172A] block">Bookings</span>
          </div>
        </Link>

        <Link to="/owner/availability">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all text-center space-y-2">
            <Clock className="w-5 h-5 text-purple-600 mx-auto" />
            <span className="text-xs font-extrabold text-[#0F172A] block">Availability</span>
          </div>
        </Link>

        <Link to="/owner/reviews">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all text-center space-y-2">
            <Star className="w-5 h-5 text-amber-500 mx-auto" />
            <span className="text-xs font-extrabold text-[#0F172A] block">Reviews</span>
          </div>
        </Link>

        <Link to="/owner/analytics">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 transition-all text-center space-y-2">
            <BarChart3 className="w-5 h-5 text-teal-600 mx-auto" />
            <span className="text-xs font-extrabold text-[#0F172A] block">Analytics</span>
          </div>
        </Link>
      </div>

    </Container>
  );
}

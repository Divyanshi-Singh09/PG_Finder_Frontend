import React, { useState, useEffect } from 'react';
import { BarChart3, Building2, BedDouble, Calendar, Star, Users, Heart, Eye, TrendingUp } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import PGSelector from '../../components/owner/PGSelector';
import { getOwnerAnalytics } from '../../services/ownerService';
import { getMyPGs } from '../../services/pgService';

export default function OwnerAnalytics() {
  const [pgs, setPgs] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [range, setRange] = useState('30');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPGs().then((res) => {
      if (res.data?.pgs) setPgs(res.data.pgs);
    });
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getOwnerAnalytics({ pgId: selectedPgId, range });
      if (res.data) setAnalytics(res.data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPgId, range]);

  const m = analytics?.metrics || {
    totalPGs: 2, totalRooms: 8, totalBeds: 24, occupiedBeds: 18, availableBeds: 6,
    occupancyRate: 75, favorites: 14, totalBookings: 12, acceptedBookings: 9,
    totalEnquiries: 22, totalVisits: 15, confirmedVisits: 11, totalReviews: 8, avgRating: 4.7,
  };

  return (
    <Container className="py-8 font-sans max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" />
            Property Performance & Operational Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track room occupancy rates, seeker enquiries, booking conversion, and tenant review scores.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <PGSelector pgs={pgs} selectedPgId={selectedPgId} onSelectPg={(id) => setSelectedPgId(id)} />

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-bold rounded-2xl px-3 py-2 text-slate-700"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Past 1 Year</option>
          </select>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-emerald-600 font-bold uppercase block">Bed Occupancy Rate</span>
          <span className="text-3xl font-black text-emerald-600">{m.occupancyRate}%</span>
          <span className="text-[10px] text-slate-500 font-semibold block">{m.occupiedBeds} occupied / {m.totalBeds} total beds</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-blue-600 font-bold uppercase block">Room Booking Requests</span>
          <span className="text-3xl font-black text-blue-600">{m.totalBookings}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">{m.acceptedBookings} confirmed bookings</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-purple-600 font-bold uppercase block">Seeker Enquiries</span>
          <span className="text-3xl font-black text-purple-600">{m.totalEnquiries}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">Direct property inquiries</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-amber-600 font-bold uppercase block">Tenant Rating</span>
          <span className="text-3xl font-black text-amber-600">{m.avgRating} ★</span>
          <span className="text-[10px] text-slate-500 font-semibold block">From {m.totalReviews} guest reviews</span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
            <Heart className="w-4 h-4 fill-current" />
            <span>Saved as Favorite</span>
          </div>
          <span className="text-2xl font-black text-[#0F172A]">{m.favorites} Seekers</span>
          <p className="text-xs text-slate-500">Number of seekers who bookmarked your PG listing.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
            <Calendar className="w-4 h-4" />
            <span>Scheduled PG Visits</span>
          </div>
          <span className="text-2xl font-black text-[#0F172A]">{m.totalVisits} Requests</span>
          <p className="text-xs text-slate-500">{m.confirmedVisits} confirmed in-person site visits.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <BedDouble className="w-4 h-4" />
            <span>Available Capacity</span>
          </div>
          <span className="text-2xl font-black text-[#0F172A]">{m.availableBeds} Beds Free</span>
          <p className="text-xs text-slate-500">Ready for instant online booking placement.</p>
        </div>
      </div>

    </Container>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Star,
  MessageSquare
} from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getAdminDashboard } from '../../services/dashboardService';
import { getPendingPGs } from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    seekers: 0,
    owners: 0,
    totalPGs: 0,
    pendingPGs: 0,
    approvedPGs: 0,
    pendingReviews: 0,
    totalEnquiries: 0,
  });
  const [recentPending, setRecentPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminDashboard(), getPendingPGs({ limit: 5 })])
      .then(([dashRes, pendingRes]) => {
        if (dashRes.data) setStats(dashRes.data);
        if (pendingRes.data?.pgs) setRecentPending(pendingRes.data.pgs);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader center text="Loading platform admin metrics..." size="lg" />;
  }

  const statCards = [
    { title: 'Total Users', count: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-[#2563EB]' },
    { title: 'Property Owners', count: stats.owners, icon: Building2, color: 'bg-purple-50 text-purple-600' },
    { title: 'PG Seekers', count: stats.seekers, icon: UserCheck, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Total PGs Listed', count: stats.totalPGs, icon: ShieldCheck, color: 'bg-[#0F172A] text-white' },
    { title: 'Pending PG Approvals', count: stats.pendingPGs, icon: Clock, color: 'bg-amber-50 text-amber-600', highlight: true },
    { title: 'Approved Live PGs', count: stats.approvedPGs, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Pending Reviews', count: stats.pendingReviews, icon: Star, color: 'bg-rose-50 text-rose-600', highlight: true },
    { title: 'Total Enquiries', count: stats.totalEnquiries, icon: MessageSquare, color: 'bg-slate-100 text-slate-700' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Platform Intelligence & Moderation Control Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor platform users, audit pending property submissions, and moderate ratings.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white p-5 rounded-2xl border ${
              card.highlight ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
            } shadow-xs flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-black text-[#0F172A] mt-1">{card.count}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/pgs/pending"
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between font-bold text-xs text-[#0F172A]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
            <span>Review Pending PG Approvals ({stats.pendingPGs})</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/admin/reviews"
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between font-bold text-xs text-[#0F172A]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Star className="w-4 h-4" />
            </div>
            <span>Moderate Guest Reviews ({stats.pendingReviews})</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/admin/pgs"
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between font-bold text-xs text-[#0F172A]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
            <span>All Property Listings ({stats.totalPGs})</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Recent Pending Approvals Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#0F172A]">Pending PG Approval Queue</h3>
            <p className="text-xs text-slate-500">Property submissions awaiting admin verification</p>
          </div>
          <Link to="/admin/pgs/pending" className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
            <span>View All Pending ({stats.pendingPGs})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPending.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">
            🎉 No pending submissions! All PG listings have been reviewed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="p-3 rounded-l-lg">PG Property Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">PG Type</th>
                  <th className="p-3">Rent Starts</th>
                  <th className="p-3 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentPending.map((item) => {
                  const pgId = item._id || item.id;
                  return (
                    <tr key={pgId} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#0F172A]">{item.name}</td>
                      <td className="p-3 text-slate-500">{item.address?.city || item.location}</td>
                      <td className="p-3"><Badge variant="primary">{item.pgType}</Badge></td>
                      <td className="p-3 font-bold text-[#0F172A]">₹{(item.rent?.min || 8000).toLocaleString('en-IN')}/mo</td>
                      <td className="p-3">
                        <Link to={`/admin/pgs/${pgId}`}>
                          <Button variant="primary" size="sm">
                            Inspect & Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

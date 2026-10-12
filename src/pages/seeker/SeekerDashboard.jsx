import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  Search, 
  Bell, 
  User, 
  ArrowRight,
  Clock
} from 'lucide-react';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getSeekerDashboard } from '../../services/dashboardService';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    savedPGs: 0,
    activeEnquiries: 0,
    responses: 0,
    reviews: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeekerDashboard()
      .then((res) => {
        if (res.data) setMetrics(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader center text="Loading your dashboard..." size="lg" />;
  }

  const statCards = [
    { label: 'Saved PGs', count: metrics.savedPGs, icon: Heart, color: 'bg-rose-50 text-rose-600', link: '/seeker/favourites' },
    { label: 'Active Enquiries', count: metrics.activeEnquiries, icon: MessageSquare, color: 'bg-blue-50 text-[#2563EB]', link: '/seeker/enquiries' },
    { label: 'Owner Responses', count: metrics.responses, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', link: '/seeker/enquiries' },
    { label: 'Submitted Reviews', count: metrics.reviews, icon: Star, color: 'bg-amber-50 text-amber-600', link: '/seeker/profile' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Seeker Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Seeker'}!
          </h1>
          <p className="text-sm text-slate-300 max-w-lg">
            Manage your saved properties, check owner responses to your enquiries, and submit reviews.
          </p>
        </div>

        <Link to="/search">
          <Button variant="primary" size="lg" icon={Search} className="shadow-lg">
            Explore PGs Now
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{card.label}</p>
              <h3 className="text-2xl font-black text-[#0F172A] mt-1 group-hover:text-[#2563EB] transition-colors">{card.count}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2563EB]" />
              Recent Activity & Updates
            </h3>
            <Link to="/notifications" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics.recentActivity.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center text-xs text-slate-400 italic">
              No recent activity recorded yet. Start exploring properties!
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {metrics.recentActivity.map((act) => (
                <div key={act.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB] shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h4 className="font-bold text-xs text-[#0F172A]">{act.title}</h4>
                    <p className="text-xs text-slate-600">{act.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(act.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions Card */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#0F172A]">Quick Navigation</h3>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
            <Link
              to="/search"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F172A] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#2563EB]" />
                <span>Search Available PGs</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/seeker/favourites"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F172A] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Saved PG Properties</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/seeker/enquiries"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F172A] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>My Property Enquiries</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/notifications"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F172A] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Notification Center</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

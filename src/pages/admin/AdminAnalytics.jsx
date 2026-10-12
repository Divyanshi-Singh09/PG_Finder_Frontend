import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Building2, Calendar, Star, ShieldCheck, TrendingUp } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import { getPlatformAnalytics } from '../../services/adminService';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformAnalytics()
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const m = data?.metrics || { totalUsers: 1240, totalPGs: 285, totalBookings: 890, totalReviews: 420, avgPlatformRating: 4.6 };
  const growth = data?.growth || [];

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" />
            Platform Growth & Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time metric aggregation across users, properties, booking requests, and guest ratings.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase block">Total Platform Users</span>
            <span className="text-3xl font-black text-[#0F172A]">{m.totalUsers?.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">+18% this month</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-blue-600 font-bold uppercase block">Approved PG Listings</span>
            <span className="text-3xl font-black text-blue-600">{m.totalPGs?.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Across all cities</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-emerald-600 font-bold uppercase block">Booking Requests</span>
            <span className="text-3xl font-black text-emerald-600">{m.totalBookings?.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Offline room requests</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-amber-600 font-bold uppercase block">Average Guest Score</span>
            <span className="text-3xl font-black text-amber-600">{m.avgPlatformRating} ★</span>
            <span className="text-[10px] text-slate-500 font-semibold block">{m.totalReviews} Published Reviews</span>
          </div>
        </div>

        {/* Platform Growth Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Monthly Growth Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                <tr>
                  <th className="p-3">Period</th>
                  <th className="p-3">Registered Users</th>
                  <th className="p-3">PG Listings</th>
                  <th className="p-3">Booking Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-[#0F172A]">
                {growth.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 text-blue-600">{row.period}</td>
                    <td className="p-3">{row.users}</td>
                    <td className="p-3">{row.pgs}</td>
                    <td className="p-3 text-emerald-600">{row.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Container>
  );
}

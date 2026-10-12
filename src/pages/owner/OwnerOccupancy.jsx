import React, { useState, useEffect } from 'react';
import { Bed as BedIcon, CheckCircle2, Clock, Ban, Wrench, BarChart3 } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { getOwnerOccupancy } from '../../services/bookingService';

export default function OwnerOccupancy() {
  const [stats, setStats] = useState({ totalBeds: 0, available: 0, reserved: 0, occupied: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnerOccupancy()
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = stats.totalBeds || 1;
  const occPct = Math.round((stats.occupied / total) * 100);
  const resPct = Math.round((stats.reserved / total) * 100);
  const availPct = Math.round((stats.available / total) * 100);

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" />
            Property Occupancy & Bed Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time occupancy metrics calculated from database room and bed inventory status.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase block">Total Bed Capacity</span>
            <span className="text-3xl font-black text-[#0F172A]">{stats.totalBeds}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Across all PG properties</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs text-emerald-600 font-bold uppercase block">Available Beds</span>
            <span className="text-3xl font-black text-emerald-600">{stats.available}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Ready for bookings</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs text-blue-600 font-bold uppercase block">Reserved Beds</span>
            <span className="text-3xl font-black text-blue-600">{stats.reserved}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Pending requests</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs text-slate-700 font-bold uppercase block">Occupied Beds</span>
            <span className="text-3xl font-black text-slate-800">{stats.occupied}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">Active guests</span>
          </div>
        </div>

        {/* Visual Distribution Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-[#0F172A] uppercase tracking-wider">Bed Capacity Breakdown</h3>

          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex shadow-inner">
            <div className="bg-slate-800 h-full transition-all" style={{ width: `${occPct}%` }} title={`Occupied (${occPct}%)`} />
            <div className="bg-blue-500 h-full transition-all" style={{ width: `${resPct}%` }} title={`Reserved (${resPct}%)`} />
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${availPct}%` }} title={`Available (${availPct}%)`} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-slate-600 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
              <span>Occupied ({occPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Reserved ({resPct}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Available ({availPct}%)</span>
            </div>
          </div>
        </div>

      </div>
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck,
  Star,
  Bell,
  Calendar,
  Flag,
  DoorOpen,
  BarChart3,
  Activity,
  Sparkles
} from 'lucide-react';

import Container from '../common/Container';
import Avatar from '../common/Avatar';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/adminService';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        if (res.data?.pendingPGs !== undefined) {
          setPendingCount(res.data.pendingPGs);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users Management', path: '/admin/users', icon: Users },
    { label: 'PG Management', path: '/admin/pgs', icon: Building2 },
    { label: 'Pending Approvals', path: '/admin/pgs/pending', icon: Clock, badge: pendingCount },
    { label: 'Owner Verifications', path: '/admin/verifications', icon: ShieldCheck },
    { label: 'Abuse Reports', path: '/admin/reports', icon: Flag },
    { label: 'Support Complaints', path: '/admin/complaints', icon: AlertOctagon },
    { label: 'Bookings Monitor', path: '/admin/bookings', icon: DoorOpen },
    { label: 'Visit Monitoring', path: '/admin/visits', icon: Calendar },
    { label: 'Review Moderation', path: '/admin/reviews', icon: Star },
    { label: 'Facilities Catalog', path: '/admin/facilities', icon: Sparkles },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Activity Logs', path: '/admin/activity', icon: Activity },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-800 shadow-md">
        <Container>
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard" className="flex items-center gap-2 font-black text-lg text-white">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>PGFinder</span>
                <span className="bg-blue-600/30 text-blue-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-500/30">
                  ADMIN
                </span>
              </Link>
            </div>

            {/* Admin User Profile & Notification Bell */}
            <div className="hidden md:flex items-center gap-4">
              <NotificationBell />

              <div className="flex items-center gap-2.5">
                <Avatar name={user?.name || 'Admin'} size="sm" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {user?.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-[10px] text-slate-400">{user?.email}</div>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-800" />

              <button
                onClick={logout}
                className="text-xs font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <NotificationBell />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white"
                aria-label="Toggle admin navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </Container>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 flex">
        
        {/* Sidebar Nav */}
        <aside
          className={`fixed md:sticky top-16 z-30 w-64 bg-[#0F172A] text-slate-300 h-[calc(100vh-4rem)] flex flex-col justify-between p-4 transition-transform duration-300 border-r border-slate-800 overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin/pgs'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              to="/search"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Public Directory</span>
            </Link>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

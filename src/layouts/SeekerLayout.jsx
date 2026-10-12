import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Heart, 
  MessageSquare, 
  Calendar, 
  User, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  Building2,
  Bell,
  DoorOpen,
  Bookmark
} from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';

export default function SeekerLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/seeker/dashboard', icon: LayoutDashboard },
    { name: 'Saved PGs', path: '/seeker/favourites', icon: Heart },
    { name: 'Saved Searches', path: '/seeker/saved-searches', icon: Bookmark },
    { name: 'My Bookings', path: '/seeker/bookings', icon: DoorOpen },
    { name: 'My Enquiries', path: '/seeker/enquiries', icon: MessageSquare },
    { name: 'Scheduled Visits', path: '/seeker/visits', icon: Calendar },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/seeker/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0F172A] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span>Seeker Portal</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white"
            aria-label="Toggle seeker navigation sidebar"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 bg-[#0F172A] text-slate-300 h-screen flex flex-col justify-between p-5 transition-transform duration-300 overflow-y-auto ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo & Notification Bell */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-white">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span>PGFinder</span>
            </Link>
            <NotificationBell />
          </div>

          {/* Seeker Badge Info */}
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 font-black flex items-center justify-center text-sm border border-emerald-500/30">
              SK
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Seeker Workspace</p>
              <span className="text-[10px] text-slate-400">Verified Member</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Search Directory */}
        <div className="pt-4 border-t border-slate-800">
          <Link
            to="/search"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Search Directory</span>
          </Link>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

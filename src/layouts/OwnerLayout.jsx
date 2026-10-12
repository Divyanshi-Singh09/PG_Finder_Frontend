import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  DoorOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  PlusCircle,
  Clock,
  BedDouble,
  Bell,
  BarChart3
} from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';

export default function OwnerLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'My PG Properties', path: '/owner/pgs', icon: Building2 },
    { name: 'Room Management', path: '/owner/rooms', icon: DoorOpen },
    { name: 'Booking Requests', path: '/owner/booking-requests', icon: Users },
    { name: 'Occupancy & Beds', path: '/owner/occupancy', icon: BedDouble },
    { name: 'Visit Availability', path: '/owner/availability', icon: Clock },
    { name: 'Scheduled Visits', path: '/owner/visits', icon: Calendar },
    { name: 'Enquiries', path: '/owner/enquiries', icon: MessageSquare },
    { name: 'Tenant Reviews', path: '/owner/reviews', icon: Star },
    { name: 'Performance Analytics', path: '/owner/analytics', icon: BarChart3 },
    { name: 'Owner Verification', path: '/owner/verification', icon: ShieldCheck },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Owner Profile', path: '/owner/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0F172A] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span>Owner Portal</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white"
            aria-label="Toggle owner navigation sidebar"
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

          {/* Owner Badge Info */}
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 font-black flex items-center justify-center text-sm border border-blue-500/30">
              OW
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Owner Portal</p>
              <span className="text-[10px] text-slate-400">Landlord Control</span>
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

        {/* Back to Public Directory */}
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

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

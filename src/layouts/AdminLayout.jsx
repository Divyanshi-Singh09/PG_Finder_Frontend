import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Clock, 
  FileSpreadsheet, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'PG Listings', path: '/admin/pgs', icon: Building2 },
    { name: 'Pending Approvals', path: '/admin/pending', icon: Clock },
    { name: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0F172A] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <span>Platform Admin</span>
        </Link>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
          aria-label="Toggle admin sidebar"
        >
          {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Responsive Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 bg-[#0F172A] text-slate-300 h-screen flex flex-col justify-between p-5 transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl text-white">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span>Admin Center</span>
          </Link>

          <div className="pt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Super Administrator
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Admin Navigation">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const IconComp = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'bg-rose-600 text-white shadow-sm' 
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back link */}
        <div className="pt-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-2 py-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Back to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-4 sm:p-8 min-h-screen overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  User, 
  Heart, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'OWNER':
        return '/owner/dashboard';
      case 'SEEKER':
        return '/seeker/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] text-white border-b border-slate-800 shadow-md font-sans">
      <Container>
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-white">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <span>PGFinder</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <Link to="/search" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#2563EB]" />
              Find PG Listings
            </Link>
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* User Right Menu Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                <Link to={getDashboardLink()}>
                  <Button variant="secondary" size="xs" icon={LayoutDashboard}>
                    Dashboard
                  </Button>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="xs">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="xs">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && <NotificationBell />}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </Container>
    </header>
  );
}

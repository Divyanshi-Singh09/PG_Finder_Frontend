import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Menu, 
  X, 
  Search as SearchIcon, 
  PlusCircle, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Heart, 
  MessageSquare,
  ShieldAlert,
  Bell
} from 'lucide-react';

import Container from '../common/Container';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import Badge from '../common/Badge';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!isAuthenticated || !user) {
      return [
        { name: 'Find PG', path: '/search' },
        { name: 'List Your PG', path: '/register?role=OWNER' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ];
    }

    if (user.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'PG Management', path: '/admin/pgs' },
        { name: 'Reviews', path: '/admin/reviews' },
        { name: 'Notifications', path: '/notifications' },
      ];
    }

    if (user.role === 'OWNER') {
      return [
        { name: 'Dashboard', path: '/owner/dashboard' },
        { name: 'My PGs', path: '/owner/pgs' },
        { name: 'Enquiries', path: '/owner/enquiries' },
        { name: 'Reviews', path: '/owner/reviews' },
      ];
    }

    return [
      { name: 'Find PG', path: '/search' },
      { name: 'Dashboard', path: '/seeker/dashboard' },
      { name: 'Saved PGs', path: '/seeker/favourites' },
      { name: 'Enquiries', path: '/seeker/enquiries' },
    ];
  };

  const navLinks = getNavLinks();

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'OWNER') return '/owner/dashboard';
    return '/seeker/dashboard';
  };

  const getProfilePath = () => {
    if (!user) return '/';
    if (user.role === 'OWNER') return '/owner/profile';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/seeker/profile';
  };

  const userDropdownItems = [
    {
      label: 'My Dashboard',
      icon: LayoutDashboard,
      onClick: () => navigate(getDashboardPath()),
    },
    {
      label: 'Notification Center',
      icon: Bell,
      onClick: () => navigate('/notifications'),
    },
    {
      label: 'My Profile',
      icon: User,
      onClick: () => navigate(getProfilePath()),
    },
    {
      label: 'Log Out',
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            onClick={closeMenu}
            className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-[#0F172A] tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span>PGFinder</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm lg:text-base font-medium transition-colors ${
                    isActive 
                      ? 'text-[#2563EB] font-semibold' 
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth State / Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Dropdown
                  trigger={
                    <button type="button" className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors">
                      <Avatar name={user.name} src={user.profileImage} size="sm" />
                      <div className="text-left text-xs">
                        <p className="font-bold text-[#0F172A] line-clamp-1">{user.name}</p>
                        <Badge size="sm" variant={user.role === 'ADMIN' ? 'dark' : user.role === 'OWNER' ? 'primary' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                    </button>
                  }
                  items={userDropdownItems}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && <NotificationBell />}
            <button
              type="button"
              onClick={toggleMenu}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </Container>
    </header>
  );
}

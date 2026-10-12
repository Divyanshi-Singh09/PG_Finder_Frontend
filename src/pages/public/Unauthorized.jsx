import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Home } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export default function Unauthorized() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'OWNER') return '/owner/dashboard';
    return '/seeker/dashboard';
  };

  return (
    <div className="py-20 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Access Restricted</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            You don't have permission to access this page or portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to={getDashboardPath()} className="w-full">
              <Button variant="primary" fullWidth icon={LayoutDashboard}>
                Go to My Dashboard
              </Button>
            </Link>
            <Link to="/" className="w-full">
              <Button variant="outline" fullWidth icon={Home}>
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

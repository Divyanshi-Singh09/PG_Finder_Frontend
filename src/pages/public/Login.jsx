import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Building2, UserCheck, Search } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  // Helper to determine dashboard path by role
  const getRoleDashboard = (role) => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'OWNER') return '/owner/dashboard';
    return '/seeker/dashboard';
  };

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRoleDashboard(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      navigate(getRoleDashboard(loggedUser.role), { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Invalid email or password.');
      setIsToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[80vh] flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-[#0F172A]">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span>PGFinder</span>
            </Link>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500">Log in to manage your account and properties</p>
          </div>

          {/* Form Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-semibold text-[#0F172A]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none text-[#0F172A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Placeholder info */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Forgot Password? (Coming in Phase 4)</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon={LogIn}
                className="mt-2"
              >
                Log In
              </Button>

            </form>

            <div className="pt-4 border-t border-slate-100 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#2563EB] font-bold hover:underline">
                  Create Account
                </Link>
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <Link to="/register?role=SEEKER" className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-[#2563EB] font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <Search className="w-3.5 h-3.5" />
                  <span>Seeker Sign Up</span>
                </Link>
                <Link to="/register?role=OWNER" className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-[#2563EB] font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Owner Sign Up</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </Container>

      <Toast
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        message={errorMessage}
        type="error"
      />
    </div>
  );
}

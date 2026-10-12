import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Search, UserCheck, UserPlus, Eye, EyeOff } from 'lucide-react';

import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, user, isAuthenticated } = useAuth();

  // Role Selection State (SEEKER or OWNER)
  const [role, setRole] = useState(searchParams.get('role') === 'OWNER' ? 'OWNER' : 'SEEKER');

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const getRoleDashboard = (roleName) => {
    if (roleName === 'OWNER') return '/owner/dashboard';
    return '/seeker/dashboard';
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getRoleDashboard(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation checks
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms & Conditions to create an account.');
      setIsToastOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsToastOpen(true);
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setErrorMessage('Password must be at least 8 characters and contain both letters and numbers.');
      setIsToastOpen(true);
      return;
    }

    setLoading(true);

    try {
      const registeredUser = await register({
        name,
        email,
        mobile,
        password,
        role,
      });
      navigate(getRoleDashboard(registeredUser.role), { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Registration failed.');
      setIsToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-[85vh] flex items-center justify-center">
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
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Create an Account</h1>
            <p className="text-sm text-slate-500">Join PGFinder to discover or list properties</p>
          </div>

          {/* Form Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            
            {/* Role Selection Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                What are you looking to do?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('SEEKER')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'SEEKER'
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-5 h-5" />
                  <span className="text-xs">Find a PG</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('OWNER')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'OWNER'
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span className="text-xs">List Your PG</span>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Mobile Number"
                type="tel"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-semibold text-[#0F172A]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars (letters & numbers)"
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

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="pt-1">
                <Checkbox
                  label="I agree to the Terms & Conditions and Privacy Policy."
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon={UserPlus}
                className="mt-2"
              >
                Create Account ({role})
              </Button>

            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-[#2563EB] font-bold hover:underline">
                  Log In
                </Link>
              </p>
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

import React, { useState } from 'react';
import { Building2, Bell, Save, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

export default function OwnerProfile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'Rajesh Sharma');
  const [email] = useState(user?.email || 'rajesh.sharma@example.com');
  const [mobile, setMobile] = useState(user?.mobile || '9876543210');

  // Notification Preferences
  const [enquiryAlerts, setEnquiryAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [pgModerationAlerts, setPgModerationAlerts] = useState(true);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Owner Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your landlord account details and property notification settings.
        </p>
      </div>

      {/* Profile Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name?.charAt(0) || 'O'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#0F172A]">{user?.name || 'Rajesh Sharma'}</h2>
              <Badge variant="success">Verified Owner</Badge>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Owner Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email Address (ReadOnly)" type="email" value={email} disabled />
            <Input label="Primary Phone Number" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            <Input label="Account Role" value={user?.role || 'OWNER'} disabled />
          </div>

          {/* Notification Preferences Section */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2563EB]" />
              Landlord Notification Preferences
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold block text-[#0F172A]">New Tenant Enquiry Notifications</span>
                  <span className="text-slate-400">Receive instant alerts when seekers send enquiries</span>
                </div>
                <input
                  type="checkbox"
                  checked={enquiryAlerts}
                  onChange={(e) => setEnquiryAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB]"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold block text-[#0F172A]">Property Review Alerts</span>
                  <span className="text-slate-400">Receive alerts when new reviews are posted on your properties</span>
                </div>
                <input
                  type="checkbox"
                  checked={reviewAlerts}
                  onChange={(e) => setReviewAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB]"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold block text-[#0F172A]">Admin PG Moderation Alerts</span>
                  <span className="text-slate-400">Receive alerts for PG approvals, rejections, or suspensions</span>
                </div>
                <input
                  type="checkbox"
                  checked={pgModerationAlerts}
                  onChange={(e) => setPgModerationAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB]"
                />
              </label>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" loading={loading} icon={Save}>
              Save Profile Settings
            </Button>
          </div>
        </form>

      </div>

      <Toast
        isOpen={saved}
        onClose={() => setSaved(false)}
        message="Owner profile and preferences saved!"
        type="success"
      />
    </div>
  );
}

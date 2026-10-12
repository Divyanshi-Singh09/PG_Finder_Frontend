import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Bell, Save } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

export default function SeekerProfile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'Aarav Patel');
  const [email] = useState(user?.email || 'aarav@example.com');
  const [mobile, setMobile] = useState(user?.mobile || '9876543210');

  // Notification Preferences
  const [enquiryUpdates, setEnquiryUpdates] = useState(true);
  const [reviewUpdates, setReviewUpdates] = useState(true);
  const [pgUpdates, setPgUpdates] = useState(true);

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
          Seeker Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account profile information and notification preferences.
        </p>
      </div>

      {/* Account Info Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#2563EB] text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#0F172A]">{user?.name || 'Aarav Patel'}</h2>
              <Badge variant="primary">Seeker Account</Badge>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email Address (ReadOnly)" type="email" value={email} disabled />
            <Input label="Phone / Mobile Number" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            <Input label="Role" value={user?.role || 'SEEKER'} disabled />
          </div>

          {/* Notification Preferences Section */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2563EB]" />
              Notification & Alert Preferences
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold block text-[#0F172A]">Enquiry Response Alerts</span>
                  <span className="text-slate-400">Receive alerts when owners respond to your enquiries</span>
                </div>
                <input
                  type="checkbox"
                  checked={enquiryUpdates}
                  onChange={(e) => setEnquiryUpdates(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB]"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold block text-[#0F172A]">Review Moderation Updates</span>
                  <span className="text-slate-400">Receive alerts when your submitted reviews are approved</span>
                </div>
                <input
                  type="checkbox"
                  checked={reviewUpdates}
                  onChange={(e) => setReviewUpdates(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB]"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold block text-[#0F172A]">PG Price & Availability Alerts</span>
                  <span className="text-slate-400">Receive updates on saved PG property changes</span>
                </div>
                <input
                  type="checkbox"
                  checked={pgUpdates}
                  onChange={(e) => setPgUpdates(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded-sm focus:ring-[#2563EB]"
                />
              </label>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" loading={loading} icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>

      </div>

      <Toast
        isOpen={saved}
        onClose={() => setSaved(false)}
        message="Profile and preferences updated successfully!"
        type="success"
      />
    </div>
  );
}

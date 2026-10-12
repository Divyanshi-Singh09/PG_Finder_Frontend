import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import { getPlatformSettings, updatePlatformSettings } from '../../services/adminService';

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('PGFinder');
  const [supportEmail, setSupportEmail] = useState('support@pgfinder.com');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [defaultSearchRadius, setDefaultSearchRadius] = useState(10);
  const [reviewWindowDays, setReviewWindowDays] = useState(30);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  useEffect(() => {
    getPlatformSettings()
      .then((res) => {
        if (res.data?.settings) {
          const s = res.data.settings;
          setPlatformName(s.platformName || 'PGFinder');
          setSupportEmail(s.supportEmail || 'support@pgfinder.com');
          setSupportPhone(s.supportPhone || '+91 98765 43210');
          setDefaultSearchRadius(s.defaultSearchRadius || 10);
          setReviewWindowDays(s.reviewWindowDays || 30);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updatePlatformSettings({
        platformName,
        supportEmail,
        supportPhone,
        defaultSearchRadius: parseInt(defaultSearchRadius),
        reviewWindowDays: parseInt(reviewWindowDays),
      });

      showToast('Platform settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save platform settings.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Container className="py-12 text-center text-xs text-slate-400">Loading platform settings...</Container>;

  return (
    <Container className="py-8 font-sans max-w-2xl mx-auto">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#2563EB]" />
            Platform Operational Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure platform support contacts, search defaults, and review policies.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Platform Branding Name"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Support Email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
              />

              <Input
                label="Official Support Helpline Phone"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Default Search Radius (km)"
                type="number"
                value={defaultSearchRadius}
                onChange={(e) => setDefaultSearchRadius(e.target.value)}
                required
              />

              <Input
                label="Review Eligibility Window (Days)"
                type="number"
                value={reviewWindowDays}
                onChange={(e) => setReviewWindowDays(e.target.value)}
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button variant="primary" type="submit" icon={Save} loading={submitting}>
                Save Settings
              </Button>
            </div>
          </form>
        </div>

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

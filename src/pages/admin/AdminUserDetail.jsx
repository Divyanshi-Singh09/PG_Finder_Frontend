import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

import { getUserById, updateUserStatus } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

export default function AdminUserDetail() {
  const { id } = useParams();
  const { user: currentAdmin } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Toast Feedback State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getUserById(id);
      if (res.data?.user) setUserData(res.data.user);
    } catch (err) {
      showToast('Failed to load user profile details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!userData) return;
    const isCurrentlyActive = userData.isActive !== false;
    const newActiveState = !isCurrentlyActive;

    setActionLoading(true);
    try {
      await updateUserStatus(id, newActiveState, suspendReason);
      showToast(`User account status updated to ${newActiveState ? 'Active' : 'Suspended'}.`, 'success');
      setIsModalOpen(false);
      setSuspendReason('');
      fetchUser();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader text="Loading user profile..." center size="lg" />;
  if (!userData) {
    return (
      <Container className="py-12 font-sans text-center space-y-4">
        <p className="text-slate-500 font-semibold text-sm">User record not found.</p>
        <Link to="/admin/users">
          <Button variant="outline" icon={ArrowLeft}>Back to Users</Button>
        </Link>
      </Container>
    );
  }

  const isSelf = currentAdmin?._id === userData._id || currentAdmin?.id === userData._id;

  return (
    <Container className="py-8 font-sans max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          Back to User Directory
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 font-black text-2xl flex items-center justify-center border border-blue-100">
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                {userData.name}
                <Badge variant={userData.role === 'ADMIN' ? 'accent' : userData.role === 'OWNER' ? 'primary' : 'neutral'}>
                  {userData.role}
                </Badge>
              </h1>
              <p className="text-xs text-slate-500 font-medium">System User ID: {userData._id || userData.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={userData.isActive !== false ? 'primary' : 'error'}>
              {userData.isActive !== false ? 'Active Account' : 'Suspended'}
            </Badge>

            {!isSelf && (
              <Button
                variant={userData.isActive !== false ? 'danger' : 'primary'}
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                {userData.isActive !== false ? 'Suspend User' : 'Restore User'}
              </Button>
            )}
          </div>
        </div>

        {/* Profile Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Email Address</div>
            <div className="font-extrabold text-slate-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              {userData.email}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Phone Number</div>
            <div className="font-extrabold text-slate-800 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              {userData.phone || 'Not provided'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Joined Date</div>
            <div className="font-extrabold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Verification Status</div>
            <div className="font-extrabold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {userData.isVerified ? 'Identity Verified' : 'Unverified'}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={userData.isActive !== false ? 'Confirm User Suspension' : 'Confirm User Account Restoration'}
      >
        <div className="space-y-4 font-sans text-xs">
          <p className="text-slate-600 font-medium">
            Are you sure you want to {userData.isActive !== false ? 'suspend' : 'restore'} account access for{' '}
            <strong className="text-slate-900">{userData.name}</strong>?
          </p>

          {userData.isActive !== false && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Reason for Suspension (Audit Log)</label>
              <textarea
                placeholder="e.g. Terms of service violation, fraudulent listing reports..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-600"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={userData.isActive !== false ? 'danger' : 'primary'}
              onClick={handleToggleStatus}
              loading={actionLoading}
            >
              {userData.isActive !== false ? 'Confirm Suspension' : 'Confirm Restoration'}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />

    </Container>
  );
}

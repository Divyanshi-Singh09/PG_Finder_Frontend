import React, { useState, useEffect } from 'react';
import { Users, Filter, Search, ShieldCheck, Ban, CheckCircle2, User, Mail, Phone, Calendar } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import { getUsers, updateUserStatus } from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  // Suspend/Reactivate Modal
  const [targetUser, setTargetUser] = useState(null);
  const [actionType, setActionType] = useState('SUSPEND'); // 'SUSPEND' | 'ACTIVATE'
  const [reasonInput, setReasonInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        role: roleFilter,
        status: statusFilter,
        search: searchQuery,
        page,
        limit: 20,
      });
      if (res.data) {
        setUsers(res.data.users || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast('Failed to load platform users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleStatusActionSubmit = async (e) => {
    e.preventDefault();
    if (!targetUser) return;

    if (actionType === 'SUSPEND' && (!reasonInput || reasonInput.trim().length < 5)) {
      showToast('Please enter a valid reason for account suspension.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const uId = targetUser._id || targetUser.id;
      const targetStatus = actionType === 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE';
      await updateUserStatus(uId, targetStatus, reasonInput);
      showToast(`User account ${actionType === 'SUSPEND' ? 'suspended' : 'reactivated'}!`, 'success');
      setIsModalOpen(false);
      setReasonInput('');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Status update failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-[#2563EB]" />
              Platform User Directory & Access Control
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search seekers, owners, and admins. Manage account status and enforce suspension policies.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-wrap">
            <Input
              placeholder="Search name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-64"
            />
            <Select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Roles', value: '' },
                { label: 'SEEKER', value: 'SEEKER' },
                { label: 'OWNER', value: 'OWNER' },
                { label: 'ADMIN', value: 'ADMIN' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'ACTIVE', value: 'ACTIVE' },
                { label: 'SUSPENDED', value: 'SUSPENDED' },
              ]}
            />
            <Button variant="primary" type="submit" icon={Search}>
              Search
            </Button>
          </form>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading user accounts...</div>
        ) : users.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No user accounts found matching query.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contact Email</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
                  {users.map((u) => {
                    const uId = u._id || u.id;

                    return (
                      <tr key={uId} className="hover:bg-slate-50/60">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-100">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <span className="font-extrabold block text-slate-900">{u.name}</span>
                              {u.isVerified && <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={u.role === 'ADMIN' ? 'primary' : u.role === 'OWNER' ? 'warning' : 'neutral'}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-600">{u.email}</td>
                        <td className="p-4 text-slate-600">{u.mobile || 'N/A'}</td>
                        <td className="p-4">
                          <Badge variant={u.isActive ? 'success' : 'danger'}>
                            {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 text-right">
                          {u.role !== 'ADMIN' && (
                            <Button
                              variant={u.isActive ? 'outline' : 'primary'}
                              size="xs"
                              icon={u.isActive ? Ban : CheckCircle2}
                              onClick={() => {
                                setTargetUser(u);
                                setActionType(u.isActive ? 'SUSPEND' : 'ACTIVATE');
                                setIsModalOpen(true);
                              }}
                            >
                              {u.isActive ? 'Suspend' : 'Activate'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        )}

      </div>

      {/* Suspend / Activate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={actionType === 'SUSPEND' ? 'Suspend User Account' : 'Reactivate User Account'}
      >
        <form onSubmit={handleStatusActionSubmit} className="space-y-4 font-sans text-xs">
          {actionType === 'SUSPEND' ? (
            <div className="space-y-3">
              <p className="text-slate-600">
                Are you sure you want to suspend <strong>{targetUser?.name}</strong> ({targetUser?.email})? Suspended users cannot perform restricted actions.
              </p>
              <Textarea
                label="Suspension Reason (Required)"
                placeholder="e.g. Repeated abusive reviews, security complaints, or policy violations..."
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                required
              />
            </div>
          ) : (
            <p className="text-slate-600">
              Reactivate access for <strong>{targetUser?.name}</strong>?
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant={actionType === 'SUSPEND' ? 'danger' : 'primary'} type="submit" loading={submitting}>
              {actionType === 'SUSPEND' ? 'Confirm Suspension' : 'Confirm Activation'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

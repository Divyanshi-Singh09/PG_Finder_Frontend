import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Clock, 
  Eye, 
  Filter,
  ShieldCheck
} from 'lucide-react';

import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { getPGs, approvePG, reactivatePG } from '../../services/adminService';

export default function AdminPGList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');
  const [pgTypeFilter, setPgTypeFilter] = useState(searchParams.get('pgType') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);

  const [pgs, setPgs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const [actionTarget, setActionTarget] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reactivate'
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPGs = useCallback(async () => {
    setLoading(true);
    const params = {
      status: statusFilter || undefined,
      city: cityFilter || undefined,
      pgType: pgTypeFilter || undefined,
      search: searchInput.trim() || undefined,
      page: currentPage,
      limit: 20,
    };

    setSearchParams({ ...params, page: currentPage }, { replace: true });

    try {
      const res = await getPGs(params);
      if (res.data) {
        setPgs(res.data.pgs || []);
        setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
      }
    } catch (err) {
      showToast('Failed to fetch property listings', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, cityFilter, pgTypeFilter, searchInput, currentPage, setSearchParams]);

  useEffect(() => {
    fetchPGs();
  }, [fetchPGs]);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      if (actionType === 'approve') {
        await approvePG(actionTarget._id || actionTarget.id);
        showToast('PG property approved successfully!');
      } else if (actionType === 'reactivate') {
        await reactivatePG(actionTarget._id || actionTarget.id);
        showToast('PG property reactivated successfully!');
      }
      fetchPGs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    } finally {
      setActionLoading(false);
      setActionTarget(null);
      setActionType(null);
    }
  };

  const getBadgeVariant = (status) => {
    if (status === 'APPROVED') return 'success';
    if (status === 'PENDING') return 'warning';
    if (status === 'REJECTED') return 'danger';
    if (status === 'SUSPENDED') return 'danger';
    return 'secondary';
  };

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Platform Property Listings Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve, reject, or suspend PG property submissions across the platform.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <Input
            icon={Search}
            placeholder="Search by PG name or city..."
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'Pending Review', value: 'PENDING' },
            { label: 'Approved (Live)', value: 'APPROVED' },
            { label: 'Rejected', value: 'REJECTED' },
            { label: 'Suspended', value: 'SUSPENDED' },
            { label: 'Draft', value: 'DRAFT' },
          ]}
        />

        <Select
          value={pgTypeFilter}
          onChange={(e) => { setPgTypeFilter(e.target.value); setCurrentPage(1); }}
          options={[
            { label: 'All Categories', value: '' },
            { label: 'Co-Living', value: 'CO_LIVING' },
            { label: 'Boys PG', value: 'BOYS' },
            { label: 'Girls PG', value: 'GIRLS' },
          ]}
        />
      </div>

      {/* Table Container */}
      {loading ? (
        <Loader center text="Loading properties..." size="lg" />
      ) : pgs.length === 0 ? (
        <EmptyState
          title="No Properties Match Filter"
          description="Try selecting a different status filter or clearing your search term."
          actionLabel="Clear Filters"
          onAction={() => { setStatusFilter(''); setSearchInput(''); setPgTypeFilter(''); }}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Min Rent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pgs.map((pg) => {
                  const pgId = pg._id || pg.id;
                  const coverImg = pg.images?.find((i) => i.isCover)?.url || pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

                  return (
                    <tr key={pgId} className="hover:bg-slate-50">
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={coverImg} alt={pg.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div>
                            <span className="font-extrabold text-[#0F172A] block line-clamp-1">{pg.name}</span>
                            <span className="text-xs text-slate-400">{pg.address?.city || pg.location}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-700 block">{pg.owner?.name || 'Property Owner'}</span>
                        <span className="text-xs text-slate-400">{pg.owner?.email || ''}</span>
                      </td>

                      <td className="p-4">
                        <Badge variant="primary">{pg.pgType}</Badge>
                      </td>

                      <td className="p-4 font-extrabold text-[#0F172A]">
                        ₹{(pg.rent?.min || 8000).toLocaleString('en-IN')}/mo
                      </td>

                      <td className="p-4">
                        <Badge variant={getBadgeVariant(pg.status)}>
                          {pg.status}
                        </Badge>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/pgs/${pgId}`}>
                            <Button variant="outline" size="sm" icon={Eye}>
                              Inspect
                            </Button>
                          </Link>

                          {pg.status === 'PENDING' && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={CheckCircle2}
                              onClick={() => { setActionTarget(pg); setActionType('approve'); }}
                            >
                              Approve
                            </Button>
                          )}

                          {pg.status === 'SUSPENDED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={ShieldCheck}
                              onClick={() => { setActionTarget(pg); setActionType('reactivate'); }}
                            >
                              Reactivate
                            </Button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog for Approve / Reactivate */}
      <ConfirmDialog
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={handleConfirmAction}
        title={actionType === 'approve' ? 'Approve PG Listing?' : 'Reactivate PG Listing?'}
        message={
          actionType === 'approve'
            ? `Are you sure you want to approve "${actionTarget?.name}"? After approval, this listing will become live and discoverable for seekers.`
            : `Are you sure you want to reactivate "${actionTarget?.name}"? It will become visible to seekers again.`
        }
        confirmText={actionType === 'approve' ? 'Approve Listing' : 'Reactivate Listing'}
        loading={actionLoading}
      />

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

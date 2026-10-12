import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Eye, Trash2, Send, Clock, AlertTriangle } from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';
import { getMyPGs, deletePG, submitPG } from '../../services/pgService';

export default function MyPGs() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const fetchPGs = async () => {
    try {
      setLoading(true);
      const res = await getMyPGs();
      if (res.data?.pgs) {
        setPgs(res.data.pgs);
      }
    } catch (err) {
      showToast('Failed to fetch property listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPGs();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await deletePG(deleteTargetId);
      setPgs((prev) => prev.filter((p) => (p._id || p.id) !== deleteTargetId));
      showToast('Property deleted successfully!');
    } catch (err) {
      showToast('Failed to delete property listing', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteTargetId(null);
    }
  };

  const handleSubmitVerification = async (id) => {
    try {
      await submitPG(id);
      showToast('PG submitted for verification successfully!');
      fetchPGs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit for verification', 'error');
    }
  };

  const getStatusBadgeVariant = (status) => {
    if (status === 'APPROVED') return 'success';
    if (status === 'PENDING') return 'warning';
    if (status === 'REJECTED') return 'danger';
    return 'secondary'; // DRAFT
  };

  if (loading) {
    return <Loader center text="Loading your listed properties..." size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            My Property Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage room availability, submit drafts for verification, or update pricing.
          </p>
        </div>
        <Link to="/owner/pgs/add">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Add New Property
          </Button>
        </Link>
      </div>

      {pgs.length === 0 ? (
        <EmptyState
          title="No Properties Listed Yet"
          description="Start receiving tenant enquiries by listing your first PG property."
          actionLabel="List Your First PG"
          onAction={() => window.location.href = '/owner/pgs/add'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgs.map((pg) => {
            const pgId = pg._id || pg.id;
            const coverImg = pg.images?.find((img) => img.isCover)?.url || pg.images?.[0]?.url || pg.image;

            return (
              <div key={pgId} className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
                
                {/* Image Header */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={coverImg || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                    alt={pg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={getStatusBadgeVariant(pg.status)}>
                      {pg.status || 'DRAFT'}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-[#0F172A] line-clamp-1">{pg.name}</h3>
                    <p className="text-xs text-slate-500">
                      {pg.address?.city || pg.location} • {pg.pgType}
                    </p>
                  </div>

                  <div className="text-sm font-bold text-[#0F172A]">
                    Rent: ₹{(pg.rent?.min || pg.rent || 8000).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>

                  {pg.status === 'REJECTED' && pg.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                      <span className="font-bold">Rejection Reason: </span>{pg.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Contextual Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
                  <Link to={`/pg/${pgId}`} className="flex-1">
                    <Button variant="outline" size="sm" fullWidth icon={Eye}>
                      View
                    </Button>
                  </Link>

                  {(pg.status === 'DRAFT' || pg.status === 'PENDING' || pg.status === 'REJECTED') && (
                    <Link to={`/owner/pgs/${pgId}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth icon={Edit}>
                        Edit
                      </Button>
                    </Link>
                  )}

                  {pg.status === 'DRAFT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSubmitVerification(pgId)}
                      icon={Send}
                      className="w-full mt-1"
                    >
                      Submit for Review
                    </Button>
                  )}

                  {pg.status === 'DRAFT' && (
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(pgId)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg ml-auto"
                      aria-label="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete PG Property Listing"
        message="Are you sure you want to delete this property? This action will remove it from your active listings."
        confirmText="Delete Listing"
        danger
        loading={deleteLoading}
      />

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

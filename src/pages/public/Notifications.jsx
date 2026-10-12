import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Check, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Star, 
  AlertOctagon, 
  User, 
  Building2,
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';

import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Toast from '../../components/common/Toast';
import { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../services/notificationService';

export default function Notifications() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getMyNotifications({
        category: activeCategory,
        isRead: unreadOnly ? 'false' : undefined,
        page,
        limit: 20,
      });

      if (res.data) {
        setNotifications(res.data.notifications || []);
        if (res.data.pagination) setPagination(res.data.pagination);
        if (res.data.unreadCount !== undefined) setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      showToast('Failed to load notification center', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeCategory, unreadOnly, page]);

  const handleMarkAsReadItem = async (e, id) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      showToast('Marked as read', 'info');
      fetchNotifications();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      showToast('Notification deleted', 'info');
      fetchNotifications();
    } catch (err) {
      showToast('Failed to delete notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      showToast('All notifications marked as read!', 'success');
      fetchNotifications();
    } catch (err) {
      showToast('Failed to mark all as read.', 'error');
    }
  };

  const handleNotificationClick = async (n) => {
    const nId = n._id || n.id;
    if (!n.isRead) {
      try {
        await markAsRead(nId);
      } catch (err) {}
    }

    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
  };

  const getNotificationIcon = (category) => {
    switch (category) {
      case 'BOOKINGS': return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'ENQUIRIES': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'VISITS': return <Clock className="w-4 h-4 text-purple-600" />;
      case 'PG': return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'REVIEWS': return <Star className="w-4 h-4 text-amber-500" />;
      case 'REPORTS': case 'COMPLAINTS': return <AlertOctagon className="w-4 h-4 text-rose-600" />;
      case 'ACCOUNT': return <User className="w-4 h-4 text-teal-600" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const categories = [
    { label: 'All', value: 'ALL' },
    { label: 'Bookings', value: 'BOOKINGS' },
    { label: 'Enquiries', value: 'ENQUIRIES' },
    { label: 'Visits', value: 'VISITS' },
    { label: 'PG Listings', value: 'PG' },
    { label: 'Reviews', value: 'REVIEWS' },
    { label: 'Complaints', value: 'COMPLAINTS' },
    { label: 'Account', value: 'ACCOUNT' },
  ];

  return (
    <Container className="py-8 font-sans max-w-4xl mx-auto">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#2563EB]" />
              Notifications & Communication Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Stay updated on booking requests, landlord replies, visit approvals, and account status updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={CheckCheck}
              onClick={handleMarkAllRead}
              className="shrink-0"
            >
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>

        {/* Category Tabs & Unread Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => { setActiveCategory(cat.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-2xl font-extrabold whitespace-nowrap transition-all ${
                  activeCategory === cat.value
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => { setUnreadOnly(e.target.checked); setPage(1); }}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Show Unread Only</span>
          </label>
        </div>

        {/* Notification List */}
        {loading ? (
          <Loader text="Loading notification feed..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="You're All Caught Up!"
            description="No notifications matching the selected category filter."
            actionText="Show All Notifications"
            onAction={() => { setActiveCategory('ALL'); setUnreadOnly(false); setPage(1); }}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {notifications.map((n) => {
              const nId = n._id || n.id;
              const isUnread = !n.isRead;

              return (
                <div
                  key={nId}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-5 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                    isUnread ? 'bg-blue-50/30' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Category Icon */}
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                      {getNotificationIcon(n.category)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isUnread && <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />}
                        <h3 className={`text-sm ${isUnread ? 'font-black text-[#0F172A]' : 'font-bold text-slate-700'}`}>
                          {n.title}
                        </h3>
                        <Badge variant="neutral">{n.category}</Badge>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                      <span className="text-[11px] text-slate-400 font-semibold block pt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : 'Recently'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {isUnread && (
                      <button
                        title="Mark as read"
                        onClick={(e) => handleMarkAsReadItem(e, nId)}
                        className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      title="Delete notification"
                      onClick={(e) => handleDeleteItem(e, nId)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {n.actionUrl && (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pt-4 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

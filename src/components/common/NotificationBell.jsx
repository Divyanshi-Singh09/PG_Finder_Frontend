import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, Calendar, MessageSquare, Shield, Star, AlertOctagon, User } from 'lucide-react';
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnread = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getUnreadCount();
      if (res.data?.unreadCount !== undefined) setUnreadCount(res.data.unreadCount);
    } catch (err) {}
  };

  const fetchLatestNotifications = async () => {
    setLoading(true);
    try {
      const res = await getMyNotifications({ limit: 5 });
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
        if (res.data.unreadCount !== undefined) setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // Polling unread count
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen) fetchLatestNotifications();
  }, [isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    const nId = notif._id || notif.id;
    if (!notif.isRead) {
      try {
        await markAsRead(nId);
        fetchUnread();
      } catch (err) {}
    }

    setIsOpen(false);
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    } else {
      navigate('/notifications');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-rose-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Preview Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 text-slate-900">
          
          {/* Dropdown Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-xs">
              <Bell className="w-4 h-4 text-blue-400" />
              <span>Notifications ({unreadCount} Unread)</span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-blue-400 hover:underline font-bold flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">You're all caught up!</p>
                <p className="text-[11px] text-slate-400">New updates will appear here.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const nId = n._id || n.id;
                return (
                  <div
                    key={nId}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 hover:bg-blue-50/60 cursor-pointer transition-colors space-y-1 ${
                      !n.isRead ? 'bg-blue-50/30' : 'opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#0F172A]">
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                        <span className="truncate max-w-[200px]">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer View All Link */}
          <div className="p-3 bg-slate-50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-extrabold text-[#2563EB] hover:underline"
            >
              View All Notifications Center →
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

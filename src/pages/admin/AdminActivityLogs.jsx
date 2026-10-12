import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, User, CheckCircle2, AlertOctagon } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import { getActivityLogs } from '../../services/adminService';

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLogs()
      .then((res) => {
        if (res.data?.logs) setLogs(res.data.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#2563EB]" />
            Platform Audit & Admin Activity Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log timeline of administrative actions, moderation status updates, and verification decisions.
          </p>
        </div>

        {/* Log List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading audit history...</div>
        ) : logs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No audit log entries found.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {logs.map((log) => {
              const lId = log._id || log.id;
              const adminName = log.performedBy?.name || 'Admin';

              return (
                <div key={lId} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={log.action?.includes('SUSPEND') ? 'danger' : log.action?.includes('APPROVE') ? 'success' : 'primary'}>
                        {log.action}
                      </Badge>
                      <span className="text-xs font-extrabold text-[#0F172A]">By {adminName}</span>
                    </div>

                    {log.reason && (
                      <p className="text-xs text-slate-600 italic">"{log.reason}"</p>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN') : 'Recently'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </Container>
  );
}

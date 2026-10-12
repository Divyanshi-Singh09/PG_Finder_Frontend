import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Users, Trash2, Ban, Check, Building2 } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Toast from '../../components/common/Toast';
import EmptyState from '../../components/common/EmptyState';
import { getMyAvailability, createAvailabilitySlot, updateAvailabilitySlot, deleteAvailabilitySlot } from '../../services/visitService';
import { getMyPGs } from '../../services/pgService';

export default function OwnerAvailability() {
  const [slots, setSlots] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [maxVisitors, setMaxVisitors] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [slotsRes, pgsRes] = await Promise.all([
        getMyAvailability(),
        getMyPGs(),
      ]);

      if (slotsRes.data?.slots) setSlots(slotsRes.data.slots);
      if (pgsRes.data?.pgs) {
        const approvedPgs = pgsRes.data.pgs.filter((p) => p.status === 'APPROVED');
        setPgs(approvedPgs);
        if (approvedPgs.length > 0) setSelectedPgId(approvedPgs[0]._id || approvedPgs[0].id);
      }
    } catch (err) {
      showToast('Failed to load availability slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!selectedPgId || !slotDate || !startTime || !endTime) {
      setErrorMsg('Please fill out all slot details.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await createAvailabilitySlot({
        pgId: selectedPgId,
        date: slotDate,
        startTime,
        endTime,
        maxVisitors: parseInt(maxVisitors) || 3,
      });

      showToast('Visit availability slot created successfully!', 'success');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create availability slot.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBlock = async (slot) => {
    const slotId = slot._id || slot.id;
    const newStatus = slot.status === 'BLOCKED' ? 'AVAILABLE' : 'BLOCKED';

    try {
      await updateAvailabilitySlot(slotId, { status: newStatus });
      showToast(`Slot status updated to ${newStatus}`, 'info');
      loadData();
    } catch (err) {
      showToast('Failed to update slot status', 'error');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this availability slot?')) return;

    try {
      await deleteAvailabilitySlot(slotId);
      showToast('Availability slot deleted', 'info');
      loadData();
    } catch (err) {
      showToast('Failed to delete slot', 'error');
    }
  };

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#2563EB]" />
              Visit Availability Slots
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Publish date & time slots when seekers can visit your PG properties.
            </p>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
            disabled={pgs.length === 0}
          >
            Add Visit Slot
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading availability slots...</div>
        ) : pgs.length === 0 ? (
          <EmptyState
            title="No Approved PGs Found"
            description="You must have at least one approved PG listing to create visit availability slots."
            actionText="Go to My PGs"
            actionTo="/owner/pgs"
          />
        ) : slots.length === 0 ? (
          <EmptyState
            title="No Availability Slots Published"
            description="Create your first visit slot so seekers can schedule physical property visits."
            actionText="Create Availability Slot"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => {
              const slotId = slot._id || slot.id;
              const pgName = slot.pg?.name || 'Property Listing';
              const spotsLeft = slot.maxVisitors - slot.bookedVisitors;

              return (
                <div
                  key={slotId}
                  className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[#0F172A] line-clamp-1 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        {pgName}
                      </span>
                      <Badge
                        variant={
                          slot.status === 'BLOCKED'
                            ? 'danger'
                            : slot.status === 'FULL'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {slot.status}
                      </Badge>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-[#0F172A]">
                        <span>{new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-blue-600">{slot.startTime} – {slot.endTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 pt-1">
                        <span>Bookings: {slot.bookedVisitors} / {slot.maxVisitors}</span>
                        <span className="font-semibold text-emerald-600">
                          {spotsLeft > 0 ? `${spotsLeft} spots available` : 'Full'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleBlock(slot)}
                      className={`text-xs font-bold flex items-center gap-1 ${
                        slot.status === 'BLOCKED' ? 'text-emerald-600 hover:underline' : 'text-amber-600 hover:underline'
                      }`}
                    >
                      {slot.status === 'BLOCKED' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          Block Slot
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(slotId)}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Add Slot Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Visit Availability Slot">
        <form onSubmit={handleCreateSlot} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          <Select
            label="Select PG Property"
            value={selectedPgId}
            onChange={(e) => setSelectedPgId(e.target.value)}
            options={pgs.map((p) => ({ label: p.name, value: p._id || p.id }))}
            required
          />

          <Input
            label="Visit Date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              options={[
                { label: '09:00 AM', value: '09:00 AM' },
                { label: '10:00 AM', value: '10:00 AM' },
                { label: '11:00 AM', value: '11:00 AM' },
                { label: '12:00 PM', value: '12:00 PM' },
                { label: '02:00 PM', value: '02:00 PM' },
                { label: '04:00 PM', value: '04:00 PM' },
                { label: '05:00 PM', value: '05:00 PM' },
                { label: '06:00 PM', value: '06:00 PM' },
              ]}
              required
            />

            <Select
              label="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              options={[
                { label: '10:00 AM', value: '10:00 AM' },
                { label: '11:00 AM', value: '11:00 AM' },
                { label: '12:00 PM', value: '12:00 PM' },
                { label: '01:00 PM', value: '01:00 PM' },
                { label: '03:00 PM', value: '03:00 PM' },
                { label: '05:00 PM', value: '05:00 PM' },
                { label: '06:00 PM', value: '06:00 PM' },
                { label: '07:00 PM', value: '07:00 PM' },
              ]}
              required
            />
          </div>

          <Input
            label="Maximum Visitor Capacity"
            type="number"
            min={1}
            max={20}
            value={maxVisitors}
            onChange={(e) => setMaxVisitors(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Publish Slot
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

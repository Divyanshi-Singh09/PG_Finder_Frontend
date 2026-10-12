import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Check, X, ShieldCheck, Tag } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';

import { getFacilities, createFacility, updateFacilityStatus } from '../../services/facilityService';

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('BASIC');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await getFacilities();
      if (res.data?.facilities) setFacilities(res.data.facilities);
    } catch (err) {
      showToast('Failed to load facility catalog.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleAddFacility = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitLoading(true);
    try {
      await createFacility({ name: name.trim(), category });
      showToast('New facility tag added successfully!', 'success');
      setName('');
      setIsAddModalOpen(false);
      fetchFacilities();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create facility.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (fac) => {
    const facId = fac._id || fac.id;
    try {
      await updateFacilityStatus(facId, { isActive: !fac.isActive });
      showToast(`Facility "${fac.name}" status updated.`, 'success');
      fetchFacilities();
    } catch (err) {
      showToast('Failed to update facility status.', 'error');
    }
  };

  if (loading) return <Loader text="Loading amenity facility catalog..." center size="lg" />;

  return (
    <Container className="py-8 font-sans max-w-5xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#2563EB]" />
            Centralized Platform Facility Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardize amenities across all property listings to maintain consistent search filters for seekers.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add Facility Tag
        </Button>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider">
              <tr>
                <th className="p-4">Facility Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
              {facilities.map((fac) => {
                const facId = fac._id || fac.id;
                return (
                  <tr key={facId} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-sm flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      {fac.name}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        {fac.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={fac.isActive ? 'primary' : 'neutral'}>
                        {fac.isActive ? 'Active Tag' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant={fac.isActive ? 'outline' : 'primary'}
                        size="xs"
                        onClick={() => handleToggleStatus(fac)}
                      >
                        {fac.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Standard Facility Tag">
        <form onSubmit={handleAddFacility} className="space-y-4 font-sans text-xs">
          <Input
            label="Facility Name"
            placeholder="e.g. EV Charging, Solar Power"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'BASIC', label: 'Basic Essentials' },
              { value: 'SAFETY', label: 'Safety & Security' },
              { value: 'COMFORT', label: 'Comfort & Climate' },
              { value: 'FOOD', label: 'Food & Kitchen' },
              { value: 'SERVICES', label: 'Housekeeping Services' },
              { value: 'ENTERTAINMENT', label: 'Recreation & Fitness' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitLoading}>
              Save Facility Tag
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />

    </Container>
  );
}

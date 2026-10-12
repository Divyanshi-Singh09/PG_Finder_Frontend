import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, SlidersHorizontal, Check, RotateCcw, Save } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';

export default function SeekerPreferences() {
  const { user } = useAuth();

  const [preferredLocation, setPreferredLocation] = useState('Noida');
  const [minBudget, setMinBudget] = useState('5000');
  const [maxBudget, setMaxBudget] = useState('20000');
  const [roomType, setRoomType] = useState('SINGLE');
  const [genderPreference, setGenderPreference] = useState('UNISEX');
  const [selectedFacilities, setSelectedFacilities] = useState(['Wi-Fi', 'AC', 'Food', 'Geyser']);
  const [saving, setSaving] = useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  useEffect(() => {
    const saved = localStorage.getItem('seeker_preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.preferredLocation) setPreferredLocation(parsed.preferredLocation);
        if (parsed.minBudget) setMinBudget(parsed.minBudget);
        if (parsed.maxBudget) setMaxBudget(parsed.maxBudget);
        if (parsed.roomType) setRoomType(parsed.roomType);
        if (parsed.genderPreference) setGenderPreference(parsed.genderPreference);
        if (parsed.facilities) setSelectedFacilities(parsed.facilities);
      } catch (err) {}
    }
  }, []);

  const handleFacilityToggle = (fac) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const prefs = {
        preferredLocation,
        minBudget,
        maxBudget,
        roomType,
        genderPreference,
        facilities: selectedFacilities,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('seeker_preferences', JSON.stringify(prefs));
      showToast('Personalization preferences saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save preferences.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPreferences = () => {
    setPreferredLocation('Noida');
    setMinBudget('5000');
    setMaxBudget('20000');
    setRoomType('SINGLE');
    setGenderPreference('UNISEX');
    setSelectedFacilities(['Wi-Fi', 'AC', 'Food', 'Geyser']);
    localStorage.removeItem('seeker_preferences');
    showToast('Preferences reset to default values.', 'info');
  };

  const availableFacilities = ['Wi-Fi', 'AC', 'Food', 'Laundry', 'Parking', 'Power Backup', 'Geyser', 'RO Water', 'CCTV'];

  return (
    <Container className="py-6 font-sans max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Seeker Personalization Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize your search profile to receive tailored recommendations and smart property matches.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleResetPreferences}>
          Reset Defaults
        </Button>
      </div>

      {/* Main Preference Form */}
      <form onSubmit={handleSavePreferences} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Preferred Location */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            Target Preferred City / Area
          </label>
          <input
            type="text"
            placeholder="e.g. Noida, Sector 62, Indirapuram"
            value={preferredLocation}
            onChange={(e) => setPreferredLocation(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Budget Bounds */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            Monthly Rent Range: ₹{parseInt(minBudget).toLocaleString()} - ₹{parseInt(maxBudget).toLocaleString()}
          </label>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="3000"
              max="50000"
              step="1000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {/* Room Occupancy & Gender Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Preferred Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="SINGLE">Single Occupancy</option>
              <option value="DOUBLE">Double Sharing</option>
              <option value="TRIPLE">Triple Sharing</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Gender Preference</label>
            <select
              value={genderPreference}
              onChange={(e) => setGenderPreference(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="UNISEX">Unisex / Co-ed</option>
              <option value="BOYS">Boys Only</option>
              <option value="GIRLS">Girls Only</option>
            </select>
          </div>
        </div>

        {/* Desired Amenities */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <label className="text-xs font-bold text-slate-700">Must-Have Amenities</label>
          <div className="flex flex-wrap gap-2">
            {availableFacilities.map((fac) => {
              const isSelected = selectedFacilities.includes(fac);
              return (
                <button
                  type="button"
                  key={fac}
                  onClick={() => handleFacilityToggle(fac)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {fac}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <Button variant="primary" type="submit" loading={saving} icon={Save}>
            Save Personalization Profile
          </Button>
        </div>

      </form>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />

    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Edit3
} from 'lucide-react';

import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Checkbox from '../common/Checkbox';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Toast from '../common/Toast';
import { createPG, updatePG, submitPG } from '../../services/pgService';

export default function PGFormWizard({ initialData = null, isEdit = false }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  // Controlled Facilities & Rules options
  const defaultFacilitiesList = [
    'Wi-Fi', 'AC', 'Food', 'Laundry', 'Parking', 'CCTV', 
    'Power Backup', 'Housekeeping', 'Geyser', 'RO Water', 
    'TV', 'Study Table', 'Wardrobe', 'Lift', 'Gym', 
    'Common Area', 'Biometric Security', '24x7 Security'
  ];

  const defaultRulesList = [
    'No Smoking inside rooms',
    'No Alcohol allowed',
    'Visitors allowed till 8 PM',
    'Gate closes at 10:30 PM',
    'Notice period: 30 days',
    'No loud music after 10 PM',
    'ID proof mandatory at check-in'
  ];

  // Wizard Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pgType: 'CO_LIVING',
    genderPreference: 'ANY',
    contact: { phone: '', alternatePhone: '', email: '' },
    address: { houseNumber: '', street: '', locality: '', landmark: '', city: 'Noida', state: 'Uttar Pradesh', pincode: '' },
    location: { latitude: 0, longitude: 0 },
    securityDeposit: 8000,
    roomTypes: [
      { type: 'DOUBLE', rent: 8500, deposit: 8500, totalRooms: 5, availableRooms: 3, amenities: ['AC', 'Wi-Fi'] }
    ],
    facilities: ['Wi-Fi', 'AC', 'Food', 'Power Backup', 'CCTV'],
    food: { available: true, type: 'Both', meals: ['Breakfast', 'Dinner'] },
    rules: ['No Smoking inside rooms', 'Visitors allowed till 8 PM'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', isCover: true }
    ],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [customRuleInput, setCustomRuleInput] = useState('');
  const [customFacilityInput, setCustomFacilityInput] = useState('');

  // Populate data when editing existing PG
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        pgType: initialData.pgType || 'CO_LIVING',
        contact: initialData.contact || { phone: '', alternatePhone: '', email: '' },
        address: initialData.address || { houseNumber: '', street: '', locality: '', landmark: '', city: 'Noida', state: 'Uttar Pradesh', pincode: '' },
        roomTypes: initialData.roomTypes?.length ? initialData.roomTypes : [
          { type: 'DOUBLE', rent: 8500, deposit: 8500, totalRooms: 5, availableRooms: 3, amenities: [] }
        ],
        facilities: initialData.facilities || ['Wi-Fi', 'AC'],
        food: initialData.food || { available: true, type: 'Both', meals: [] },
        rules: initialData.rules || [],
        images: initialData.images?.length ? initialData.images : [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', isCover: true }
        ],
      });
    }
  }, [initialData]);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  // Field change helpers
  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // Step 3: Room Types Helpers
  const addRoomType = () => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: [
        ...prev.roomTypes,
        { type: 'SINGLE', rent: 12000, deposit: 12000, totalRooms: 2, availableRooms: 1, amenities: [] },
      ],
    }));
  };

  const removeRoomType = (index) => {
    if (formData.roomTypes.length <= 1) {
      showToast('At least one room type is required.', 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, idx) => idx !== index),
    }));
  };

  const updateRoomType = (index, field, value) => {
    const updated = [...formData.roomTypes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, roomTypes: updated }));
  };

  // Step 4: Facilities Toggle
  const toggleFacility = (facility) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const addCustomFacility = () => {
    if (!customFacilityInput.trim()) return;
    if (!formData.facilities.includes(customFacilityInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, customFacilityInput.trim()],
      }));
    }
    setCustomFacilityInput('');
  };

  // Step 5: Rules & Food Toggle
  const toggleRule = (rule) => {
    setFormData((prev) => {
      const exists = prev.rules.includes(rule);
      return {
        ...prev,
        rules: exists
          ? prev.rules.filter((r) => r !== rule)
          : [...prev.rules, rule],
      };
    });
  };

  const addCustomRule = () => {
    if (!customRuleInput.trim()) return;
    if (!formData.rules.includes(customRuleInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, customRuleInput.trim()],
      }));
    }
    setCustomRuleInput('');
  };

  const toggleMeal = (meal) => {
    setFormData((prev) => {
      const meals = prev.food.meals || [];
      const exists = meals.includes(meal);
      return {
        ...prev,
        food: {
          ...prev.food,
          meals: exists ? meals.filter((m) => m !== meal) : [...meals, meal],
        },
      };
    });
  };

  // Step 6: Images Helpers
  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url: imageUrlInput.trim(), isCover: prev.images.length === 0 },
      ],
    }));
    setImageUrlInput('');
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const setCoverImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, idx) => ({
        ...img,
        isCover: idx === index,
      })),
    }));
  };

  // Step Navigation Validation
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.name.trim()) {
        showToast('Please enter a valid PG Property Name.', 'error');
        return false;
      }
      if (!formData.description.trim() || formData.description.length < 10) {
        showToast('Please provide a description of at least 10 characters.', 'error');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.address.city.trim() || !formData.address.state.trim() || !formData.address.pincode.trim()) {
        showToast('Please complete City, State, and Pincode.', 'error');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.roomTypes || formData.roomTypes.length === 0) {
        showToast('Please add at least one room type.', 'error');
        return false;
      }
    }
    if (step === 6) {
      if (!formData.images || formData.images.length === 0) {
        showToast('Please add at least 1 property image before completing.', 'error');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submission Handlers
  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      if (isEdit && initialData?._id) {
        await updatePG(initialData._id, { ...formData, status: 'DRAFT' });
      } else {
        await createPG({ ...formData, status: 'DRAFT' });
      }
      showToast('PG saved as Draft successfully!', 'success');
      setTimeout(() => navigate('/owner/pgs'), 1200);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save draft.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(6)) {
      return;
    }

    setLoading(true);
    try {
      let savedPg;
      if (isEdit && initialData?._id) {
        const res = await updatePG(initialData._id, formData);
        savedPg = res.data?.pg || initialData;
      } else {
        const res = await createPG(formData);
        savedPg = res.data?.pg;
      }

      if (savedPg?._id || savedPg?.id) {
        const pgId = savedPg._id || savedPg.id;
        await submitPG(pgId);
      }

      showToast('Property submitted for verification successfully!', 'success');
      setTimeout(() => navigate('/owner/pgs'), 1500);
    } catch (err) {
      const msg = err.response?.data?.missingFields
        ? `Missing required fields: ${err.response.data.missingFields.join(', ')}`
        : err.response?.data?.message || err.message || 'Verification submission failed.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    'Basic Information',
    'Address & Location',
    'Rooms & Pricing',
    'Facilities',
    'Food & Rules',
    'Property Images',
    'Review & Submit',
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Step Progress Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
          <span>Step {currentStep} of 7: <span className="text-[#2563EB]">{stepTitles[currentStep - 1]}</span></span>
          <span className="text-slate-400">{Math.round((currentStep / 7) * 100)}% Completed</span>
        </div>

        {/* Multi-step Circles Bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
            <div key={stepNum} className="flex items-center flex-1 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  stepNum === currentStep
                    ? 'bg-[#2563EB] text-white ring-4 ring-blue-100'
                    : stepNum < currentStep
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {stepNum < currentStep ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
              </button>
              {stepNum < 7 && <div className={`flex-1 h-1 mx-1 rounded ${stepNum < currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
        
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] border-b border-slate-100 pb-3">
              Step 1: Basic Property Information
            </h2>
            <Input
              label="PG Property Name"
              placeholder="e.g. Sunrise Premium Living"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Textarea
              label="Property Description"
              rows={4}
              required
              placeholder="Describe proximity to IT parks/colleges, housekeeping frequency, atmosphere..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="PG Category Type"
                value={formData.pgType}
                onChange={(e) => setFormData({ ...formData, pgType: e.target.value })}
                options={[
                  { label: 'Co-living (All)', value: 'CO_LIVING' },
                  { label: 'Boys PG', value: 'BOYS' },
                  { label: 'Girls PG', value: 'GIRLS' },
                ]}
              />
              <Select
                label="Gender Preference"
                value={formData.genderPreference}
                onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                options={[
                  { label: 'Any', value: 'ANY' },
                  { label: 'Male Only', value: 'MALE' },
                  { label: 'Female Only', value: 'FEMALE' },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Primary Contact Phone"
                placeholder="+91 98765 43210"
                value={formData.contact.phone}
                onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
              />
              <Input
                label="Alternate Phone"
                placeholder="Optional"
                value={formData.contact.alternatePhone}
                onChange={(e) => handleNestedChange('contact', 'alternatePhone', e.target.value)}
              />
              <Input
                label="Contact Email"
                placeholder="pgowner@example.com"
                value={formData.contact.email}
                onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Address & Location */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] border-b border-slate-100 pb-3">
              Step 2: Property Address & Location
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="House / Flat / Building No."
                placeholder="Building B-12"
                value={formData.address.houseNumber}
                onChange={(e) => handleNestedChange('address', 'houseNumber', e.target.value)}
              />
              <Input
                label="Street / Road"
                placeholder="Main Road Sector 62"
                value={formData.address.street}
                onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Locality / Area"
                placeholder="Near Electronic City Metro"
                value={formData.address.locality}
                onChange={(e) => handleNestedChange('address', 'locality', e.target.value)}
              />
              <Input
                label="Landmark"
                placeholder="Opposite Fortis Hospital"
                value={formData.address.landmark}
                onChange={(e) => handleNestedChange('address', 'landmark', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="City"
                value={formData.address.city}
                onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                options={['Noida', 'Delhi', 'Greater Noida', 'Ghaziabad', 'Gurugram', 'Bangalore', 'Pune', 'Hyderabad']}
              />
              <Input
                label="State"
                value={formData.address.state}
                onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
              />
              <Input
                label="Pincode"
                placeholder="201309"
                required
                value={formData.address.pincode}
                onChange={(e) => handleNestedChange('address', 'pincode', e.target.value)}
              />
            </div>
            
            {/* Map Placeholder */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <MapPin className="w-6 h-6 text-[#2563EB] mx-auto" />
              <p className="font-bold text-xs text-[#0F172A]">Location Coordinates (Optional)</p>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <Input
                  placeholder="Latitude"
                  type="number"
                  step="any"
                  value={formData.location.latitude}
                  onChange={(e) => handleNestedChange('location', 'latitude', Number(e.target.value))}
                />
                <Input
                  placeholder="Longitude"
                  type="number"
                  step="any"
                  value={formData.location.longitude}
                  onChange={(e) => handleNestedChange('location', 'longitude', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Rooms & Pricing */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-bold text-[#0F172A]">Step 3: Rooms & Rent Pricing</h2>
              <Button variant="outline" size="sm" onClick={addRoomType} icon={Plus}>
                Add Room Type
              </Button>
            </div>

            <div className="space-y-4">
              {formData.roomTypes.map((room, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#2563EB]">Room Option #{idx + 1}</span>
                    {formData.roomTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomType(idx)}
                        className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Select
                      label="Sharing Type"
                      value={room.type}
                      onChange={(e) => updateRoomType(idx, 'type', e.target.value)}
                      options={[
                        { label: 'Single Room', value: 'SINGLE' },
                        { label: 'Double Sharing', value: 'DOUBLE' },
                        { label: 'Triple Sharing', value: 'TRIPLE' },
                        { label: 'Four Sharing', value: 'FOUR_SHARING' },
                      ]}
                    />
                    <Input
                      label="Monthly Rent (₹)"
                      type="number"
                      value={room.rent}
                      onChange={(e) => updateRoomType(idx, 'rent', Number(e.target.value))}
                    />
                    <Input
                      label="Security Deposit (₹)"
                      type="number"
                      value={room.deposit}
                      onChange={(e) => updateRoomType(idx, 'deposit', Number(e.target.value))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Total Rooms"
                      type="number"
                      value={room.totalRooms}
                      onChange={(e) => updateRoomType(idx, 'totalRooms', Number(e.target.value))}
                    />
                    <Input
                      label="Available Rooms"
                      type="number"
                      value={room.availableRooms}
                      onChange={(e) => updateRoomType(idx, 'availableRooms', Number(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Facilities */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0F172A] border-b border-slate-100 pb-3">
              Step 4: Amenities & Facilities Grid
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {defaultFacilitiesList.map((fac) => (
                <Checkbox
                  key={fac}
                  label={fac}
                  checked={formData.facilities.includes(fac)}
                  onChange={() => toggleFacility(fac)}
                />
              ))}
            </div>

            <div className="pt-4 flex gap-2">
              <Input
                placeholder="Add custom facility (e.g. Swimming Pool)..."
                value={customFacilityInput}
                onChange={(e) => setCustomFacilityInput(e.target.value)}
              />
              <Button variant="outline" onClick={addCustomFacility}>
                Add
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Food & House Rules */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A] border-b border-slate-100 pb-3">
              Step 5: Food Policy & House Rules
            </h2>

            {/* Food Section */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <Checkbox
                label="Food / Meals Available"
                checked={formData.food.available}
                onChange={(e) => handleNestedChange('food', 'available', e.target.checked)}
              />

              {formData.food.available && (
                <div className="space-y-3 pt-2 pl-6">
                  <Select
                    label="Food Type"
                    value={formData.food.type}
                    onChange={(e) => handleNestedChange('food', 'type', e.target.value)}
                    options={['Vegetarian', 'Non-Vegetarian', 'Both']}
                  />
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Meals Included</label>
                    <div className="flex gap-4">
                      {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                        <Checkbox
                          key={meal}
                          label={meal}
                          checked={formData.food.meals?.includes(meal)}
                          onChange={() => toggleMeal(meal)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rules Section */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#0F172A]">Select House Rules</label>
              <div className="space-y-2">
                {defaultRulesList.map((rule) => (
                  <Checkbox
                    key={rule}
                    label={rule}
                    checked={formData.rules.includes(rule)}
                    onChange={() => toggleRule(rule)}
                  />
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add custom rule..."
                  value={customRuleInput}
                  onChange={(e) => setCustomRuleInput(e.target.value)}
                />
                <Button variant="outline" onClick={addCustomRule}>
                  Add Rule
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Images */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A] border-b border-slate-100 pb-3">
              Step 6: Property Images
            </h2>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">Add Image by URL</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <Button variant="primary" onClick={addImageUrl}>
                  Add Photo
                </Button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img src={img.url} alt={`Property ${idx}`} className="w-full h-full object-cover" />
                  
                  {img.isCover && (
                    <span className="absolute top-2 left-2 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Cover Photo
                    </span>
                  )}

                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!img.isCover && (
                      <Button variant="secondary" size="sm" onClick={() => setCoverImage(idx)}>
                        Set Cover
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Review & Submit */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A] border-b border-slate-100 pb-3">
              Step 7: Review Property Listing
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0F172A] text-base">{formData.name}</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} icon={Edit3}>Edit</Button>
                </div>
                <p className="text-xs text-slate-500">{formData.description}</p>
                <p className="text-xs font-semibold text-[#2563EB]">Category: {formData.pgType} • Gender: {formData.genderPreference}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0F172A]">Address & Location</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} icon={Edit3}>Edit</Button>
                </div>
                <p className="text-xs text-slate-600">
                  {formData.address.houseNumber} {formData.address.street}, {formData.address.locality}, {formData.address.city}, {formData.address.state} - {formData.address.pincode}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0F172A]">Room Options</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} icon={Edit3}>Edit</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.roomTypes.map((r, i) => (
                    <Badge key={i} variant="primary">
                      {r.type}: ₹{r.rent}/mo ({r.availableRooms}/{r.totalRooms} available)
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0F172A]">Facilities & Rules</h4>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)} icon={Edit3}>Edit</Button>
                </div>
                <p className="text-xs text-slate-600">
                  <span className="font-bold">Facilities:</span> {formData.facilities.join(', ')}
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-bold">Rules:</span> {formData.rules.join(', ')}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={prevStep} icon={ChevronLeft}>
              Previous
            </Button>
          ) : <div />}

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSaveDraft} disabled={loading}>
              Save as Draft
            </Button>

            {currentStep < 7 ? (
              <Button variant="primary" onClick={nextStep}>
                Next Step
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmitVerification} loading={loading}>
                Submit for Verification
              </Button>
            )}
          </div>
        </div>

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}

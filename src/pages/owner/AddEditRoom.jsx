import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DoorOpen, ArrowLeft, Plus, Check } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Toast from '../../components/common/Toast';
import { getMyPGs } from '../../services/pgService';
import { createRoom, getRoomById, updateRoom } from '../../services/roomService';

export default function AddEditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [pgs, setPgs] = useState([]);
  const [pgId, setPgId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('DOUBLE');
  const [totalBeds, setTotalBeds] = useState(2);
  const [rent, setRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [amenitiesStr, setAmenitiesStr] = useState('Attach Bathroom, Wi-Fi, Cupboard');

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

  useEffect(() => {
    getMyPGs().then((res) => {
      if (res.data?.pgs && res.data.pgs.length > 0) {
        setPgs(res.data.pgs);
        if (!isEdit) setPgId(res.data.pgs[0]._id || res.data.pgs[0].id);
      }
    });

    if (isEdit) {
      getRoomById(id).then((res) => {
        if (res.data?.room) {
          const rm = res.data.room;
          setPgId(rm.pg?._id || rm.pg?.id || rm.pg);
          setRoomNumber(rm.roomNumber);
          setRoomType(rm.roomType || 'DOUBLE');
          setTotalBeds(rm.totalBeds || 2);
          setRent(rm.rent);
          setSecurityDeposit(rm.securityDeposit || 0);
          setStatus(rm.status || 'ACTIVE');
          if (rm.amenities) setAmenitiesStr(rm.amenities.join(', '));
        }
      });
    }
  }, [id, isEdit]);

  // Adjust default beds when room type changes
  const handleRoomTypeChange = (e) => {
    const val = e.target.value;
    setRoomType(val);
    if (val === 'SINGLE') setTotalBeds(1);
    else if (val === 'DOUBLE') setTotalBeds(2);
    else if (val === 'TRIPLE') setTotalBeds(3);
    else if (val === 'FOUR_SHARING') setTotalBeds(4);
    else if (val === 'DORMITORY') setTotalBeds(6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pgId || !roomNumber || !rent) {
      setErrorMsg('Please enter room number and monthly rent.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const amenitiesList = amenitiesStr.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      if (isEdit) {
        await updateRoom(id, {
          rent: parseFloat(rent),
          securityDeposit: parseFloat(securityDeposit || 0),
          status,
          amenities: amenitiesList,
        });
        showToast('Room updated successfully!', 'success');
      } else {
        await createRoom({
          pgId,
          roomNumber,
          roomType,
          totalBeds: parseInt(totalBeds),
          rent: parseFloat(rent),
          securityDeposit: parseFloat(securityDeposit || 0),
          status,
          amenities: amenitiesList,
        });
        showToast('Room created with automatic beds!', 'success');
      }

      setTimeout(() => navigate('/owner/rooms'), 1000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save room details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-8 font-sans max-w-3xl mx-auto">
      <div className="space-y-6">
        
        {/* Back Link */}
        <Link to="/owner/rooms" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" />
          Back to Room Management
        </Link>

        {/* Form Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">
              {isEdit ? `Edit Room ${roomNumber}` : 'Add New PG Room'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Beds are automatically created according to the specified bed capacity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {!isEdit && pgs.length > 0 && (
              <Select
                label="Target PG Property"
                value={pgId}
                onChange={(e) => setPgId(e.target.value)}
                options={pgs.map((p) => ({ label: p.name, value: p._id || p.id }))}
                required
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Room Number"
                placeholder="e.g. 101, 102A, 201"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                disabled={isEdit}
              />

              <Select
                label="Room Sharing Type"
                value={roomType}
                onChange={handleRoomTypeChange}
                options={[
                  { label: 'Single Sharing (1 Bed)', value: 'SINGLE' },
                  { label: 'Double Sharing (2 Beds)', value: 'DOUBLE' },
                  { label: 'Triple Sharing (3 Beds)', value: 'TRIPLE' },
                  { label: 'Four Sharing (4 Beds)', value: 'FOUR_SHARING' },
                  { label: 'Dormitory (6 Beds)', value: 'DORMITORY' },
                ]}
                disabled={isEdit}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Number of Beds"
                type="number"
                min={1}
                max={20}
                value={totalBeds}
                onChange={(e) => setTotalBeds(e.target.value)}
                required
                disabled={isEdit}
              />

              <Input
                label="Monthly Rent per Bed (₹)"
                type="number"
                placeholder="8000"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                required
              />

              <Input
                label="Security Deposit (₹)"
                type="number"
                placeholder="8000"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Room Operational Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'ACTIVE (Ready for Booking)', value: 'ACTIVE' },
                  { label: 'INACTIVE (Hidden)', value: 'INACTIVE' },
                  { label: 'MAINTENANCE (Under Maintenance)', value: 'MAINTENANCE' },
                ]}
              />

              <Input
                label="Room Amenities (Comma Separated)"
                placeholder="Attach Bathroom, AC, Wi-Fi, Balcony"
                value={amenitiesStr}
                onChange={(e) => setAmenitiesStr(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link to="/owner/rooms">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button variant="primary" type="submit" loading={submitting}>
                {isEdit ? 'Save Changes' : 'Create Room & Generate Beds'}
              </Button>
            </div>

          </form>
        </div>

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

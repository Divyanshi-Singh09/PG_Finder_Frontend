import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Building2, DoorOpen, Bed as BedIcon, Check, Send, AlertTriangle } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';
import { getPublicPGById } from '../../services/pgService';
import { getRoomsByPG } from '../../services/roomService';
import { createBooking } from '../../services/bookingService';

export default function SeekerBookPage() {
  const { pgId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Room, 2: Bed, 3: Date/Message, 4: Review
  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);

  const [moveInDate, setMoveInDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  const [seekerMessage, setSeekerMessage] = useState('');

  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    Promise.all([getPublicPGById(pgId), getRoomsByPG(pgId)])
      .then(([pgRes, roomRes]) => {
        if (pgRes.data?.pg) setPg(pgRes.data.pg);
        if (roomRes.data?.rooms) setRooms(roomRes.data.rooms);
      })
      .catch((err) => setErrorMsg('Failed to load room availability'))
      .finally(() => setLoading(false));
  }, [pgId]);

  const availableRooms = rooms.filter(
    (r) => r.status === 'ACTIVE' && (r.beds || []).some((b) => b.status === 'AVAILABLE')
  );

  const handleSubmitBooking = async () => {
    if (!selectedRoom || !selectedBed || !moveInDate) {
      setErrorMsg('Please complete room, bed, and move-in date selection.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await createBooking({
        pgId,
        roomId: selectedRoom._id || selectedRoom.id,
        bedId: selectedBed._id || selectedBed.id,
        moveInDate,
        seekerMessage,
      });

      showToast('Booking request submitted successfully!', 'success');
      setTimeout(() => navigate('/seeker/bookings'), 1200);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Container className="py-12 text-center text-xs text-slate-400">Loading booking wizard...</Container>;

  return (
    <Container className="py-8 font-sans max-w-3xl mx-auto">
      <div className="space-y-6">
        
        {/* Back Link */}
        <Link to={`/pg/${pgId}`} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" />
          Back to PG Details
        </Link>

        {/* Wizard Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#2563EB] tracking-wider uppercase">Room Booking Request</span>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">{pg?.name || 'Sunrise PG'}</h1>
            </div>
            <Badge variant="primary">Step {step} of 4</Badge>
          </div>

          {/* Wizard Steps Navigation */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            {['1. Select Room', '2. Select Bed', '3. Move-in Date', '4. Review & Request'].map((title, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={stepNum > step && (!selectedRoom || (stepNum === 3 && !selectedBed))}
                  onClick={() => setStep(stepNum)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold text-center transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : isDone
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: SELECT ROOM */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#0F172A]">Step 1: Choose Available Room</h3>

            {availableRooms.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No available rooms found for online booking at this property.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableRooms.map((rm) => {
                  const rmId = rm._id || rm.id;
                  const isSelected = (selectedRoom?._id || selectedRoom?.id) === rmId;
                  const availBedsCount = (rm.beds || []).filter((b) => b.status === 'AVAILABLE').length;

                  return (
                    <div
                      key={rmId}
                      onClick={() => {
                        setSelectedRoom(rm);
                        setSelectedBed(null);
                        setStep(2);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                        isSelected ? 'border-[#2563EB] bg-blue-50/60 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-base text-[#0F172A]">Room {rm.roomNumber}</span>
                        <Badge variant="success">{availBedsCount} Beds Left</Badge>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p className="font-semibold text-blue-600">{rm.roomType ? rm.roomType.replace('_', ' ') : 'DOUBLE'}</p>
                        <p className="font-extrabold text-sm text-[#0F172A]">₹{rm.rent?.toLocaleString('en-IN')}/mo</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SELECT BED */}
        {step === 2 && selectedRoom && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#0F172A]">
                Step 2: Choose Bed in Room {selectedRoom.roomNumber}
              </h3>
              <Button variant="outline" size="xs" onClick={() => setStep(1)}>Change Room</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(selectedRoom.beds || [])
                .filter((b) => b.status === 'AVAILABLE')
                .map((bed) => {
                  const bId = bed._id || bed.id;
                  const isSelected = (selectedBed?._id || selectedBed?.id) === bId;

                  return (
                    <div
                      key={bId}
                      onClick={() => {
                        setSelectedBed(bed);
                        setStep(3);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 text-center ${
                        isSelected ? 'border-[#2563EB] bg-blue-50/60 ring-2 ring-blue-500/20' : 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                      }`}
                    >
                      <BedIcon className="w-6 h-6 text-emerald-600 mx-auto" />
                      <span className="font-black text-sm text-[#0F172A] block">{bed.bedNumber}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                        AVAILABLE
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* STEP 3: MOVE-IN DATE & MESSAGE */}
        {step === 3 && selectedBed && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#0F172A]">Step 3: Move-in Date & Message</h3>

            <Input
              label="Expected Move-in Date"
              type="date"
              value={moveInDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setMoveInDate(e.target.value)}
              required
            />

            <Textarea
              label="Optional Note to Landlord"
              placeholder="e.g. I am a working professional moving to Noida next month..."
              rows={3}
              value={seekerMessage}
              onChange={(e) => setSeekerMessage(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button variant="primary" onClick={() => setStep(4)}>Proceed to Review</Button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & REQUEST SUMMARY (NO PAYMENT) */}
        {step === 4 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-[#0F172A]">Step 4: Review Booking Request Summary</h3>

            {/* Offline Disclosure Notice */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Offline Booking Request:</strong> Submitting this request reserves your bed and notifies the landlord. No online payment is processed inside this application.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-700">
                <span>PG Property:</span>
                <span className="text-[#0F172A]">{pg?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Room & Type:</span>
                <span className="font-bold text-slate-900">Room {selectedRoom?.roomNumber} ({selectedRoom?.roomType})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Selected Bed:</span>
                <span className="font-bold text-emerald-600">{selectedBed?.bedNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Move-in Date:</span>
                <span className="font-bold text-slate-900">{moveInDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Monthly Rent Quote:</span>
                <span className="font-black text-sm text-[#0F172A]">₹{selectedRoom?.rent?.toLocaleString('en-IN')}/mo</span>
              </div>
              {selectedRoom?.securityDeposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Security Deposit:</span>
                  <span className="font-bold text-slate-900">₹{selectedRoom.securityDeposit?.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button variant="primary" icon={Send} loading={submitting} onClick={handleSubmitBooking}>
                Send Booking Request
              </Button>
            </div>
          </div>
        )}

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed as BedIcon, ArrowLeft, CheckCircle2, Clock, Ban, Wrench } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { getRoomById, updateBedStatus } from '../../services/roomService';

export default function OwnerBedManager() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [beds, setBeds] = useState([]);
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

  const loadRoom = async () => {
    setLoading(true);
    try {
      const res = await getRoomById(roomId);
      if (res.data?.room) {
        setRoom(res.data.room);
        setBeds(res.data.room.beds || []);
      }
    } catch (err) {
      showToast('Failed to load bed inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  const handleToggleStatus = async (bed) => {
    const bedId = bed._id || bed.id;
    if (bed.status === 'OCCUPIED' || bed.status === 'RESERVED') {
      showToast(`Cannot modify status of a bed that is ${bed.status}`, 'error');
      return;
    }

    const newStatus = bed.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
    try {
      await updateBedStatus(bedId, newStatus);
      showToast(`Bed ${bed.bedNumber} marked as ${newStatus}!`, 'success');
      loadRoom();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update bed status.', 'error');
    }
  };

  const getBedCardStyle = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50/60 border-emerald-200 text-emerald-950 hover:border-emerald-300';
      case 'RESERVED':
        return 'bg-blue-50/60 border-blue-200 text-blue-950 hover:border-blue-300';
      case 'OCCUPIED':
        return 'bg-slate-100 border-slate-300 text-slate-900';
      case 'MAINTENANCE':
        return 'bg-amber-50/60 border-amber-200 text-amber-950 hover:border-amber-300';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <Container className="py-8 font-sans max-w-4xl mx-auto">
      <div className="space-y-6">
        
        {/* Back Link */}
        <Link to="/owner/rooms" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
          <ArrowLeft className="w-4 h-4" />
          Back to Room Management
        </Link>

        {/* Room Header Card */}
        {room && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#0F172A]">Room {room.roomNumber} Inventory</h1>
                <Badge variant="primary">{room.roomType ? room.roomType.replace('_', ' ') : 'DOUBLE'}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Property: {room.pg?.name || 'My PG'} • Rent: ₹{room.rent?.toLocaleString('en-IN')}/mo
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase block">Bed Availability</span>
              <span className="text-lg font-extrabold text-emerald-600">
                {beds.filter((b) => b.status === 'AVAILABLE').length} Available / {beds.length} Total
              </span>
            </div>
          </div>
        )}

        {/* Beds Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading bed document inventory...</div>
        ) : beds.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No beds associated with this room.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beds.map((bed) => {
              const bId = bed._id || bed.id;
              const isLocked = bed.status === 'OCCUPIED' || bed.status === 'RESERVED';

              return (
                <div
                  key={bId}
                  className={`p-5 rounded-3xl border transition-all space-y-4 flex flex-col justify-between ${getBedCardStyle(bed.status)}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base flex items-center gap-2">
                        <BedIcon className="w-5 h-5 text-[#2563EB]" />
                        {bed.bedNumber}
                      </h3>

                      <Badge
                        variant={
                          bed.status === 'AVAILABLE'
                            ? 'success'
                            : bed.status === 'OCCUPIED'
                            ? 'neutral'
                            : bed.status === 'RESERVED'
                            ? 'primary'
                            : 'warning'
                        }
                      >
                        {bed.status}
                      </Badge>
                    </div>

                    <p className="text-xs opacity-75">
                      {bed.status === 'AVAILABLE' && 'Ready to accept seeker booking requests.'}
                      {bed.status === 'RESERVED' && 'Seeker request pending owner decision.'}
                      {bed.status === 'OCCUPIED' && 'Occupied by active verified guest.'}
                      {bed.status === 'MAINTENANCE' && 'Under maintenance / unassigned.'}
                    </p>
                  </div>

                  {!isLocked && (
                    <div className="pt-2">
                      <Button
                        variant={bed.status === 'AVAILABLE' ? 'outline' : 'primary'}
                        size="xs"
                        fullWidth
                        icon={Wrench}
                        onClick={() => handleToggleStatus(bed)}
                      >
                        {bed.status === 'AVAILABLE' ? 'Set Maintenance' : 'Set Available'}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}

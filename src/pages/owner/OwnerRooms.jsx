import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DoorOpen, Plus, Edit, Trash2, Users, Bed as BedIcon, AlertCircle, CheckCircle } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import Select from '../../components/common/Select';
import { getMyPGs } from '../../services/pgService';
import { getRoomsByPG, deleteRoom } from '../../services/roomService';

export default function OwnerRooms() {
  const [pgs, setPgs] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [rooms, setRooms] = useState([]);
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

  useEffect(() => {
    getMyPGs()
      .then((res) => {
        if (res.data?.pgs && res.data.pgs.length > 0) {
          setPgs(res.data.pgs);
          const firstPgId = res.data.pgs[0]._id || res.data.pgs[0].id;
          setSelectedPgId(firstPgId);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const loadRooms = async (pgId) => {
    if (!pgId) return;
    setLoading(true);
    try {
      const res = await getRoomsByPG(pgId);
      if (res.data?.rooms) setRooms(res.data.rooms);
    } catch (err) {
      showToast('Failed to load rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPgId) {
      loadRooms(selectedPgId);
    }
  }, [selectedPgId]);

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) return;

    try {
      await deleteRoom(roomId);
      showToast(`Room ${roomNumber} deleted successfully.`, 'success');
      loadRooms(selectedPgId);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete room.', 'error');
    }
  };

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <DoorOpen className="w-6 h-6 text-[#2563EB]" />
              Room & Bed Inventory Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure room sharing types, set monthly rent, and manage individual bed availability.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {pgs.length > 0 && (
              <Select
                value={selectedPgId}
                onChange={(e) => setSelectedPgId(e.target.value)}
                options={pgs.map((p) => ({ label: p.name, value: p._id || p.id }))}
              />
            )}

            <Link to="/owner/rooms/new">
              <Button variant="primary" icon={Plus}>
                Add New Room
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading rooms...</div>
        ) : pgs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <p className="text-sm font-bold text-slate-700">No PG Properties Found</p>
            <p className="text-xs text-slate-500">Please create a PG property listing first before adding rooms.</p>
            <Link to="/owner/pgs/add">
              <Button variant="primary" size="sm">Add Property</Button>
            </Link>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <DoorOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Rooms Created Yet</p>
            <p className="text-xs text-slate-500">Add rooms to enable online booking requests for this PG.</p>
            <Link to="/owner/rooms/new">
              <Button variant="primary" size="sm" icon={Plus}>Add Room Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((rm) => {
              const rmId = rm._id || rm.id;
              const total = rm.totalBeds || 1;
              const avail = rm.availableBeds !== undefined ? rm.availableBeds : total;
              const occupied = total - avail;

              return (
                <div key={rmId} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-lg text-[#0F172A]">Room {rm.roomNumber}</h3>
                        <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 mt-1 inline-block">
                          {rm.roomType ? rm.roomType.replace('_', ' ') : 'DOUBLE SHARING'}
                        </span>
                      </div>

                      <Badge
                        variant={
                          rm.status === 'ACTIVE'
                            ? 'success'
                            : rm.status === 'FULL'
                            ? 'neutral'
                            : 'warning'
                        }
                      >
                        {rm.status}
                      </Badge>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-700 font-bold">
                        <span>Monthly Rent:</span>
                        <span className="text-[#0F172A] font-black text-sm">₹{rm.rent?.toLocaleString('en-IN')}/mo</span>
                      </div>
                      {rm.securityDeposit > 0 && (
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Deposit:</span>
                          <span>₹{rm.securityDeposit?.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>

                    {/* Bed Capacity Progress */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span className="flex items-center gap-1">
                          <BedIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                          Beds Capacity
                        </span>
                        <span className="text-emerald-600">{avail} Available / {total} Total</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full transition-all"
                          style={{ width: `${(avail / total) * 100}%` }}
                        />
                        <div
                          className="bg-slate-300 h-full transition-all"
                          style={{ width: `${(occupied / total) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link to={`/owner/rooms/${rmId}/beds`} className="flex-1">
                      <Button variant="secondary" size="xs" fullWidth icon={BedIcon}>
                        Manage Beds ({total})
                      </Button>
                    </Link>

                    <Link to={`/owner/rooms/${rmId}/edit`}>
                      <Button variant="outline" size="xs" icon={Edit} title="Edit Room" />
                    </Link>

                    <Button
                      variant="outline"
                      size="xs"
                      icon={Trash2}
                      className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                      onClick={() => handleDeleteRoom(rmId, rm.roomNumber)}
                      title="Delete Room"
                    />
                  </div>

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

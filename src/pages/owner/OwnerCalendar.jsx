import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import Container from '../../components/common/Container';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { getOwnerVisits, getMyAvailability } from '../../services/visitService';

export default function OwnerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visits, setVisits] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  useEffect(() => {
    setLoading(true);
    Promise.all([getOwnerVisits(), getMyAvailability()])
      .then(([vRes, sRes]) => {
        if (vRes.data?.visits) setVisits(vRes.data.visits);
        if (sRes.data?.slots) setSlots(sRes.data.slots);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Get visits and slots for the currently selected day
  const selectedDateStr = new Date(year, month, selectedDay).toDateString();

  const dayVisits = visits.filter(
    (v) => new Date(v.date).toDateString() === selectedDateStr
  );

  const daySlots = slots.filter(
    (s) => new Date(s.date).toDateString() === selectedDateStr
  );

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#2563EB]" />
              Visit Calendar
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Visual monthly schedule of published visit slots and booked property visits.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-xl hover:bg-white text-slate-700 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-[#0F172A] px-3">
              {currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-xl hover:bg-white text-slate-700 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid: Calendar + Day Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Monthly Calendar Grid */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="grid grid-cols-7 text-center text-xs font-black text-slate-400 uppercase border-b border-slate-100 pb-3">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Empty padding cells */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 sm:h-24 bg-slate-50/50 rounded-2xl border border-slate-100" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const cellDateStr = new Date(year, month, dayNum).toDateString();
                const isSelected = selectedDay === dayNum;

                const cellVisits = visits.filter((v) => new Date(v.date).toDateString() === cellDateStr);
                const cellSlots = slots.filter((s) => new Date(s.date).toDateString() === cellDateStr);

                return (
                  <div
                    key={dayNum}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#2563EB] ring-2 ring-blue-100'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-xs font-black ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                      {dayNum}
                    </span>

                    <div className="space-y-1">
                      {cellVisits.length > 0 && (
                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate">
                          {cellVisits.length} visit{cellVisits.length > 1 ? 's' : ''}
                        </div>
                      )}
                      {cellSlots.length > 0 && (
                        <div className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate">
                          {cellSlots.length} slot{cellSlots.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Selected Day Details Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#0F172A]">
                {new Date(year, month, selectedDay).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-500">
                Scheduled visits & slots for selected date
              </p>
            </div>

            {/* Visits on this day */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booked Visits ({dayVisits.length})</h4>
              {dayVisits.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No visit requests on this date.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {dayVisits.map((v) => (
                    <div key={v._id || v.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#0F172A]">
                        <span>{v.seeker?.name || 'Seeker'}</span>
                        <Badge variant={v.status === 'CONFIRMED' ? 'success' : 'warning'}>{v.status}</Badge>
                      </div>
                      <p className="text-slate-500">{v.startTime} – {v.endTime}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slots on this day */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Slots ({daySlots.length})</h4>
              {daySlots.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No slots published for this date.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {daySlots.map((s) => (
                    <div key={s._id || s.id} className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#0F172A] block">{s.startTime} – {s.endTime}</span>
                        <span className="text-slate-500 text-[11px]">{s.bookedVisitors} / {s.maxVisitors} booked</span>
                      </div>
                      <Badge variant="primary">{s.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </Container>
  );
}

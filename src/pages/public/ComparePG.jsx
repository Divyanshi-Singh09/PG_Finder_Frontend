import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Check, X, ArrowLeft, Star, ShieldCheck, DoorOpen } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { getPublicPGById } from '../../services/pgService';

export default function ComparePG() {
  const [searchParams] = useSearchParams();
  const idsStr = searchParams.get('ids') || '';
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idsStr) {
      setLoading(false);
      return;
    }

    const ids = idsStr.split(',').filter(Boolean);
    Promise.all(ids.map((id) => getPublicPGById(id).catch(() => null)))
      .then((results) => {
        const valid = results.map((r) => r?.data?.pg).filter(Boolean);
        setPgs(valid);
      })
      .finally(() => setLoading(false));
  }, [idsStr]);

  if (loading) return <Loader text="Loading side-by-side comparison matrix..." center size="lg" />;

  if (pgs.length === 0) {
    return (
      <Container className="py-16 text-center space-y-4 font-sans max-w-lg mx-auto">
        <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-black text-[#0F172A]">No Properties Selected for Comparison</h2>
        <p className="text-xs text-slate-500">Select up to 3 PG properties from search results to compare rent, amenities, and room sharing choices.</p>
        <Link to="/search">
          <Button variant="primary">Browse PG Directory</Button>
        </Link>
      </Container>
    );
  }

  const facilityList = ['Wi-Fi', 'AC', 'Food', 'Laundry', 'Parking', 'Power Backup', 'CCTV', 'Hot Water'];

  return (
    <Container className="py-8 font-sans max-w-6xl mx-auto space-y-6">
      
      {/* Back Link */}
      <Link to="/search" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
        <ArrowLeft className="w-4 h-4" />
        Back to Search Results
      </Link>

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-[#2563EB]" />
          Side-by-Side Property Comparison
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Comparing {pgs.length} properties across location, rent options, guest ratings, and verified amenities.
        </p>
      </div>

      {/* Comparison Grid Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="p-4 w-48 font-black uppercase tracking-wider text-slate-400">Feature</th>
                {pgs.map((pg) => {
                  const pgId = pg._id || pg.id;
                  return (
                    <th key={pgId} className="p-4 min-w-[220px]">
                      <div className="space-y-2">
                        <img
                          src={pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                          alt={pg.name}
                          className="w-full h-28 object-cover rounded-2xl"
                        />
                        <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center gap-1">
                          {pg.name}
                          {pg.isVerifiedPG && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </h3>
                        <Link to={`/pg/${pgId}`}>
                          <Button variant="primary" size="xs" fullWidth>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-[#0F172A]">
              
              {/* Location Row */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Location</td>
                {pgs.map((pg) => (
                  <td key={pg._id || pg.id} className="p-4">
                    {pg.address?.locality ? `${pg.address.locality}, ${pg.address.city}` : pg.address?.city || 'Noida'}
                  </td>
                ))}
              </tr>

              {/* Gender Preference */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Gender Allowed</td>
                {pgs.map((pg) => (
                  <td key={pg._id || pg.id} className="p-4">
                    <Badge variant={pg.genderPreference === 'MALE' ? 'primary' : pg.genderPreference === 'FEMALE' ? 'danger' : 'neutral'}>
                      {pg.genderPreference}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Starting Rent */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Starting Rent</td>
                {pgs.map((pg) => {
                  const minRent = pg.rent?.min || (pg.roomTypes?.[0]?.rent) || 8000;
                  return (
                    <td key={pg._id || pg.id} className="p-4 font-black text-sm text-blue-600">
                      ₹{minRent.toLocaleString('en-IN')}/mo
                    </td>
                  );
                })}
              </tr>

              {/* Guest Rating */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Guest Rating</td>
                {pgs.map((pg) => (
                  <td key={pg._id || pg.id} className="p-4">
                    {pg.ratingSummary?.average > 0 ? (
                      <span className="font-extrabold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100 inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        {pg.ratingSummary.average} ({pg.ratingSummary.count} reviews)
                      </span>
                    ) : (
                      <span className="text-slate-400 font-semibold">No reviews yet</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Room Sharing Options */}
              <tr>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/50">Room Sharing Types</td>
                {pgs.map((pg) => (
                  <td key={pg._id || pg.id} className="p-4 space-y-1">
                    {pg.roomTypes && pg.roomTypes.length > 0 ? (
                      pg.roomTypes.map((rt, idx) => (
                        <span key={idx} className="block text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md w-max">
                          {rt.type || rt} (₹{rt.rent || 'Custom'})
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">Single, Double</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Facilities Checklist Rows */}
              {facilityList.map((fac) => (
                <tr key={fac}>
                  <td className="p-4 font-bold text-slate-500 bg-slate-50/50">{fac}</td>
                  {pgs.map((pg) => {
                    const hasFac = pg.facilities?.includes(fac);
                    return (
                      <td key={pg._id || pg.id} className="p-4">
                        {hasFac ? (
                          <Check className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <X className="w-5 h-5 text-slate-300" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Action Row */}
              <tr className="bg-slate-50">
                <td className="p-4 font-bold text-slate-500">Book Property</td>
                {pgs.map((pg) => {
                  const pgId = pg._id || pg.id;
                  const isBookable = pg.status === 'APPROVED' && pg.onlineBookingEnabled !== false;
                  return (
                    <td key={pgId} className="p-4">
                      {isBookable ? (
                        <Link to={`/seeker/book/${pgId}`}>
                          <Button variant="primary" size="xs" icon={DoorOpen} fullWidth>
                            Book Room Now
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold block text-center">
                          Enquire for Booking
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </Container>
  );
}

import React from 'react';
import Badge from '../../components/common/Badge';
import { mockPGs } from '../../utils/mockData';

export default function AdminPGs() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          All PG Listings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Master registry of published accommodations across all cities.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="p-3 rounded-l-lg">PG Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Location</th>
              <th className="p-3">Rent</th>
              <th className="p-3">Owner</th>
              <th className="p-3 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {mockPGs.map((pg) => (
              <tr key={pg.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-[#0F172A]">{pg.name}</td>
                <td className="p-3">
                  <Badge variant={pg.pgType === 'Girls' ? 'danger' : 'primary'}>{pg.pgType}</Badge>
                </td>
                <td className="p-3 text-slate-500">{pg.location}</td>
                <td className="p-3 font-bold">₹{pg.rent}/mo</td>
                <td className="p-3">{pg.owner?.name}</td>
                <td className="p-3">
                  <Badge variant="success">Verified</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PGFormWizard from '../../components/pg/PGFormWizard';
import { getPGById } from '../../services/pgService';
import Loader from '../../components/common/Loader';

export default function AddEditPG() {
  const { id } = useParams();
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPGById(id)
        .then((res) => {
          if (res.data?.pg) setPgData(res.data.pg);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <Loader center text="Loading property details..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {id ? 'Edit PG Property' : 'List Your PG Property'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {id ? 'Update room availability, pricing, or property details.' : 'Complete the 7-step wizard to list your PG on PGFinder.'}
        </p>
      </div>

      <PGFormWizard initialData={pgData} isEdit={!!id} />
    </div>
  );
}

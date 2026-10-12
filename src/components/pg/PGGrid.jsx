import React from 'react';
import PGCard from './PGCard';
import Skeleton from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

export default function PGGrid({
  pgs = [],
  loading = false,
  emptyTitle = 'No PGs Found',
  emptyDescription = 'Try adjusting your filters or search keywords.',
  onResetFilters = null,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton variant="card" count={6} />
      </div>
    );
  }

  if (!pgs || pgs.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Clear Filters' : ''}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pgs.map((pg) => (
        <PGCard key={pg.id} pg={pg} />
      ))}
    </div>
  );
}

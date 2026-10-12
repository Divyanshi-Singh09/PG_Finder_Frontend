const RECENTLY_VIEWED_KEY = 'pgfinder_recently_viewed';

export const addRecentlyViewed = (pg) => {
  if (!pg) return;
  const pgId = pg._id || pg.id;
  if (!pgId) return;

  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter((item) => (item._id || item.id) !== pgId);

    const newItem = {
      _id: pgId,
      id: pgId,
      name: pg.name,
      address: pg.address,
      rent: pg.rent,
      ratingSummary: pg.ratingSummary,
      images: pg.images,
      isVerifiedPG: pg.isVerifiedPG,
      genderPreference: pg.genderPreference,
      viewedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...filtered].slice(0, 10);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recently viewed PG:', err);
  }
};

export const getRecentlyViewed = () => {
  try {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (err) {}
};

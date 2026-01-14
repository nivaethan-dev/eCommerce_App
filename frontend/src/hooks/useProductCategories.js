import { useEffect, useMemo, useState } from 'react';
import { get } from '../utils/api';

export const useProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await get('/api/products/categories');
        const cats = Array.isArray(res?.categories) ? res.categories : [];
        if (!cancelled) setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        if (!cancelled) setError(err.message || 'Failed to load categories');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({ categories, loading, error }),
    [categories, loading, error]
  );
};

export default useProductCategories;



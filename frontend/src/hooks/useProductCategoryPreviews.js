import { useEffect, useMemo, useState } from 'react';
import { get } from '../utils/api';
import { useProductCategories } from './useProductCategories';

const DEFAULT_LIMIT_PER_CATEGORY = 6;

export const useProductCategoryPreviews = (options = {}) => {
  const limitPerCategory =
    Number.isFinite(options?.limitPerCategory) && options.limitPerCategory > 0
      ? Math.floor(options.limitPerCategory)
      : DEFAULT_LIMIT_PER_CATEGORY;

  const [productsByCategory, setProductsByCategory] = useState({});
  const { categories, loading: categoriesLoading, error: categoriesError } = useProductCategories();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCategoryPreviews = async () => {
      try {
        // Wait for categories list (from shared hook)
        if (categoriesLoading) return;
        if (categoriesError) throw new Error(categoriesError);
        if (!categories || categories.length === 0) {
          setProductsByCategory({});
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const results = await Promise.all(
          categories.map(async (category) => {
            const qs = new URLSearchParams({
              category,
              limit: String(limitPerCategory),
              page: '1',
            });
            const res = await get(`/api/products?${qs.toString()}`);
            return [category, res?.products || []];
          })
        );

        if (cancelled) return;

        const map = {};
        for (const [category, products] of results) {
          map[category] = Array.isArray(products) ? products : [];
        }
        setProductsByCategory(map);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to fetch product category previews:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategoryPreviews();

    return () => {
      cancelled = true;
    };
  }, [categories, categoriesError, categoriesLoading, limitPerCategory]);

  // Stable return shape
  return useMemo(
    () => ({
      productsByCategory,
      categories,
      loading,
      error,
      limitPerCategory,
    }),
    [productsByCategory, categories, loading, error, limitPerCategory]
  );
};

export default useProductCategoryPreviews;



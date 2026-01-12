import { useCallback, useEffect, useMemo, useState } from 'react';
import { get } from '../utils/api';

export const useCategoryProducts = ({ category, pageSize = 12 } = {}) => {
  const normalizedPageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 12;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(
    async (pageToFetch) => {
      const qs = new URLSearchParams({
        category,
        limit: String(normalizedPageSize),
        page: String(pageToFetch),
      });
      const res = await get(`/api/products?${qs.toString()}`);
      return Array.isArray(res?.products) ? res.products : [];
    },
    [category, normalizedPageSize]
  );

  const resetAndFetch = useCallback(async () => {
    if (!category) {
      setLoading(false);
      setProducts([]);
      setPage(1);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);
    setProducts([]);
    setPage(1);
    setHasMore(true);

    try {
      const items = await fetchPage(1);
      setProducts(items);
      setHasMore(items.length === normalizedPageSize);
    } catch (err) {
      console.error('Failed to fetch category products:', err);
      setError(err.message || 'Failed to load products');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category, fetchPage, normalizedPageSize]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await resetAndFetch();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [resetAndFetch]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;

    const nextPage = page + 1;
    try {
      setLoadingMore(true);
      setError(null);
      const items = await fetchPage(nextPage);
      setProducts((prev) => [...prev, ...items]);
      setPage(nextPage);
      setHasMore(items.length === normalizedPageSize);
    } catch (err) {
      console.error('Failed to load more category products:', err);
      setError(err.message || 'Failed to load more products');
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, hasMore, loading, loadingMore, normalizedPageSize, page]);

  return useMemo(
    () => ({
      products,
      loading,
      error,
      hasMore,
      loadingMore,
      pageSize: normalizedPageSize,
      loadMore,
      refresh: resetAndFetch,
    }),
    [
      products,
      loading,
      error,
      hasMore,
      loadingMore,
      normalizedPageSize,
      loadMore,
      resetAndFetch,
    ]
  );
};

export default useCategoryProducts;



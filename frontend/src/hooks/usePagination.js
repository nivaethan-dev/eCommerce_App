import { useEffect, useMemo, useState } from 'react';

/**
 * Client-side pagination helper.
 * Reusable across admin lists (products, orders, audit logs, etc).
 */
const usePagination = (items = [], pageSize = 5) => {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    const size = Math.max(1, Number(pageSize) || 1);
    return Math.max(1, Math.ceil((items?.length || 0) / size));
  }, [items, pageSize]);

  // Keep page in bounds when items change (e.g. delete) or when pageSize changes
  useEffect(() => {
    setPage((prev) => Math.min(Math.max(1, prev), totalPages));
  }, [totalPages]);

  const currentItems = useMemo(() => {
    const size = Math.max(1, Number(pageSize) || 1);
    const start = (page - 1) * size;
    return (items || []).slice(start, start + size);
  }, [items, page, pageSize]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => Math.min(totalPages, p + 1));

  return {
    page,
    setPage,
    pageSize,
    totalPages,
    currentItems,
    canPrev,
    canNext,
    prev,
    next
  };
};

export default usePagination;



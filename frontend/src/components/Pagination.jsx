import Button from './Button';

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  pageSize,
  totalItems
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const go = (p) => onPageChange?.(p);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Minimal number buttons: first, last, and a small window around current page
  const pages = (() => {
    const windowSize = 2;
    const set = new Set([1, totalPages]);
    for (let p = page - windowSize; p <= page + windowSize; p += 1) {
      if (p >= 1 && p <= totalPages) set.add(p);
    }
    return Array.from(set).sort((a, b) => a - b);
  })();

  const renderPages = () => {
    const out = [];
    for (let i = 0; i < pages.length; i += 1) {
      const p = pages[i];
      const prevP = pages[i - 1];
      if (prevP && p - prevP > 1) {
        out.push(
          <span key={`ellipsis-${p}`} style={{ color: '#666', padding: '0 6px' }}>
            …
          </span>
        );
      }

      const isActive = p === page;
      out.push(
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          style={{
            minWidth: 36,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${isActive ? '#4facfe' : '#e0e0e0'}`,
            background: isActive ? '#4facfe' : 'white',
            color: isActive ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 600
          }}
          aria-current={isActive ? 'page' : undefined}
        >
          {p}
        </button>
      );
    }
    return out;
  };

  return (
    <div
      style={{
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ color: '#666', fontSize: '0.9rem' }}>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        {typeof totalItems === 'number' && typeof pageSize === 'number' ? (
          <span> · {totalItems} items</span>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button variant="secondary" onClick={() => go(page - 1)} disabled={!canPrev}>
          Prev
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {renderPages()}
        </div>

        <Button variant="secondary" onClick={() => go(page + 1)} disabled={!canNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;



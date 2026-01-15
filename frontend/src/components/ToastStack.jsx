 const ToastStack = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  const styles = {
    container: {
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 20000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: 'min(360px, calc(100vw - 32px))'
    },
    toast: (type) => {
      const palette = {
        success: { bg: '#f0fff4', border: '#9ae6b4', fg: '#22543d' },
        error: { bg: '#fff5f5', border: '#feb2b2', fg: '#742a2a' },
        warning: { bg: '#fffff0', border: '#fbd38d', fg: '#744210' },
        info: { bg: '#ebf8ff', border: '#90cdf4', fg: '#2a4365' }
      }[type] || { bg: '#ffffff', border: '#e2e8f0', fg: '#1a202c' };

      return {
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        color: palette.fg,
        borderRadius: '10px',
        padding: '12px 12px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start'
      };
    },
    title: { margin: 0, fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 },
    msg: { margin: '2px 0 0 0', fontSize: '0.9rem', lineHeight: 1.35 },
    close: {
      marginLeft: 'auto',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'inherit',
      fontSize: '1rem',
      lineHeight: 1
    }
  };

  return (
    <div style={styles.container} aria-live="polite" aria-relevant="additions removals">
      {toasts.map((t) => (
        <div key={t.id} style={styles.toast(t.type)}>
          <div>
            {t.title ? <p style={styles.title}>{t.title}</p> : null}
            <p style={styles.msg}>{t.message}</p>
          </div>
          <button type="button" style={styles.close} onClick={() => onDismiss?.(t.id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;



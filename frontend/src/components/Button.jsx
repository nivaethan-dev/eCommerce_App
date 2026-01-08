const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1
  };

  const variants = {
    primary: {
      background: '#4facfe',
      color: 'white',
      boxShadow: '0 2px 4px rgba(79, 172, 254, 0.3)'
    },
    secondary: {
      background: '#f5f5f5',
      color: '#333',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    danger: {
      background: '#f44336',
      color: 'white',
      boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)'
    },
    success: {
      background: '#4caf50',
      color: 'white',
      boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
    },
    outline: {
      background: 'transparent',
      color: '#4facfe',
      border: '2px solid #4facfe',
      boxShadow: 'none'
    }
  };

  const sizes = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem'
    }
  };

  const hoverStyles = !disabled ? {
    transform: 'translateY(-1px)',
    boxShadow: variants[variant].boxShadow?.replace('0.3', '0.4') || '0 4px 8px rgba(0, 0, 0, 0.15)'
  } : {};

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = variants[variant].boxShadow || '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;


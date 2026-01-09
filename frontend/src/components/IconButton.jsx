const IconButton = ({ 
  icon, 
  onClick, 
  variant = 'default',
  size = 'medium',
  disabled = false,
  title,
  ...props 
}) => {
  const variants = {
    default: {
      color: '#666',
      hoverColor: '#333'
    },
    primary: {
      color: '#4facfe',
      hoverColor: '#3d9ae8'
    },
    danger: {
      color: '#f44336',
      hoverColor: '#d32f2f'
    },
    success: {
      color: '#4caf50',
      hoverColor: '#388e3c'
    },
    warning: {
      color: '#ff9800',
      hoverColor: '#f57c00'
    }
  };

  const sizes = {
    small: {
      fontSize: '1rem',
      padding: '0.25rem'
    },
    medium: {
      fontSize: '1.25rem',
      padding: '0.375rem'
    },
    large: {
      fontSize: '1.5rem',
      padding: '0.5rem'
    }
  };

  const baseStyle = {
    background: 'none',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: variants[variant].color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    borderRadius: '4px',
    opacity: disabled ? 0.5 : 1,
    ...sizes[size]
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.color = variants[variant].hoverColor;
          e.target.style.background = 'rgba(0, 0, 0, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.color = variants[variant].color;
          e.target.style.background = 'none';
        }
      }}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;


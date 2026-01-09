import Button from './Button';
import { useState, useEffect } from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setSubmitError('');
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      setSubmitError('');
      await onConfirm?.();
      onClose();
    } catch (e) {
      setSubmitError(e?.message || 'Action failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        animation: 'slideIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: variant === 'danger' ? '#f44336' : '#333', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            {title}
          </h2>
        </div>

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          color: '#666',
          lineHeight: '1.6'
        }}>
          {message}
          {submitError && (
            <div style={{
              marginTop: '0.75rem',
              background: '#fff5f5',
              border: '1px solid #fed7d7',
              color: '#c53030',
              padding: '0.75rem',
              borderRadius: '8px'
            }}>
              {submitError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : confirmText}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;


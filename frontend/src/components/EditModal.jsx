import { useState, useEffect } from 'react';
import Button from './Button';

// Backend base URL (set via VITE_API_URL environment variable)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const EditModal = ({ 
  isOpen, 
  onClose, 
  title,
  data = {},
  fields = [],
  onSubmit,
  onSuccess,
  onError
}) => {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (typeof imagePath !== 'string') return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    if (isOpen && data) {
      setFormData({ ...data });
      setOriginalData({ ...data });
      setErrors({});
      setSubmitError('');
      setIsSubmitting(false);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // Clear error when user types
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      const originalValue = originalData[field.name];
      
      // If field had a value and now it's empty, that's an error
      if (originalValue && !value) {
        newErrors[field.name] = `${field.label} cannot be removed without a replacement`;
      }
      
      // If field is empty (no original value and no new value), that's an error
      if (!value && value !== 0) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError('');
      await onSubmit(formData);
      onSuccess?.();
      setFormData({});
      setOriginalData({});
      setErrors({});
    } catch (err) {
      setSubmitError(err?.message || 'Failed to update. Please try again.');
      onError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setOriginalData({});
    setErrors({});
    onClose();
  };

  const renderField = (field) => {
    const baseInputStyle = {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${errors[field.name] ? '#f44336' : '#e0e0e0'}`,
      borderRadius: '6px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={baseInputStyle}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.nonNegative ? 0 : undefined}
            step={field.step || 'any'}
            style={baseInputStyle}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            style={{ ...baseInputStyle, resize: 'vertical' }}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            style={baseInputStyle}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        const fileInputId = `file-input-${field.name}`;
        return (
          <div>
            {formData[field.name] && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={getImageUrl(formData[field.name])} 
                    alt="Current" 
                    style={{ 
                      maxWidth: '150px', 
                      maxHeight: '150px', 
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0'
                    }} 
                    onError={(e) => {
                      // If the stored path is invalid/unreachable, hide broken image icon
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById(fileInputId).click();
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#4facfe',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
            <input
              id={fileInputId}
              type="file"
              accept={field.accept || 'image/*'}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange(field.name, reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ display: 'none' }}
            />
          </div>
        );

      default:
        return null;
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
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>{title}</h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem' }}>
            {submitError && (
              <div style={{
                background: '#fff5f5',
                border: '1px solid #fed7d7',
                color: '#c53030',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                {submitError}
              </div>
            )}
            {fields.map((field) => (
              <div key={field.name} style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {field.label}
                </label>
                {renderField(field)}
                {errors[field.name] && (
                  <div style={{
                    color: '#f44336',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem'
                  }}>
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <Button variant="secondary" type="button" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait…' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;


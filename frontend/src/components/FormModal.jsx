import { useState } from 'react';
import Button from './Button';

const FormModal = ({ 
  isOpen, 
  onClose, 
  title, 
  fields = [], 
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel'
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // Clear error when user starts typing
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
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'number' && field.nonNegative && formData[field.name] < 0) {
        newErrors[field.name] = `${field.label} must be non-negative`;
      }
      if (field.validate) {
        const error = field.validate(formData[field.name]);
        if (error) newErrors[field.name] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({});
    setErrors({});
  };

  const handleClose = () => {
    setFormData({});
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
      case 'password':
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

      case 'checkbox':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
            <span>{field.checkboxLabel || field.label}</span>
          </label>
        );

      case 'file':
        return (
          <div>
            <input
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
              style={baseInputStyle}
            />
            {formData[field.name] && (
              <div style={{ marginTop: '0.75rem' }}>
                <img 
                  src={formData[field.name]} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0'
                  }} 
                />
              </div>
            )}
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
            {fields.map((field) => (
              <div key={field.name} style={{ marginBottom: '1.25rem' }}>
                {field.type !== 'checkbox' && (
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {field.label}
                    {field.required && <span style={{ color: '#f44336' }}> *</span>}
                  </label>
                )}
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
            <Button variant="secondary" type="button" onClick={handleClose}>
              {cancelLabel}
            </Button>
            <Button variant="primary" type="submit">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;


import { useState, useEffect } from 'react';
import Button from './Button';

const EditModal = ({ 
  isOpen, 
  onClose, 
  title,
  data = {},
  fields = [],
  onSubmit
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen && data) {
      setFormData({ ...data });
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const renderField = (field) => {
    const baseInputStyle = {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #e0e0e0',
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
        return (
          <div>
            {formData[field.name] && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={formData[field.name]} 
                    alt="Current" 
                    style={{ 
                      maxWidth: '150px', 
                      maxHeight: '150px', 
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => handleChange(field.name, '')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
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
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {field.label}
                </label>
                {renderField(field)}
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
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;


import Button from '../Button';

const AuditLogModal = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const formatJSON = (obj) => {
    if (!obj || typeof obj !== 'object') return 'None';
    return JSON.stringify(obj, null, 2);
  };

  const InfoRow = ({ label, value, isCode = false }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.5rem'
      }}>
        {label}
      </div>
      {isCode ? (
        <pre style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#333',
          overflow: 'auto',
          maxHeight: '200px',
          margin: 0,
          border: '1px solid #e0e0e0'
        }}>
          {value}
        </pre>
      ) : (
        <div style={{
          fontSize: '0.875rem',
          color: '#333',
          padding: '0.75rem',
          background: '#f9f9f9',
          borderRadius: '6px',
          border: '1px solid #e0e0e0'
        }}>
          {value || 'N/A'}
        </div>
      )}
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h3 style={{
      fontSize: '1rem',
      fontWeight: '700',
      color: '#333',
      margin: '1.5rem 0 1rem 0',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #4facfe'
    }}>
      {children}
    </h3>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        {/* Modal Content */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 1
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#333'
            }}>
              Audit Log Details
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '2rem',
                color: '#666',
                cursor: 'pointer',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem' }}>
            {/* Basic Information */}
            <SectionTitle>Basic Information</SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <InfoRow label="Timestamp" value={formatTimestamp(log.timestamp)} />
              <InfoRow label="Status" value={
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  background: log.status === 'success' ? '#f1f8f4' : '#ffebee',
                  color: log.status === 'success' ? '#4caf50' : '#f44336',
                  border: `1px solid ${log.status === 'success' ? '#4caf50' : '#f44336'}`
                }}>
                  {log.status}
                </span>
              } />
            </div>

            {/* User Information */}
            <SectionTitle>User Information</SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <InfoRow label="User ID" value={log.userId || 'N/A'} />
              <InfoRow label="User Type" value={log.userType || 'N/A'} />
            </div>

            {/* Action Details */}
            <SectionTitle>Action Details</SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <InfoRow label="Action" value={log.action || 'N/A'} />
              <InfoRow label="Resource" value={log.resource || 'N/A'} />
              <InfoRow label="Resource ID" value={log.resourceId || 'N/A'} />
            </div>

            {/* Request Information */}
            <SectionTitle>Request Information</SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <InfoRow label="HTTP Method" value={log.method || 'N/A'} />
              <InfoRow label="Endpoint" value={log.endpoint || 'N/A'} />
              <InfoRow label="IP Address" value={log.ipAddress || 'N/A'} />
            </div>

            {/* Geolocation */}
            {log.geolocation && (
              <>
                <SectionTitle>Geolocation</SectionTitle>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <InfoRow label="Country" value={log.geolocation.country} />
                  <InfoRow label="Region" value={log.geolocation.region} />
                  <InfoRow label="City" value={log.geolocation.city} />
                  <InfoRow label="Timezone" value={log.geolocation.timezone} />
                </div>
              </>
            )}

            {/* Changes */}
            <SectionTitle>Changes</SectionTitle>
            <InfoRow 
              label="Old and New Values" 
              value={formatJSON(log.changes)} 
              isCode={true}
            />
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'sticky',
            bottom: 0,
            background: 'white'
          }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditLogModal;


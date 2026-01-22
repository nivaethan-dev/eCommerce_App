const AuditLogsTable = ({ logs = [], onRowClick, loading = false }) => {
  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '2rem',
        textAlign: 'center',
        color: '#666'
      }}>
        Loading audit logs...
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      success: {
        background: '#f1f8f4',
        color: '#4caf50',
        border: '1px solid #4caf50'
      },
      failure: {
        background: '#ffebee',
        color: '#f44336',
        border: '1px solid #f44336'
      }
    };

    const style = styles[status] || styles.success;

    return (
      <span style={{
        ...style,
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        display: 'inline-block'
      }}>
        {status || 'unknown'}
      </span>
    );
  };

  const getActionBadge = (action) => {
    const colors = {
      CREATE: '#4caf50',
      UPDATE: '#ff9800',
      DELETE: '#f44336',
      READ: '#2196f3',
      LOGIN: '#9c27b0',
      LOGOUT: '#607d8b'
    };

    const color = colors[action] || '#666';

    return (
      <span style={{
        background: `${color}20`,
        color: color,
        padding: '0.25rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-block'
      }}>
        {action}
      </span>
    );
  };

  return (
    <div style={{
      overflowX: 'auto',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Timestamp
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              User Type
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Action
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Resource
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Status
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              IP Address
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Location
            </th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>
              Method
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="7" style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#666'
              }}>
                No audit logs found
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr
                key={log._id || log.id || index}
                onClick={() => onRowClick && onRowClick(log)}
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={{ padding: '1rem', color: '#333', fontSize: '0.875rem' }}>
                  {formatTimestamp(log.timestamp)}
                </td>
                <td style={{ padding: '1rem', color: '#666' }}>
                  {log.userType || 'N/A'}
                </td>
                <td style={{ padding: '1rem' }}>
                  {getActionBadge(log.action)}
                </td>
                <td style={{ padding: '1rem', color: '#666' }}>
                  {log.resource || 'N/A'}
                </td>
                <td style={{ padding: '1rem' }}>
                  {getStatusBadge(log.status)}
                </td>
                <td style={{ padding: '1rem', color: '#666', fontSize: '0.875rem' }}>
                  {log.ipAddress || 'N/A'}
                </td>
                <td style={{ padding: '1rem', color: '#666', fontSize: '0.875rem' }}>
                  {log.geolocation ? (
                    <span>
                      {log.geolocation.city || '?'}, {log.geolocation.country || '?'}
                    </span>
                  ) : 'N/A'}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {log.method || 'N/A'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsTable;


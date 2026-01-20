const AuditStatsCards = ({ stats = null, loading = false }) => {
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        Loading statistics...
      </div>
    );
  }

  if (!stats) return null;

  const totalLogs = stats.totalLogs || 0;
  const successCount = stats.byStatus?.find(s => s._id === 'success')?.count || 0;
  const failureCount = stats.byStatus?.find(s => s._id === 'failure')?.count || 0;
  const adminCount = stats.byUserType?.find(u => u._id === 'Admin')?.count || 0;
  const customerCount = stats.byUserType?.find(u => u._id === 'Customer')?.count || 0;

  const cards = [
    {
      title: 'Total Logs',
      value: totalLogs.toLocaleString(),
      color: '#4facfe',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Successful',
      value: successCount.toLocaleString(),
      color: '#4caf50',
      bgColor: '#f1f8f4'
    },
    {
      title: 'Failed',
      value: failureCount.toLocaleString(),
      color: '#f44336',
      bgColor: '#ffebee'
    },
    {
      title: 'Admin Actions',
      value: adminCount.toLocaleString(),
      color: '#ff9800',
      bgColor: '#fff3e0'
    },
    {
      title: 'Customer Actions',
      value: customerCount.toLocaleString(),
      color: '#9c27b0',
      bgColor: '#f3e5f5'
    }
  ];

  // Top actions display
  const topActions = (stats.byAction || []).slice(0, 3);

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Stats Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              background: card.bgColor,
              border: `2px solid ${card.color}`,
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#666',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {card.title}
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: card.color
            }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Top Actions */}
      {topActions.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#333'
          }}>
            Top Actions
          </h3>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {topActions.map((action, index) => (
              <div
                key={index}
                style={{
                  flex: '1 1 150px',
                  padding: '0.75rem 1rem',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  borderLeft: '4px solid #4facfe'
                }}
              >
                <div style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.25rem'
                }}>
                  {action._id}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#333'
                }}>
                  {action.count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditStatsCards;


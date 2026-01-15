const PageHeader = ({ title, description, actions }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '1.5rem' 
    }}>
      <div>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{title}</h1>
        {description && (
          <p style={{ margin: 0, color: '#666' }}>{description}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;


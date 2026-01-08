const LayoutGrid = ({ children, columns = 'repeat(auto-fit, minmax(200px, 1fr))', gap = '1.5rem' }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: columns, 
      gap: gap 
    }}>
      {children}
    </div>
  );
};

export default LayoutGrid;


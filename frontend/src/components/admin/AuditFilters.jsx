import { useEffect, useState } from 'react';
import Button from '../Button';
import { get } from '../../utils/api';

const AuditFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [filterOptions, setFilterOptions] = useState({
    actions: [],
    resources: [],
    userTypes: [],
    statuses: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch dynamic filter values
  useEffect(() => {
    const fetchFilterValues = async () => {
      try {
        setLoading(true);
        const values = await get('/api/audit-logs/filter-values');
        setFilterOptions({
          actions: values.actions || [],
          resources: values.resources || [],
          userTypes: values.userTypes || [],
          statuses: values.statuses || []
        });
      } catch (error) {
        console.error('Failed to fetch filter values:', error);
        // Fallback to default values if fetch fails
        setFilterOptions({
          actions: ['CREATE', 'UPDATE', 'DELETE', 'READ', 'LOGIN', 'LOGOUT'],
          resources: ['Product', 'Order', 'Customer', 'Admin', 'Notification'],
          userTypes: ['Admin', 'Customer'],
          statuses: ['success', 'failure']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFilterValues();
  }, []);

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: '600',
          color: '#333'
        }}>
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="small"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {/* Action Type Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            Action Type
          </label>
          <select
            value={filters.action || ''}
            onChange={(e) => handleInputChange('action', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.875rem',
              color: '#333',
              background: 'white',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <option value="">All Actions</option>
            {filterOptions.actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        {/* User Type Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            User Type
          </label>
          <select
            value={filters.userType || ''}
            onChange={(e) => handleInputChange('userType', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.875rem',
              color: '#333',
              background: 'white',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <option value="">All Users</option>
            {filterOptions.userTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Resource Type Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            Resource Type
          </label>
          <select
            value={filters.resource || ''}
            onChange={(e) => handleInputChange('resource', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.875rem',
              color: '#333',
              background: 'white',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <option value="">All Resources</option>
            {filterOptions.resources.map(resource => (
              <option key={resource} value={resource}>{resource}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.875rem',
              color: '#333',
              background: 'white',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            <option value="">All Status</option>
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            From Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.875rem',
              color: '#333',
              background: 'white'
            }}
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            To Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.875rem',
              color: '#333',
              background: 'white'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuditFilters;


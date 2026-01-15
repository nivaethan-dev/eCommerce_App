import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import AuditStatsCards from '../../components/admin/AuditStatsCards';
import AuditFilters from '../../components/admin/AuditFilters';
import AuditLogsTable from '../../components/admin/AuditLogsTable';
import AuditLogModal from '../../components/admin/AuditLogModal';
import Pagination from '../../components/Pagination';
import ToastStack from '../../components/ToastStack';
import useToasts from '../../hooks/useToasts';
import { get } from '../../utils/api';

const AdminAuditLogs = () => {
  // State management
  const [filters, setFilters] = useState({
    action: '',
    userType: '',
    resource: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const LIMIT = 20;

  // Build query parameters from filters
  const buildQueryParams = (currentPage, currentFilters) => {
    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('limit', LIMIT);

    // Add filters to query
    if (currentFilters.action) params.append('action', currentFilters.action);
    if (currentFilters.userType) params.append('userType', currentFilters.userType);
    if (currentFilters.resource) params.append('resource', currentFilters.resource);
    if (currentFilters.status) params.append('status', currentFilters.status);
    if (currentFilters.startDate) params.append('startDate', currentFilters.startDate);
    if (currentFilters.endDate) params.append('endDate', currentFilters.endDate);

    return params.toString();
  };

  // Fetch audit logs
  const fetchLogs = async (currentPage = page, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = buildQueryParams(currentPage, currentFilters);
      const response = await get(`/api/audit-logs?${queryParams}`);

      // Handle different response formats
      if (Array.isArray(response)) {
        // If response is just an array
        setLogs(response);
        setTotalItems(response.length);
        setTotalPages(1);
      } else if (response.logs || response.data) {
        // If response has logs or data property
        const logsData = response.logs || response.data;
        setLogs(logsData);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.total || response.totalItems || logsData.length);
      } else {
        setLogs([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load audit logs');
      push({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to load audit logs'
      });
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      
      // Build date range for stats
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const response = await get(`/api/audit-logs/stats${queryString ? '?' + queryString : ''}`);
      setStats(response);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      // Don't show toast for stats error, just log it
    } finally {
      setStatsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLogs(1, filters);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    fetchLogs(1, newFilters);
    
    // Refresh stats with new date range if dates changed
    if (newFilters.startDate !== filters.startDate || newFilters.endDate !== filters.endDate) {
      fetchStats();
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const emptyFilters = {
      action: '',
      userType: '',
      resource: '',
      status: '',
      startDate: '',
      endDate: ''
    };
    setFilters(emptyFilters);
    setPage(1);
    fetchLogs(1, emptyFilters);
    fetchStats();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchLogs(newPage, filters);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle row click
  const handleRowClick = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  return (
    <div>
      <ToastStack toasts={toasts} onDismiss={dismiss} />

      <PageHeader 
        title="Audit Logs"
        description="View and monitor system activity logs"
      />

      {/* Statistics Dashboard */}
      <AuditStatsCards stats={stats} loading={statsLoading} />

      {/* Filters */}
      <AuditFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Error Display */}
      {error && !loading && (
        <div style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: '#f44336',
          background: '#ffebee',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #f44336'
        }}>
          Error: {error}
        </div>
      )}

      {/* Audit Logs Table */}
      <AuditLogsTable
        logs={logs}
        onRowClick={handleRowClick}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && !error && logs.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={LIMIT}
          totalItems={totalItems}
        />
      )}

      {/* Detail Modal */}
      <AuditLogModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        log={selectedLog}
      />
    </div>
  );
};

export default AdminAuditLogs;

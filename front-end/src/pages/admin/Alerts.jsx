import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Input } from '../../components/forms';
import {
  FaExclamationTriangle, FaExclamationCircle, FaInfoCircle,
  FaTruck, FaTachometerAlt, FaSearch, FaCalendar
} from 'react-icons/fa';
import { getAllAlerts } from '../../services/alertService';
import { handleApiError, showErrorToast } from '../../utils/errorHandlers';

const Alerts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allAlerts, setAllAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [displayedAlerts, setDisplayedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state (frontend only)
  const perPage = 5;
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    // Filter alerts based on search term
    if (searchTerm.trim() === '') {
      setFilteredAlerts(allAlerts);
    } else {
      const filtered = allAlerts.filter(alert =>
        alert.truck.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.truck.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.truck.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAlerts(filtered);
      // Reset to page 1 when searching
      setSearchParams({ page: '1' });
    }
  }, [searchTerm, allAlerts]);

  useEffect(() => {
    // Update displayed alerts when page changes or filter changes
    if (filteredAlerts.length > 0) {
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      setDisplayedAlerts(filteredAlerts.slice(startIndex, endIndex));
    } else {
      setDisplayedAlerts([]);
    }
  }, [currentPage, filteredAlerts]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await getAllAlerts();
      const alerts = response.data?.alerts || [];
      setAllAlerts(alerts);
      setFilteredAlerts(alerts);

      // Set initial displayed alerts
      setDisplayedAlerts(alerts.slice(0, perPage));
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'high':
        return 'bg-orange-50 border-l-4 border-orange-500';
      case 'medium':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'low':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return FaExclamationTriangle;
      case 'medium':
        return FaExclamationCircle;
      case 'low':
        return FaInfoCircle;
      default:
        return FaInfoCircle;
    }
  };

  const getMaintenanceTypeColor = (type) => {
    switch (type) {
      case 'oil':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'tires':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'engine':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'general':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const totalPages = Math.ceil(filteredAlerts.length / perPage);
  const totalAlerts = allAlerts.length;
  const filteredCount = filteredAlerts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">Maintenance Alerts</h1>
            <p className="text-gray-600 mt-1">
              Monitor truck maintenance alerts
              {totalAlerts > 0 && (
                <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {totalAlerts} alert{totalAlerts !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by truck registration, brand, or model..."
              className="input-field pl-10"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredCount} alert{filteredCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading alerts...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaExclamationTriangle className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? 'No alerts found' : 'No alerts'}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No alerts match "${searchTerm}"`
                : 'All trucks are in good condition!'}
            </p>
          </div>
        ) : (
          <>
            {displayedAlerts.map((alert, index) => {
              const SeverityIcon = getSeverityIcon(alert.severity);
              const uniqueKey = `${alert.truck._id}-${alert.maintenanceType}-${index}`;

              return (
                <div
                  key={uniqueKey}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all ${getSeverityColor(alert.severity)}`}
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Severity Icon */}
                        <div className={`p-3 rounded-lg ${getSeverityBadgeColor(alert.severity)}`}>
                          <SeverityIcon className="text-2xl" />
                        </div>

                        {/* Alert Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityBadgeColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getMaintenanceTypeColor(alert.maintenanceType)}`}>
                              {alert.maintenanceType}
                            </span>
                            {alert.overdue && (
                              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-dark mb-1">{alert.message}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Truck Info Card */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary rounded-lg">
                          <FaTruck className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Truck</p>
                          <p className="font-bold text-dark text-lg">
                            {alert.truck.registrationNumber}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Brand & Model</p>
                          <p className="font-semibold text-dark">
                            {alert.truck.brand} {alert.truck.model}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Odometer</p>
                          <p className="font-semibold text-dark flex items-center gap-1">
                            <FaTachometerAlt className="text-primary" />
                            {alert.truck.currentKm.toLocaleString()} km
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Overdue Info */}
                    {(alert.overdueKm || alert.overdueMonths) && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle className="text-red-600 text-xl" />
                          <div>
                            <p className="text-sm text-red-600 font-semibold">Overdue Information</p>
                            <p className="text-red-800 font-bold">
                              {alert.overdueKm && (
                                <span className="flex items-center gap-1">
                                  <FaTachometerAlt />
                                  {alert.overdueKm.toLocaleString()} km overdue
                                </span>
                              )}
                              {alert.overdueMonths && (
                                <span className="flex items-center gap-1">
                                  <FaCalendar />
                                  {alert.overdueMonths} month{alert.overdueMonths !== 1 ? 's' : ''} overdue
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Alerts;

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/common';
import { Button } from '../../components/forms';
import {
  FaExclamationTriangle, FaExclamationCircle, FaInfoCircle,
  FaTruck, FaTachometerAlt, FaCalendar, FaCheckCircle
} from 'react-icons/fa';
import { getMyTruckAlerts } from '../../services/driverAlertService';
import { handleApiError, showErrorToast } from '../../utils/errorHandlers';

const DriverAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAssignedTrip, setHasAssignedTrip] = useState(false);
  const [totalAlerts, setTotalAlerts] = useState(0);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await getMyTruckAlerts();
      const data = response.data;

      setAlerts(data.alerts || []);
      setTotalAlerts(data.totalAlerts || 0);
      setHasAssignedTrip(data.hasAssignedTrip || false);

      // Get truck from first alert
      if (data.alerts && data.alerts.length > 0) {
        setTruck(data.alerts[0].truck);
      }
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark">My Truck Alerts</h1>
        <p className="text-gray-600 mt-1">
          Maintenance alerts for your assigned truck
          {totalAlerts > 0 && (
            <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              {totalAlerts} alert{totalAlerts !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      {/* No Trip Warning */}
      {!hasAssignedTrip && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <FaExclamationTriangle className="text-3xl text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">No Assigned Trip</h3>
              <p className="text-yellow-700">
                You don't have any assigned trips yet. Truck alerts will be shown when you have an active trip assignment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Truck Info Card */}
      {truck && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <FaTruck className="text-primary" />
            Your Assigned Truck
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Registration Number</p>
              <p className="text-lg font-bold text-dark">{truck.registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Brand & Model</p>
              <p className="text-lg font-semibold text-dark">{truck.brand} {truck.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Odometer</p>
              <p className="text-lg font-semibold text-primary">{truck.currentKm?.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${truck.status === 'on_trip' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                {truck.status === 'on_trip' ? 'On Trip' : 'Available'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">All Clear!</h3>
            <p className="text-gray-500">
              {hasAssignedTrip
                ? 'Your truck has no maintenance alerts. Everything is in good condition!'
                : 'No alerts to display. Get assigned to a trip to see truck alerts.'}
            </p>
          </div>
        ) : (
          <>
            {alerts.map((alert, index) => {
              const SeverityIcon = getSeverityIcon(alert.severity);
              const uniqueKey = `${alert.truck._id}-${alert.maintenanceType}-${index}`;

              return (
                <div
                  key={uniqueKey}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all ${getSeverityColor(alert.severity)}`}
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex items-start gap-4 mb-4">
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

                    {/* Truck Info */}
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
                            {alert.truck.currentKm?.toLocaleString()} km
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
          </>
        )}
      </div>

      {/* Critical Alerts Warning */}
      {alerts.some(alert => alert.severity === 'critical') && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <FaExclamationTriangle className="text-3xl text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Critical Alerts Detected!</h3>
              <p className="text-red-700 mb-4">
                Your truck has critical maintenance issues that need immediate attention.
                Please address these issues before starting any new trips.
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-800 font-semibold">
                  ⚠️ You may not be able to start new trips until critical alerts are resolved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={fetchAlerts}
        >
          Refresh Alerts
        </Button>
      </div>
    </div>
  );
};

export default DriverAlerts;

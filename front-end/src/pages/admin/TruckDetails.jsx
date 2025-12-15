import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../components/common';
import { Button, Select } from '../../components/forms';
import {
  FaTruck,
  FaArrowLeft,
  FaCircle,
  FaEdit,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import {
  getTruckById,
  updateTruckStatus,
  getTruckMaintenanceStatus
} from '../../services/truckService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const TruckDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [truck, setTruck] = useState(null);
  const [maintenanceStatus, setMaintenanceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchTruckDetails();
    fetchMaintenanceStatus();
  }, [id]);

  const fetchTruckDetails = async () => {
    try {
      setLoading(true);
      const response = await getTruckById(id);
      setTruck(response.data);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
      navigate('/admin/trucks');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await getTruckMaintenanceStatus(id);
      setMaintenanceStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      await updateTruckStatus(id, newStatus);
      showSuccessToast('Status updated successfully!');
      fetchTruckDetails();
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'on_trip':
        return 'text-blue-600 bg-blue-50';
      case 'maintenance':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'on_trip':
        return 'On Trip';
      case 'maintenance':
        return 'Maintenance';
      default:
        return status;
    }
  };

  const getTireConditionColor = (condition) => {
    switch (condition) {
      case 'good':
        return 'text-green-600';
      case 'worn':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading truck details..." />;
  }

  if (!truck) {
    return null;
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/trucks')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-xl text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-dark">
                {truck.registrationNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                {truck.brand} {truck.model}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            icon={FaEdit}
            onClick={() => navigate(`/admin/trucks/${id}/edit`)}
          >
            Edit Truck
          </Button>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Status</h2>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${getStatusColor(truck.status)}`}>
              <div className="flex items-center gap-2">
                <FaCircle className="text-xs" />
                <span className="font-semibold">{getStatusLabel(truck.status)}</span>
              </div>
            </div>
            <div className="flex-1">
              <Select
                name="status"
                value={truck.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'on_trip', label: 'On Trip' },
                  { value: 'maintenance', label: 'Maintenance' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Truck Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Basic Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Registration Number:</span>
                <span className="font-semibold text-dark">{truck.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brand:</span>
                <span className="font-semibold text-dark">{truck.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="font-semibold text-dark">{truck.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Mileage:</span>
                <span className="font-semibold text-dark">
                  {truck.currentKm?.toLocaleString()} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Capacity:</span>
                <span className="font-semibold text-dark">{truck.fuelCapacity} L</span>
              </div>
            </div>
          </div>

          {/* Maintenance Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Maintenance Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Oil Change:</span>
                <span className="font-semibold text-dark">
                  {truck.lastOilChangeKm?.toLocaleString()} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last General Check:</span>
                <span className="font-semibold text-dark">
                  {truck.lastGeneralCheckDate
                    ? new Date(truck.lastGeneralCheckDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Alerts */}
        {maintenanceStatus && maintenanceStatus.alerts && maintenanceStatus.alerts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-yellow-600" />
              Maintenance Alerts
            </h2>
            <div className="space-y-3">
              {maintenanceStatus.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${alert.priority === 'critical'
                    ? 'bg-red-50 border-red-500'
                    : alert.priority === 'high'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-dark">{alert.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${alert.priority === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : alert.priority === 'high'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tires */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <FaCircle className="text-primary" />
            Tires ({truck.tires?.length || 0})
          </h2>
          {truck.tires && truck.tires.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {truck.tires.map((tire) => (
                <div
                  key={tire._id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-dark capitalize">
                      {tire.position?.replace(/-/g, ' ')}
                    </span>
                    <FaCircle className={`text-xs ${getTireConditionColor(tire.condition)}`} />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className={`font-medium ${getTireConditionColor(tire.condition)}`}>
                        {tire.condition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Install KM:</span>
                      <span className="text-dark">{tire.installKm?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current KM:</span>
                      <span className="text-dark">{tire.currentKm?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage:</span>
                      <span className="text-dark">
                        {((tire.currentKm - tire.installKm) || 0).toLocaleString()} km
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No tires installed</p>
          )}
        </div>
      </div>  );
};

export default TruckDetails;

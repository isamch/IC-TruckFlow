import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../components/common';
import { Button } from '../../components/forms';
import {
  FaArrowLeft, FaRoute, FaUser, FaTruck, FaTrailer,
  FaMapMarkerAlt, FaCalendar, FaGasPump, FaTools,
  FaTachometerAlt, FaMoneyBillWave, FaStickyNote,
  FaClock, FaPlay, FaCheckCircle, FaEdit
} from 'react-icons/fa';
import { getTripById } from '../../services/tripService';
import { handleApiError, showErrorToast } from '../../utils/errorHandlers';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await getTripById(id);
      setTrip(response.data);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
      navigate('/admin/trips');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'to_do':
        return 'bg-gray-100 text-gray-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'finished':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'to_do':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'to_do':
        return FaClock;
      case 'in_progress':
        return FaPlay;
      case 'finished':
        return FaCheckCircle;
      default:
        return FaClock;
    }
  };

  const getMaintenanceTypeColor = (type) => {
    switch (type) {
      case 'oil':
        return 'bg-yellow-100 text-yellow-700';
      case 'tires':
        return 'bg-blue-100 text-blue-700';
      case 'brakes':
        return 'bg-red-100 text-red-700';
      case 'engine':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!trip) {
    return null;
  }

  const StatusIcon = getStatusIcon(trip.status);
  const totalFuelCost = trip.fuelLogs?.reduce((sum, log) => sum + log.totalCost, 0) || 0;
  const totalMaintenanceCost = trip.maintenanceLogs?.reduce((sum, log) => sum + log.cost, 0) || 0;
  const totalLiters = trip.fuelLogs?.reduce((sum, log) => sum + log.liters, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/trips')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
              <FaRoute className="text-primary" />
              Trip Details
            </h1>
            <p className="text-gray-600 mt-1">
              {trip.startLocation} → {trip.endLocation}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={FaEdit}
            onClick={() => navigate(`/admin/trips/edit/${trip._id}`)}
          >
            Edit Trip
          </Button>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(trip.status)}`}>
            <StatusIcon />
            {getStatusLabel(trip.status)}
          </span>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Distance Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaTachometerAlt className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-2xl font-bold text-dark">
                {trip.totalDistance ? `${trip.totalDistance} km` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Fuel Used Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaGasPump className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel Used</p>
              <p className="text-2xl font-bold text-dark">
                {trip.fuelUsed ? `${trip.fuelUsed} L` : totalLiters ? `${totalLiters.toFixed(1)} L` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Fuel Cost Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaMoneyBillWave className="text-2xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel Cost</p>
              <p className="text-2xl font-bold text-dark">
                {totalFuelCost.toFixed(2)} MAD
              </p>
            </div>
          </div>
        </div>

        {/* Maintenance Cost Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaTools className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-dark">
                {totalMaintenanceCost.toFixed(2)} MAD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trip Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <FaRoute className="text-primary" />
              Trip Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Start Location</p>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  <p className="font-medium text-dark">{trip.startLocation}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">End Location</p>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" />
                  <p className="font-medium text-dark">{trip.endLocation}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Planned Date</p>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-primary" />
                  <p className="font-medium text-dark">
                    {new Date(trip.plannedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Odometer</p>
                <div className="flex items-center gap-2">
                  <FaTachometerAlt className="text-gray-600" />
                  <p className="font-medium text-dark">
                    {trip.startKm ? `${trip.startKm.toLocaleString()} km` : 'Not started'}
                    {trip.endKm && ` → ${trip.endKm.toLocaleString()} km`}
                  </p>
                </div>
              </div>
            </div>

            {trip.notes && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start gap-2">
                  <FaStickyNote className="text-yellow-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-gray-700">{trip.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fuel Logs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <FaGasPump className="text-green-600" />
              Fuel Logs ({trip.fuelLogs?.length || 0})
            </h2>
            {trip.fuelLogs && trip.fuelLogs.length > 0 ? (
              <div className="space-y-3">
                {trip.fuelLogs.map((log) => (
                  <div key={log._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-dark">{log.stationName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(log.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{log.totalCost.toFixed(2)} MAD</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Liters:</span>
                        <span className="ml-2 font-medium text-dark">{log.liters} L</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Price/L:</span>
                        <span className="ml-2 font-medium text-dark">{log.pricePerLiter.toFixed(2)} MAD</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-dark">Total</span>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{totalLiters.toFixed(1)} L</p>
                      <p className="text-xl font-bold text-primary">{totalFuelCost.toFixed(2)} MAD</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No fuel logs recorded yet</p>
            )}
          </div>

          {/* Maintenance Logs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <FaTools className="text-purple-600" />
              Maintenance Logs ({trip.maintenanceLogs?.length || 0})
            </h2>
            {trip.maintenanceLogs && trip.maintenanceLogs.length > 0 ? (
              <div className="space-y-3">
                {trip.maintenanceLogs.map((log) => (
                  <div key={log._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getMaintenanceTypeColor(log.type)}`}>
                            {log.type}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(log.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700">{log.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{log.cost.toFixed(2)} MAD</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-dark">Total Maintenance Cost</span>
                    <p className="text-xl font-bold text-purple-600">{totalMaintenanceCost.toFixed(2)} MAD</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No maintenance logs recorded yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Driver, Truck, Trailer */}
        <div className="space-y-6">
          {/* Driver Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Driver
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-dark">{trip.driver?.fullname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-dark">{trip.driver?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-dark">{trip.driver?.phone}</p>
              </div>
              {trip.driver?.licenseNumber && (
                <div>
                  <p className="text-sm text-gray-600">License Number</p>
                  <p className="font-medium text-dark">{trip.driver.licenseNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Truck Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <FaTruck className="text-primary" />
              Truck
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Registration</p>
                <p className="font-medium text-dark">{trip.truck?.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brand & Model</p>
                <p className="font-medium text-dark">{trip.truck?.brand} {trip.truck?.model}</p>
              </div>
              {trip.truck?.currentKm && (
                <div>
                  <p className="text-sm text-gray-600">Current Odometer</p>
                  <p className="font-medium text-dark">{trip.truck.currentKm.toLocaleString()} km</p>
                </div>
              )}
            </div>
          </div>

          {/* Trailer Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <FaTrailer className="text-gray-600" />
              Trailer
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Serial Number</p>
                <p className="font-medium text-dark">{trip.trailer?.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-dark capitalize">{trip.trailer?.type}</p>
              </div>
              {trip.trailer?.maxLoadKg && (
                <div>
                  <p className="text-sm text-gray-600">Max Load</p>
                  <p className="font-medium text-dark">{trip.trailer.maxLoadKg.toLocaleString()} kg</p>
                </div>
              )}
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-md p-6 text-white">
            <h2 className="text-lg font-bold mb-4">Total Trip Cost</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Fuel</span>
                <span className="font-semibold">{totalFuelCost.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance</span>
                <span className="font-semibold">{totalMaintenanceCost.toFixed(2)} MAD</span>
              </div>
            </div>
            <div className="pt-3 border-t border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">{(totalFuelCost + totalMaintenanceCost).toFixed(2)} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;

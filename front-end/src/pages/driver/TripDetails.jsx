import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../components/common';
import { Button } from '../../components/forms';
import {
  FaArrowLeft, FaRoute, FaTruck, FaTrailer, FaCalendar,
  FaTachometerAlt, FaGasPump, FaTools, FaPlay, FaStop,
  FaMoneyBillWave, FaEdit, FaSave, FaTimes
} from 'react-icons/fa';
import { getMyTripById, updateTripNotes } from '../../services/driverTripService';
import { handleApiError, showErrorToast, showSuccessToast } from '../../utils/errorHandlers';

const DriverTripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await getMyTripById(id);
      setTrip(response.data);
      setNotesValue(response.data.notes || '');
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
      navigate('/driver/trips');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNotes = () => {
    setEditingNotes(true);
  };

  const handleCancelEdit = () => {
    setEditingNotes(false);
    setNotesValue(trip.notes || '');
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      await updateTripNotes(id, notesValue);
      showSuccessToast('Notes updated successfully!');
      setEditingNotes(false);
      // Update local trip state
      setTrip({ ...trip, notes: notesValue });
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setSavingNotes(false);
    }
  };

  const getStatusColor = (status) => {
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

  // Calculate totals
  const totalFuelCost = trip?.fuelLogs?.reduce((sum, log) => sum + (log.totalCost || 0), 0) || 0;
  const totalMaintenanceCost = trip?.maintenanceLogs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0;
  const totalCost = totalFuelCost + totalMaintenanceCost;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!trip) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/driver/trips')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
              <FaRoute className="text-primary" />
              {trip.startLocation} → {trip.endLocation}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(trip.status)}`}>
                {getStatusLabel(trip.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {trip.status === 'to_do' && (
            <Button
              variant="primary"
              icon={FaPlay}
              onClick={() => navigate(`/driver/trips/${id}/start`)}
            >
              Start Trip
            </Button>
          )}
          {trip.status === 'in_progress' && (
            <Button
              variant="primary"
              icon={FaStop}
              onClick={() => navigate(`/driver/trips/${id}/finish`)}
            >
              Finish Trip
            </Button>
          )}
        </div>
      </div>

      {/* Trip Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Truck Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <FaTruck className="text-primary" />
            Truck Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Number:</span>
              <span className="font-semibold text-dark">{trip.truck?.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Brand & Model:</span>
              <span className="font-semibold text-dark">{trip.truck?.brand} {trip.truck?.model}</span>
            </div>
            {trip.truck?.currentKm && (
              <div className="flex justify-between">
                <span className="text-gray-600">Current Odometer:</span>
                <span className="font-semibold text-dark">{trip.truck.currentKm.toLocaleString()} km</span>
              </div>
            )}
          </div>
        </div>

        {/* Trailer Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
            <FaTrailer className="text-gray-600" />
            Trailer Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Serial Number:</span>
              <span className="font-semibold text-dark">{trip.trailer?.serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-semibold text-dark capitalize">{trip.trailer?.type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <FaCalendar className="text-primary" />
          Trip Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Planned Date</p>
            <p className="font-semibold text-dark">
              {new Date(trip.plannedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {trip.startKm && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Start Odometer</p>
              <p className="font-semibold text-dark">{trip.startKm.toLocaleString()} km</p>
            </div>
          )}

          {trip.endKm && (
            <div>
              <p className="text-sm text-gray-600 mb-1">End Odometer</p>
              <p className="font-semibold text-dark">{trip.endKm.toLocaleString()} km</p>
            </div>
          )}

          {trip.totalDistance && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Distance</p>
              <p className="font-semibold text-primary text-lg">{trip.totalDistance.toLocaleString()} km</p>
            </div>
          )}

          {trip.fuelUsed && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Fuel Used</p>
              <p className="font-semibold text-dark">{trip.fuelUsed} L</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">Notes</p>
            {!editingNotes && (
              <button
                onClick={handleEditNotes}
                className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors"
              >
                <FaEdit />
                Edit Notes
              </button>
            )}
          </div>

          {editingNotes ? (
            <div className="space-y-3">
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add notes about this trip..."
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  icon={FaTimes}
                  onClick={handleCancelEdit}
                  disabled={savingNotes}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  icon={FaSave}
                  onClick={handleSaveNotes}
                  loading={savingNotes}
                  disabled={savingNotes}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]">
              {trip.notes ? (
                <p className="text-dark whitespace-pre-wrap">{trip.notes}</p>
              ) : (
                <p className="text-gray-400 italic">No notes added yet. Click "Edit Notes" to add notes.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fuel Logs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
              <FaGasPump className="text-green-600" />
              Fuel Logs ({trip.fuelLogs?.length || 0})
            </h2>
            {totalFuelCost > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Fuel Cost</p>
                <p className="text-xl font-bold text-green-600">{totalFuelCost.toFixed(2)} MAD</p>
              </div>
            )}
          </div>
        </div>

        {trip.fuelLogs && trip.fuelLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Liters</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price/L</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trip.fuelLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-dark">{log.stationName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-dark">{log.liters} L</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.pricePerLiter.toFixed(2)} MAD</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">{log.totalCost.toFixed(2)} MAD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FaGasPump className="mx-auto text-4xl text-gray-300 mb-2" />
            <p>No fuel logs recorded for this trip</p>
          </div>
        )}
      </div>

      {/* Maintenance Logs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
              <FaTools className="text-orange-600" />
              Maintenance Logs ({trip.maintenanceLogs?.length || 0})
            </h2>
            {totalMaintenanceCost > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Maintenance Cost</p>
                <p className="text-xl font-bold text-orange-600">{totalMaintenanceCost.toFixed(2)} MAD</p>
              </div>
            )}
          </div>
        </div>

        {trip.maintenanceLogs && trip.maintenanceLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trip.maintenanceLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded capitalize font-semibold">
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark">{log.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-orange-600">{log.cost.toFixed(2)} MAD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FaTools className="mx-auto text-4xl text-gray-300 mb-2" />
            <p>No maintenance logs recorded for this trip</p>
          </div>
        )}
      </div>

      {/* Total Cost Summary */}
      {totalCost > 0 && (
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Trip Cost</p>
              <p className="text-4xl font-bold mt-1">{totalCost.toFixed(2)} MAD</p>
            </div>
            <FaMoneyBillWave className="text-6xl opacity-20" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
            <div>
              <p className="text-xs opacity-75">Fuel Cost</p>
              <p className="text-lg font-semibold">{totalFuelCost.toFixed(2)} MAD</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Maintenance Cost</p>
              <p className="text-lg font-semibold">{totalMaintenanceCost.toFixed(2)} MAD</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverTripDetails;

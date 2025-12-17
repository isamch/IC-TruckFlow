import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button, Input, Select } from '../../components/forms';
import { FaGasPump, FaPlus, FaRoute, FaTruck, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import { getMyFuelLogs, addFuelLog } from '../../services/driverFuelLogService';
import { getMyTrips } from '../../services/driverTripService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const DriverFuelLogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [fuelLogs, setFuelLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchFuelLogs(currentPage);
  }, [currentPage]);

  const fetchFuelLogs = async (page = 1, isInitialLoad = false) => {
    try {
      if (fuelLogs.length === 0 || isInitialLoad) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await getMyFuelLogs(page, pagination.perPage);
      setFuelLogs(response.data?.fuelLogs || []);
      setPagination(response.data?.pagination || { page: 1, perPage: 10, total: 0 });
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      await addFuelLog(formData);
      showSuccessToast('Fuel log added successfully!');
      setIsModalOpen(false);
      fetchFuelLogs(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">My Fuel Logs</h1>
          <p className="text-gray-600 mt-1">Track your fuel consumption</p>
        </div>
        <Button
          variant="primary"
          icon={FaPlus}
          onClick={handleCreate}
        >
          Add Fuel Log
        </Button>
      </div>

      {/* Fuel Logs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading fuel logs...</p>
          </div>
        ) : fuelLogs.length === 0 ? (
          <div className="p-12 text-center">
            <FaGasPump className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No fuel logs found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first fuel log</p>
            <Button variant="primary" icon={FaPlus} onClick={handleCreate}>
              Add Fuel Log
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            {/* Loading overlay for pagination */}
            {paginationLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner size="lg" />
              </div>
            )}

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Station
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Liters
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price/L
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fuelLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaRoute className="text-primary" />
                          <span className="font-medium text-dark">
                            {log.trip?.startLocation} → {log.trip?.endLocation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FaTruck className="text-gray-400" />
                          <span>{log.trip?.truck?.registrationNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaGasPump className="text-green-600" />
                        <span className="font-medium text-dark">{log.stationName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaCalendar className="text-gray-400" />
                        {new Date(log.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-dark">{log.liters} L</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {log.pricePerLiter.toFixed(2)} MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FaMoneyBillWave className="text-green-600" />
                        <span className="text-lg font-bold text-primary">{log.totalCost.toFixed(2)} MAD</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {fuelLogs.length > 0 && pagination.total > pagination.perPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(pagination.total / pagination.perPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add Fuel Log Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Fuel Log"
        size="lg"
      >
        <FuelLogForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

// Fuel Log Form Component
const FuelLogForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    trip: '',
    liters: '',
    pricePerLiter: '',
    stationName: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });
  const [errors, setErrors] = useState({});
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setTripsLoading(true);
      const response = await getMyTrips(1, 100);
      // Only show in_progress trips
      const inProgressTrips = (response.data?.trips || []).filter(
        trip => trip.status === 'in_progress'
      );
      setTrips(inProgressTrips);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setTripsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.trip) newErrors.trip = 'Trip is required';
    if (!formData.liters) newErrors.liters = 'Liters is required';
    if (!formData.pricePerLiter) newErrors.pricePerLiter = 'Price per liter is required';
    if (!formData.stationName) newErrors.stationName = 'Station name is required';
    if (!formData.timestamp) newErrors.timestamp = 'Date & time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calculate total cost
    const submitData = {
      ...formData,
      liters: parseFloat(formData.liters),
      pricePerLiter: parseFloat(formData.pricePerLiter),
      totalCost: parseFloat(formData.liters) * parseFloat(formData.pricePerLiter)
    };

    onSubmit(submitData);
  };

  const tripOptions = trips.map(trip => ({
    value: trip._id,
    label: `${trip.startLocation} → ${trip.endLocation} (${trip.truck?.registrationNumber})`
  }));

  const totalCost = formData.liters && formData.pricePerLiter
    ? (parseFloat(formData.liters) * parseFloat(formData.pricePerLiter)).toFixed(2)
    : '0.00';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {tripsLoading ? (
        <div className="text-center py-8">
          <LoadingSpinner />
          <p className="text-gray-500 mt-2">Loading trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-8">
          <FaRoute className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-600 mb-2">No active trips found</p>
          <p className="text-sm text-gray-500">You need to have an active trip (in progress) to add fuel logs</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trip */}
            <div className="md:col-span-2">
              <Select
                label="Trip"
                name="trip"
                value={formData.trip}
                onChange={handleChange}
                options={tripOptions}
                placeholder="Select an active trip"
                required
                error={errors.trip}
              />
            </div>

            {/* Station Name */}
            <Input
              label="Station Name"
              name="stationName"
              value={formData.stationName}
              onChange={handleChange}
              placeholder="Shell Station Casablanca"
              required
              error={errors.stationName}
            />

            {/* Timestamp */}
            <Input
              label="Date & Time"
              name="timestamp"
              type="datetime-local"
              value={formData.timestamp}
              onChange={handleChange}
              required
              error={errors.timestamp}
            />

            {/* Liters */}
            <Input
              label="Liters"
              name="liters"
              type="number"
              step="0.1"
              value={formData.liters}
              onChange={handleChange}
              placeholder="100"
              required
              error={errors.liters}
            />

            {/* Price Per Liter */}
            <Input
              label="Price per Liter (MAD)"
              name="pricePerLiter"
              type="number"
              step="0.01"
              value={formData.pricePerLiter}
              onChange={handleChange}
              placeholder="12.50"
              required
              error={errors.pricePerLiter}
            />
          </div>

          {/* Total Cost Display */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Cost:</span>
              <span className="text-2xl font-bold text-primary">{totalCost} MAD</span>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Fuel logs can only be added to trips that are currently in progress.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              Add Fuel Log
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default DriverFuelLogs;

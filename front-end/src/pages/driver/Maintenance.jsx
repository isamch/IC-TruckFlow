import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button, Input, Select } from '../../components/forms';
import { FaTools, FaPlus, FaEdit, FaTrash, FaTruck, FaRoute, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import {
  getMyMaintenanceLogs,
  addMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog
} from '../../services/driverMaintenanceService';
import { getMyTrips } from '../../services/driverTripService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const DriverMaintenance = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchMaintenanceLogs(currentPage);
  }, [currentPage]);

  const fetchMaintenanceLogs = async (page = 1, isInitialLoad = false) => {
    try {
      if (maintenanceLogs.length === 0 || isInitialLoad) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await getMyMaintenanceLogs(page, pagination.perPage);
      setMaintenanceLogs(response.data?.maintenanceLogs || []);
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
    setSelectedLog(null);
    setIsModalOpen(true);
  };

  const handleEdit = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleDelete = (log) => {
    setSelectedLog(log);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (selectedLog) {
        await updateMaintenanceLog(selectedLog._id, formData);
        showSuccessToast('Maintenance log updated successfully!');
      } else {
        await addMaintenanceLog(formData);
        showSuccessToast('Maintenance log added successfully!');
      }
      setIsModalOpen(false);
      fetchMaintenanceLogs(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteMaintenanceLog(selectedLog._id);
      showSuccessToast('Maintenance log deleted successfully!');
      setIsDeleteDialogOpen(false);
      fetchMaintenanceLogs(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'oil':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'tires':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'engine':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'general':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">My Maintenance Logs</h1>
          <p className="text-gray-600 mt-1">Track your truck maintenance records</p>
        </div>
        <Button
          variant="primary"
          icon={FaPlus}
          onClick={handleCreate}
        >
          Add Maintenance Log
        </Button>
      </div>

      {/* Maintenance Logs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading maintenance logs...</p>
          </div>
        ) : maintenanceLogs.length === 0 ? (
          <div className="p-12 text-center">
            <FaTools className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No maintenance logs found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first maintenance log</p>
            <Button variant="primary" icon={FaPlus} onClick={handleCreate}>
              Add Maintenance Log
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
                    Truck & Trip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {maintenanceLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaTruck className="text-primary" />
                          <span className="font-medium text-dark">
                            {log.truck?.registrationNumber}
                          </span>
                        </div>
                        {log.trip && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <FaRoute className="text-gray-400" />
                            <span>{log.trip.startLocation} → {log.trip.endLocation}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-dark line-clamp-2">{log.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaCalendar className="text-gray-400" />
                        {new Date(log.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FaMoneyBillWave className="text-orange-600" />
                        <span className="text-lg font-bold text-orange-600">{log.cost.toFixed(2)} MAD</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(log)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(log)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {maintenanceLogs.length > 0 && pagination.total > pagination.perPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(pagination.total / pagination.perPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedLog ? 'Edit Maintenance Log' : 'Add Maintenance Log'}
        size="lg"
      >
        <MaintenanceForm
          initialData={selectedLog}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Maintenance Log"
        message={`Are you sure you want to delete this maintenance log? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

// Maintenance Form Component
const MaintenanceForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    truck: initialData?.truck?._id || '',
    trip: initialData?.trip?._id || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    cost: initialData?.cost || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
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
      // Show all trips (driver can add maintenance to any trip)
      setTrips(response.data?.trips || []);
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
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.cost) newErrors.cost = 'Cost is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      ...formData,
      cost: parseFloat(formData.cost)
    };

    // Remove trip if empty
    if (!submitData.trip) {
      delete submitData.trip;
    }

    // Remove truck (backend will use current driver's truck)
    delete submitData.truck;

    onSubmit(submitData);
  };

  const typeOptions = [
    { value: 'oil', label: 'Oil' },
    { value: 'tires', label: 'Tires' },
    { value: 'engine', label: 'Engine' },
    { value: 'general', label: 'General' }
  ];

  const tripOptions = [
    { value: '', label: 'No trip (optional)' },
    ...trips.map(trip => ({
      value: trip._id,
      label: `${trip.startLocation} → ${trip.endLocation} (${trip.truck?.registrationNumber})`
    }))
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {tripsLoading ? (
        <div className="text-center py-8">
          <LoadingSpinner />
          <p className="text-gray-500 mt-2">Loading trips...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <Select
              label="Maintenance Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={typeOptions}
              placeholder="Select type"
              required
              error={errors.type}
            />

            {/* Trip */}
            <Select
              label="Trip (Optional)"
              name="trip"
              value={formData.trip}
              onChange={handleChange}
              options={tripOptions}
              error={errors.trip}
            />

            {/* Cost */}
            <Input
              label="Cost (MAD)"
              name="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              placeholder="450.00"
              required
              error={errors.cost}
            />

            {/* Date */}
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              error={errors.date}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Describe the maintenance work performed..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The maintenance log will be associated with your current truck. You can optionally link it to a specific trip.
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
              {initialData ? 'Update' : 'Add'} Maintenance Log
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default DriverMaintenance;

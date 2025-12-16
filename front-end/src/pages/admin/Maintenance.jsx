import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button, Input, Select } from '../../components/forms';
import { FaTools, FaPlus, FaEdit, FaTrash, FaTruck, FaRoute, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import { getAllMaintenanceLogs, createMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog } from '../../services/maintenanceService';
import { getAllTrucks } from '../../services/truckService';
import { getAllTrips } from '../../services/tripService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const Maintenance = () => {
  const navigate = useNavigate();
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
  const [selectedLog, setSelectedLog] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

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

      const response = await getAllMaintenanceLogs(page, pagination.perPage);
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

  const handleSubmit = async (formData, setFormErrors) => {
    try {
      setFormLoading(true);
      if (selectedLog) {
        await updateMaintenanceLog(selectedLog._id, formData);
        showSuccessToast('Maintenance log updated successfully!');
      } else {
        await createMaintenanceLog(formData);
        showSuccessToast('Maintenance log created successfully!');
      }
      setIsModalOpen(false);
      fetchMaintenanceLogs(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);

      // Handle validation errors from backend
      if (error.response?.data?.details && setFormErrors) {
        const backendErrors = {};
        error.response.data.details.forEach(detail => {
          const fieldName = detail.field.replace('body.', '');
          backendErrors[fieldName] = detail.message;
        });
        setFormErrors(backendErrors);
      }

      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (log) => {
    setLogToDelete(log);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!logToDelete) return;

    try {
      await deleteMaintenanceLog(logToDelete._id);
      showSuccessToast('Maintenance log deleted successfully!');
      setIsConfirmOpen(false);
      setLogToDelete(null);
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
        return 'bg-yellow-100 text-yellow-700';
      case 'tires':
        return 'bg-blue-100 text-blue-700';
      case 'brakes':
        return 'bg-red-100 text-red-700';
      case 'engine':
        return 'bg-purple-100 text-purple-700';
      case 'general':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Maintenance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all maintenance activities</p>
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
            <p className="text-gray-500 mb-6">Get started by adding your first maintenance log</p>
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
                    Truck
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {maintenanceLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-primary" />
                        <div>
                          <div className="font-medium text-dark">{log.truck?.registrationNumber}</div>
                          <div className="text-xs text-gray-500">{log.truck?.brand} {log.truck?.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-xs truncate">{log.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.trip ? (
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-700">
                            <FaRoute className="text-primary text-xs" />
                            <span>{log.trip.startLocation} → {log.trip.endLocation}</span>
                          </div>
                          <div className="text-xs text-gray-500">{log.trip.driver?.fullname}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No trip</span>
                      )}
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
                        <FaMoneyBillWave className="text-green-600" />
                        <span className="font-bold text-purple-600">{log.cost.toFixed(2)} MAD</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(log)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(log)}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedLog ? 'Edit Maintenance Log' : 'Add New Maintenance Log'}
        size="lg"
      >
        <MaintenanceForm
          log={selectedLog}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setLogToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Maintenance Log"
        message={`Are you sure you want to delete this maintenance log for "${logToDelete?.truck?.registrationNumber}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

// Maintenance Form Component
const MaintenanceForm = ({ log, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    truck: log?.truck?._id || '',
    trip: log?.trip?._id || '',
    type: log?.type || 'oil',
    description: log?.description || '',
    cost: log?.cost || '',
    date: log?.date
      ? new Date(log.date).toISOString().split('T')[0]
      : ''
  });
  const [errors, setErrors] = useState({});
  const [trucks, setTrucks] = useState([]);
  const [trips, setTrips] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setOptionsLoading(true);
      const [trucksRes, tripsRes] = await Promise.all([
        getAllTrucks(1, 100),
        getAllTrips(1, 100)
      ]);
      setTrucks(trucksRes.data?.trucks || []);
      setTrips(tripsRes.data?.trips || []);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setOptionsLoading(false);
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
    if (!formData.truck) newErrors.truck = 'Truck is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.cost) newErrors.cost = 'Cost is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Don't send trip if empty
    const submitData = { ...formData };
    if (!submitData.trip) {
      delete submitData.trip;
    }

    onSubmit(submitData, setErrors);
  };

  const truckOptions = trucks.map(truck => ({
    value: truck._id,
    label: `${truck.registrationNumber} - ${truck.brand} ${truck.model}`
  }));

  const tripOptions = trips.map(trip => ({
    value: trip._id,
    label: `${trip.startLocation} → ${trip.endLocation} (${trip.truck?.registrationNumber})`
  }));

  const typeOptions = [
    { value: 'oil', label: 'Oil Change' },
    { value: 'tires', label: 'Tires' },
    { value: 'engine', label: 'Engine' },
    { value: 'general', label: 'General Maintenance' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {optionsLoading ? (
        <div className="text-center py-8">
          <LoadingSpinner />
          <p className="text-gray-500 mt-2">Loading options...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Truck */}
            <Select
              label="Truck"
              name="truck"
              value={formData.truck}
              onChange={handleChange}
              options={truckOptions}
              placeholder="Select a truck"
              required
              error={errors.truck}
            />

            {/* Type */}
            <Select
              label="Maintenance Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={typeOptions}
              required
              error={errors.type}
            />

            {/* Trip (Optional) */}
            <Select
              label="Trip (Optional)"
              name="trip"
              value={formData.trip}
              onChange={handleChange}
              options={tripOptions}
              placeholder="Select a trip (optional)"
              error={errors.trip}
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

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Oil change and filter replacement"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
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
              {log ? 'Update Maintenance Log' : 'Create Maintenance Log'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default Maintenance;

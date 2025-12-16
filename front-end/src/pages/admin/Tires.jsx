import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button } from '../../components/forms';
import { FaCircle, FaPlus, FaEdit, FaTrash, FaTruck } from 'react-icons/fa';
import { getAllTires, createTire, updateTire, deleteTire } from '../../services/tireService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const Tires = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tires, setTires] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTire, setSelectedTire] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tireToDelete, setTireToDelete] = useState(null);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchTires(currentPage);
  }, [currentPage]);

  const fetchTires = async (page = 1, isInitialLoad = false) => {
    try {
      // Only show full loading on initial load
      if (tires.length === 0 || isInitialLoad) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await getAllTires(page, pagination.perPage);
      setTires(response.data?.tires || []);
      setPagination(response.data?.pagination || { page: 1, perPage: 5, total: 0 });
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
    setSelectedTire(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tire) => {
    setSelectedTire(tire);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (selectedTire) {
        await updateTire(selectedTire._id, formData);
        showSuccessToast('Tire updated successfully!');
      } else {
        await createTire(formData);
        showSuccessToast('Tire created successfully!');
      }
      setIsModalOpen(false);
      fetchTires(currentPage);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (tire) => {
    setTireToDelete(tire);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!tireToDelete) return;

    try {
      await deleteTire(tireToDelete._id);
      showSuccessToast('Tire deleted successfully!');
      setIsConfirmOpen(false);
      setTireToDelete(null);
      fetchTires(currentPage);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'on_truck':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'on_truck':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getConditionColor = (condition) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Tires Management</h1>
          <p className="text-gray-600 mt-1">Manage your tire inventory</p>
        </div>
        <Button
          variant="primary"
          icon={FaPlus}
          onClick={handleCreate}
        >
          Add New Tire
        </Button>
      </div>

      {/* Tires Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading tires...</p>
          </div>
        ) : tires.length === 0 ? (
          <div className="p-12 text-center">
            <FaCircle className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tires found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first tire</p>
            <Button variant="primary" icon={FaPlus} onClick={handleCreate}>
              Add New Tire
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
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Install KM
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Current KM
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Truck
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tires.map((tire) => (
                  <tr key={tire._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaCircle className={getStatusColor(tire.status)} />
                        <span className="font-medium text-dark capitalize">
                          {tire.position?.replace(/-/g, ' ') || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(tire.status)}`}>
                        {tire.status === 'on_truck' ? 'On Truck' : 'Available'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium capitalize ${getConditionColor(tire.condition)}`}>
                        {tire.condition || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {tire.installKm?.toLocaleString() || 'N/A'} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {tire.currentKm?.toLocaleString() || 'N/A'} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {((tire.currentKm - tire.installKm) || 0).toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tire.truck ? (
                        <div className="flex items-center gap-2">
                          <FaTruck className="text-primary" />
                          <span className="text-sm text-gray-700">
                            {tire.truck.registrationNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(tire)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tire)}
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
        {tires.length > 0 && pagination.total > pagination.perPage && (
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
        title={selectedTire ? 'Edit Tire' : 'Add New Tire'}
        size="lg"
      >
        <TireFormContent
          tire={selectedTire}
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
          setTireToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Tire"
        message={`Are you sure you want to delete this tire at "${tireToDelete?.position?.replace(/-/g, ' ')}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

// Tire Form Component
const TireFormContent = ({ tire, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    position: tire?.position || '',
    status: tire?.status || 'available',
    condition: tire?.condition || 'good',
    installKm: tire?.installKm || '',
    currentKm: tire?.currentKm || ''
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.installKm) newErrors.installKm = 'Install KM is required';
    if (!formData.currentKm) newErrors.currentKm = 'Current KM is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Position */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Position <span className="text-red-500">*</span>
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Position</option>
            <option value="front-left">Front Left</option>
            <option value="front-right">Front Right</option>
            <option value="rear-left-outer">Rear Left Outer</option>
            <option value="rear-left-inner">Rear Left Inner</option>
            <option value="rear-right-outer">Rear Right Outer</option>
            <option value="rear-right-inner">Rear Right Inner</option>
          </select>
          {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="available">Available</option>
            <option value="on_truck">On Truck</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Condition <span className="text-red-500">*</span>
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="good">Good</option>
            <option value="worn">Worn</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Install KM */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Install KM <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="installKm"
            value={formData.installKm}
            onChange={handleChange}
            className="input-field"
            placeholder="50000"
            required
          />
          {errors.installKm && <p className="mt-1 text-sm text-red-600">{errors.installKm}</p>}
        </div>

        {/* Current KM */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current KM <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="currentKm"
            value={formData.currentKm}
            onChange={handleChange}
            className="input-field"
            placeholder="50000"
            required
          />
          {errors.currentKm && <p className="mt-1 text-sm text-red-600">{errors.currentKm}</p>}
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
          {tire ? 'Update Tire' : 'Create Tire'}
        </Button>
      </div>
    </form>
  );
};

export default Tires;

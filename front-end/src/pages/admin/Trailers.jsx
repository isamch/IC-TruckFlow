import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button, Input, Select } from '../../components/forms';
import { FaTrailer, FaPlus, FaEdit, FaTrash, FaCircle, FaTruck } from 'react-icons/fa';
import { getAllTrailers, createTrailer, updateTrailer, deleteTrailer } from '../../services/trailerService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const Trailers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trailers, setTrailers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [trailerToDelete, setTrailerToDelete] = useState(null);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchTrailers(currentPage);
  }, [currentPage]);

  const fetchTrailers = async (page = 1, isInitialLoad = false) => {
    try {
      // Only show full loading on initial load
      if (trailers.length === 0 || isInitialLoad) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await getAllTrailers(page, pagination.perPage);
      setTrailers(response.data?.trailers || []);
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
    setSelectedTrailer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (trailer) => {
    setSelectedTrailer(trailer);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (selectedTrailer) {
        await updateTrailer(selectedTrailer._id, formData);
        showSuccessToast('Trailer updated successfully!');
      } else {
        await createTrailer(formData);
        showSuccessToast('Trailer created successfully!');
      }
      setIsModalOpen(false);
      fetchTrailers(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (trailer) => {
    setTrailerToDelete(trailer);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!trailerToDelete) return;

    try {
      await deleteTrailer(trailerToDelete._id);
      showSuccessToast('Trailer deleted successfully!');
      setIsConfirmOpen(false);
      setTrailerToDelete(null);
      fetchTrailers(currentPage, true);
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
      case 'on_trip':
        return 'text-blue-600';
      case 'maintenance':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'on_trip':
        return 'bg-blue-100 text-blue-700';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Trailers Management</h1>
          <p className="text-gray-600 mt-1">Manage your trailer fleet</p>
        </div>
        <Button
          variant="primary"
          icon={FaPlus}
          onClick={handleCreate}
        >
          Add New Trailer
        </Button>
      </div>

      {/* Trailers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading trailers...</p>
          </div>
        ) : trailers.length === 0 ? (
          <div className="p-12 text-center">
            <FaTrailer className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trailers found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first trailer</p>
            <Button variant="primary" icon={FaPlus} onClick={handleCreate}>
              Add New Trailer
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
                    Serial Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Max Load
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Check
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trailers.map((trailer) => (
                  <tr key={trailer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaTrailer className={getStatusColor(trailer.status)} />
                        <span className="font-medium text-dark">
                          {trailer.serialNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700 capitalize">
                        {trailer.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {trailer.maxLoadKg ? `${trailer.maxLoadKg.toLocaleString()} kg` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(trailer.status)}`}>
                        {getStatusLabel(trailer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {trailer.lastCheckDate
                        ? new Date(trailer.lastCheckDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(trailer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(trailer)}
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
        {trailers.length > 0 && pagination.total > pagination.perPage && (
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
        title={selectedTrailer ? 'Edit Trailer' : 'Add New Trailer'}
        size="lg"
      >
        <TrailerForm
          trailer={selectedTrailer}
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
          setTrailerToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Trailer"
        message={`Are you sure you want to delete trailer "${trailerToDelete?.serialNumber}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

// Trailer Form Component
const TrailerForm = ({ trailer, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    serialNumber: trailer?.serialNumber || '',
    type: trailer?.type || '',
    maxLoadKg: trailer?.maxLoadKg || '',
    status: trailer?.status || 'available',
    lastCheckDate: trailer?.lastCheckDate
      ? new Date(trailer.lastCheckDate).toISOString().split('T')[0]
      : ''
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
    if (!formData.serialNumber) newErrors.serialNumber = 'Serial number is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.maxLoadKg) newErrors.maxLoadKg = 'Max load is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const typeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'flatbed', label: 'Flatbed' },
    { value: 'refrigerated', label: 'Refrigerated' },
    { value: 'dry-van', label: 'Dry Van' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'container', label: 'Container' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'on_trip', label: 'On Trip' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Serial Number */}
        <Input
          label="Serial Number"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          placeholder="TRL-1234-MA"
          required
          error={errors.serialNumber}
        />

        {/* Type */}
        <Select
          label="Trailer Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions}
          required
          error={errors.type}
        />

        {/* Max Load */}
        <Input
          label="Max Load (kg)"
          name="maxLoadKg"
          type="number"
          value={formData.maxLoadKg}
          onChange={handleChange}
          placeholder="25000"
          required
          error={errors.maxLoadKg}
        />

        {/* Status */}
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
        />

        {/* Last Check Date */}
        <Input
          label="Last Check Date"
          name="lastCheckDate"
          type="date"
          value={formData.lastCheckDate}
          onChange={handleChange}
        />
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
          {trailer ? 'Update Trailer' : 'Create Trailer'}
        </Button>
      </div>
    </form>
  );
};

export default Trailers;

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import TruckForm from '../../components/trucks/TruckForm';
import { Button } from '../../components/forms';
import { FaTruck, FaPlus, FaEdit, FaTrash, FaCircle, FaEye } from 'react-icons/fa';
import { getAllTrucks, createTruck, updateTruck, deleteTruck } from '../../services/truckService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const Trucks = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trucks, setTrucks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Fetch trucks when page changes
  useEffect(() => {
    fetchTrucks(currentPage);
  }, [currentPage]);

  // Fetch all trucks
  const fetchTrucks = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllTrucks(page, pagination.perPage);
      // Backend returns: { data: { trucks: [...], pagination: {...} } }
      setTrucks(response.data?.trucks || []);
      setPagination(response.data?.pagination || { page: 1, perPage: 5, total: 0 });
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Open modal for creating new truck
  const handleCreate = () => {
    setSelectedTruck(null);
    setIsModalOpen(true);
  };

  // Open modal for editing truck
  const handleEdit = (truck) => {
    setSelectedTruck(truck);
    setIsModalOpen(true);
  };

  // Handle form submit (create or update)
  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);

      if (selectedTruck) {
        // Update existing truck
        await updateTruck(selectedTruck._id, formData);
        showSuccessToast('Truck updated successfully!');
      } else {
        // Create new truck
        await createTruck(formData);
        showSuccessToast('Truck created successfully!');
      }

      setIsModalOpen(false);
      fetchTrucks(currentPage); // Refresh current page
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete truck
  const handleDelete = async (truck) => {
    if (!window.confirm(`Are you sure you want to delete truck ${truck.registrationNumber}?`)) {
      return;
    }

    try {
      await deleteTruck(truck._id);
      showSuccessToast('Truck deleted successfully!');
      fetchTrucks(currentPage); // Refresh current page
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'on_trip':
        return 'text-blue-600';
      case 'maintenance':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get status label
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
          <h1 className="text-3xl font-bold text-dark">Trucks Management</h1>
          <p className="text-gray-600 mt-1">Manage your fleet of trucks</p>
        </div>
        <Button
          variant="primary"
          icon={FaPlus}
          onClick={handleCreate}
        >
          Add New Truck
        </Button>
      </div>

      {/* Trucks Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading trucks...</p>
          </div>
        ) : trucks.length === 0 ? (
          <div className="p-12 text-center">
            <FaTruck className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No trucks found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first truck
            </p>
            <Button variant="primary" icon={FaPlus} onClick={handleCreate}>
              Add New Truck
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">
                    Registration Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">
                    Brand & Model
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">
                    Current Mileage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">
                    Fuel Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trucks.map((truck) => (
                  <tr key={truck._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-light rounded-lg">
                          <FaTruck className="text-primary text-lg" />
                        </div>
                        <span className="font-semibold text-dark">
                          {truck.registrationNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {truck.brand} {truck.model}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {truck.currentKm?.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {truck.fuelCapacity} L
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCircle className={`text-xs ${getStatusColor(truck.status)}`} />
                        <span className={`font-medium ${getStatusColor(truck.status)}`}>
                          {getStatusLabel(truck.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/trucks/${truck._id}`)}
                          className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleEdit(truck)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(truck)}
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
        {trucks.length > 0 && pagination.total > pagination.perPage && (
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
        title={selectedTruck ? 'Edit Truck' : 'Add New Truck'}
        size="lg"
      >
        <TruckForm
          truck={selectedTruck}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Trucks;

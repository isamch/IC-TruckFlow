import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button } from '../../components/forms';
import {
  FaRoute, FaPlus, FaEdit, FaTrash, FaEye,
  FaTruck, FaTrailer, FaUser, FaMapMarkerAlt,
  FaCalendar, FaCheckCircle, FaClock, FaPlay
} from 'react-icons/fa';
import { getAllTrips, deleteTrip } from '../../services/tripService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const Trips = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trips, setTrips] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchTrips(currentPage);
  }, [currentPage]);

  const fetchTrips = async (page = 1, isInitialLoad = false) => {
    try {
      if (trips.length === 0 || isInitialLoad) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await getAllTrips(page, pagination.perPage);
      setTrips(response.data?.trips || []);
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
    navigate('/admin/trips/create');
  };

  const handleView = (tripId) => {
    navigate(`/admin/trips/${tripId}`);
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      await deleteTrip(tripToDelete._id);
      showSuccessToast('Trip deleted successfully!');
      setIsConfirmOpen(false);
      setTripToDelete(null);
      fetchTrips(currentPage, true);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'to_do':
        return 'text-gray-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'finished':
        return 'text-green-600';
      default:
        return 'text-gray-600';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Trips Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all trips</p>
        </div>
        <Button
          variant="primary"
          icon={FaPlus}
          onClick={handleCreate}
        >
          Create New Trip
        </Button>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500 mt-4">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="p-12 text-center">
            <FaRoute className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first trip</p>
            <Button variant="primary" icon={FaPlus} onClick={handleCreate}>
              Create New Trip
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
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Truck / Trailer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Planned Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trips.map((trip) => {
                  const StatusIcon = getStatusIcon(trip.status);
                  return (
                    <tr key={trip._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <FaMapMarkerAlt className="text-primary mt-1" />
                          <div>
                            <div className="font-medium text-dark">{trip.startLocation}</div>
                            <div className="text-sm text-gray-500">→ {trip.endLocation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-dark">{trip.driver?.fullname}</div>
                            <div className="text-xs text-gray-500">{trip.driver?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <FaTruck className="text-primary" />
                            <span className="text-gray-700">{trip.truck?.registrationNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FaTrailer className="text-gray-400" />
                            <span className="text-gray-600">{trip.trailer?.serialNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FaCalendar className="text-gray-400" />
                          {new Date(trip.plannedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(trip.status)}`}>
                          <StatusIcon />
                          {getStatusLabel(trip.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {trip.totalDistance ? `${trip.totalDistance} km` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(trip._id)}
                            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(trip)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {trips.length > 0 && pagination.total > pagination.perPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(pagination.total / pagination.perPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setTripToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Trip"
        message={`Are you sure you want to delete trip from "${tripToDelete?.startLocation}" to "${tripToDelete?.endLocation}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Trips;

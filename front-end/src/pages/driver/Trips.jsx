import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common';
import { Button } from '../../components/forms';
import {
  FaRoute, FaTruck, FaTrailer, FaCalendar, FaPlay,
  FaCheckCircle, FaClock, FaEye, FaStop
} from 'react-icons/fa';
import { getMyTrips } from '../../services/driverTripService';
import { handleApiError, showErrorToast } from '../../utils/errorHandlers';

const DriverTrips = () => {
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

      const response = await getMyTrips(page, pagination.perPage);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">My Trips</h1>
          <p className="text-gray-600 mt-1">View and manage your assigned trips</p>
        </div>
      </div>

      {/* Trips List */}
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
            <p className="text-gray-500">You don't have any assigned trips yet</p>
          </div>
        ) : (
          <div className="relative">
            {/* Loading overlay for pagination */}
            {paginationLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner size="lg" />
              </div>
            )}

            <div className="divide-y divide-gray-200">
              {trips.map((trip) => {
                const StatusIcon = getStatusIcon(trip.status);

                return (
                  <div
                    key={trip._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      {/* Trip Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                            <FaRoute className="text-2xl text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-dark">
                              {trip.startLocation} → {trip.endLocation}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                                <StatusIcon />
                                {getStatusLabel(trip.status)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-16">
                          {/* Planned Date */}
                          <div className="flex items-center gap-2 text-sm">
                            <FaCalendar className="text-gray-400" />
                            <div>
                              <p className="text-gray-600">Planned Date</p>
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
                          </div>

                          {/* Truck */}
                          <div className="flex items-center gap-2 text-sm">
                            <FaTruck className="text-gray-400" />
                            <div>
                              <p className="text-gray-600">Truck</p>
                              <p className="font-semibold text-dark">
                                {trip.truck?.registrationNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {trip.truck?.brand} {trip.truck?.model}
                              </p>
                            </div>
                          </div>

                          {/* Trailer */}
                          <div className="flex items-center gap-2 text-sm">
                            <FaTrailer className="text-gray-400" />
                            <div>
                              <p className="text-gray-600">Trailer</p>
                              <p className="font-semibold text-dark">
                                {trip.trailer?.serialNumber}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {trip.trailer?.type}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Distance Info (for finished trips) */}
                        {trip.status === 'finished' && trip.totalDistance && (
                          <div className="mt-4 ml-16 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Distance: </span>
                                <span className="font-bold text-green-700">{trip.totalDistance} km</span>
                              </div>
                              {trip.fuelUsed && (
                                <div>
                                  <span className="text-gray-600">Fuel Used: </span>
                                  <span className="font-bold text-green-700">{trip.fuelUsed} L</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Progress Info (for in_progress trips) */}
                        {trip.status === 'in_progress' && trip.startKm && (
                          <div className="mt-4 ml-16 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm">
                              <span className="text-gray-600">Started at: </span>
                              <span className="font-bold text-blue-700">{trip.startKm.toLocaleString()} km</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        {trip.status === 'to_do' && (
                          <Button
                            variant="primary"
                            icon={FaPlay}
                            onClick={() => navigate(`/driver/trips/${trip._id}/start`)}
                          >
                            Start Trip
                          </Button>
                        )}

                        {trip.status === 'in_progress' && (
                          <>
                            <Button
                              variant="primary"
                              icon={FaStop}
                              onClick={() => navigate(`/driver/trips/${trip._id}/finish`)}
                            >
                              Finish Trip
                            </Button>
                            <Button
                              variant="outline"
                              icon={FaEye}
                              onClick={() => navigate(`/driver/trips/${trip._id}`)}
                            >
                              View Details
                            </Button>
                          </>
                        )}

                        {trip.status === 'finished' && (
                          <Button
                            variant="outline"
                            icon={FaEye}
                            onClick={() => navigate(`/driver/trips/${trip._id}`)}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
    </div>
  );
};

export default DriverTrips;

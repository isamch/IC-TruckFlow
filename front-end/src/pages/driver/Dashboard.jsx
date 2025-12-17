import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common';
import { Button } from '../../components/forms';
import {
  FaRoute, FaTruck, FaCheckCircle, FaTachometerAlt,
  FaExclamationTriangle, FaPlay, FaEye, FaGasPump
} from 'react-icons/fa';
import { getMyTrips } from '../../services/driverTripService';
import { handleApiError, showErrorToast } from '../../utils/errorHandlers';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [stats, setStats] = useState({
    completedTrips: 0,
    totalDistance: 0,
    inProgressTrips: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all trips to calculate stats
      const response = await getMyTrips(1, 100);
      const trips = response.data?.trips || [];

      // Find current trip (in_progress)
      const inProgress = trips.find(trip => trip.status === 'in_progress');
      setCurrentTrip(inProgress || null);

      // Find upcoming trips (to_do)
      const upcoming = trips.filter(trip => trip.status === 'to_do').slice(0, 3);
      setUpcomingTrips(upcoming);

      // Calculate stats
      const finished = trips.filter(trip => trip.status === 'finished');
      const totalDist = finished.reduce((sum, trip) => sum + (trip.totalDistance || 0), 0);

      setStats({
        completedTrips: finished.length,
        totalDistance: totalDist,
        inProgressTrips: trips.filter(trip => trip.status === 'in_progress').length
      });
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your trip overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completed Trips */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Trips</p>
              <p className="text-3xl font-bold text-dark">{stats.completedTrips}</p>
            </div>
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <FaTachometerAlt className="text-3xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-3xl font-bold text-dark">{stats.totalDistance.toLocaleString()} km</p>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 rounded-lg">
              <FaRoute className="text-3xl text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-dark">{stats.inProgressTrips}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Trip */}
      {currentTrip ? (
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <FaRoute className="text-3xl" />
                <div>
                  <p className="text-sm opacity-90">Current Trip</p>
                  <h2 className="text-2xl font-bold">
                    {currentTrip.startLocation} → {currentTrip.endLocation}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Truck</p>
                  <p className="font-semibold">{currentTrip.truck?.registrationNumber}</p>
                  <p className="text-xs opacity-75">{currentTrip.truck?.brand} {currentTrip.truck?.model}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Started at</p>
                  <p className="font-semibold">{currentTrip.startKm?.toLocaleString()} km</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-xs opacity-90">Trailer</p>
                  <p className="font-semibold">{currentTrip.trailer?.serialNumber}</p>
                  <p className="text-xs opacity-75 capitalize">{currentTrip.trailer?.type}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-6">
              <Button
                variant="outline"
                className="bg-white text-primary hover:bg-gray-100 border-white"
                icon={FaEye}
                onClick={() => navigate(`/driver/trips/${currentTrip._id}`)}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                className="bg-white text-primary hover:bg-gray-100 border-white"
                onClick={() => navigate(`/driver/trips/${currentTrip._id}/finish`)}
              >
                Finish Trip
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <FaRoute className="mx-auto text-5xl text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Trip</h3>
          <p className="text-gray-500 mb-4">You don't have any trip in progress</p>
          <Button
            variant="primary"
            onClick={() => navigate('/driver/trips')}
          >
            View All Trips
          </Button>
        </div>
      )}

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark">Upcoming Trips</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/driver/trips')}
            >
              View All
            </Button>
          </div>
        </div>

        {upcomingTrips.length === 0 ? (
          <div className="p-8 text-center">
            <FaRoute className="mx-auto text-5xl text-gray-300 mb-3" />
            <p className="text-gray-500">No upcoming trips scheduled</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {upcomingTrips.map((trip) => (
              <div key={trip._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FaRoute className="text-2xl text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark">
                        {trip.startLocation} → {trip.endLocation}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaTruck className="text-gray-400" />
                          <span>{trip.truck?.registrationNumber}</span>
                        </div>
                        <div>
                          Planned: {new Date(trip.plannedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    icon={FaPlay}
                    onClick={() => navigate(`/driver/trips/${trip._id}/start`)}
                  >
                    Start Trip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/driver/fuel-logs')}
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <FaGasPump className="text-3xl text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark">Add Fuel Log</h3>
              <p className="text-sm text-gray-600">Record fuel consumption</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/driver/alerts')}
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="text-3xl text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark">Truck Alerts</h3>
              <p className="text-sm text-gray-600">View maintenance alerts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;

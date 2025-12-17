import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../components/common';
import { Button, Input } from '../../components/forms';
import { FaArrowLeft, FaPlay, FaRoute, FaTruck, FaTrailer } from 'react-icons/fa';
import { getMyTripById, startTrip } from '../../services/driverTripService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const StartTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startKm: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await getMyTripById(id);
      const tripData = response.data;

      // Check if trip can be started
      if (tripData.status !== 'to_do') {
        showErrorToast('This trip cannot be started');
        navigate('/driver/trips');
        return;
      }

      setTrip(tripData);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.startKm) {
      newErrors.startKm = 'Start odometer is required';
    } else if (formData.startKm < trip.truck.currentKm) {
      newErrors.startKm = `Start odometer must be at least ${trip.truck.currentKm} km (current truck odometer)`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await startTrip(id, {
        startKm: parseInt(formData.startKm),
        notes: formData.notes
      });
      showSuccessToast('Trip started successfully!');
      navigate(`/driver/trips/${id}`);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!trip) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/driver/trips')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-xl text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
            <FaPlay className="text-primary" />
            Start Trip
          </h1>
          <p className="text-gray-600 mt-1">
            {trip.startLocation} → {trip.endLocation}
          </p>
        </div>
      </div>

      {/* Trip Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
          <FaRoute className="text-primary" />
          Trip Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Truck Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <FaTruck className="text-2xl text-primary" />
              <div>
                <p className="text-sm text-gray-600">Truck</p>
                <p className="font-bold text-dark text-lg">{trip.truck.registrationNumber}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">
                Brand: <span className="font-semibold text-dark">{trip.truck.brand} {trip.truck.model}</span>
              </p>
              <p className="text-gray-600">
                Current Odometer: <span className="font-semibold text-dark">{trip.truck.currentKm?.toLocaleString()} km</span>
              </p>
            </div>
          </div>

          {/* Trailer Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <FaTrailer className="text-2xl text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Trailer</p>
                <p className="font-bold text-dark text-lg">{trip.trailer.serialNumber}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">
                Type: <span className="font-semibold text-dark capitalize">{trip.trailer.type}</span>
              </p>
              <p className="text-gray-600">
                Planned Date: <span className="font-semibold text-dark">
                  {new Date(trip.plannedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Start Trip Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-dark mb-6">Start Trip Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Start Odometer */}
            <Input
              label="Start Odometer (km)"
              name="startKm"
              type="number"
              value={formData.startKm}
              onChange={handleChange}
              placeholder={`Minimum: ${trip.truck.currentKm}`}
              required
              error={errors.startKm}
              helperText={`Current truck odometer: ${trip.truck.currentKm?.toLocaleString()} km`}
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="input-field"
                placeholder="Add any notes about the trip start (e.g., weather conditions, truck status, etc.)"
              />
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Once you start the trip, the status will change to "In Progress" and you'll be able to add fuel logs and maintenance records during the trip.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/driver/trips')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FaPlay}
              loading={submitting}
              disabled={submitting}
            >
              Start Trip
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartTrip;

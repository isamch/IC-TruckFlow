import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../components/common';
import { Button, Input } from '../../components/forms';
import { FaArrowLeft, FaStop, FaRoute, FaTruck, FaTachometerAlt } from 'react-icons/fa';
import { getMyTripById, finishTrip } from '../../services/driverTripService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const FinishTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    endKm: '',
    fuelUsed: '',
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

      // Check if trip can be finished
      if (tripData.status !== 'in_progress') {
        showErrorToast('This trip is not in progress');
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
    if (!formData.endKm) {
      newErrors.endKm = 'End odometer is required';
    } else if (parseInt(formData.endKm) <= trip.startKm) {
      newErrors.endKm = `End odometer must be greater than ${trip.startKm} km (start odometer)`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const submitData = {
        endKm: parseInt(formData.endKm),
        notes: formData.notes
      };

      if (formData.fuelUsed) {
        submitData.fuelUsed = parseFloat(formData.fuelUsed);
      }

      await finishTrip(id, submitData);
      showSuccessToast('Trip finished successfully!');
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

  const calculatedDistance = formData.endKm && trip
    ? parseInt(formData.endKm) - trip.startKm
    : 0;

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
            <FaStop className="text-red-600" />
            Finish Trip
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Truck Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FaTruck className="text-2xl text-primary" />
              <div>
                <p className="text-sm text-gray-600">Truck</p>
                <p className="font-bold text-dark">{trip.truck.registrationNumber}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {trip.truck.brand} {trip.truck.model}
            </p>
          </div>

          {/* Start Odometer */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <FaTachometerAlt className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Start Odometer</p>
                <p className="font-bold text-dark text-lg">{trip.startKm?.toLocaleString()} km</p>
              </div>
            </div>
          </div>

          {/* Fuel Logs */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 mb-1">Fuel Logs</p>
            <p className="font-bold text-dark text-lg">{trip.fuelLogs?.length || 0} logs</p>
            <p className="text-xs text-gray-600 mt-1">Added during trip</p>
          </div>
        </div>
      </div>

      {/* Finish Trip Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-dark mb-6">Finish Trip Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* End Odometer */}
            <Input
              label="End Odometer (km)"
              name="endKm"
              type="number"
              value={formData.endKm}
              onChange={handleChange}
              placeholder={`Greater than ${trip.startKm}`}
              required
              error={errors.endKm}
              helperText={`Start odometer: ${trip.startKm?.toLocaleString()} km`}
            />

            {/* Fuel Used */}
            <Input
              label="Total Fuel Used (Liters)"
              name="fuelUsed"
              type="number"
              step="0.1"
              value={formData.fuelUsed}
              onChange={handleChange}
              placeholder="Optional"
              helperText="Total fuel consumed during the trip"
            />
          </div>

          {/* Calculated Distance */}
          {calculatedDistance > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total Distance:</span>
                <span className="text-2xl font-bold text-primary">{calculatedDistance.toLocaleString()} km</span>
              </div>
            </div>
          )}

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
              placeholder="Add any notes about the trip completion (e.g., incidents, delays, truck condition, etc.)"
            />
          </div>

          {/* Info Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Once you finish the trip, the status will change to "Finished" and you won't be able to add more fuel logs or maintenance records to this trip.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/driver/trips/${id}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FaStop}
              loading={submitting}
              disabled={submitting}
            >
              Finish Trip
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinishTrip;

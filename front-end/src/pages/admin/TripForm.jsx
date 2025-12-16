import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../components/common';
import { Button, Input, Select } from '../../components/forms';
import { FaArrowLeft, FaRoute, FaSave } from 'react-icons/fa';
import { getTripById, createTrip, updateTrip } from '../../services/tripService';
import { getAllUsers } from '../../services/userService';
import { getAllTrucks } from '../../services/truckService';
import { getAllTrailers } from '../../services/trailerService';
import { handleApiError, showSuccessToast, showErrorToast } from '../../utils/errorHandlers';

const TripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    driver: '',
    truck: '',
    trailer: '',
    startLocation: '',
    endLocation: '',
    plannedDate: '',
    status: 'to_do'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  // Dropdown options
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
    if (isEditMode) {
      fetchTripDetails();
    }
  }, [id]);

  const fetchOptions = async () => {
    try {
      setOptionsLoading(true);
      const [usersRes, trucksRes, trailersRes] = await Promise.all([
        getAllUsers(1, 100),
        getAllTrucks(1, 100),
        getAllTrailers(1, 100)
      ]);

      // Filter only drivers
      const driversList = usersRes.data?.users?.filter(user => user.role === 'driver') || [];
      setDrivers(driversList);
      setTrucks(trucksRes.data?.trucks || []);
      setTrailers(trailersRes.data?.trailers || []);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setOptionsLoading(false);
    }
  };

  const fetchTripDetails = async () => {
    try {
      setPageLoading(true);
      const response = await getTripById(id);
      const trip = response.data;

      setFormData({
        driver: trip.driver?._id || '',
        truck: trip.truck?._id || '',
        trailer: trip.trailer?._id || '',
        startLocation: trip.startLocation || '',
        endLocation: trip.endLocation || '',
        plannedDate: trip.plannedDate ? new Date(trip.plannedDate).toISOString().slice(0, 16) : '',
        status: trip.status || 'to_do'
      });
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
      navigate('/admin/trips');
    } finally {
      setPageLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.driver) newErrors.driver = 'Driver is required';
    if (!formData.truck) newErrors.truck = 'Truck is required';
    if (!formData.trailer) newErrors.trailer = 'Trailer is required';
    if (!formData.startLocation) newErrors.startLocation = 'Start location is required';
    if (!formData.endLocation) newErrors.endLocation = 'End location is required';
    if (!formData.plannedDate) newErrors.plannedDate = 'Planned date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await updateTrip(id, formData);
        showSuccessToast('Trip updated successfully!');
        navigate(`/admin/trips/${id}`); // Redirect to details page
      } else {
        const response = await createTrip(formData);
        showSuccessToast('Trip created successfully!');
        // Redirect to the newly created trip details
        const newTripId = response.data?._id || response.data?.data?._id;
        if (newTripId) {
          navigate(`/admin/trips/${newTripId}`);
        } else {
          navigate('/admin/trips');
        }
      }
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || optionsLoading) {
    return <LoadingScreen />;
  }

  const driverOptions = drivers.map(driver => ({
    value: driver._id,
    label: `${driver.fullname} (${driver.licenseNumber || 'N/A'})`
  }));

  const truckOptions = trucks.map(truck => ({
    value: truck._id,
    label: `${truck.registrationNumber} - ${truck.brand} ${truck.model}`
  }));

  const trailerOptions = trailers.map(trailer => ({
    value: trailer._id,
    label: `${trailer.serialNumber} - ${trailer.type}`
  }));

  const statusOptions = [
    { value: 'to_do', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'finished', label: 'Finished' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/trips')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-xl text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
            <FaRoute className="text-primary" />
            {isEditMode ? 'Edit Trip' : 'Create New Trip'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update trip information' : 'Fill in the details to create a new trip'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver */}
            <Select
              label="Driver"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              options={driverOptions}
              placeholder="Select a driver"
              required
              error={errors.driver}
            />

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

            {/* Trailer */}
            <Select
              label="Trailer"
              name="trailer"
              value={formData.trailer}
              onChange={handleChange}
              options={trailerOptions}
              placeholder="Select a trailer"
              required
              error={errors.trailer}
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

            {/* Start Location */}
            <Input
              label="Start Location"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
              placeholder="Casablanca"
              required
              error={errors.startLocation}
            />

            {/* End Location */}
            <Input
              label="End Location"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
              placeholder="Marrakech"
              required
              error={errors.endLocation}
            />

            {/* Planned Date */}
            <Input
              label="Planned Date & Time"
              name="plannedDate"
              type="datetime-local"
              value={formData.plannedDate}
              onChange={handleChange}
              required
              error={errors.plannedDate}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/trips')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FaSave}
              loading={loading}
              disabled={loading}
            >
              {isEditMode ? 'Update Trip' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Driver Selection</h3>
          <p className="text-sm text-blue-700">
            {drivers.length} driver{drivers.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Truck Selection</h3>
          <p className="text-sm text-green-700">
            {trucks.length} truck{trucks.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Trailer Selection</h3>
          <p className="text-sm text-purple-700">
            {trailers.length} trailer{trailers.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripForm;

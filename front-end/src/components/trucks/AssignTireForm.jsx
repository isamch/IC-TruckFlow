import { useState, useEffect } from 'react';
import { Select, Button } from '../forms';
import { LoadingSpinner } from '../common';
import { getAvailableTires } from '../../services/tireService';
import { handleApiError, showErrorToast } from '../../utils/errorHandlers';

const AssignTireForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    tireId: '',
    position: ''
  });
  const [errors, setErrors] = useState({});
  const [availableTires, setAvailableTires] = useState([]);
  const [tiresLoading, setTiresLoading] = useState(true);

  useEffect(() => {
    fetchAvailableTires();
  }, []);

  const fetchAvailableTires = async () => {
    try {
      setTiresLoading(true);
      const response = await getAvailableTires();
      // Response.data is already the filtered array
      setAvailableTires(response.data || []);
    } catch (error) {
      const errorData = handleApiError(error);
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setTiresLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.tireId) newErrors.tireId = 'Please select a tire';
    if (!formData.position) newErrors.position = 'Position is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    onSubmit(formData);
  };

  const positionOptions = [
    { value: 'front-left', label: 'Front Left' },
    { value: 'front-right', label: 'Front Right' },
    { value: 'rear-left-outer', label: 'Rear Left Outer' },
    { value: 'rear-left-inner', label: 'Rear Left Inner' },
    { value: 'rear-right-outer', label: 'Rear Right Outer' },
    { value: 'rear-right-inner', label: 'Rear Right Inner' },
  ];

  const getTireLabel = (tire) => {
    const position = tire.position?.replace(/-/g, ' ') || 'Unknown Position';
    const condition = tire.condition || 'N/A';
    const km = tire.currentKm ? `${tire.currentKm.toLocaleString()} km` : 'N/A';
    return `${position} - ${condition} (${km}) - ${tire.status}`;
  };

  const tireOptions = availableTires.map(tire => ({
    value: tire._id,
    label: getTireLabel(tire)
  }));

  if (tiresLoading) {
    return (
      <div className="py-12 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 mt-4">Loading available tires...</p>
      </div>
    );
  }

  if (availableTires.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600 mb-4">No available tires found.</p>
        <p className="text-sm text-gray-500">All tires are currently assigned to trucks.</p>
        <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Select Tire */}
        <div>
          <Select
            label="Select Tire"
            name="tireId"
            value={formData.tireId}
            onChange={handleChange}
            options={tireOptions}
            placeholder="Choose a tire"
            required
            error={errors.tireId}
          />
          <p className="text-xs text-gray-500 mt-1">
            {availableTires.length} tire(s) available
          </p>
        </div>

        {/* Position */}
        <Select
          label="Position on Truck"
          name="position"
          value={formData.position}
          onChange={handleChange}
          options={positionOptions}
          placeholder="Choose position"
          required
          error={errors.position}
        />

        {/* Selected Tire Details */}
        {formData.tireId && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-dark mb-2">Selected Tire Details:</h4>
            {(() => {
              const selectedTire = availableTires.find(t => t._id === formData.tireId);
              if (!selectedTire) return null;
              return (
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Position:</span>
                    <span className="text-dark font-medium capitalize">
                      {selectedTire.position?.replace(/-/g, ' ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className={`font-medium ${selectedTire.condition === 'good' ? 'text-green-600' :
                      selectedTire.condition === 'worn' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                      {selectedTire.condition || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Install KM:</span>
                    <span className="text-dark font-medium">
                      {selectedTire.installKm?.toLocaleString() || 'N/A'} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current KM:</span>
                    <span className="text-dark font-medium">
                      {selectedTire.currentKm?.toLocaleString() || 'N/A'} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage:</span>
                    <span className="text-dark font-medium">
                      {((selectedTire.currentKm - selectedTire.installKm) || 0).toLocaleString()} km
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
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
          Assign Tire
        </Button>
      </div>
    </form>
  );
};

export default AssignTireForm;

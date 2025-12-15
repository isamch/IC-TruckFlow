import { useState, useEffect } from 'react';
import { Input, Select, Button } from '../forms';
import { FaTruck, FaIdCard, FaGasPump } from 'react-icons/fa';

const TruckForm = ({ truck, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    brand: '',
    model: '',
    currentKm: '',
    fuelCapacity: '',
    status: 'available',
  });
  const [errors, setErrors] = useState({});

  // Load truck data if editing
  useEffect(() => {
    if (truck) {
      setFormData({
        registrationNumber: truck.registrationNumber || '',
        brand: truck.brand || '',
        model: truck.model || '',
        currentKm: truck.currentKm || '',
        fuelCapacity: truck.fuelCapacity || '',
        status: truck.status || 'available',
      });
    }
  }, [truck]);

  // Handle input change
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

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.currentKm) newErrors.currentKm = 'Current mileage is required';
    if (!formData.fuelCapacity) newErrors.fuelCapacity = 'Fuel capacity is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    onSubmit(formData);
  };

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'on_trip', label: 'On Trip' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Number */}
        <Input
          label="Registration Number"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          placeholder="ABC-1234-MA"
          icon={FaIdCard}
          required
          error={errors.registrationNumber}
        />

        {/* Brand */}
        <Input
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Mercedes, Volvo, etc."
          icon={FaTruck}
          required
          error={errors.brand}
        />

        {/* Model */}
        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Actros, FH16, etc."
          required
          error={errors.model}
        />

        {/* Current Mileage */}
        <Input
          label="Current Mileage (km)"
          name="currentKm"
          type="number"
          value={formData.currentKm}
          onChange={handleChange}
          placeholder="125000"
          required
          error={errors.currentKm}
        />

        {/* Fuel Capacity */}
        <Input
          label="Fuel Capacity (L)"
          name="fuelCapacity"
          type="number"
          value={formData.fuelCapacity}
          onChange={handleChange}
          placeholder="500"
          icon={FaGasPump}
          required
          error={errors.fuelCapacity}
        />

        {/* Status */}
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
          error={errors.status}
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
          {truck ? 'Update Truck' : 'Create Truck'}
        </Button>
      </div>
    </form>
  );
};

export default TruckForm;

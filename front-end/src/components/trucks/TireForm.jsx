import { useState } from 'react';
import { Input, Select, Button } from '../forms';

const TireForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    position: '',
    condition: 'good',
    installKm: '',
    currentKm: ''
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.installKm) newErrors.installKm = 'Install KM is required';
    if (!formData.currentKm) newErrors.currentKm = 'Current KM is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    onSubmit(formData);
  };

  const positionOptions = [
    { value: '', label: 'Select Position' },
    { value: 'front-left', label: 'Front Left' },
    { value: 'front-right', label: 'Front Right' },
    { value: 'rear-left-outer', label: 'Rear Left Outer' },
    { value: 'rear-left-inner', label: 'Rear Left Inner' },
    { value: 'rear-right-outer', label: 'Rear Right Outer' },
    { value: 'rear-right-inner', label: 'Rear Right Inner' },
  ];

  const conditionOptions = [
    { value: 'good', label: 'Good' },
    { value: 'worn', label: 'Worn' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Position */}
        <Select
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          options={positionOptions}
          required
          error={errors.position}
        />

        {/* Condition */}
        <Select
          label="Condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          options={conditionOptions}
          required
          error={errors.condition}
        />

        {/* Install KM */}
        <Input
          label="Install KM"
          name="installKm"
          type="number"
          value={formData.installKm}
          onChange={handleChange}
          placeholder="125000"
          required
          error={errors.installKm}
        />

        {/* Current KM */}
        <Input
          label="Current KM"
          name="currentKm"
          type="number"
          value={formData.currentKm}
          onChange={handleChange}
          placeholder="125000"
          required
          error={errors.currentKm}
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
          Add Tire
        </Button>
      </div>
    </form>
  );
};

export default TireForm;

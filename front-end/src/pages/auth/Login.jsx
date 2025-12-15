import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaEnvelope, FaLock } from 'react-icons/fa';
import { Input, Button } from '../../components/forms';
import { LoadingScreen } from '../../components/common';
import { handleApiError, showSuccessToast, showErrorToast, clearFieldError } from '../../utils/errorHandlers';

const Login = () => {
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Hooks
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user?.role === 'driver') {
        navigate('/driver/trips', { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    clearFieldError(name, errors, setErrors);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const user = await login(formData.email, formData.password);

      // Show success message
      showSuccessToast(`Welcome back, ${user.fullname}!`);

      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'driver') {
        navigate('/driver/trips');
      }
    } catch (error) {
      // Handle error
      const errorData = handleApiError(error);

      // Set field errors if any
      if (Object.keys(errorData.fieldErrors).length > 0) {
        setErrors(errorData.fieldErrors);
      }

      // Show toast for general errors
      if (errorData.showToast) {
        showErrorToast(errorData.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // If already authenticated, show redirecting message
  if (isAuthenticated) {
    return <LoadingScreen message="Redirecting to dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-white to-beige flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4 shadow-lg">
            <FaTruck className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-dark mb-2">IC-TruckFlow</h1>
          <p className="text-gray-600">Truck Fleet Management System</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-dark mb-6 text-center">
            Login
          </h2>

          {/* Show general error message if there are field errors */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm text-red-700 font-medium">
                Please fix the errors below
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              icon={FaEnvelope}
              required
              error={errors.email}
            />

            {/* Password field */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FaLock}
              required
              error={errors.password}
            />

            {/* Login button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-beige rounded-lg">
            <p className="text-xs text-gray-600 text-center mb-2 font-semibold">
              Demo Accounts:
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>👨‍💼 Admin: admin@ictruckflow.com</p>
              <p>🚛 Driver: driver@ictruckflow.com</p>
              <p className="text-center mt-2">Password: password123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 IC-TruckFlow. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;

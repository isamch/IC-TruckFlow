import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/common';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return <LoadingScreen message="Loading..." />;
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'driver') {
      return <Navigate to="/driver/trips" replace />;
    }
  }

  // If not authenticated, show the public page
  return children;
};

export default PublicRoute;

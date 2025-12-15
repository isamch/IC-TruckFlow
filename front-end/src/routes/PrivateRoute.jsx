import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/common';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // If loading
  if (loading) {
    return <LoadingScreen message="Loading..." />;
  }

  // If not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
          <p className="text-xl text-gray-700">You don't have permission to access this page</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;

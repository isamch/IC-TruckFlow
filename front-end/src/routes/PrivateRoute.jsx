import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // إذا كان التحميل جاري
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان الدور غير مسموح
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
          <p className="text-xl text-gray-700">غير مصرح لك بالدخول لهذه الصفحة</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 btn-primary"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;

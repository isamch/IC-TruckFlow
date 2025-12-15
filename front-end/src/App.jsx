import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// المكونات
import PrivateRoute from './routes/PrivateRoute';

// الصفحات
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* الصفحات العامة */}
          <Route path="/login" element={<Login />} />

          {/* صفحات الأدمن */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* الصفحة الافتراضية */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* صفحة 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-beige">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                  <p className="text-xl text-gray-700">الصفحة غير موجودة</p>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Toast للإشعارات */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

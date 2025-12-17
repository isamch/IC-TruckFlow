import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import PrivateRoute from './routes/PrivateRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Trucks from './pages/admin/Trucks';
import TruckDetails from './pages/admin/TruckDetails';
import Tires from './pages/admin/Tires';
import Trailers from './pages/admin/Trailers';
import Trips from './pages/admin/Trips';
import TripDetails from './pages/admin/TripDetails';
import TripForm from './pages/admin/TripForm';
import FuelLogs from './pages/admin/FuelLogs';
import Maintenance from './pages/admin/Maintenance';
import Alerts from './pages/admin/Alerts';

// Driver Pages
import DriverDashboard from './pages/driver/Dashboard';
import DriverTrips from './pages/driver/Trips';
import DriverTripDetails from './pages/driver/TripDetails';
import StartTrip from './pages/driver/StartTrip';
import FinishTrip from './pages/driver/FinishTrip';
import DriverFuelLogs from './pages/driver/FuelLogs';
import DriverMaintenance from './pages/driver/Maintenance';
import DriverAlerts from './pages/driver/Alerts';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<Login />} />

          {/* Admin pages - Nested routes with DashboardLayout */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="trucks/:id" element={<TruckDetails />} />
            <Route path="tires" element={<Tires />} />
            <Route path="trailers" element={<Trailers />} />
            <Route path="trips" element={<Trips />} />
            <Route path="trips/create" element={<TripForm />} />
            <Route path="trips/edit/:id" element={<TripForm />} />
            <Route path="trips/:id" element={<TripDetails />} />
            <Route path="fuel-logs" element={<FuelLogs />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>

          {/* Driver pages - Nested routes with DashboardLayout */}
          <Route
            path="/driver"
            element={
              <PrivateRoute allowedRoles={['driver']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="trips" element={<DriverTrips />} />
            <Route path="trips/:id" element={<DriverTripDetails />} />
            <Route path="trips/:id/start" element={<StartTrip />} />
            <Route path="trips/:id/finish" element={<FinishTrip />} />
            <Route path="fuel-logs" element={<DriverFuelLogs />} />
            <Route path="maintenance" element={<DriverMaintenance />} />
            <Route path="alerts" element={<DriverAlerts />} />
          </Route>

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-beige">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                  <p className="text-xl text-gray-700">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
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

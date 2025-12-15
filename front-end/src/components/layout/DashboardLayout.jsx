import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-beige">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar role={user?.role} />

        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

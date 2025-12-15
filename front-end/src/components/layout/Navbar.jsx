import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              IC-TruckFlow
            </h1>
          </div>

          {/* User information */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <FaBell className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User info */}
            <div className="flex items-center gap-3 border-r border-l px-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-dark">
                  {user?.fullname}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'System Admin' : 'Driver'}
                </p>
              </div>
              <FaUserCircle className="text-3xl text-primary" />
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

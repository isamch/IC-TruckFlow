import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaTruck,
  FaTrailer,
  FaUsers,
  FaRoute,
  FaGasPump,
  FaTools,
  FaExclamationTriangle,
  FaCog,
  FaCircle
} from 'react-icons/fa';

const Sidebar = ({ role = 'admin' }) => {
  // Admin links
  const adminLinks = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/trucks', icon: FaTruck, label: 'Trucks' },
    { path: '/admin/tires', icon: FaCircle, label: 'Tires' },
    { path: '/admin/trailers', icon: FaTrailer, label: 'Trailers' },
    { path: '/admin/trips', icon: FaRoute, label: 'Trips' },
    { path: '/admin/fuel-logs', icon: FaGasPump, label: 'Fuel Logs' },
    { path: '/admin/maintenance', icon: FaTools, label: 'Maintenance' },
    { path: '/admin/alerts', icon: FaExclamationTriangle, label: 'Alerts' },
  ];

  // Driver links
  const driverLinks = [
    { path: '/driver/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/driver/trips', icon: FaRoute, label: 'My Trips' },
    { path: '/driver/fuel-logs', icon: FaGasPump, label: 'Fuel Logs' },
    { path: '/driver/maintenance', icon: FaTools, label: 'Maintenance' },
    { path: '/driver/alerts', icon: FaExclamationTriangle, label: 'Alerts' },
  ];

  const links = role === 'admin' ? adminLinks : driverLinks;

  return (
    <aside className="w-64 bg-dark min-h-screen sticky top-16">
      <div className="p-6">
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`
              }
            >
              <link.icon className="text-xl" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Settings */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <NavLink
            to={`/${role}/settings`}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-dark-light hover:text-white rounded-lg transition-all"
          >
            <FaCog className="text-xl" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

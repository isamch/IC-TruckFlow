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
  FaCog
} from 'react-icons/fa';

const Sidebar = ({ role = 'admin' }) => {
  // قائمة الروابط للأدمن
  const adminLinks = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'لوحة التحكم' },
    { path: '/admin/users', icon: FaUsers, label: 'المستخدمين' },
    { path: '/admin/trucks', icon: FaTruck, label: 'الشاحنات' },
    { path: '/admin/trailers', icon: FaTrailer, label: 'المقطورات' },
    { path: '/admin/trips', icon: FaRoute, label: 'الرحلات' },
    { path: '/admin/fuel-logs', icon: FaGasPump, label: 'سجلات الوقود' },
    { path: '/admin/maintenance', icon: FaTools, label: 'الصيانة' },
    { path: '/admin/alerts', icon: FaExclamationTriangle, label: 'التنبيهات' },
  ];

  // قائمة الروابط للسائق
  const driverLinks = [
    { path: '/driver/trips', icon: FaRoute, label: 'رحلاتي' },
    { path: '/driver/fuel-logs', icon: FaGasPump, label: 'سجلات الوقود' },
    { path: '/driver/maintenance', icon: FaTools, label: 'الصيانة' },
    { path: '/driver/alerts', icon: FaExclamationTriangle, label: 'التنبيهات' },
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

        {/* إعدادات في الأسفل */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <NavLink
            to={`/${role}/settings`}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-dark-light hover:text-white rounded-lg transition-all"
          >
            <FaCog className="text-xl" />
            <span className="font-medium">الإعدادات</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

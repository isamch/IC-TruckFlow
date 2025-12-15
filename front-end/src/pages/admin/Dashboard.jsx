import DashboardLayout from '../../components/layout/DashboardLayout';
import { FaTruck, FaUsers, FaRoute, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
  // Sample statistics data
  const stats = [
    {
      title: 'Total Trucks',
      value: '24',
      icon: FaTruck,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Active Drivers',
      value: '18',
      icon: FaUsers,
      color: 'bg-green-500',
      change: '+3 this week'
    },
    {
      title: 'Ongoing Trips',
      value: '7',
      icon: FaRoute,
      color: 'bg-primary',
      change: '5 pending'
    },
    {
      title: 'Maintenance Alerts',
      value: '3',
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
      change: 'Requires attention'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-dark">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Fleet Management System</p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-dark mt-2">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent trips */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">
            Recent Trips
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                    Driver
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                    Truck
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Sample data */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Ahmed Mohamed
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ABC-1234
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Casablanca → Marrakech
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      In Progress
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Said Alaoui
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    XYZ-5678
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Rabat → Tangier
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Khalid Benali
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    DEF-9012
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Agadir → Essaouira
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Urgent maintenance alerts */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">
            Urgent Maintenance Alerts
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <div>
                <p className="font-semibold text-dark">
                  Truck ABC-1234 - Oil Change
                </p>
                <p className="text-sm text-gray-600">
                  Overdue by 500 km
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <FaExclamationTriangle className="text-yellow-500 text-xl" />
              <div>
                <p className="font-semibold text-dark">
                  Truck XYZ-5678 - Tire Inspection
                </p>
                <p className="text-sm text-gray-600">
                  Required within 200 km
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

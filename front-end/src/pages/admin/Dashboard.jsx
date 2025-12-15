import DashboardLayout from '../../components/layout/DashboardLayout';
import { FaTruck, FaUsers, FaRoute, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
  // بيانات تجريبية للإحصائيات
  const stats = [
    {
      title: 'إجمالي الشاحنات',
      value: '24',
      icon: FaTruck,
      color: 'bg-blue-500',
      change: '+2 هذا الشهر'
    },
    {
      title: 'السائقين النشطين',
      value: '18',
      icon: FaUsers,
      color: 'bg-green-500',
      change: '+3 هذا الأسبوع'
    },
    {
      title: 'الرحلات الجارية',
      value: '7',
      icon: FaRoute,
      color: 'bg-primary',
      change: '5 قيد الانتظار'
    },
    {
      title: 'تنبيهات الصيانة',
      value: '3',
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
      change: 'يتطلب اهتمام'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* العنوان */}
        <div>
          <h1 className="text-3xl font-bold text-dark">لوحة التحكم</h1>
          <p className="text-gray-600 mt-1">مرحباً بك في نظام إدارة الأسطول</p>
        </div>

        {/* بطاقات الإحصائيات */}
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

        {/* الرحلات الأخيرة */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">
            الرحلات الأخيرة
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark">
                    السائق
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark">
                    الشاحنة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark">
                    المسار
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* بيانات تجريبية */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    أحمد محمد
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ABC-1234
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    الدار البيضاء → مراكش
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      جارية
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    سعيد العلوي
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    XYZ-5678
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    الرباط → طنجة
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      قيد الانتظار
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    خالد بنعلي
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    DEF-9012
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    أكادير → الصويرة
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      منتهية
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* تنبيهات الصيانة */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">
            تنبيهات الصيانة العاجلة
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <div>
                <p className="font-semibold text-dark">
                  شاحنة ABC-1234 - تغيير الزيت
                </p>
                <p className="text-sm text-gray-600">
                  متأخر بـ 500 كم
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border-r-4 border-yellow-500 rounded-lg">
              <FaExclamationTriangle className="text-yellow-500 text-xl" />
              <div>
                <p className="font-semibold text-dark">
                  شاحنة XYZ-5678 - فحص الإطارات
                </p>
                <p className="text-sm text-gray-600">
                  مطلوب خلال 200 كم
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

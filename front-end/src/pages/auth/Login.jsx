import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTruck, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  // States للنموذج
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  // دالة تسجيل الدخول
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success('مرحباً بك! تم تسجيل الدخول بنجاح');

      // التوجيه حسب نوع المستخدم
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'driver') {
        navigate('/driver/trips');
      }
    } catch (error) {
      toast.error(error.message || 'خطأ في البريد الإلكتروني أو كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-white to-beige flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* الشعار والعنوان */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4 shadow-lg">
            <FaTruck className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-dark mb-2">IC-TruckFlow</h1>
          <p className="text-gray-600">نظام إدارة أسطول الشاحنات</p>
        </div>

        {/* بطاقة تسجيل الدخول */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-dark mb-6 text-center">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* حقل البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pr-10 text-right"
                  placeholder="example@email.com"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-5 h-5 border-2"></div>
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <span>دخول</span>
              )}
            </button>
          </form>

          {/* معلومات تجريبية */}
          <div className="mt-6 p-4 bg-beige rounded-lg">
            <p className="text-xs text-gray-600 text-center mb-2 font-semibold">
              حسابات تجريبية:
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>👨‍💼 Admin: admin@ic-truckflow.com</p>
              <p>🚛 Driver: driver@ic-truckflow.com</p>
              <p className="text-center mt-2">كلمة المرور: password123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 IC-TruckFlow. جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
};

export default Login;

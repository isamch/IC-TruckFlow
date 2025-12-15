import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

// إنشاء Context للمصادقة
export const AuthContext = createContext();

// Provider للمصادقة
export const AuthProvider = ({ children }) => {
  // الحالات (States)
  const [user, setUser] = useState(null); // معلومات المستخدم
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [isAuthenticated, setIsAuthenticated] = useState(false); // هل المستخدم مسجل دخول؟

  // عند تحميل التطبيق - تحقق من المصادقة
  useEffect(() => {
    checkAuth();
  }, []);

  // دالة للتحقق من المصادقة
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        // جلب معلومات المستخدم من الـ API
        const response = await api.get('/auth/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('خطأ في التحقق:', error);
        // مسح الـ Tokens إذا كانت غير صالحة
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    setLoading(false);
  };

  // دالة تسجيل الدخول
  const login = async (email, password) => {
    try {
      // إرسال طلب تسجيل الدخول
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      // حفظ الـ Tokens في التخزين المحلي
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // تحديث الحالة
      setUser(user);
      setIsAuthenticated(true);

      return user;
    } catch (error) {
      throw error;
    }
  };

  // دالة تسجيل الخروج
  const logout = async () => {
    try {
      // إرسال طلب تسجيل الخروج للـ API
      await api.post('/auth/logout');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    } finally {
      // مسح البيانات المحلية
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // القيم التي سنشاركها مع باقي التطبيق
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

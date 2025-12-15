// رابط الـ Backend
const BASE_URL = 'http://localhost:5000/api/v1';

// دالة لإرسال الطلبات للـ API
const fetchAPI = async (endpoint, options = {}) => {
  // جلب الـ Token من التخزين المحلي
  const token = localStorage.getItem('accessToken');

  // إعداد الـ Headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // إضافة Token إذا كان موجود
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // إعداد الطلب
  const config = {
    ...options,
    headers,
  };

  try {
    // إرسال الطلب
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // التحقق من الاستجابة
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'حدث خطأ في الاتصال'
      }));

      // إذا كان الخطأ 401 (غير مصرح) - تسجيل خروج تلقائي
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }

      throw new Error(error.message || 'حدث خطأ');
    }

    // إرجاع البيانات
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// دوال مساعدة لكل نوع طلب
export const api = {
  // GET - جلب البيانات
  get: (endpoint) => {
    return fetchAPI(endpoint, {
      method: 'GET',
    });
  },

  // POST - إضافة بيانات جديدة
  post: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT - تحديث كامل
  put: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // PATCH - تحديث جزئي
  patch: (endpoint, data) => {
    return fetchAPI(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE - حذف
  delete: (endpoint) => {
    return fetchAPI(endpoint, {
      method: 'DELETE',
    });
  },
};

export default api;

// src/lib/axios.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true, // 리프래시 토큰 쿠키 전송용
  headers: { Accept: 'application/json' },
});

// ✅ 요청 인터셉터 (그대로)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 🔎 추가: 401 뿐 아니라 403 이라도 "expired/invalid/token"류 메시지면 리프레시
function shouldRefresh(error: AxiosError) {
  const status = error.response?.status;
  const data: any = error.response?.data ?? {};
  const msg = String(data.message ?? data.error ?? '').toLowerCase();

  // 서버가 401이거나, 403이면서 토큰 만료/무효 뉘앙스면 리프레시
  return (
    status === 401 ||
    (status === 403 &&
      (msg.includes('expired') || msg.includes('invalid') || msg.includes('token')))
  );
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 🔒 리프레시 요청 자체에서 또 리프레시 안 돌게 가드
    const url = originalRequest?.url || '';
    if (url.includes('/auth/token-refresh') || url.includes('/companys/token-refresh')) {
      return Promise.reject(error);
    }

    // ✅ 여기만 변경: 401 || (403 + 만료/무효 메시지) 에도 리프레시
    if (shouldRefresh(error) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const userType = localStorage.getItem('userType'); // 'company' | 'user'
        if (!refreshToken || !userType) throw new Error('No refresh token or user type');

        const refreshEndpoint =
          userType === 'company' ? '/companys/token-refresh' : '/auth/token-refresh';

        const refreshRes = await api.post(refreshEndpoint, { refresh_token: refreshToken });
        const newAccessToken = (refreshRes.data as any).access_token;

        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        } else {
          originalRequest.headers = new AxiosHeaders({ Authorization: `Bearer ${newAccessToken}` });
        }

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userType');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// src/lib/axios.ts
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true, // 리프래시 토큰 쿠키 전송용
  headers: {
    Accept: 'application/json',
  },
});

// ✅ 추가된 요청 인터셉터 (중요!)
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

// 응답 인터셉터: 401 → 리프래시 토큰 발급 (개인회원/기업회원 구분)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const userType = localStorage.getItem('userType');

        if (!refreshToken || !userType) throw new Error('No refresh token or user type');

        const refreshEndpoint =
          userType === 'company'
            ? '/companys/token-refresh'
            : '/auth/token-refresh';

        const refreshRes = await api.post(refreshEndpoint, {
          refresh_token: refreshToken,
        });

        const newAccessToken = refreshRes.data.access_token;
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

import axios from 'axios';

const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh access token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
          const newAccess = res.data.access;
          localStorage.setItem('access_token', newAccess);
          original.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ---- AUTH ----
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login:    (data) => api.post('/auth/login/', data),
  me:       ()     => api.get('/auth/me/'),
};

// ---- SURVEYS ----
export const surveyAPI = {
  list:   ()         => api.get('/surveys/'),
  detail: (id)       => api.get(`/surveys/${id}/`),
  submit: (id, data) => api.post(`/surveys/${id}/submit/`, data),
};

// ---- POLLS ----
export const pollAPI = {
  list:   ()         => api.get('/polls/'),
  detail: (id)       => api.get(`/polls/${id}/`),
  vote:   (id, data) => api.post(`/polls/${id}/vote/`, data),
  result: (id)       => api.get(`/polls/${id}/result/`),
};

export default api;

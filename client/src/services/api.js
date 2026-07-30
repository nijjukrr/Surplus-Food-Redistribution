import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach user role headers
api.interceptors.request.use((config) => {
  const role = localStorage.getItem('foodbridge_role') || 'restaurant';
  const userId = localStorage.getItem('foodbridge_user_id') || '11111111-1111-1111-1111-111111111111';
  config.headers['x-user-role'] = role;
  config.headers['x-user-id'] = userId;
  return config;
});

export const donationsApi = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  getById: (id) => api.get(`/donations/${id}`),
  updateStatus: (id, status) => api.patch(`/donations/${id}/status`, { status }),
  triggerAI: (id) => api.post(`/donations/${id}/evaluate-ai`)
};

export const ngoApi = {
  getNearby: () => api.get('/ngo/nearby-donations'),
  acceptDonation: (id) => api.post(`/ngo/accept-donation/${id}`)
};

export const volunteerApi = {
  claimDelivery: (id) => api.post(`/volunteer/claim-delivery/${id}`),
  updateStep: (id, step) => api.post(`/volunteer/update-step/${id}`, { step })
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users')
};

export const notificationsApi = {
  getNotifications: () => api.get('/notifications')
};

export default api;

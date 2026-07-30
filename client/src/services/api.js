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
  acceptDonation: (id) => api.post(`/ngo/accept-donation/${id}`),
  denyDonation: (id) => api.post(`/ngo/deny-donation/${id}`)
};

export const volunteerApi = {
  claimDelivery: (id) => api.post(`/volunteer/claim-delivery/${id}`),
  updateStep: (id, step) => api.post(`/volunteer/update-step/${id}`, { step })
};

export const adminApi = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  getPendingDonations: () => api.get('/admin/pending-donations'),
  approveDonation: (id) => api.post(`/admin/approve-donation/${id}`),
  rejectDonation: (id) => api.post(`/admin/reject-donation/${id}`),
  verifyRestaurant: (id) => api.post(`/admin/verify-restaurant/${id}`)
};

export const notificationsApi = {
  getNotifications: () => api.get('/notifications')
};

export default api;

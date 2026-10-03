// client/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smarthire_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Modular API Service Endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const profileAPI = {
  getMyProfile: () => api.get('/profile/me'),
  updateMyProfile: (data) => api.put('/profile/me', data),
  getCandidateProfile: (id) => api.get(`/profile/candidate/${id}`),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getJobMatch: (id) => api.get(`/jobs/${id}/match`),
  getRecommendedJobs: () => api.get('/jobs/recommendations'),
  createJob: (data) => api.post('/jobs', data),
  toggleSaveJob: (id) => api.post(`/jobs/${id}/save`),
};

export const resumeAPI = {
  getMyResumes: () => api.get('/resumes/my'),
  getResumeById: (id) => api.get(`/resumes/${id}`),
  saveResume: (data) => api.post('/resumes', data),
  uploadPdf: (formData) =>
    api.post('/resumes/upload-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  atsCheckAgainstJob: (data) => api.post('/resumes/ats-check', data),
};

export const roadmapAPI = {
  getMyRoadmaps: () => api.get('/roadmaps'),
  selectRole: (data) => api.post('/roadmaps/select-role', data),
  updateItemStatus: (id, data) => api.put(`/roadmaps/${id}/item-status`, data),
};

export const interviewAPI = {
  getQuestionsByCategory: (category) => api.get(`/interviews/questions/${category}`),
  evaluateSingleAnswer: (data) => api.post('/interviews/evaluate-single', data),
  submitSession: (data) => api.post('/interviews/submit-session', data),
  getHistory: () => api.get('/interviews/history'),
  getPlacementReadiness: () => api.get('/interviews/placement-readiness'),
};

export const applicationAPI = {
  apply: (data) => api.post('/applications/apply', data),
  getMyApplications: () => api.get('/applications/my'),
  getJobApplicants: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  scheduleInterview: (id, data) => api.put(`/applications/${id}/schedule-interview`, data),
  getCalendar: () => api.get('/applications/calendar'),
};

export const driveAPI = {
  getDrives: () => api.get('/drives'),
  getDriveById: (id) => api.get(`/drives/${id}`),
  createDrive: (data) => api.post('/drives', data),
  registerForDrive: (id) => api.post(`/drives/${id}/register`),
};

export const analyticsAPI = {
  getPlacementAnalytics: () => api.get('/analytics'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;

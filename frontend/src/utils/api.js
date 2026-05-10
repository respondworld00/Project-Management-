import axios from 'axios';

const API_BASE_URL = '/api';

// Projects
export const projectAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/projects`),
  getById: (id) => axios.get(`${API_BASE_URL}/projects/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/projects`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/projects/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/projects/${id}`),
  getMembers: (projectId) => axios.get(`${API_BASE_URL}/projects/${projectId}/members`),
  addMember: (projectId, data) => axios.post(`${API_BASE_URL}/projects/${projectId}/members`, data),
  removeMember: (projectId, userId) => axios.delete(`${API_BASE_URL}/projects/${projectId}/members/${userId}`),
};

// Tasks
export const taskAPI = {
  getByProject: (projectId) => axios.get(`${API_BASE_URL}/tasks/${projectId}`),
  getById: (projectId, taskId) => axios.get(`${API_BASE_URL}/tasks/${projectId}/${taskId}`),
  create: (projectId, data) => axios.post(`${API_BASE_URL}/tasks/${projectId}`, data),
  update: (projectId, taskId, data) => axios.put(`${API_BASE_URL}/tasks/${projectId}/${taskId}`, data),
  delete: (projectId, taskId) => axios.delete(`${API_BASE_URL}/tasks/${projectId}/${taskId}`),
  getUserTasks: () => axios.get(`${API_BASE_URL}/tasks/user/assigned`),
  getDashboardStats: () => axios.get(`${API_BASE_URL}/tasks/dashboard/stats`),
};

// Users (admin)
export const userAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/users`),
  update: (userId, data) => axios.put(`${API_BASE_URL}/users/${userId}`, data),
  delete: (userId) => axios.delete(`${API_BASE_URL}/users/${userId}`),
};

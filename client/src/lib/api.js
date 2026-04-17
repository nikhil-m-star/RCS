import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
});

export const setAuthToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const syncUser = (username) => api.post('/users/sync', { username });
export const logHabit = (category) => api.post('/habits', { category });
export const getTodayHabits = (userId) => api.get(`/habits/${userId}`);
export const getScore = (userId) => api.get(`/score/${userId}`);
export const getLeaderboard = () => api.get('/leaderboard');

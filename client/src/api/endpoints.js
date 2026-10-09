import { api } from './http.js';

export const authApi = {
  register: (username, password) => api('/auth/register', { method: 'POST', body: { username, password } }),
  login: (username, password) => api('/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => api('/auth/logout', { method: 'POST' }),
  me: () => api('/auth/me'),
};

export const gamesApi = {
  list: () => api('/games'),
  get: (id) => api(`/games/${id}`),
  saveComputerGame: (game) => api('/games', { method: 'POST', body: { ...game, mode: 'computer' } }),
  saveReview: (id, review) => api(`/games/${id}/review`, { method: 'PUT', body: { review } }),
};

export const skillApi = {
  breakdown: () => api('/skill/breakdown'),
};

export const progressApi = {
  get: () => api('/progress'),
  complete: (lessonId, stars, answers) => api(`/progress/${lessonId}`, { method: 'PUT', body: { stars, answers } }),
  completeBonus: (lessonId, stars, answers) => api(`/progress/${lessonId}/bonus`, { method: 'PUT', body: { stars, answers } }),
  merge: (progress) => api('/progress/merge', { method: 'POST', body: { progress } }),
};

export const onlineApi = {
  active: (saved) => api('/online/active', { method: 'POST', body: { saved } }),
};

export const trainerApi = {
  get: () => api('/trainer'),
  save: (trainer) => api('/trainer', { method: 'PUT', body: { trainer } }),
};
